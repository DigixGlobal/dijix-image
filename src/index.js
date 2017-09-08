import canvas from '@hitchcott/isomorphic-canvas';
import * as a from 'awaiting';

if (canvas.setImageProvider) {
  canvas.setImageProvider(new canvas.FSImageProvider(process.env.PWD));
} else {
  // set up getImage
  // getImage //
}

const defaultConfig = {
  // format: 'auto',
  // quality: 1,
  maxWidth: 2048,
  // watermark: () => // TODO
  thumbnails: {
    format: 'jpeg',
    quality: 0.7, // default
    // 32: { quality: 0.2, square: true },
    64: true,
    256: true,
    512: true,
  },
};

function calculateBase64Size(str) {
  const head = str.split(',')[0];
  return Math.round((str.length - head.length) * 0.75);
}

export default class DijixImage {
  constructor(config) {
    this.type = 'image';
    this.config = { ...defaultConfig, ...config };
  }
  getImage(data) {
    return new Promise((resolve, reject) => {
      canvas.getImage(data, (err, res) => {
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
      c.toDataURL(`image/${format}`, quality, (err, res) => resolve(res));
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
    const ipfsHashes = await dijix.ipfs.put(Object.values(thumbs));
    return Object.keys(thumbs).reduce((o, k, i) => ({ ...o, [k]: ipfsHashes[i] }), {});
  }
  async creationPipeline(opts, dijix) {
    // config overrides
    const config = { ...this.config, ...opts };
    // accepts base64, file location, buffer
    const image = await this.getImage(opts.src);
    const format = image.mime;
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
    const src = await dijix.ipfs.put(converted);
    // get the size & other meta data
    const size = calculateBase64Size(converted);
    const splitPath = typeof opts.src === 'string' && opts.src.indexOf('.') > -1 && opts.src.split('/');
    const fileName = opts.fileName || (splitPath && splitPath[splitPath.length - 1]) || undefined;
    const name = opts.name;
    const mime = format;
    const data = { height, width, src, size, mime };
    if (thumbnails) { data.thumbnails = thumbnails; }
    if (fileName) { data.fileName = fileName; }
    if (name) { data.name = name; }
    return data;
  }
}
