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

var _dom = require("../../utils/dom.js");

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PointOrderDetail = (_temp2 = _class = function (_BaseComponent) {
  _inherits(PointOrderDetail, _BaseComponent);

  function PointOrderDetail() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, PointOrderDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PointOrderDetail.__proto__ || Object.getPrototypeOf(PointOrderDetail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "info", "showAddressPicker", "address"], _this.handleCopy = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var info, msg;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              info = _this.state.info;
              msg = info.luckydraw_trade_id;
              _context.next = 4;
              return (0, _index3.copyText)(msg);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleClickBtn = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(type) {
        var info, _ref4, confirm, query, _ref5, _confirm, _query;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                info = _this.state.info;

                if (!(type === 'address')) {
                  _context2.next = 18;
                  break;
                }

                _context2.next = 4;
                return _index2.default.showModal({
                  title: '确认提交该收货地址，提交后不可修改？',
                  content: ''
                });

              case 4:
                _ref4 = _context2.sent;
                confirm = _ref4.confirm;

                if (!confirm) {
                  _context2.next = 17;
                  break;
                }

                query = {
                  luckydraw_trade_id: info.luckydraw_trade_id,
                  address_id: info.address_id
                };
                _context2.prev = 8;
                _context2.next = 11;
                return _index5.default.member.pointOrderAddress(query);

              case 11:
                _this.fetch();
                _context2.next = 17;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](8);

                console.log(_context2.t0);

              case 17:
                return _context2.abrupt("return");

              case 18:
                if (!(type === 'confirm')) {
                  _context2.next = 35;
                  break;
                }

                _context2.next = 21;
                return _index2.default.showModal({
                  title: '确认收货？',
                  content: ''
                });

              case 21:
                _ref5 = _context2.sent;
                _confirm = _ref5.confirm;

                if (!_confirm) {
                  _context2.next = 34;
                  break;
                }

                _query = {
                  luckydraw_trade_id: info.luckydraw_trade_id
                };
                _context2.prev = 25;
                _context2.next = 28;
                return _index5.default.member.pointOrderConfirm(_query);

              case 28:
                _this.fetch();
                _context2.next = 34;
                break;

              case 31:
                _context2.prev = 31;
                _context2.t1 = _context2["catch"](25);

                console.log(_context2.t1);

              case 34:
                return _context2.abrupt("return");

              case 35:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[8, 14], [25, 31]]);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.toggleState = function (key, val) {
      console.log(key, val, 96);
      if (val === undefined) {
        val = !_this.state[key];
      }

      _this.setState(_defineProperty({}, key, val));
    }, _this.toggleAddressPicker = function (isOpened) {
      console.log(isOpened, 126);
      if (isOpened === undefined) {
        isOpened = !_this.state.showAddressPicker;
      }

      (0, _dom.lockScreen)(isOpened);
      _this.setState({ showAddressPicker: isOpened });
    }, _this.handleAddressChange = function (address) {
      if (!address) {
        _this.toggleAddressPicker(true);
        return;
      }

      address = (0, _index3.pickBy)(address, {
        state: 'province',
        city: 'city',
        district: 'county',
        addr_id: 'address_id',
        mobile: 'telephone',
        name: 'username',
        zip: 'postalCode',
        address: 'adrdetail',
        area: 'area'
      });

      _this.setState({
        address: address,
        info: _extends({}, _this.state.info, {
          receiver_name: address.name,
          receiver_mobile: address.mobile,
          receiver_state: address.state,
          receiver_city: address.city,
          receiver_district: address.district,
          receiver_address: address.address,
          address_id: address.addr_id
        })
      });
      if (!address) {
        _this.setState({
          showAddressPicker: true
        });
      }
    }, _this.handleClickDelivery = function () {
      _index2.default.navigateTo({
        url: '/pages/trade/delivery-info?order_id=' + _this.state.info.luckydraw_trade_id
      });
    }, _this.handleAddressClick = function () {
      var info = _this.state.info;

      console.log(info, 111);
      if (info.ship_status === 'waitaddress') {
        _this.toggleAddressPicker(true);
      }
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PointOrderDetail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PointOrderDetail.prototype.__proto__ || Object.getPrototypeOf(PointOrderDetail.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: null,
        address: null,
        showAddressPicker: false
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
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var id, data, info;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                id = this.$router.params.id;
                _context3.next = 3;
                return _index5.default.member.pointOrderDetail(id);

              case 3:
                data = _context3.sent;
                info = (0, _index3.pickBy)(data, {
                  luckydraw_trade_id: 'luckydraw_trade_id',
                  created: function created(_ref7) {
                    var _created = _ref7.created;
                    return (0, _index3.formatTime)(_created * 1000, 'YYYY-MM-DD HH:mm:ss');
                  },
                  title: 'item_name',
                  pic_path: 'item_pic',
                  point: 'luckydraw_point',
                  lucky_status: 'lucky_status',
                  status_img: 'lucky_status',
                  address_id: 'address_id',
                  ship_status: 'ship_status',
                  receiver_name: 'address.username',
                  receiver_mobile: 'address.telephone',
                  receiver_state: 'address.province',
                  receiver_city: 'address.city',
                  receiver_district: 'address.county',
                  receiver_address: 'address.adrdetail',
                  ship_corp: 'ship_corp',
                  ship_code: 'ship_code'
                });


                console.log(info, 49);
                if (info.lucky_status === 'lucky') {
                  info.status_desc_name = '中奖';
                  info.status_img = 'ico_wait_buyer_confirm_goods.png';
                } else if (info.lucky_status === 'unlukcy') {
                  info.status_desc_name = '未中奖';
                  info.status_img = 'ico_wait_rate.png';
                } else {
                  info.status_desc_name = '尚未开奖';
                  info.status_img = 'ico_wait_seller_send_goods.png';
                }

                this.setState({
                  info: info
                });

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetch() {
        return _ref6.apply(this, arguments);
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
          address = _state.address,
          showAddressPicker = _state.showAddressPicker;

      if (!info) {
        return null;
      }
      console.log(info, showAddressPicker, 190);
      // TODO: orders 多商铺
      // const tradeOrders = resolveTradeOrders(info)

      var anonymousState__temp = (0, _index3.classNames)('trade-detail', "trade-detail__status-" + info.status);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp
      });
      return this.__state;
    }
  }]);

  return PointOrderDetail;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleAddressClick", "handleCopy", "handleClickDelivery", "handleClickBtn", "handleAddressChange", "toggleState"], _temp2);
exports.default = PointOrderDetail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PointOrderDetail, true));