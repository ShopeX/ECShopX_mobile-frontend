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

var _index3 = require("../../utils/index.js");

var _index4 = require("../../spx/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../api/index.js");

var _index7 = _interopRequireDefault(_index6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Reg = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Reg, _BaseComponent);

  function Reg() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Reg);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Reg.__proto__ || Object.getPrototypeOf(Reg)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp9", "anonymousState__temp10", "loopArray0", "info", "timerMsg", "isVisible", "list"], _this.handleSubmit = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
        var value, data, _ref3, UserInfo;

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

                return _context.abrupt("return", _index5.default.toast('请输入正确的手机号'));

              case 4:
                if (data.password) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", _index5.default.toast('请输入密码'));

              case 6:
                _this.state.list.map(function (item) {
                  return item.is_required ? item.is_required && data[item.key] ? true : _index5.default.toast("\u8BF7\u8F93\u5165" + item.name) : null;
                });
                console.log(data);

                _context.next = 10;
                return _index7.default.user.reg(data);

              case 10:
                _ref3 = _context.sent;
                UserInfo = _ref3.UserInfo;

                console.log(UserInfo);

              case 13:
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
      var _this$state = _this.state,
          info = _this$state.info,
          list = _this$state.list;

      info[name] = val;
      if (!(0, _index3.isString)(val)) {
        list.map(function (item) {
          item.key === name ? info[name] = val.detail.value : null;
          if (name === 'birthday') {
            item.key === name ? item.value = val.detail.value : null;
          } else {
            item.key === name ? item.items ? item.value = item.items[val.detail.value] : item.value = val.detail.value : null;
          }
        });
      } else {
        list.map(function (item) {
          item.key === name ? item.value = val : null;
        });
      }
      _this.setState({ list: list });
      if (name === 'sex') {
        if (info[name] === '男') {
          info[name] = 1;
        } else {
          info[name] = 2;
        }
      }
    }, _this.handleClickIconpwd = function () {
      var isVisible = _this.state.isVisible;

      _this.setState({
        isVisible: !isVisible
      });
    }, _this.handleErrorToastClose = function () {
      _index5.default.closeToast();
    }, _this.handleTimerStart = function (resolve) {
      if (_this.state.isTimerStart) {
        return;
      }var mobile = _this.state.info.mobile;


      if (!/1\d{10}/.test(mobile)) {
        return _index5.default.toast('请输入正确的手机号');
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
    }, _this.handleClickAgreement = function () {
      // Taro.navigateTo({
      //   url: '/pages/auth/login'
      // })
      console.log("用户协议");
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Reg, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Reg.prototype.__proto__ || Object.getPrototypeOf(Reg.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: {},
        timerMsg: '获取验证码',
        isVisible: false,
        list: []
        // dateSel: '2018-04-22'
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log(_index2.default.getEnv());
      if (_index2.default.getEnv() === 'WEAPP') {
        this.setState({
          info: {
            user_type: 'wechat'
          }
        });
      } else if (_index2.default.getEnv() === 'WEB') {
        this.setState({
          info: {
            user_type: 'local'
          }
        });
      }
      this.fetch();
    }

    // onDateChange = e => {
    //   this.setState({
    //     dateSel: e.detail.value
    //   })
    // }

  }, {
    key: "fetch",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var arr, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                arr = [];
                _context2.next = 3;
                return _index7.default.user.regParam();

              case 3:
                res = _context2.sent;

                Object.keys(res).forEach(function (key) {
                  if (res[key].is_open) {
                    if (key === 'sex') {
                      res[key].items = ['男', '女'];
                    }
                    if (key === 'birthday') {
                      res[key].items = [];
                    }
                    arr.push({
                      key: key,
                      name: res[key].name,
                      is_required: res[key].is_required,
                      items: res[key].items ? res[key].items : null
                    });
                  }
                });

                this.setState({
                  list: arr
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch() {
        return _ref4.apply(this, arguments);
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
          list = _state.list;


      var anonymousState__temp9 = _index2.default.getEnv() === 'WEAPP';
      var anonymousState__temp10 = _index2.default.getEnv() === 'WEB';
      var loopArray0 = list.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = item.$original.key === 'birthday' ? (0, _index3.classNames)(item.$original.value ? 'pick-value' : 'pick-value-null') : null;
        var $loopState__temp4 = (0, _index3.classNames)(item.$original.value ? 'pick-value' : 'pick-value-null');
        var $loopState__temp6 = "" + item.$original.key;
        var $loopState__temp8 = "\u8BF7\u8F93\u5165" + item.$original.name;
        return {
          $loopState__temp2: $loopState__temp2,
          $loopState__temp4: $loopState__temp4,
          $loopState__temp6: $loopState__temp6,
          $loopState__temp8: $loopState__temp8,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp9: anonymousState__temp9,
        anonymousState__temp10: anonymousState__temp10,
        loopArray0: loopArray0
      });
      return this.__state;
    }
  }]);

  return Reg;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleSubmit", "handleErrorToastClose", "handleChange", "handleTimerStart", "handleUpdateTimer", "handleTimerStop", "handleClickIconpwd", "handleClickAgreement"], _temp2);
exports.default = Reg;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Reg, true));