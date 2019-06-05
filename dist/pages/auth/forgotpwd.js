"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../spx/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Forgotpwd = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Forgotpwd, _BaseComponent);

  function Forgotpwd() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Forgotpwd);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Forgotpwd.__proto__ || Object.getPrototypeOf(Forgotpwd)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "imgVisible", "imgInfo", "timerMsg", "isVisible"], _this.handleClickImgcode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var query, img_res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = {
                type: 'forgot_password'
              };
              _context.prev = 1;
              _context.next = 4;
              return _index6.default.user.regImg(query);

            case 4:
              img_res = _context.sent;

              _this.setState({
                imgInfo: img_res
              });
              _context.next = 12;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              return _context.abrupt("return", false);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2, [[1, 8]]);
    })), _this.handleSubmit = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
        var value, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                value = e.detail.value;
                data = _extends({}, _this.state.info, value);

                if (!(!data.mobile || !/1\d{10}/.test(data.mobile))) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return", _index4.default.toast('请输入正确的手机号'));

              case 4:
                if (data.vcode) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", _index4.default.toast('请选择验证码'));

              case 6:
                if (data.password) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", _index4.default.toast('请输入密码'));

              case 8:
                console.log(data, 19);
                _context2.prev = 9;
                _context2.next = 12;
                return _index6.default.user.forgotPwd(data);

              case 12:
                _index2.default.showToast({
                  title: '修改成功',
                  icon: 'none'
                });
                setTimeout(function () {
                  _index2.default.redirectTo({
                    url: "/pages/auth/login"
                  });
                }, 700);
                _context2.next = 20;
                break;

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](9);
                return _context2.abrupt("return", false);

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[9, 16]]);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.handleChange = function (name, val) {
      var info = _this.state.info;

      info[name] = val;
      if (name === 'mobile') {
        if (val.length === 11 && _this.count === 0) {
          _this.count = 1;
          _this.setState({
            imgVisible: true
          });
        }
      }
    }, _this.handleClickIconpwd = function () {
      var isVisible = _this.state.isVisible;

      _this.setState({
        isVisible: !isVisible
      });
    }, _this.handleErrorToastClose = function () {
      _index4.default.closeToast();
    }, _this.handleTimerStart = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve) {
        var _this$state$info, mobile, yzm, imgInfo, query;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!_this.state.isTimerStart) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                _this$state$info = _this.state.info, mobile = _this$state$info.mobile, yzm = _this$state$info.yzm;
                imgInfo = _this.state.imgInfo;

                if (/1\d{10}/.test(mobile)) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", _index4.default.toast('请输入正确的手机号'));

              case 6:
                if (mobile.length === 11 && yzm) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", _index4.default.toast('请输入手机号和图形验证码'));

              case 8:
                query = {
                  type: 'forgot_password',
                  mobile: mobile,
                  yzm: yzm,
                  token: imgInfo.imageToken
                };
                _context3.prev = 9;
                _context3.next = 12;
                return _index6.default.user.regSmsCode(query);

              case 12:
                _index4.default.toast('发送成功');
                _context3.next = 19;
                break;

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3["catch"](9);
                return _context3.abrupt("return", false);

              case 19:

                resolve();

              case 20:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, _this2, [[9, 15]]);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.handleUpdateTimer = function (val) {
      var timerMsg = val + "s";
      _this.setState({
        timerMsg: timerMsg
      });
    }, _this.handleTimerStop = function () {
      _this.setState({
        timerMsg: '重新获取'
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Forgotpwd, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Forgotpwd.prototype.__proto__ || Object.getPrototypeOf(Forgotpwd.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: {},
        timerMsg: '获取验证码',
        isVisible: false,
        imgVisible: false,
        imgInfo: {}
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.handleClickImgcode();
                this.count = 0;

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetch() {
        return _ref5.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          timerMsg = _state.timerMsg,
          isVisible = _state.isVisible,
          imgVisible = _state.imgVisible,
          imgInfo = _state.imgInfo;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return Forgotpwd;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleSubmit", "handleErrorToastClose", "handleChange", "handleClickImgcode", "handleTimerStart", "handleUpdateTimer", "handleTimerStop", "handleClickIconpwd"], _temp2);
exports.default = Forgotpwd;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Forgotpwd, true));