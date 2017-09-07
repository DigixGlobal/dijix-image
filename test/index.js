import fs from 'fs';
import assert from 'assert';

import DijixImage from '../src';

const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABk0lEQVQ4T4XTzYuNcRjG8c8hhbzl/a05jAZpWLH0B8xiSrFhLGc5Gwv8A8qCEitJSqRMkr2d7CVlmkmp8U6jJBrvuup+6ikzx1On09Pvd3/v677u6+no/ezBYWzBT7zFQP0/wc1Oj/ph7MMtvMPX1t2N6GK4F+AC1uIyPlTXL9iEALbieC/AOdzAfmyuom+YLdjE/xRcxGdcwvuSn4Z/sALbcLZRkHl2VJfV+IWDeIyVJTcGBhQTv9dZfwDbcQgfS9qLKjqA39iAjLMES/GmxliMewE8xFDJnWsp57EXV0tZ1MbE+LEogDP4gVW1rufIGLm0BtPYjbtV1GwkI40HcAdHWkXrW05n/8lDwpRGMbCvBe8GEJdf41MpSMcYFwXJwa5KYkZNDmbKq2c4FcB1nER/awtNbCMzd8bqt6BggScb0zm8hvvlbiS/xPKCrcOJen9a3RPpbGISD5oRbmNnrWwZFpbMXHyEUZyea0UBHEWcz+xRkBDlCSgZOIYrdfYPo0niCAZLdmD5YBKiV7Wlqfm+2r96eWVTe2tWSwAAAABJRU5ErkJggg==';

let dijixImage = new DijixImage();

describe('DijixImage', function () {
  this.timeout(Infinity);
  describe('parseInput', function () {
    it('parses base64 images', async function () {
      assert.equal((await dijixImage.getImage(testImage)).width, 16);
    });
    it('parses image buffers', async function () {
      const image = fs.readFileSync(`${process.env.PWD}/test/banner.jpg`);
      assert.equal((await dijixImage.getImage(image)).width, 940);
    });
    it('parses file paths', async function () {
      assert.equal((await dijixImage.getImage('./test/banner.jpg')).width, 940);
    });
  });
  // it('does something', function () {
  //   console.log(dijixImage.creationPipeline());
  // });
});
