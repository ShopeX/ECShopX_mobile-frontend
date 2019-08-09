"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// 请在onload 中调用此函数，保证千人千码跟踪记录正常
// 用户分享和接受参数处理
var entryLaunch = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, isNeedLocate) {
    var options, scene, _Taro$getStorageSync, distributor_id, dtidValid, store;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = null;

            if (data.scene) {
              scene = decodeURIComponent(data.scene);
              //格式化二维码参数

              options = parseUrlStr(scene);
            } else {
              options = data;
            }

            // 如果没有带店铺id
            if (!options.dtid) {
              _Taro$getStorageSync = _index2.default.getStorageSync('curStore'), distributor_id = _Taro$getStorageSync.distributor_id;

              if (distributor_id) {
                options.dtid = distributor_id;
              }
            }
            dtidValid = false;
            store = {};

            // 传过来的店铺id

            if (!options.dtid) {
              _context.next = 10;
              break;
            }

            _context.next = 8;
            return handleDistributorId(options.dtid);

          case 8:
            store = _context.sent;

            dtidValid = store.status ? false : true;

          case 10:

            console.log('是否需要定位', dtidValid);

            // 如果需要定位,并且店铺无效，

            if (dtidValid) {
              _context.next = 16;
              break;
            }

            console.log('进行定位处理');
            _context.next = 15;
            return getLocal(isNeedLocate);

          case 15:
            store = _context.sent;

          case 16:

            console.log('定位或返回值', store);

            if (!store.status) {
              options.store = store;
              options.dtid = store.distributor_id;
            }

            if (options.uid) {
              // 如果分享带了会员ID 那么
              _index2.default.setStorageSync('distribution_shop_id', options.uid);
              _index2.default.setStorageSync('trackParams', {});
            } else if (options.s && options.m) {
              _index2.default.setStorageSync('distribution_shop_id', '');
              _index2.default.setStorageSync('trackParams', { source_id: options.s, monitor_id: options.m });
              trackViewNum(options.m, options.s);
            }
            console.log('接收出来后参数', options);
            return _context.abrupt("return", options);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function entryLaunch(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

//获取定位配置


var getLocalSetting = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var filter, res, data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filter = { template_name: 'yykweishop', version: 'v1.0.1', name: 'setting' };
            _context2.next = 3;
            return _index4.default.category.getCategory(filter);

          case 3:
            res = _context2.sent;
            data = res[0].params;

            if (!(res.length > 0)) {
              _context2.next = 17;
              break;
            }

            if (!(!data || !data.config)) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", true);

          case 10:
            if (!data.config.location) {
              _context2.next = 14;
              break;
            }

            return _context2.abrupt("return", true);

          case 14:
            return _context2.abrupt("return", false);

          case 15:
            _context2.next = 18;
            break;

          case 17:
            return _context2.abrupt("return", true);

          case 18:
            return _context2.abrupt("return", positionStatus);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getLocalSetting() {
    return _ref2.apply(this, arguments);
  };
}();

var getLocal = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(isNeedLocate) {
    var positionStatus, store, lnglat, param, locationData, _param;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getLocalSetting();

          case 2:
            positionStatus = _context3.sent;
            store = null;

            if (positionStatus) {
              _context3.next = 10;
              break;
            }

            _context3.next = 7;
            return _index4.default.shop.getShop();

          case 7:
            store = _context3.sent;
            _context3.next = 28;
            break;

          case 10:
            lnglat = _index2.default.getStorageSync('lnglat');

            if (!lnglat) {
              _context3.next = 19;
              break;
            }

            param = {};

            if (isNeedLocate && positionStatus) {
              param.lat = lnglat.latitude;
              param.lng = lnglat.longitude;
            }
            _context3.next = 16;
            return _index4.default.shop.getShop(param);

          case 16:
            store = _context3.sent;
            _context3.next = 28;
            break;

          case 19:
            _context3.next = 21;
            return getLoc();

          case 21:
            locationData = _context3.sent;

            if (!(locationData !== '')) {
              _context3.next = 28;
              break;
            }

            _param = {};

            if (isNeedLocate && positionStatus) {
              _param.lat = locationData.latitude;
              _param.lng = locationData.longitude;
            }
            _context3.next = 27;
            return _index4.default.shop.getShop(_param);

          case 27:
            store = _context3.sent;

          case 28:

            if (!store.status) {
              _index2.default.setStorageSync('curStore', store);
            } else {
              _index2.default.setStorageSync('curStore', false);
            }
            return _context3.abrupt("return", store);

          case 30:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getLocal(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var getLoc = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _index2.default.getLocation({ type: 'gcj02' }).then(function (locationData) {
              _index2.default.setStorage({ key: 'lnglat', data: locationData });
              return locationData;
            }, function (res) {
              return '';
            });

          case 2:
            return _context4.abrupt("return", _context4.sent);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getLoc() {
    return _ref4.apply(this, arguments);
  };
}();

// 新增千人千码跟踪记录


var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../api/index.js");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function trackViewNum(monitor_id, source_id) {
  var _session = _index2.default.getStorageSync('_session');
  if (!_session) {
    return true;
  }

  if (monitor_id && source_id) {
    var param = { source_id: source_id, monitor_id: monitor_id };
    _index4.default.track.viewnum(param);
  }
  return true;
}

// distributorId 店铺ID
function handleDistributorId(distributorId) {
  var res = _index4.default.shop.getShop({ distributor_id: distributorId });
  if (res.status === false) {
    _index2.default.setStorageSync('trackIdentity', { distributor_id: distributorId });
  } else {
    _index2.default.setStorageSync('trackIdentity', '');
  }
  return res;
}

// 格式化URL字符串
function parseUrlStr(urlStr) {
  var keyValuePairs = [];
  if (urlStr) {
    for (var i = 0; i < urlStr.split('&').length; i++) {
      keyValuePairs[i] = urlStr.split('&')[i];
    }
  }
  var kvObj = [];
  for (var j = 0; j < keyValuePairs.length; j++) {
    var tmp = keyValuePairs[j].split('=');
    kvObj[tmp[0]] = decodeURI(tmp[1]);
  }
  return kvObj;
}

exports.default = {
  entryLaunch: entryLaunch,
  getLocal: getLocal
};