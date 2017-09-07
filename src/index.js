import canvas from '@hitchcott/isomorphic-canvas';

if (canvas.setImageProvider) {
  canvas.setImageProvider(new canvas.FSImageProvider(process.env.PWD));
} else {
  // set up getImage
  // getImage //
}

const defaultConfig = {
  // format: 'auto',
  // compression: 1,
  // maxWidth: 2000,
  // watermark: () => // TODO
  thumbnails: {
    compression: 0.7, // default
    // 32: { compression: 0.2, square: true },
    64: true,
    256: true,
    512: true,
  },
};

export default class DijixImage {
  constructor(config) {
    this.type = 'image';
    this.config = { ...defaultConfig, ...config };
  }
  getImage(image) {
    return new Promise((resolve, reject) => {
      canvas.getImage(image, (err, res) => {
        if (err) { return reject(err); }
        return resolve(res);
      });
    });
  }
  async creationPipeline(input) {
    // accepts base64, file location, buffer?
    // console.log('getting the iamge', this);
    // const image = await this.getImage(input);
    // console.log('image', image);
    // const parsedInput = this.parseInput(input);
    // console.log('parsed', parsedInput);
  }
  // converts input to canvas
  // gets metadata information about the canvas instance
  // calculate the size
  // src, name, size, fileName, mimeType, thumbnails, height, width
  // converts the image to thumbnails
  // uploads the original image
  // uploads the thumbnails
  // decorates the dijix object;

  // readPipeline
}
