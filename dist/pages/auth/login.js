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

var Login = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Login, _BaseComponent);

  function Login() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Login);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Login.__proto__ || Object.getPrototypeOf(Login)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "isVisible"], _this.handleClickReg = function () {
      _index2.default.navigateTo({
        url: "/pages/auth/reg"
      });
    }, _this.handleSubmit = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
        var value, data, _ref3, token, redirect;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                value = e.detail.value;
                data = _extends({}, _this.state.info, value);

                if (!(!data.username || !/1\d{10}/.test(data.username))) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", _index4.default.toast('请输入正确的手机号'));

              case 4:
                if (data.password) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", _index4.default.toast('请输入密码'));

              case 6:
                _context.prev = 6;
                _context.next = 9;
                return _index6.default.user.login(data);

              case 9:
                _ref3 = _context.sent;
                token = _ref3.token;

                _index4.default.setAuthToken(token);
                redirect = decodeURIComponent(_this.$router.params.redirect || "/pages/index");

                _index2.default.redirectTo({
                  url: redirect
                });
                _context.next = 20;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](6);
                return _context.abrupt("return", false);

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2, [[6, 16]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.handleBlurMobile = function (val) {
      _this.setState({
        info: {
          username: val
        }
      });
    }, _this.handleClickIconpwd = function () {
      var isVisible = _this.state.isVisible;

      _this.setState({
        isVisible: !isVisible
      });
    }, _this.handleErrorToastClose = function () {
      // S.closeToast()
    }, _this.handleClickForgtPwd = function () {
      _index2.default.navigateTo({
        url: "/pages/auth/forgotpwd"
      });
    }, _this.handleNavLeftItemClick = function () {
      // const { redirect } = this.$router.params
      // if (redirect) {
      //   Taro.redirectTo({
      //     url: decodeURIComponent(redirect)
      //   })
      // }
      //
      // Taro.navigateBack()、
      _index2.default.redirectTo({
        url: "/pages/index"
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Login, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Login.prototype.__proto__ || Object.getPrototypeOf(Login.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: {},
        isVisible: false
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "handleChange",
    value: function handleChange(name, val) {
      var info = this.state.info;

      info[name] = val;
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          isVisible = _state.isVisible;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return Login;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleNavLeftItemClick", "handleClickReg", "handleSubmit", "handleErrorToastClose", "handleChange", "handleBlurMobile", "handleClickIconpwd", "handleClickForgtPwd"], _temp2);
exports.default = Login;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Login, true));