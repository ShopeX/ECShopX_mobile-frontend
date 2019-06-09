"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../utils/index.js");

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

var _index8 = require("../../consts/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// function resolveTradeOrders (info) {
//   return info.orders.map(order => {
//     const { item_id, title, pic_path: img, total_fee: price, num } = order
//     return {
//       item_id,
//       title,
//       img,
//       price,
//       num
//     }
//   })
// }

var TradeDetail = (_temp2 = _class = function (_BaseComponent) {
  _inherits(TradeDetail, _BaseComponent);

  function TradeDetail() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, TradeDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TradeDetail.__proto__ || Object.getPrototypeOf(TradeDetail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "info", "timer", "isDhPoint", "payLoading"], _this.handleCopy = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var info, msg;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              info = _this.state.info;
              msg = "\u6536\u8D27\u4EBA\uFF1A" + info.receiver_name + " " + info.receiver_mobile + "\n\u6536\u8D27\u5730\u5740\uFF1A" + info.receiver_state + info.receiver_city + info.receiver_district + info.receiver_address + "\n\u8BA2\u5355\u7F16\u53F7\uFF1A" + info.tid + "\n\u521B\u5EFA\u65F6\u95F4\uFF1A" + info.created_time_str + "\n";
              _context.next = 4;
              return (0, _index3.copyText)(msg);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleClickDelivery = function () {}
    /*Taro.navigateTo({
      url: '/pages/trade/delivery-info?order_id='+this.state.info.tid
    })*/

    // handleClickAfterSale= () => {
    //   const { info: { tid: order_id } } = this.state
    //   Taro.navigateTo({
    //     url: `/pages/trade/refund?order_id=${order_id}`
    //   })
    // }

    , _this.handleClickToDelivery = function () {}, _this.handleClickCopy = function (val) {
      (0, _index3.copyText)(val);
      _index7.default.toast('复制成功');
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TradeDetail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TradeDetail.prototype.__proto__ || Object.getPrototypeOf(TradeDetail.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: null,
        timer: null,
        payLoading: false
      };
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetch();
    }
  }, {
    key: "calcTimer",
    value: function calcTimer(totalSec) {
      var remainingSec = totalSec;
      var dd = Math.floor(totalSec / 24 / 3600);
      remainingSec -= dd * 3600 * 24;
      var hh = Math.floor(remainingSec / 3600);
      remainingSec -= hh * 3600;
      var mm = Math.floor(remainingSec / 60);
      remainingSec -= mm * 60;
      var ss = Math.floor(remainingSec);

      return {
        dd: dd,
        hh: hh,
        mm: mm,
        ss: ss
      };
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var id, data, info, timer, infoStatus;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = this.$router.params.id;
                _context2.next = 3;
                return _index5.default.trade.detail(id);

              case 3:
                data = _context2.sent;
                info = (0, _index3.pickBy)(data.orderInfo, {
                  tid: 'order_id',
                  created_time_str: function created_time_str(_ref4) {
                    var create_time = _ref4.create_time;
                    return (0, _index3.formatTime)(create_time * 1000);
                  },
                  auto_cancel_seconds: 'auto_cancel_seconds',
                  receiver_name: 'receiver_name',
                  receiver_mobile: 'receiver_mobile',
                  receiver_state: 'receiver_state',
                  discount_fee: function discount_fee(_ref5) {
                    var _discount_fee = _ref5.discount_fee;
                    return (+_discount_fee / 100).toFixed(2);
                  },
                  receiver_city: 'receiver_city',
                  receiver_district: 'receiver_district',
                  receiver_address: 'receiver_address',
                  status_desc: 'order_status_msg',
                  delivery_code: 'delivery_code',
                  delivery_corp: 'delivery_corp',
                  order_type: 'order_type',
                  order_status_msg: 'order_status_msg',
                  item_fee: function item_fee(_ref6) {
                    var _item_fee = _ref6.item_fee;
                    return (+_item_fee / 100).toFixed(2);
                  },
                  coupon_discount: function coupon_discount(_ref7) {
                    var _coupon_discount = _ref7.coupon_discount;
                    return (+_coupon_discount / 100).toFixed(2);
                  },
                  freight_fee: function freight_fee(_ref8) {
                    var _freight_fee = _ref8.freight_fee;
                    return (+_freight_fee / 100).toFixed(2);
                  },
                  payment: function payment(_ref9) {
                    var pay_type = _ref9.pay_type,
                        total_fee = _ref9.total_fee;
                    return pay_type === 'dhpoint' ? Math.floor(total_fee) : (+total_fee / 100).toFixed(2);
                  }, // 积分向下取整
                  pay_type: 'pay_type',
                  invoice_content: 'invoice.content',
                  point: 'point',
                  status: function status(_ref10) {
                    var order_status = _ref10.order_status;
                    return (0, _index3.resolveOrderStatus)(order_status);
                  },
                  orders: function orders(_ref11) {
                    var items = _ref11.items;
                    return (0, _index3.pickBy)(items, {
                      order_id: 'order_id',
                      item_id: 'item_id',
                      aftersales_status: function aftersales_status(_ref12) {
                        var _aftersales_status = _ref12.aftersales_status;
                        return _index8.AFTER_SALE_STATUS[_aftersales_status];
                      },
                      pic_path: 'pic',
                      title: 'item_name',
                      delivery_status: 'delivery_status',
                      price: function price(_ref13) {
                        var item_fee = _ref13.item_fee;
                        return (+item_fee / 100).toFixed(2);
                      },
                      point: 'item_point',
                      num: 'num'
                    });
                  }
                });
                timer = null;

                if (info.auto_cancel_seconds) {
                  timer = this.calcTimer(info.auto_cancel_seconds);
                  this.setState({
                    timer: timer
                  });
                }

                infoStatus = (info.status || '').toLowerCase();

                info.status_img = "ico_" + (infoStatus === 'trade_success' ? 'wait_rate' : infoStatus) + ".png";

                _index3.log.debug('[trade info] info: ', info);

                this.setState({
                  info: info
                });

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch() {
        return _ref3.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "handlePay",
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var info, order_id, order_type, paymentParams, config, payErr, payRes, _getCurrentRoute, fullPath;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                info = this.state.info;


                this.setState({
                  payLoading: true
                });

                // 爱茉pay流程
                order_id = info.tid, order_type = info.order_type;
                paymentParams = {
                  pay_type: 'amorepay',
                  order_id: order_id,
                  order_type: order_type
                };
                _context3.next = 6;
                return _index5.default.cashier.getPayment(paymentParams);

              case 6:
                config = _context3.sent;


                this.setState({
                  payLoading: false
                });

                payErr = void 0;
                _context3.prev = 9;
                _context3.next = 12;
                return _index2.default.requestPayment(config);

              case 12:
                payRes = _context3.sent;

                _index3.log.debug("[order pay]: ", payRes);
                _context3.next = 20;
                break;

              case 16:
                _context3.prev = 16;
                _context3.t0 = _context3["catch"](9);

                payErr = _context3.t0;
                if (_context3.t0.errMsg.indexOf('cancel') < 0) {
                  _index2.default.showToast({
                    title: _context3.t0.err_desc || _context3.t0.errMsg || '支付失败',
                    icon: 'none'
                  });
                }

              case 20:
                if (payErr) {
                  _context3.next = 26;
                  break;
                }

                try {
                  _index5.default.trade.tradeQuery(config.trade_info.trade_id);
                } catch (e) {
                  console.info(e);
                }

                _context3.next = 24;
                return _index2.default.showToast({
                  title: '支付成功',
                  icon: 'success'
                });

              case 24:
                _getCurrentRoute = (0, _index3.getCurrentRoute)(this.$router), fullPath = _getCurrentRoute.fullPath;

                _index2.default.redirectTo({
                  url: fullPath
                });

              case 26:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[9, 16]]);
      }));

      function handlePay() {
        return _ref14.apply(this, arguments);
      }

      return handlePay;
    }()
  }, {
    key: "handleClickBtn",
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(type) {
        var info, _ref16, confirm, _getCurrentRoute2, fullPath;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                info = this.state.info;

                if (!(type === 'home')) {
                  _context4.next = 4;
                  break;
                }

                _index2.default.redirectTo({
                  url: "/pages/index"
                });
                return _context4.abrupt("return");

              case 4:
                if (!(type === 'pay')) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 7;
                return this.handlePay();

              case 7:
                return _context4.abrupt("return");

              case 8:
                if (!(type === 'cancel')) {
                  _context4.next = 11;
                  break;
                }

                _index2.default.navigateTo({
                  url: "/pages/trade/cancel?order_id=" + info.tid
                });
                return _context4.abrupt("return");

              case 11:
                if (!(type === 'confirm')) {
                  _context4.next = 22;
                  break;
                }

                _context4.next = 14;
                return _index2.default.showModal({
                  title: '确认收货？',
                  content: ''
                });

              case 14:
                _ref16 = _context4.sent;
                confirm = _ref16.confirm;

                if (!confirm) {
                  _context4.next = 21;
                  break;
                }

                _context4.next = 19;
                return _index5.default.trade.confirm(info.tid);

              case 19:
                _getCurrentRoute2 = (0, _index3.getCurrentRoute)(this.$router), fullPath = _getCurrentRoute2.fullPath;

                _index2.default.redirectTo({
                  url: fullPath
                });

              case 21:
                return _context4.abrupt("return");

              case 22:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function handleClickBtn(_x) {
        return _ref15.apply(this, arguments);
      }

      return handleClickBtn;
    }()
  }, {
    key: "handleClickRefund",
    value: function () {
      var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(type, item_id) {
        var order_id;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                order_id = this.state.info.tid;


                if (type === 'refund') {
                  _index2.default.navigateTo({
                    url: "/pages/trade/refund?order_id=" + order_id + "&item_id=" + item_id
                  });
                } else if (type === 'refundDetail') {
                  _index2.default.navigateTo({
                    url: "/pages/trade/refund-detail?order_id=" + order_id + "&item_id=" + item_id
                  });
                }

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function handleClickRefund(_x2, _x3) {
        return _ref17.apply(this, arguments);
      }

      return handleClickRefund;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          timer = _state.timer,
          payLoading = _state.payLoading;

      if (!info) {
        return null;
      }

      var isDhPoint = info.pay_type === 'dhpoint';

      // TODO: orders 多商铺
      // const tradeOrders = resolveTradeOrders(info)

      var anonymousState__temp = info.status === 'WAIT_BUYER_PAY' ? (0, _index3.classNames)('trade-detail-header', "trade-detail-header__waitpay") : null;
      var anonymousState__temp2 = info.status === 'WAIT_BUYER_PAY' ? { hours: ':', minutes: ':', seconds: '' } : null;
      var anonymousState__temp3 = info.status !== 'WAIT_BUYER_PAY' ? (0, _index3.classNames)('trade-detail-header') : null;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        isDhPoint: isDhPoint
      });
      return this.__state;
    }
  }]);

  return TradeDetail;
}(_index.Component), _class.properties = {}, _class.$$events = ["fetch", "handleClickDelivery", "handleClickCopy", "handleClickBtn"], _temp2);
exports.default = TradeDetail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TradeDetail, true));