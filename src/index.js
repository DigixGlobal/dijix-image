import canvas from 'isomorphic-canvas';

const isBrowser = !canvas.setImageProvider;

if (!isBrowser) {
  canvas.setImageProvider(new canvas.FSImageProvider(''));
}

export const defaultConfig = {
  maxWidth: 2048,
  thumbnails: {
    format: 'jpeg',
    quality: 0.7, // default
    64: true,
    256: true,
    512: true,
  },
};

function calculateBase64Size(str) {
  const head = str.split(',')[0];
  return Math.round((str.length - head.length) * 0.75);
}

function formatFromExtension(ext) {
  return ext === 'jpg' ? 'jpeg' : ext;
}

function getBase64Format(str) {
  if (str.indexOf('data:') !== 0) { return false; }
  const splitStr = str.split(';')[0];
  const splitHeader = splitStr.split('/');
  const ext = splitHeader[splitHeader.length - 1];
  return ext;
}

function base64ToBinary(str) {
  return Buffer.from(str.split(',')[1], 'base64');
}

export default class DijixImage {
  constructor(config) {
    this.type = 'image';
    this.config = { ...defaultConfig, ...config };
  }
  getImage(data) {
    return new Promise((resolve, reject) => {
      // if it's a string, prefix if [0] is not '/' or 'data:'
      let parsedData = data;
      if (typeof data === 'string') {
        if (data[0] !== '/' && data.substr(0, 5) !== 'data:') {
          parsedData = `${process.env.PWD}/${data}`;
        }
      }
      canvas.getImage(parsedData, (err, res) => {
        if (err) { return reject(err); }
        return resolve(res);
      });
    });
  }
  async resizeToCanvas(image, { width, height, quality = 1, format = 'png' }) {
    const c = canvas(width, height);
    const ctx = c.getContext('2d');
    // TODO square...
    ctx.drawImage(image, 0, 0, width, height);
    return new Promise((resolve) => {
      const params = [`image/${format}`, quality, (err, res) => resolve(res)];
      if (isBrowser) {
        resolve(c.toDataURL(params[0], params[1]));
      } else {
        c.toDataURL(...params);
      }
    });
  }
  async generateThumbnails(image, thumbnailsConfig) {
    if (!thumbnailsConfig) { return false; }
    const keys = Object.keys(thumbnailsConfig).filter(k => !isNaN(parseInt(k, 10)));
    return (await Promise.all(keys.map((key) => {
      const thisConfig = { ...thumbnailsConfig, ...thumbnailsConfig[key] };
      const width = parseInt(key, 10);
      const height = (width / image.width) * image.height;
      return this.resizeToCanvas(image, { width, height, ...thisConfig });
    }))).reduce((o, d, i) => ({ ...o, [keys[i]]: d }), {});
  }
  async uploadThumbnails(image, config, dijix) {
    const thumbs = await this.generateThumbnails(image, config);
    const ipfsHashes = await dijix.ipfs.put(Object.values(thumbs).map(base64ToBinary));
    return Object.keys(thumbs).reduce((o, k, i) => ({ ...o, [k]: ipfsHashes[i] }), {});
  }
  async creationPipeline(opts, dijix) {
    // config overrides
    const config = { ...this.config, ...opts };
    // accepts base64, file location, buffer
    const image = await this.getImage(opts.src);
    // attempt to resolve format
    const splitPath = typeof opts.src === 'string' && opts.src.indexOf('.') > -1 && opts.src.split('/');
    const splitFileName = splitPath && splitPath[splitPath.length - 1].split('.');
    const extension = splitFileName && splitFileName[splitFileName.length - 1];
    const format = (image.mime && image.mime.split('/')[1]) || getBase64Format(opts.src) || formatFromExtension(extension);
    if (format !== 'png' && format !== 'jpeg') { throw new Error(`Invalid format: ${format}`); }
    // misc config
    const quality = config.quality;
    const width = image.width > config.maxWidth ? config.maxWidth : image.width;
    const height = image.height * (width / image.width);
    // resize the image before watermarking
    const resized = await this.resizeToCanvas(image, { width, height });
    // TODO watermark step
    const watermarked = await this.getImage(resized);
    // compress and convert
    const converted = await this.resizeToCanvas(watermarked, { width, height, format, quality });
    // create & upload the thumbnails
    const thumbnails = await this.uploadThumbnails(watermarked, config.thumbnails, dijix);
    // upload the source file
    const src = await dijix.ipfs.put(base64ToBinary(converted));
    // get the size & other meta data
    const size = calculateBase64Size(converted);
    const fileName = opts.fileName || (splitPath && splitPath[splitPath.length - 1]) || undefined;
    const name = opts.name;
    const mime = `image/${format}`;
    const data = { height, width, src, size, mime };
    if (thumbnails) { data.thumbnails = thumbnails; }
    if (fileName) { data.fileName = fileName; }
    if (name) { data.name = name; }
    return data;
  }
}
