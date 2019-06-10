"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var uploadImagesFn = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(imgFiles) {
    var promises, results;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            promises = [];

            imgFiles.forEach(function (item) {
              var promise = new Promise(function (resolve, reject) {
                if (!item.file) {
                  resolve(item);
                } else {
                  var filename = item.url.slice(item.url.lastIndexOf('/') + 1);
                  var extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
                  _index2.default.uploadFile({
                    url: _req2.default.baseURL + 'espier/upload',
                    filePath: item.url,
                    name: 'file',
                    header: {
                      'Authorization': _index4.default.getAuthToken(),
                      'authorizer-appid': extConfig.appid
                    },
                    formData: {
                      'file': item.url,
                      'company_id': extConfig.company_id || 1
                    },
                    success: function success(res) {
                      var imgData = JSON.parse(res.data);
                      resolve(imgData.data);
                    },
                    fail: function fail(error) {
                      return reject(error);
                    }
                  });
                }
              });
              promises.push(promise);
            });

            _context.next = 4;
            return Promise.all(promises);

          case 4:
            results = _context.sent;
            return _context.abrupt("return", results);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function uploadImagesFn(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _req = require("../api/req.js");

var _req2 = _interopRequireDefault(_req);

var _index3 = require("../spx/index.js");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  uploadImagesFn: uploadImagesFn
};