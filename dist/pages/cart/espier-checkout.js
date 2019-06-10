"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _dec2, _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

var _index8 = require("../../hocs/index.js");

var _index9 = require("../../utils/index.js");

var _dom = require("../../utils/dom.js");

var _find = require("../../npm/lodash/find.js");

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var transformCartList = function transformCartList(list) {
  return (0, _index9.pickBy)(list, {
    item_id: 'item_id',
    cart_id: 'cart_id',
    title: 'item_name',
    curSymbol: 'fee_symbol',
    discount_info: 'discount_info',
    order_item_type: 'order_item_type',
    pics: 'pic',
    price: function price(_ref) {
      var _price = _ref.price;
      return (+_price / 100).toFixed(2);
    },
    num: 'num'
  }).sort(function (a) {
    return a.order_item_type !== 'gift' ? -1 : 1;
  });
};

var CartCheckout = (_dec = (0, _index3.connect)(function (_ref2) {
  var address = _ref2.address,
      cart = _ref2.cart;
  return {
    address: address.current,
    coupon: cart.coupon
  };
}, function (dispatch) {
  return {
    onClearFastbuy: function onClearFastbuy() {
      return dispatch({ type: 'cart/clearFastbuy' });
    },
    onClearCart: function onClearCart() {
      return dispatch({ type: 'cart/clear' });
    },
    onClearCoupon: function onClearCoupon() {
      return dispatch({ type: 'cart/clearCoupon' });
    },
    onAddressChoose: function onAddressChoose(address) {
      return dispatch({ type: 'address/choose', payload: address });
    }
  };
}), _dec2 = (0, _index8.withLogin)(), _dec(_class = _dec2(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(CartCheckout, _BaseComponent);

  function CartCheckout() {
    var _ref3,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, CartCheckout);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref3 = CartCheckout.__proto__ || Object.getPrototypeOf(CartCheckout)).call.apply(_ref3, [this].concat(args))), _this), _this.$usedState = ["info", "showAddressPicker", "address", "payType", "couponText", "total", "showCheckoutItems", "curCheckoutItems", "submitLoading", "isBtnDisabled", "isPaymentOpend", "disabledPayment", "invoiceTitle", "address_list", "showShippingPicker", "showCoupons", "coupons", "__fn_onClearFastbuy", "defaultAddress", "__fn_onClearCoupon", "__fn_onAddressChoose", "coupon", "__fn_onClearCart"], _this.handleAddressChange = function (address) {
      if (!address) {
        return;
      }
      address = (0, _index9.pickBy)(address, {
        state: 'province',
        city: 'city',
        district: 'county',
        address_id: 'address_id',
        mobile: 'telephone',
        name: 'username',
        zip: 'postalCode',
        address: 'adrdetail',
        area: 'area'
      });

      _this.setState({
        address: address
      }, function () {
        _this.calcOrder();
      });
      if (!address) {
        _this.setState({
          showAddressPicker: true
        });
      }
    }, _this.handleShippingChange = function (type) {
      console.log(type);
    }, _this.handleInvoiceClick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res, type, content, company_address, registration_number, bankname, bankaccount, company_phone;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _index2.default.chooseInvoiceTitle();

            case 2:
              res = _context.sent;


              if (res.errMsg === 'chooseInvoiceTitle:ok') {
                _index9.log.debug('[invoice] info:', res);
                type = res.type, content = res.title, company_address = res.companyAddress, registration_number = res.taxNumber, bankname = res.bankName, bankaccount = res.bankAccount, company_phone = res.telephone;

                _this.params = _extends({}, _this.params, {
                  invoice_type: 'normal',
                  invoice_content: {
                    title: type !== 0 ? 'individual' : 'unit',
                    content: content,
                    company_address: company_address,
                    registration_number: registration_number,
                    bankname: bankname,
                    bankaccount: bankaccount,
                    company_phone: company_phone
                  }
                });
                _this.setState({
                  invoiceTitle: content
                });
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handlePaymentShow = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _this.setState({
                isPaymentOpend: true
              });

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    })), _this.handlePay = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var _this$state, payType, total, _ref7, confirm, order_id, orderInfo, params, paymentParams, config, payErr, payRes;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (_this.state.address) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return", _index7.default.toast('请选择地址'));

            case 2:
              _this$state = _this.state, payType = _this$state.payType, total = _this$state.total;

              if (!(payType === 'dhpoint')) {
                _context3.next = 17;
                break;
              }

              _context3.prev = 4;
              _context3.next = 7;
              return _index2.default.showModal({
                title: '积分支付',
                content: "\u786E\u8BA4\u4F7F\u7528" + total.remainpt + "\u79EF\u5206\u5168\u989D\u62B5\u6263\u5546\u54C1\u603B\u4EF7\u5417",
                confirmColor: '#0b4137',
                confirmText: '确认使用',
                cancelText: '取消'
              });

            case 7:
              _ref7 = _context3.sent;
              confirm = _ref7.confirm;

              if (confirm) {
                _context3.next = 11;
                break;
              }

              return _context3.abrupt("return");

            case 11:
              _context3.next = 17;
              break;

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](4);

              console.log(_context3.t0);
              return _context3.abrupt("return");

            case 17:

              _index2.default.showLoading({
                title: '正在提交',
                mask: true
              });

              _this.setState({
                submitLoading: true
              });

              order_id = void 0, orderInfo = void 0;
              _context3.prev = 20;
              params = _this.getParams();
              _context3.next = 24;
              return _index5.default.trade.create(params);

            case 24:
              orderInfo = _context3.sent;

              order_id = orderInfo.order_id;
              _context3.next = 33;
              break;

            case 28:
              _context3.prev = 28;
              _context3.t1 = _context3["catch"](20);

              _index2.default.showToast({
                title: _context3.t1.message,
                icon: 'none'
              });

              _this.resolvePayError(_context3.t1);

              // dhpoint 判断
              if (payType === 'dhpoint') {
                _this.setState({
                  submitLoading: false
                });
              }

            case 33:

              _index2.default.hideLoading();

              if (order_id) {
                _context3.next = 36;
                break;
              }

              return _context3.abrupt("return");

            case 36:
              // 爱茉pay流程
              paymentParams = {
                order_id: order_id,
                pay_type: _this.state.payType,
                order_type: orderInfo.order_type
              };
              config = void 0, payErr = void 0;
              _context3.prev = 38;
              _context3.next = 41;
              return _index5.default.cashier.getPayment(paymentParams);

            case 41:
              config = _context3.sent;
              _context3.next = 48;
              break;

            case 44:
              _context3.prev = 44;
              _context3.t2 = _context3["catch"](38);

              payErr = _context3.t2;
              console.log(_context3.t2);

            case 48:

              _this.setState({
                submitLoading: false
              });

              // 积分流程

              if (!(payType === 'dhpoint')) {
                _context3.next = 52;
                break;
              }

              if (!payErr) {
                _index2.default.showToast({
                  title: '支付成功',
                  icon: 'none'
                });

                _this.__triggerPropsFn("onClearCart", [null].concat([]));
                _index2.default.redirectTo({
                  url: "/pages/trade/detail?id=" + order_id
                });
              }

              return _context3.abrupt("return");

            case 52:

              payErr = null;
              _context3.prev = 53;
              _context3.next = 56;
              return _index2.default.requestPayment(config);

            case 56:
              payRes = _context3.sent;

              _index9.log.debug("[order pay]: ", payRes);
              _context3.next = 64;
              break;

            case 60:
              _context3.prev = 60;
              _context3.t3 = _context3["catch"](53);

              payErr = _context3.t3;
              _index2.default.showToast({
                title: _context3.t3.err_desc || _context3.t3.errMsg || '支付失败',
                icon: 'none'
              });

            case 64:
              if (payErr) {
                _context3.next = 72;
                break;
              }

              try {
                _index5.default.trade.tradeQuery(config.trade_info.trade_id);
              } catch (e) {
                console.info(e);
              }

              _context3.next = 68;
              return _index2.default.showToast({
                title: '支付成功',
                icon: 'success'
              });

            case 68:

              _this.__triggerPropsFn("onClearCart", [null].concat([]));
              _index2.default.redirectTo({
                url: "/pages/trade/detail?id=" + order_id
              });
              _context3.next = 73;
              break;

            case 72:
              if (payErr.errMsg.indexOf('fail cancel') >= 0) {
                _index2.default.redirectTo({
                  url: "/pages/trade/detail?id=" + order_id
                });
              }

            case 73:
              return _context3.abrupt("return");

            case 74:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, _this2, [[4, 13], [20, 28], [38, 44], [53, 60]]);
    })), _this.handleCouponsClick = function () {
      if (_this.state.payType === 'dhpoint') {
        return;
      }

      var items = _this.params.items.filter(function (item) {
        return item.order_item_type !== 'gift';
      }).map(function (item) {
        var item_id = item.item_id,
            num = item.num;

        return {
          item_id: item_id,
          num: num
        };
      });

      _index2.default.navigateTo({
        url: "/pages/cart/coupon-picker?items=" + JSON.stringify(items)
      });
    }, _this.handlePaymentChange = function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(payType) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (payType === 'dhpoint') {
                  _this.__triggerPropsFn("onClearCoupon", [null].concat([]));
                }
                _this.setState({
                  payType: payType,
                  isPaymentOpend: false
                }, function () {
                  _this.calcOrder();
                });

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, _this2);
      }));

      return function (_x) {
        return _ref8.apply(this, arguments);
      };
    }(), _this.handlePaymentClose = function () {
      _this.setState({
        isPaymentOpend: false
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CartCheckout, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CartCheckout.prototype.__proto__ || Object.getPrototypeOf(CartCheckout.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: null,
        submitLoading: false,
        address_list: [],
        showShippingPicker: false,
        showAddressPicker: false,
        showCheckoutItems: false,
        showCoupons: false,
        curCheckoutItems: [],
        coupons: [],
        total: {
          items_count: '',
          total_fee: '0.00',
          item_fee: '',
          freight_fee: '',
          member_discount: '',
          coupon_discount: '',
          point: ''
        },
        payType: 'amorepay',
        disabledPayment: null,
        isPaymentOpend: false,
        invoiceTitle: ''
      };
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetchAddress();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // this.fetchAddress()

      var _$router$params = this.$router.params,
          cart_type = _$router$params.cart_type,
          payType = _$router$params.pay_type;

      var info = null;

      if (cart_type === 'fastbuy') {
        this.__triggerPropsFn("onClearFastbuy", [null].concat([]));
        info = null;
      } else if (cart_type === 'cart') {
        // 积分购买不在此种情况

        this.__triggerPropsFn("onClearFastbuy", [null].concat([]));
        info = null;
      }

      this.setState({
        info: info,
        payType: payType || this.state.payType
      });

      var total_fee = 0;
      var items_count = 0;
      var items = info && info.cart ? info.cart[0].list.map(function (item) {
        var item_id = item.item_id,
            num = item.num;

        total_fee += +item.price;
        items_count += +item.num;
        return {
          item_id: item_id,
          num: num
        };
      }) : [];

      this.params = {
        cart_type: cart_type,
        items: items,
        pay_type: payType || 'amorepay'
      };

      this.setState({
        total: {
          items_count: items_count,
          total_fee: total_fee.toFixed(2)
        }
      });
      this.handleAddressChange(this.props.defaultAddress);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // teardown clean
      this.__triggerPropsFn("onClearCoupon", [null].concat([]));
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.address !== this.props.address) {
        this.fetchAddress();
      }
    }
  }, {
    key: "fetchAddress",
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(cb) {
        var _this3 = this;

        var _ref10, list;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _index2.default.showLoading({
                  mask: true
                });
                _context5.next = 3;
                return _index5.default.member.addressList();

              case 3:
                _ref10 = _context5.sent;
                list = _ref10.list;

                _index2.default.hideLoading();

                this.setState({
                  address_list: list
                }, function () {
                  _this3.changeSelection();
                  cb && cb(list);
                });

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function fetchAddress(_x2) {
        return _ref9.apply(this, arguments);
      }

      return fetchAddress;
    }()
  }, {
    key: "changeSelection",
    value: function changeSelection() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var address_list = this.state.address_list;

      if (address_list.length === 0) {
        // this.props.address = {
        //   current: null
        // }
        this.__triggerPropsFn("onAddressChoose", [null].concat([null]));
        this.setState({
          address: null
        });
        // this.handleAddressChange()
        this.calcOrder();
        /*Taro.navigateTo({
          url: '/pages/member/edit-address'
        })*/
        return;
      }

      var address = this.props.address;
      if (!address) {
        var address_id = params.address_id;

        address = (0, _find2.default)(address_list, function (addr) {
          return address_id ? address_id === addr.address_id : addr.is_def > 0;
        }) || address_list[0] || null;
      }

      _index9.log.debug('[address picker] selection: ', address);
      this.__triggerPropsFn("onAddressChoose", [null].concat([address]));
      this.handleAddressChange(address);
    }
  }, {
    key: "getParams",
    value: function getParams() {
      var receiver = (0, _index9.pickBy)(this.state.address, {
        receiver_name: 'name',
        receiver_mobile: 'mobile',
        receiver_state: 'state',
        receiver_city: 'city',
        receiver_district: 'district',
        receiver_address: 'address',
        receiver_zip: 'zip'
      });
      var payType = this.state.payType;
      var coupon = this.props.coupon;


      var params = _extends({}, this.params, receiver, {
        receipt_type: 'logistics',
        order_type: 'normal',
        promotion: 'normal',
        member_discount: 0,
        coupon_discount: 0,
        pay_type: payType
      });

      _index9.log.debug('[checkout] params: ', params);

      if (coupon) {
        if (coupon.type === 'coupon' && coupon.value.code) {
          params.coupon_discount = coupon.value.code;
        } else if (coupon.type === 'member') {
          params.member_discount = coupon.value ? 1 : 0;
        }
      }

      this.params = params;

      return params;
    }
  }, {
    key: "calcOrder",
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var params, data, _data, items, item_fee, totalItemNum, _data$member_discount, member_discount, _data$coupon_discount, coupon_discount, discount_fee, _data$freight_fee, freight_fee, _data$freight_point, freight_point, _data$point, point, total_fee, remainpt, deduction, total, info;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _index2.default.showLoading({
                  title: '加载中',
                  mask: true
                });
                params = this.getParams();
                data = void 0;
                _context6.prev = 3;
                _context6.next = 6;
                return _index5.default.cart.total(params);

              case 6:
                data = _context6.sent;
                _context6.next = 12;
                break;

              case 9:
                _context6.prev = 9;
                _context6.t0 = _context6["catch"](3);

                this.resolvePayError(_context6.t0);

              case 12:
                if (data) {
                  _context6.next = 14;
                  break;
                }

                return _context6.abrupt("return");

              case 14:
                _data = data, items = _data.items, item_fee = _data.item_fee, totalItemNum = _data.totalItemNum, _data$member_discount = _data.member_discount, member_discount = _data$member_discount === undefined ? 0 : _data$member_discount, _data$coupon_discount = _data.coupon_discount, coupon_discount = _data$coupon_discount === undefined ? 0 : _data$coupon_discount, discount_fee = _data.discount_fee, _data$freight_fee = _data.freight_fee, freight_fee = _data$freight_fee === undefined ? 0 : _data$freight_fee, _data$freight_point = _data.freight_point, freight_point = _data$freight_point === undefined ? 0 : _data$freight_point, _data$point = _data.point, point = _data$point === undefined ? 0 : _data$point, total_fee = _data.total_fee, remainpt = _data.remainpt, deduction = _data.deduction;
                total = _extends({}, this.state.total, {
                  item_fee: item_fee,
                  discount_fee: -1 * discount_fee,
                  member_discount: -1 * member_discount,
                  coupon_discount: -1 * coupon_discount,
                  freight_fee: freight_fee,
                  total_fee: params.pay_type === 'dhpoint' ? 0 : total_fee,
                  items_count: totalItemNum,
                  point: point,
                  freight_point: freight_point,
                  remainpt: remainpt, // 总积分
                  deduction: deduction // 抵扣
                });
                info = this.state.info;

                if (items && !this.state.info) {
                  // 从后端获取订单item
                  info = {
                    cart: [{
                      list: transformCartList(items),
                      cart_total_num: items.reduce(function (acc, item) {
                        return +item.num + acc;
                      }, 0)
                    }]
                  };
                  this.params.items = items;
                }

                _index2.default.hideLoading();
                this.setState({
                  total: total,
                  info: info
                });

              case 20:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[3, 9]]);
      }));

      function calcOrder() {
        return _ref11.apply(this, arguments);
      }

      return calcOrder;
    }()
  }, {
    key: "handleClickItems",
    value: function handleClickItems(items) {
      this.setState({
        curCheckoutItems: items
      });
      this.toggleCheckoutItems();
    }
  }, {
    key: "toggleCheckoutItems",
    value: function toggleCheckoutItems(isOpened) {
      if (isOpened === undefined) {
        isOpened = !this.state.showCheckoutItems;
      }

      (0, _dom.lockScreen)(isOpened);
      this.setState({ showCheckoutItems: isOpened });
    }
  }, {
    key: "toggleState",
    value: function toggleState(key, val) {
      if (val === undefined) {
        val = !this.state[key];
      }

      this.setState(_defineProperty({}, key, val));
    }
  }, {
    key: "resolvePayError",
    value: function resolvePayError(e) {
      var _this4 = this;

      var payType = this.state.payType;

      if (payType === 'dhpoint') {
        // let payTypeNeedsChange = ['当前积分不足以支付本次订单费用', '当月使用积分已达限额'].includes(e.message)
        this.setState({
          disabledPayment: { name: 'dhpoint', message: e.message },
          payType: 'amorepay'
        }, function () {
          _this4.calcOrder();
        });
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var coupon = this.__props.coupon;
      var _state = this.__state,
          info = _state.info,
          address = _state.address,
          total = _state.total,
          showAddressPicker = _state.showAddressPicker,
          showCheckoutItems = _state.showCheckoutItems,
          curCheckoutItems = _state.curCheckoutItems,
          payType = _state.payType,
          invoiceTitle = _state.invoiceTitle,
          submitLoading = _state.submitLoading,
          disabledPayment = _state.disabledPayment,
          isPaymentOpend = _state.isPaymentOpend;

      if (!info) {
        return null;
      }

      var couponText = !coupon ? '' : coupon.type === 'member' ? '会员折扣' : coupon.value && coupon.value.title || '';
      var isBtnDisabled = !address;

      Object.assign(this.__state, {
        address: address,
        couponText: couponText,
        isBtnDisabled: isBtnDisabled
      });
      return this.__state;
    }
  }]);

  return CartCheckout;
}(_index.Component), _class2.properties = {
  "__fn_onClearFastbuy": {
    "type": null,
    "value": null
  },
  "defaultAddress": {
    "type": null,
    "value": null
  },
  "__fn_onClearCoupon": {
    "type": null,
    "value": null
  },
  "address": {
    "type": null,
    "value": null
  },
  "__fn_onAddressChoose": {
    "type": null,
    "value": null
  },
  "coupon": {
    "type": null,
    "value": null
  },
  "__fn_onClearCart": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleCouponsClick", "handleInvoiceClick", "handlePaymentShow", "toggleCheckoutItems", "handlePay", "handlePaymentClose", "handlePaymentChange"], _class2.defaultProps = {
  list: []
}, _temp2)) || _class) || _class);
exports.default = CartCheckout;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CartCheckout, true));