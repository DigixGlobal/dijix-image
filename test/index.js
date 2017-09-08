/* eslint-disable max-len, global-require */

import assert from 'assert';

import DijixImage from '../src';

const isBrowser = typeof window !== 'undefined';

const bannerPath = isBrowser ? require('./banner.jpg') : './test/banner.jpg';

const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABk0lEQVQ4T4XTzYuNcRjG8c8hhbzl/a05jAZpWLH0B8xiSrFhLGc5Gwv8A8qCEitJSqRMkr2d7CVlmkmp8U6jJBrvuup+6ikzx1On09Pvd3/v677u6+no/ezBYWzBT7zFQP0/wc1Oj/ph7MMtvMPX1t2N6GK4F+AC1uIyPlTXL9iEALbieC/AOdzAfmyuom+YLdjE/xRcxGdcwvuSn4Z/sALbcLZRkHl2VJfV+IWDeIyVJTcGBhQTv9dZfwDbcQgfS9qLKjqA39iAjLMES/GmxliMewE8xFDJnWsp57EXV0tZ1MbE+LEogDP4gVW1rufIGLm0BtPYjbtV1GwkI40HcAdHWkXrW05n/8lDwpRGMbCvBe8GEJdf41MpSMcYFwXJwa5KYkZNDmbKq2c4FcB1nER/awtNbCMzd8bqt6BggScb0zm8hvvlbiS/xPKCrcOJen9a3RPpbGISD5oRbmNnrWwZFpbMXHyEUZyea0UBHEWcz+xRkBDlCSgZOIYrdfYPo0niCAZLdmD5YBKiV7Wlqfm+2r96eWVTe2tWSwAAAABJRU5ErkJggg==';

const testImageResized = isBrowser ? [
  // 10x10 png
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAzElEQVQoU23QO0oDUBCF4S8iIiKIjY0IVsEqVhZaW9ja2aZxC8FWSGPhClxAVuACBFsRxEZ8FCEoGFSIhSg+ODJFBKc6985/59w5DX+rgVWsYwrvmMBpGuM1jUMc4QafaGLnP7CNC8wW+IbNgDNYw3LpxbL9QKD0XwN20MOo/jCHXZzgGwuxD7iPRzwj5/myvcQQT9hO4wC57NfEWGfrWzxggFbALo7LJlF8YQtXeMFkdMA93GEJieca9zgv8Nco4Ao2Sud1tg10Nh7wD1BeKlh6L7jqAAAAAElFTkSuQmCC',
  // 64x64 jpeg
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABAAEADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD/AD/6ACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAP//Z',
] : [
  // 10x10 png
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAAuElEQVQYlV3QP0vCcRSF8Y/61f4ICoXYIA0NRkNDQ6+hLZp7kb2FFvfAiIYml4IQh8IMS38tJygvnOXy8HDurfk/WzjDEGusUMekbIAHuMQNXgMOcLEJFrxgByexfmJV0McxOugl55jiCxWqgivc4hFNdHGNp9i6aBbsx7BM8W18o41ZclTS6w3zP+Ap9vCRvJf0mKVLDYscsc6ujdGvrYPdGOcY4w7PES0a+dUhGmjlNfd4iH2J6gf0JzDnbX+/bAAAAABJRU5ErkJggg==',
  // 64x64 jpeg
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABAAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD/AD/6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z',
];

const mockDijix = {
  ipfs: {
    put: (data) => {
      if (Array.isArray(data)) { return data.map((o, i) => `Fake IFPS Hash ${i}`); }
      return 'Fake IPFS Hash';
    },
  },
};

const dijixImage = new DijixImage();

describe('DijixImage', function () {
  this.timeout(Infinity);
  describe('parseInput', function () {
    it('parses base64 images', async function () {
      const { width, height } = await dijixImage.getImage(testImage);
      assert.equal(width, 16);
      assert.equal(height, 16);
    });
    it('parses file paths', async function () {
      const { width, height } = await dijixImage.getImage(bannerPath);
      assert.equal(width, 940);
      assert.equal(height, 250);
    });
  });
  describe('resizeToCanvas', function () {
    it('resizes input to a canvas', async function () {
      const image = await dijixImage.getImage(testImage);
      const imageData = await dijixImage.resizeToCanvas(image, { width: 10, height: 10 });
      assert.equal(imageData, testImageResized[0]);
    });
  });
  describe('generateThumbnails', function () {
    it('generates thumbnails', async function () {
      const image = await dijixImage.getImage(testImage);
      const thumbs = await dijixImage.generateThumbnails(image, { format: 'jpeg', 10: { format: 'png' }, 64: true });
      assert.equal(thumbs[10], testImageResized[0]);
      assert.equal(thumbs[64], testImageResized[1]);
    });
  });
  describe('creationPipeline', function () {
    it('creates the dijix object data (defaults)', async function () {
      assert.deepEqual(await dijixImage.creationPipeline({ src: bannerPath }, mockDijix), {
        height: 250,
        width: 940,
        src: 'Fake IPFS Hash',
        size: isBrowser ? 153061 : 100789,
        fileName: isBrowser ? bannerPath : 'banner.jpg',
        mime: 'image/jpeg',
        thumbnails: {
          64: 'Fake IFPS Hash 0',
          256: 'Fake IFPS Hash 1',
          512: 'Fake IFPS Hash 2',
        },
      });
    });
    it('creates the dijix object data (with overrides)', async function () {
      const overrides = { maxWidth: 5, thumbnails: { 50: true } };
      assert.deepEqual(await dijixImage.creationPipeline({ src: testImage, ...overrides }, mockDijix), {
        height: 5,
        width: 5,
        src: 'Fake IPFS Hash',
        size: isBrowser ? 133 : 145,
        mime: 'image/png',
        thumbnails: {
          50: 'Fake IFPS Hash 0',
        },
      });
    });
  });
});
