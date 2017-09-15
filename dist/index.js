'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultConfig = undefined;

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _isomorphicCanvas = require('@hitchcott/isomorphic-canvas');

var _isomorphicCanvas2 = _interopRequireDefault(_isomorphicCanvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isBrowser = !_isomorphicCanvas2.default.setImageProvider;

if (!isBrowser) {
  _isomorphicCanvas2.default.setImageProvider(new _isomorphicCanvas2.default.FSImageProvider(''));
}

var defaultConfig = exports.defaultConfig = {
  maxWidth: 2048,
  thumbnails: {
    format: 'jpeg',
    quality: 0.7, // default
    64: true,
    256: true,
    512: true
  }
};

function calculateBase64Size(str) {
  var head = str.split(',')[0];
  return Math.round((str.length - head.length) * 0.75);
}

function formatFromExtension(ext) {
  return ext === 'jpg' ? 'jpeg' : ext;
}

function getBase64Format(str) {
  if (str.indexOf('data:') !== 0) {
    return false;
  }
  var splitStr = str.split(';')[0];
  var splitHeader = splitStr.split('/');
  var ext = splitHeader[splitHeader.length - 1];
  return ext;
}

function base64ToBinary(str) {
  return Buffer.from(str.split(',')[1], 'base64');
}

var DijixImage = function () {
  function DijixImage(config) {
    (0, _classCallCheck3.default)(this, DijixImage);

    this.type = 'image';
    this.config = (0, _extends5.default)({}, defaultConfig, config);
  }

  (0, _createClass3.default)(DijixImage, [{
    key: 'getImage',
    value: function getImage(data) {
      return new _promise2.default(function (resolve, reject) {
        // if it's a string, prefix if [0] is not '/' or 'data:'
        var parsedData = data;
        if (typeof data === 'string') {
          if (data[0] !== '/' && data.substr(0, 5) !== 'data:') {
            parsedData = process.env.PWD + '/' + data;
          }
        }
        _isomorphicCanvas2.default.getImage(parsedData, function (err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
      });
    }
  }, {
    key: 'resizeToCanvas',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(image, _ref2) {
        var width = _ref2.width,
            height = _ref2.height,
            _ref2$quality = _ref2.quality,
            quality = _ref2$quality === undefined ? 1 : _ref2$quality,
            _ref2$format = _ref2.format,
            format = _ref2$format === undefined ? 'png' : _ref2$format;
        var c, ctx;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                c = (0, _isomorphicCanvas2.default)(width, height);
                ctx = c.getContext('2d');
                // TODO square...

                ctx.drawImage(image, 0, 0, width, height);
                return _context.abrupt('return', new _promise2.default(function (resolve) {
                  var params = ['image/' + format, quality, function (err, res) {
                    return resolve(res);
                  }];
                  if (isBrowser) {
                    resolve(c.toDataURL(params[0], params[1]));
                  } else {
                    c.toDataURL.apply(c, params);
                  }
                }));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function resizeToCanvas(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return resizeToCanvas;
    }()
  }, {
    key: 'generateThumbnails',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(image, thumbnailsConfig) {
        var _this = this;

        var keys;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (thumbnailsConfig) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', false);

              case 2:
                keys = (0, _keys2.default)(thumbnailsConfig).filter(function (k) {
                  return !isNaN(parseInt(k, 10));
                });
                _context2.next = 5;
                return _promise2.default.all(keys.map(function (key) {
                  var thisConfig = (0, _extends5.default)({}, thumbnailsConfig, thumbnailsConfig[key]);
                  var width = parseInt(key, 10);
                  var height = width / image.width * image.height;
                  return _this.resizeToCanvas(image, (0, _extends5.default)({ width: width, height: height }, thisConfig));
                }));

              case 5:
                _context2.t0 = function (o, d, i) {
                  return (0, _extends5.default)({}, o, (0, _defineProperty3.default)({}, keys[i], d));
                };

                _context2.t1 = {};
                return _context2.abrupt('return', _context2.sent.reduce(_context2.t0, _context2.t1));

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function generateThumbnails(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return generateThumbnails;
    }()
  }, {
    key: 'uploadThumbnails',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(image, config, dijix) {
        var thumbs, ipfsHashes;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.generateThumbnails(image, config);

              case 2:
                thumbs = _context3.sent;
                _context3.next = 5;
                return dijix.ipfs.put((0, _values2.default)(thumbs).map(base64ToBinary));

              case 5:
                ipfsHashes = _context3.sent;
                return _context3.abrupt('return', (0, _keys2.default)(thumbs).reduce(function (o, k, i) {
                  return (0, _extends5.default)({}, o, (0, _defineProperty3.default)({}, k, ipfsHashes[i]));
                }, {}));

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function uploadThumbnails(_x5, _x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return uploadThumbnails;
    }()
  }, {
    key: 'creationPipeline',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(opts, dijix) {
        var config, image, splitPath, splitFileName, extension, format, quality, width, height, resized, watermarked, converted, thumbnails, src, size, fileName, name, mime, data;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // config overrides
                config = (0, _extends5.default)({}, this.config, opts);
                // accepts base64, file location, buffer

                _context4.next = 3;
                return this.getImage(opts.src);

              case 3:
                image = _context4.sent;

                // attempt to resolve format
                splitPath = typeof opts.src === 'string' && opts.src.indexOf('.') > -1 && opts.src.split('/');
                splitFileName = splitPath && splitPath[splitPath.length - 1].split('.');
                extension = splitFileName && splitFileName[splitFileName.length - 1];
                format = image.mime && image.mime.split('/')[1] || getBase64Format(opts.src) || formatFromExtension(extension);

                if (!(format !== 'png' && format !== 'jpeg')) {
                  _context4.next = 10;
                  break;
                }

                throw new Error('Invalid format: ' + format);

              case 10:
                // misc config
                quality = config.quality;
                width = image.width > config.maxWidth ? config.maxWidth : image.width;
                height = image.height * (width / image.width);
                // resize the image before watermarking

                _context4.next = 15;
                return this.resizeToCanvas(image, { width: width, height: height });

              case 15:
                resized = _context4.sent;
                _context4.next = 18;
                return this.getImage(resized);

              case 18:
                watermarked = _context4.sent;
                _context4.next = 21;
                return this.resizeToCanvas(watermarked, { width: width, height: height, format: format, quality: quality });

              case 21:
                converted = _context4.sent;
                _context4.next = 24;
                return this.uploadThumbnails(watermarked, config.thumbnails, dijix);

              case 24:
                thumbnails = _context4.sent;
                _context4.next = 27;
                return dijix.ipfs.put(base64ToBinary(converted));

              case 27:
                src = _context4.sent;

                // get the size & other meta data
                size = calculateBase64Size(converted);
                fileName = opts.fileName || splitPath && splitPath[splitPath.length - 1] || undefined;
                name = opts.name;
                mime = 'image/' + format;
                data = { height: height, width: width, src: src, size: size, mime: mime };

                if (thumbnails) {
                  data.thumbnails = thumbnails;
                }
                if (fileName) {
                  data.fileName = fileName;
                }
                if (name) {
                  data.name = name;
                }
                return _context4.abrupt('return', data);

              case 37:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function creationPipeline(_x8, _x9) {
        return _ref5.apply(this, arguments);
      }

      return creationPipeline;
    }()
  }]);
  return DijixImage;
}();

exports.default = DijixImage;