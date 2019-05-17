"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

// import AddressList from '@/components/new-address/address'


var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _index4 = require("../../spx/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../api/index.js");

var _index7 = _interopRequireDefault(_index6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddressIndex = (_dec = (0, _index3.connect)(function (_ref) {
  var address = _ref.address;
  return {
    defaultAddress: address.defaultAddress
  };
}, function (dispatch) {
  return {
    onAddressChoose: function onAddressChoose(defaultAddress) {
      return dispatch({ type: 'address/choose', payload: defaultAddress });
    }
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(AddressIndex, _BaseComponent);

  function AddressIndex() {
    var _ref2,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, AddressIndex);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = AddressIndex.__proto__ || Object.getPrototypeOf(AddressIndex)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["list", "isChoose", "ItemIndex", "isItemChecked", "isDefaultChecked", "__fn_onAddressChoose"], _this.handleClickChecked = function (index, item) {
      if (index === _this.state.ItemIndex) {
        _this.setState({
          isItemChecked: !_this.state.isItemChecked,
          ItemIndex: index
        });
      } else {
        _this.setState({
          isItemChecked: true,
          ItemIndex: index
        });
      }
      _this.__triggerPropsFn("onAddressChoose", [null].concat([item]));
      setTimeout(function () {
        _index2.default.navigateBack();
      }, 700);
    }, _this.handleChangeDefault = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                item.is_def = 1;
                _context.prev = 1;
                _context.next = 4;
                return _index7.default.member.addressCreateOrUpdate(item);

              case 4:
                if (item.address_id) {
                  _index5.default.toast('修改成功');
                }
                setTimeout(function () {
                  _this.fetch();
                }, 700);
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("return", false);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2, [[1, 8]]);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.handleClickToEdit = function (item) {
      if (item.address_id) {
        _index2.default.navigateTo({
          url: "/pages/member/edit-address?address_id=" + item.address_id
        });
      } else {
        _index2.default.navigateTo({
          url: '/pages/member/edit-address'
        });
      }
    }, _this.handleDelete = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(item) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _index7.default.member.addressDelete(item.address_id);

              case 2:
                _index5.default.toast('删除成功');
                setTimeout(function () {
                  _this.fetch();
                }, 700);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.wxAddress = function () {
      _index2.default.navigateTo({
        url: "/pages/member/edit-address?isWechatAddress=true"
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AddressIndex, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AddressIndex.prototype.__proto__ || Object.getPrototypeOf(AddressIndex.prototype), "_constructor", this).call(this, props);

      this.state = {
        list: [],
        isChoose: false,
        isItemChecked: false,
        ItemIndex: null,
        isDefaultChecked: true
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetch();
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _ref6, list;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.$router.params.isPicker) {
                  this.setState({
                    isChoose: true
                  });
                }
                _index2.default.showLoading({
                  mask: true
                });
                _context3.next = 4;
                return _index7.default.member.addressList();

              case 4:
                _ref6 = _context3.sent;
                list = _ref6.list;

                _index2.default.hideLoading();

                this.setState({
                  list: list
                });

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
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
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          ItemIndex = _state.ItemIndex,
          isItemChecked = _state.isItemChecked,
          isChoose = _state.isChoose,
          list = _state.list;

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return AddressIndex;
}(_index.Component), _class2.properties = {
  "__fn_onAddressChoose": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["wxAddress", "handleClickChecked", "handleChangeDefault", "handleClickToEdit", "handleDelete"], _temp2)) || _class);
exports.default = AddressIndex;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(AddressIndex, true));