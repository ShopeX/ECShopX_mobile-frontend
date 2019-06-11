"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _index4 = require("../../utils/index.js");

var _index5 = require("../../spx/index.js");

var _index6 = _interopRequireDefault(_index5);

var _index7 = require("../../api/index.js");

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isWeapp = _index2.default.getEnv() === _index2.default.ENV_TYPE.WEAPP;

var Reg = (_dec = (0, _index3.connect)(function (_ref) {
  var user = _ref.user;
  return {
    land_params: user.land_params
  };
}, function () {
  return {};
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Reg, _BaseComponent);

  function Reg() {
    var _ref2,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Reg);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Reg.__proto__ || Object.getPrototypeOf(Reg)).call.apply(_ref2, [this].concat(args))), _this), _this.$$hasLoopRef = true, _this.$usedState = ["anonymousState__temp11", "loopArray0", "info", "imgVisible", "imgInfo", "list", "isVisible"], _this.handleClickImgcode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var query, img_res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = {
                type: 'sign'
              };
              _context.prev = 1;
              _context.next = 4;
              return _index8.default.user.regImg(query);

            case 4:
              img_res = _context.sent;

              _this.setState({
                imgInfo: img_res
              });
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);

              console.log(_context.t0);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2, [[1, 8]]);
    })), _this.handleSubmit = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
        var value, data, _this$$router$params, union_id, open_id, res, _ref5, code, _ref6, token, _res;

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

                return _context2.abrupt("return", _index6.default.toast('请输入正确的手机号'));

              case 4:
                if (!(!isWeapp && !data.vcode)) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", _index6.default.toast('请输入验证码'));

              case 6:

                /*if (!data.password) {
                  return S.toast('请输入密码')
                }*/
                _this.state.list.map(function (item) {
                  return item.is_required ? item.is_required && data[item.key] ? true : _index6.default.toast("\u8BF7\u8F93\u5165" + item.name) : null;
                });

                _context2.prev = 7;

                if (!isWeapp) {
                  _context2.next = 24;
                  break;
                }

                _this$$router$params = _this.$router.params, union_id = _this$$router$params.union_id, open_id = _this$$router$params.open_id;
                _context2.next = 12;
                return _index8.default.user.reg(_extends({}, data, {
                  user_type: 'wechat',
                  auth_type: 'wxapp',
                  union_id: union_id,
                  open_id: open_id
                }));

              case 12:
                res = _context2.sent;
                _context2.next = 15;
                return _index2.default.login();

              case 15:
                _ref5 = _context2.sent;
                code = _ref5.code;
                _context2.next = 19;
                return _index8.default.wx.login({ code: code });

              case 19:
                _ref6 = _context2.sent;
                token = _ref6.token;

                _index6.default.setAuthToken(token);
                _context2.next = 28;
                break;

              case 24:
                _context2.next = 26;
                return _index8.default.user.reg(data);

              case 26:
                _res = _context2.sent;

                _index6.default.setAuthToken(_res.token);

              case 28:

                _index6.default.toast('注册成功');
                setTimeout(function () {
                  _index2.default.redirectTo({
                    url: '/pages/member/index'
                  });
                }, 700);
                _context2.next = 36;
                break;

              case 32:
                _context2.prev = 32;
                _context2.t0 = _context2["catch"](7);
                return _context2.abrupt("return", false);

              case 36:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[7, 32]]);
      }));

      return function (_x) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.handleChange = function (name, val) {
      // console.log(name, val, 126)
      var _this$state = _this.state,
          info = _this$state.info,
          list = _this$state.list;

      info[name] = val;
      if (name === 'mobile') {
        if (val.length === 11 && _this.count === 0) {
          _this.count = 1;
          _this.setState({
            imgVisible: true
          });
        }
      }
      if (!(0, _index4.isString)(val)) {
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
        if (val.detail.value === 0) {
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
      console.log(_this.textInput.value);
      _index6.default.closeToast();
    }, _this.handleTimerStart = function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve) {
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

                return _context3.abrupt("return", _index6.default.toast('请输入正确的手机号'));

              case 6:
                if (mobile.length === 11 && yzm) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", _index6.default.toast('请输入手机号和图形验证码'));

              case 8:
                query = {
                  type: 'sign',
                  mobile: mobile,
                  yzm: yzm,
                  token: imgInfo.imageToken
                };
                _context3.prev = 9;
                _context3.next = 12;
                return _index8.default.user.regSmsCode(query);

              case 12:
                _index6.default.toast('发送成功');
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
        return _ref7.apply(this, arguments);
      };
    }(), _this.handleTimerStop = function () {}, _this.handleClickAgreement = function () {
      _index2.default.navigateTo({
        url: '/pages/auth/reg-rule'
      });
    }, _this.handleGetPhoneNumber = function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(e) {
        var _ref9, code, _e$detail, errMsg, params, _ref10, phoneNumber;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _index2.default.login();

              case 2:
                _ref9 = _context4.sent;
                code = _ref9.code;
                _e$detail = e.detail, errMsg = _e$detail.errMsg, params = _objectWithoutProperties(_e$detail, ["errMsg"]);

                if (!(errMsg.indexOf('fail') >= 0)) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt("return");

              case 7:
                params.code = code;
                _context4.next = 10;
                return _index8.default.wx.decryptPhone(params);

              case 10:
                _ref10 = _context4.sent;
                phoneNumber = _ref10.phoneNumber;

                _this.handleChange('mobile', phoneNumber);

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, _this2);
      }));

      return function (_x3) {
        return _ref8.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Reg, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Reg.prototype.__proto__ || Object.getPrototypeOf(Reg.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: {},
        isVisible: false,
        list: [],
        imgVisible: false,
        imgInfo: {}
      };
      this.handleChange = this.handleChange.bind(this);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // console.log(Taro.getEnv(),this.props.land_params)
      {
        this.setState({
          info: {
            user_type: 'wechat'
          }
        });
      }
      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var arr, res;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                arr = [];
                _context5.next = 3;
                return _index8.default.user.regParam();

              case 3:
                res = _context5.sent;

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

                if (!isWeapp) {
                  this.handleClickImgcode();
                }

                this.setState({
                  list: arr
                });
                this.count = 0;

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function fetch() {
        return _ref11.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      var _this3 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;
      var __scope = this.$scope;

      var _state = this.__state,
          info = _state.info,
          isVisible = _state.isVisible,
          list = _state.list,
          imgVisible = _state.imgVisible,
          imgInfo = _state.imgInfo;

      var anonymousState__temp11 = _index2.default.getEnv() !== _index2.default.ENV_TYPE.WEAPP;
      var loopArray0 = list.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = item.$original.key === 'birthday' ? (0, _index4.classNames)(item.$original.value ? 'pick-value' : 'pick-value-null') : null;
        var $loopState__temp4 = (0, _index4.classNames)(item.$original.value ? 'pick-value' : 'pick-value-null');
        var $loopState__temp6 = "" + item.$original.key;
        var $loopState__temp8 = "\u8BF7\u8F93\u5165" + item.$original.name;
        var $loopState__temp10 = "ZXris" + index;

        var __ref = __scope && __isRunloopRef && (0, _index.getElementById)(__scope, "#" + ("ZXris" + index), "component");

        __ref && function (input) {
          _this3.textInput = input;
        }(__ref);
        return {
          $loopState__temp2: $loopState__temp2,
          $loopState__temp4: $loopState__temp4,
          $loopState__temp6: $loopState__temp6,
          $loopState__temp8: $loopState__temp8,
          $loopState__temp10: $loopState__temp10,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp11: anonymousState__temp11,
        loopArray0: loopArray0
      });
      return this.__state;
    }
  }]);

  return Reg;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleSubmit", "handleErrorToastClose", "handleChange", "handleGetPhoneNumber", "handleClickImgcode", "handleTimerStart", "handleTimerStop", "handleClickAgreement"], _temp2)) || _class);
exports.default = Reg;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Reg, true));