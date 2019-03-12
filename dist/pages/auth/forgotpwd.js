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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Forgotpwd.__proto__ || Object.getPrototypeOf(Forgotpwd)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "info", "timerMsg", "isVisible"], _this.handleSubmit = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
        var value, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                value = e.detail.value;
                data = _extends({}, _this.state.info, value);

                if (!(!data.mobile || !/1\d{10}/.test(data.mobile))) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", _index4.default.toast('请输入正确的手机号'));

              case 4:
                if (data.code) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", _index4.default.toast('请选择验证码'));

              case 6:
                if (data.password) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", _index4.default.toast('请输入密码'));

              case 8:
                console.log(data, 19);
                // if(this.state.isForgot){
                //
                // }
                // const { UserInfo } = await api.user.reg(data)
                // console.log(UserInfo)

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.handleChange = function (name, val) {
      var info = _this.state.info;

      info[name] = val;
    }, _this.handleClickIconpwd = function () {
      var isVisible = _this.state.isVisible;

      _this.setState({
        isVisible: !isVisible
      });
    }, _this.handleErrorToastClose = function () {
      _index4.default.closeToast();
    }, _this.handleTimerStart = function (resolve) {
      if (_this.state.isTimerStart) {
        return;
      }var mobile = _this.state.info.mobile;


      if (!/1\d{10}/.test(mobile)) {
        return _index4.default.toast('请输入正确的手机号');
      }

      resolve();
    }, _this.handleUpdateTimer = function (val) {
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
        isVisible: false
      };
    }
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
          isVisible = _state.isVisible;


      var anonymousState__temp = _index2.default.getEnv() === 'WEAPP';
      var anonymousState__temp2 = _index2.default.getEnv() === 'WEB';
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2
      });
      return this.__state;
    }
  }]);

  return Forgotpwd;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleSubmit", "handleErrorToastClose", "handleChange", "handleTimerStart", "handleUpdateTimer", "handleTimerStop", "handleClickIconpwd"], _temp2);
exports.default = Forgotpwd;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Forgotpwd, true));