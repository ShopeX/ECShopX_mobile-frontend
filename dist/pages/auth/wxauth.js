"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../spx/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WxAuth = (_temp2 = _class = function (_BaseComponent) {
  _inherits(WxAuth, _BaseComponent);

  function WxAuth() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, WxAuth);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WxAuth.__proto__ || Object.getPrototypeOf(WxAuth)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["isAuthShow"], _this.state = {
      isAuthShow: false
    }, _this.handleGetUserInfo = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(res) {
        var loginParams, iv, encryptedData, rawData, signature, userInfo, _ref3, code, _ref4, token, open_id, union_id, user_id;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                loginParams = res.detail;
                iv = loginParams.iv, encryptedData = loginParams.encryptedData, rawData = loginParams.rawData, signature = loginParams.signature, userInfo = loginParams.userInfo;

                if (!(!iv || !encryptedData)) {
                  _context.next = 5;
                  break;
                }

                _index2.default.showModal({
                  title: '授权提示',
                  content: "'ecshopx'" + "\u9700\u8981\u60A8\u7684\u6388\u6743\u624D\u80FD\u6B63\u5E38\u8FD0\u884C",
                  showCancel: false,
                  confirmText: '知道啦'
                });

                return _context.abrupt("return");

              case 5:
                _context.next = 7;
                return _index2.default.login();

              case 7:
                _ref3 = _context.sent;
                code = _ref3.code;


                _index2.default.showLoading({
                  mask: true,
                  title: '正在加载...'
                });

                _context.prev = 10;
                _context.next = 13;
                return _index4.default.wx.prelogin({
                  code: code,
                  iv: iv,
                  encryptedData: encryptedData,
                  rawData: rawData,
                  signature: signature,
                  userInfo: userInfo
                });

              case 13:
                _ref4 = _context.sent;
                token = _ref4.token;
                open_id = _ref4.open_id;
                union_id = _ref4.union_id;
                user_id = _ref4.user_id;


                _index6.default.setAuthToken(token);

                // 绑定过，跳转会员中心

                if (!user_id) {
                  _context.next = 23;
                  break;
                }

                _context.next = 22;
                return _this.autoLogin();

              case 22:
                return _context.abrupt("return");

              case 23:

                // 跳转注册绑定
                _index2.default.navigateTo({
                  url: "/pages/auth/reg?code=" + code + "&open_id=" + open_id + "&union_id=" + union_id
                });
                _context.next = 30;
                break;

              case 26:
                _context.prev = 26;
                _context.t0 = _context["catch"](10);

                console.info(_context.t0);
                _index2.default.showToast({
                  title: '授权失败，请稍后再试',
                  icon: 'none'
                });

              case 30:

                _index2.default.hideLoading();

              case 31:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2, [[10, 26]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WxAuth, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(WxAuth.prototype.__proto__ || Object.getPrototypeOf(WxAuth.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.autoLogin();
    }
  }, {
    key: "autoLogin",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _ref6, code, _ref7, token;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _index2.default.login();

              case 2:
                _ref6 = _context2.sent;
                code = _ref6.code;
                _context2.prev = 4;
                _context2.next = 7;
                return _index4.default.wx.login({ code: code });

              case 7:
                _ref7 = _context2.sent;
                token = _ref7.token;

                if (token) {
                  _context2.next = 11;
                  break;
                }

                throw new Error("token is not defined: " + token);

              case 11:
                _index6.default.setAuthToken(token);
                return _context2.abrupt("return", this.redirect());

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2["catch"](4);

                console.log(_context2.t0);
                this.setState({
                  isAuthShow: true
                });

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 15]]);
      }));

      function autoLogin() {
        return _ref5.apply(this, arguments);
      }

      return autoLogin;
    }()
  }, {
    key: "redirect",
    value: function redirect() {
      var redirect = this.$router.params.redirect;
      var redirect_url = redirect ? decodeURIComponent(redirect) : '/pages/member/index';

      _index2.default.redirectTo({
        url: redirect_url
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var isAuthShow = this.__state.isAuthShow;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return WxAuth;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleGetUserInfo"], _temp2);
exports.default = WxAuth;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WxAuth, true));