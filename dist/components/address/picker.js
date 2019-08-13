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

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _find = require("../../npm/lodash/find.js");

var _find2 = _interopRequireDefault(_find);

var _index6 = require("../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddressPicker = (_temp2 = _class = function (_BaseComponent) {
  _inherits(AddressPicker, _BaseComponent);

  function AddressPicker() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, AddressPicker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AddressPicker.__proto__ || Object.getPrototypeOf(AddressPicker)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "mode", "list", "curAddress", "__fn_onChange", "__fn_onClickBack", "value", "isOpened"], _this.handleGoBack = function () {
      _this.setState({
        mode: 'default',
        curAddress: null
      });
      _this.__triggerPropsFn("onClickBack", [null].concat([]));
    }, _this.handleClickAddress = function (address, e) {
      _this.changeSelection(address);
      _this.__triggerPropsFn("onClickBack", [null].concat([]));
    }, _this.handleRetrieveWxAddress = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res, errMsg;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _index2.default.chooseAddress();

            case 2:
              res = _context.sent;
              errMsg = res.errMsg;

              if (errMsg === 'chooseAddress:ok') {
                _index3.log.debug("[wx chooseAddress] address:", res);
              } else if (errMsg.indexOf('auth deny') >= 0) {
                _index3.log.debug("[wx chooseAddress] error: " + errMsg);
              }

              console.info('unkown error, res:', res);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleSaveAddress = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(address) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _index5.default.member.addressCreateOrUpdate(address);

              case 3:
                if (address.address_id) {
                  _index7.default.toast('修改成功');
                } else {
                  _index7.default.toast('创建成功');
                }

                _context2.next = 6;
                return _this.fetch(function () {
                  // update current address
                  var params = _this.props.value ? _extends({}, _this.props.value) : null;
                  _this.changeSelection(params);
                });

              case 6:

                _this.exitEdit();
                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);

                _index7.default.toast("" + _context2.t0.res.data.error.message);
                return _context2.abrupt("return", false);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[0, 9]]);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.handleDelAddress = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(address) {
        var address_id, list, isDeleteCurAddress;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                address_id = address.address_id;
                _context3.next = 3;
                return _index5.default.member.addressDelete(address_id);

              case 3:
                list = _this.state.list.filter(function (addr) {
                  return addr.address_id !== address_id;
                });
                isDeleteCurAddress = _this.state.curAddress && _this.state.curAddress.address_id === address.address_id;


                _this.setState({
                  list: list
                }, function () {
                  if (isDeleteCurAddress) {
                    _this.changeSelection();
                  }
                });
                _this.exitEdit();

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.exitEdit = function () {
      _this.setState({
        mode: 'default',
        curAddress: null
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AddressPicker, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AddressPicker.prototype.__proto__ || Object.getPrototypeOf(AddressPicker.prototype), "_constructor", this).call(this, props);

      this.state = {
        list: [],
        mode: 'default',
        curAddress: null
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      this.fetch(function () {
        return _this3.changeSelection();
      });
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(cb) {
        var _ref6, list;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _index2.default.showLoading({
                  mask: true
                });
                _context4.next = 3;
                return _index5.default.member.addressList();

              case 3:
                _ref6 = _context4.sent;
                list = _ref6.list;

                _index2.default.hideLoading();

                this.setState({
                  list: list
                }, function () {
                  cb && cb(list);
                });

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetch(_x3) {
        return _ref5.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "changeSelection",
    value: function changeSelection() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var address_id = params.address_id;
      var list = this.state.list;

      var address = (0, _find2.default)(list, function (addr) {
        return address_id ? address_id === addr.address_id : addr.def_addr > 0;
      }) || list[0] || null;

      _index3.log.debug('[address picker] change selection: ', address);
      this.__triggerPropsFn("onChange", [null].concat([address]));
    }
  }, {
    key: "enterEdit",
    value: function enterEdit() {
      var address = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var e = arguments[1];

      if (e) {
        e.stopPropagation();
      }
      this.setState({
        mode: 'edit',
        curAddress: address
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var isOpened = this.__props.isOpened;
      var _state = this.__state,
          mode = _state.mode,
          curAddress = _state.curAddress,
          list = _state.list;


      var anonymousState__temp = (0, _index3.classNames)('address-picker', isOpened ? 'address-picker__active' : null);
      var anonymousState__temp2 = _index2.default.getEnv() === _index2.default.ENV_TYPE.WEAPP;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2
      });
      return this.__state;
    }
  }]);

  return AddressPicker;
}(_index.Component), _class.properties = {
  "__fn_onChange": {
    "type": null,
    "value": null
  },
  "__fn_onClickBack": {
    "type": null,
    "value": null
  },
  "value": {
    "type": null,
    "value": null
  },
  "isOpened": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleGoBack", "enterEdit", "exitEdit", "handleRetrieveWxAddress", "handleClickAddress", "handleSaveAddress", "handleDelAddress"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  onClickBack: function onClickBack() {}
}, _temp2);
exports.default = AddressPicker;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(AddressPicker));