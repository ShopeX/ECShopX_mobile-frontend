"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

require("../npm/@tarojs/async-await/index.js");

var _index3 = require("../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _globalData = {};
var TOKEN_IDENTIFIER = 'auth_token';
var TOKEN_TIMESTAMP = 'refresh_token_time';

function remove(arr, item) {
  var idx = arr.indexOf(item);
  if (idx >= 0) {
    arr.splice(idx, 1);
  }
}

function isAsync(func) {
  var string = func.toString().trim();

  return !!(string.match(/^async /) || string.match(/return _ref[^.]*\.apply/) || // babel transform
  func.then);
}

var Spx = function () {
  function Spx() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Spx);

    this.hooks = [];
    this.options = _extends({
      autoRefreshToken: true
    }, options);

    if (this.options.autoRefreshToken) {
      this.startRefreshToken();
    }
  }

  _createClass(Spx, [{
    key: "getAuthToken",
    value: function getAuthToken() {
      var authToken = _index2.default.getStorageSync(TOKEN_IDENTIFIER);
      if (authToken && !this.get(TOKEN_IDENTIFIER)) {
        this.set(TOKEN_IDENTIFIER, authToken);
      }
      return authToken;
    }
  }, {
    key: "setAuthToken",
    value: function setAuthToken(token) {
      this.set(TOKEN_IDENTIFIER, token);
      _index2.default.setStorageSync(TOKEN_IDENTIFIER, token);
      _index2.default.setStorageSync(TOKEN_TIMESTAMP, Date.now() + 3300000);
    }
  }, {
    key: "startRefreshToken",
    value: function startRefreshToken() {
      var _this = this;

      if (this._refreshTokenTimer) {
        clearTimeout(this._refreshTokenTimer);
      }
      var checkAndRefresh = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var expired, delta, _ref2, token;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  expired = _index2.default.getStorageSync(TOKEN_TIMESTAMP);

                  if (expired) {
                    _context.next = 3;
                    break;
                  }

                  return _context.abrupt("return");

                case 3:
                  delta = expired - Date.now();

                  if (!(delta > 0 && delta <= 300000)) {
                    _context.next = 11;
                    break;
                  }

                  _context.next = 7;
                  return _index4.default.user.refreshToken();

                case 7:
                  _ref2 = _context.sent;
                  token = _ref2.token;

                  clearTimeout(_this._refreshTokenTimer);
                  _this.setAuthToken(token);

                case 11:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }));

        return function checkAndRefresh() {
          return _ref.apply(this, arguments);
        };
      }();

      setInterval(checkAndRefresh, 300000);
    }
  }, {
    key: "getUserInfo",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var userInfo, token;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                userInfo = this.get('userInfo');
                token = this.getAuthToken();

                if (!(!userInfo && token)) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 5;
                return _index4.default.user.info();

              case 5:
                userInfo = _context2.sent;

                this.set('userInfo', userInfo);

              case 7:
                return _context2.abrupt("return", userInfo);

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getUserInfo() {
        return _ref3.apply(this, arguments);
      }

      return getUserInfo;
    }()
  }, {
    key: "get",
    value: function get(key) {
      return _globalData[key];
    }
  }, {
    key: "set",
    value: function set(key, val) {
      _globalData[key] = val;
    }
  }, {
    key: "hasHook",
    value: function hasHook(name) {
      return this.hooks[name] !== undefined;
    }
  }, {
    key: "trigger",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(name) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var cbs, ret, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, cb, rs;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                cbs = this.hooks[name];

                if (cbs) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                ret = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 7;
                _iterator = cbs[Symbol.iterator]();

              case 9:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 23;
                  break;
                }

                cb = _step.value;

                if (!isAsync(cb)) {
                  _context3.next = 17;
                  break;
                }

                _context3.next = 14;
                return cb.apply(this, args);

              case 14:
                _context3.t0 = _context3.sent;
                _context3.next = 18;
                break;

              case 17:
                _context3.t0 = cb.apply(this, args);

              case 18:
                rs = _context3.t0;


                ret.push(rs);

              case 20:
                _iteratorNormalCompletion = true;
                _context3.next = 9;
                break;

              case 23:
                _context3.next = 29;
                break;

              case 25:
                _context3.prev = 25;
                _context3.t1 = _context3["catch"](7);
                _didIteratorError = true;
                _iteratorError = _context3.t1;

              case 29:
                _context3.prev = 29;
                _context3.prev = 30;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 32:
                _context3.prev = 32;

                if (!_didIteratorError) {
                  _context3.next = 35;
                  break;
                }

                throw _iteratorError;

              case 35:
                return _context3.finish(32);

              case 36:
                return _context3.finish(29);

              case 37:
                return _context3.abrupt("return", ret);

              case 38:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[7, 25, 29, 37], [30,, 32, 36]]);
      }));

      function trigger(_x2) {
        return _ref4.apply(this, arguments);
      }

      return trigger;
    }()
  }, {
    key: "bind",
    value: function bind(name, fn) {
      var fns = this.hooks[name] || [];
      fns.push(fn);
      this.hooks[name] = fns;
    }
  }, {
    key: "unbind",
    value: function unbind(name, fn) {
      var fns = this.hooks[name];
      if (!fns) return;

      remove(fns, fn);
    }
  }, {
    key: "autoLogin",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx, next) {
        var userInfo;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.trigger('autoLogin', ctx);

              case 3:
                if (this.getAuthToken()) {
                  _context4.next = 5;
                  break;
                }

                throw new Error('auth token not found');

              case 5:
                _context4.next = 7;
                return this.getUserInfo();

              case 7:
                userInfo = _context4.sent;

                if (!next) {
                  _context4.next = 11;
                  break;
                }

                _context4.next = 11;
                return next(userInfo);

              case 11:
                if (userInfo) {
                  _context4.next = 13;
                  break;
                }

                throw new Error('userInfo is empty');

              case 13:
                return _context4.abrupt("return", userInfo);

              case 16:
                _context4.prev = 16;
                _context4.t0 = _context4["catch"](0);

                _index5.log.debug('[auth failed] redirect to login page: ', _context4.t0);

                this.login(ctx);

              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 16]]);
      }));

      function autoLogin(_x3, _x4) {
        return _ref5.apply(this, arguments);
      }

      return autoLogin;
    }()
  }, {
    key: "login",
    value: function login(ctx) {
      var isRedirect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var _getCurrentRoute = (0, _index5.getCurrentRoute)(ctx.$router),
          path = _getCurrentRoute.path,
          fullPath = _getCurrentRoute.fullPath;

      var encodedRedirect = encodeURIComponent(fullPath);
      if (path === '/pages/auth/login') {
        return;
      }

      var authUrl = "/pages/auth/login?redirect=" + encodedRedirect;

      _index2.default[isRedirect ? 'redirectTo' : 'navigateTo']({
        url: authUrl
      });
    }
  }, {
    key: "logout",
    value: function logout() {
      _index2.default.removeStorageSync(TOKEN_IDENTIFIER);
      delete _globalData[TOKEN_IDENTIFIER];
      this.trigger('logout');
    }
  }, {
    key: "globalData",
    value: function globalData() {
      {
        return _globalData;
      }
    }
  }, {
    key: "toast",
    value: function toast() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _index2.default.eventCenter.trigger.apply(_index2.default.eventCenter, ['sp-toast:show'].concat(args));
    }
  }, {
    key: "closeToast",
    value: function closeToast() {
      _index2.default.eventCenter.trigger('sp-toast:close');
    }
  }]);

  return Spx;
}();

exports.default = new Spx();