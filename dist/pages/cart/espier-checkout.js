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

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

var _index8 = require("../../utils/index.js");

var _dom = require("../../utils/dom.js");

var _cart = require("../../store/cart.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CartCheckout = (_dec = (0, _index3.connect)(function (_ref) {
  var cart = _ref.cart;
  return {
    coupon: cart.coupon,
    fastbuy: cart.fastbuy,
    list: (0, _cart.getSelectedCart)(cart)
  };
}, function (dispatch) {
  return {
    onClearFastbuy: function onClearFastbuy() {
      return dispatch({ type: 'cart/clearFastbuy' });
    },
    onClearCart: function onClearCart() {
      return dispatch({ type: 'cart/clear' });
    }
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(CartCheckout, _BaseComponent);

  function CartCheckout() {
    var _ref2,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, CartCheckout);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = CartCheckout.__proto__ || Object.getPrototypeOf(CartCheckout)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["info", "loopArray0", "address", "couponText", "total", "showAddressPicker", "showCheckoutItems", "curCheckoutItems", "showShippingPicker", "showCoupons", "coupons", "fastbuy", "__fn_onClearFastbuy", "list", "coupon", "__fn_onClearCart"], _this.handleAddressChange = function (address) {
      address = (0, _index8.pickBy)(address, {
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
    }, _this.handlePay = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _ref4, order_id, url;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (_this.state.address) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", _index7.default.notify('请选择地址'));

            case 2:
              _context.next = 4;
              return _index5.default.trade.create(_this.params);

            case 4:
              _ref4 = _context.sent;
              order_id = _ref4.order_id;
              url = "/pages/cashier/index?order_id=" + order_id;

              _this.__triggerPropsFn("onClearCart", [null].concat([]));
              _index2.default.navigateTo({ url: url });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleCouponsClick = function () {
      _index2.default.navigateTo({
        url: "/pages/cart/coupon-picker?items=" + JSON.stringify(_this.params.items)
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CartCheckout, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CartCheckout.prototype.__proto__ || Object.getPrototypeOf(CartCheckout.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: null,
        address: null,
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
          coupon_discount: ''
        }
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var cart_type = this.$router.params.cart_type;

      var info = null;

      if (cart_type === 'fastbuy') {
        var fastBuyItem = this.props.fastbuy;
        info = {
          cart: [{
            list: [fastBuyItem],
            cart_total_num: fastBuyItem.num
          }]
        };
      } else {
        this.__triggerPropsFn("onClearFastbuy", [null].concat([]));
        var list = this.props.list;

        info = {
          cart: [{
            list: list,
            cart_total_num: list.reduce(function (acc, item) {
              return +item.num + acc;
            }, 0)
          }]
        };
      }

      this.setState({
        info: info
      });

      var total_fee = 0;
      var items_count = 0;
      var items = info.cart[0].list.map(function (item) {
        var item_id = item.item_id,
            num = item.num;

        total_fee += +item.price;
        items_count += +item.num;
        return {
          item_id: item_id,
          num: num
        };
      });

      this.params = {
        items: items,
        receipt_type: 'logistics',
        order_type: 'normal',
        promotion: 'normal',
        member_discount: false,
        pay_type: 'deposit'
      };

      this.setState({
        total: {
          items_count: items_count,
          total_fee: total_fee.toFixed(2)
        }
      });
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      if (!this.props.list.length && !this.props.fastbuy) {
        _index2.default.showToast({
          title: '购物车中无商品',
          icon: 'none'
        }).then(function () {
          _index2.default.navigateTo({
            url: '/pages/home/index'
          });
        });

        return;
      }
      if (!this.params) {
        return;
      }this.calcOrder();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch() {
        return _ref5.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "getParams",
    value: function getParams() {
      var receiver = (0, _index8.pickBy)(this.state.address, {
        receiver_name: 'name',
        receiver_mobile: 'mobile',
        receiver_state: 'state',
        receiver_city: 'city',
        receiver_district: 'district',
        receiver_address: 'address',
        receiver_zip: 'zip'
      });
      var coupon = this.props.coupon;


      var params = _extends({}, this.params, receiver, {
        coupon_discount: 0,
        member_discount: 0
      });
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
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var params, data, item_fee, _data$member_discount, member_discount, _data$coupon_discount, coupon_discount, _data$freight_fee, freight_fee, total_fee, total;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _index2.default.showLoading({
                  title: '加载中',
                  mask: true
                });
                params = this.getParams();
                _context3.next = 4;
                return _index5.default.cart.total(params);

              case 4:
                data = _context3.sent;
                item_fee = data.item_fee, _data$member_discount = data.member_discount, member_discount = _data$member_discount === undefined ? 0 : _data$member_discount, _data$coupon_discount = data.coupon_discount, coupon_discount = _data$coupon_discount === undefined ? 0 : _data$coupon_discount, _data$freight_fee = data.freight_fee, freight_fee = _data$freight_fee === undefined ? 0 : _data$freight_fee, total_fee = data.total_fee;
                total = _extends({}, this.state.total, {
                  item_fee: item_fee,
                  member_discount: -1 * member_discount,
                  coupon_discount: -1 * coupon_discount,
                  freight_fee: freight_fee,
                  total_fee: total_fee
                });

                _index2.default.hideLoading();

                this.setState({
                  total: total
                });

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function calcOrder() {
        return _ref6.apply(this, arguments);
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
    key: "toggleAddressPicker",
    value: function toggleAddressPicker(isOpened) {
      if (isOpened === undefined) {
        isOpened = !this.state.showAddressPicker;
      }

      (0, _dom.lockScreen)(isOpened);
      this.setState({ showAddressPicker: isOpened });
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
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var coupon = this.__props.coupon;
      var _state = this.__state,
          info = _state.info,
          address = _state.address,
          total = _state.total,
          showAddressPicker = _state.showAddressPicker,
          showCheckoutItems = _state.showCheckoutItems,
          curCheckoutItems = _state.curCheckoutItems;


      if (!info) {
        return null;
      }

      var couponText = !coupon ? '' : coupon.type === 'member' ? '会员折扣' : coupon.value && coupon.value.title || '';

      var loopArray0 = info.cart.map(function (cart) {
        cart = {
          $original: (0, _index.internal_get_original)(cart)
        };
        var $loopState__temp2 = "\u5171" + cart.$original.cart_total_num + "\u4EF6\u5546\u54C1";
        var $anonymousCallee__0 = cart.$original.list.map(function (item, idx) {
          item = {
            $original: (0, _index.internal_get_original)(item)
          };
          var $loopState__temp4 = Array.isArray(item.$original.pics) ? item.$original.pics[0] : item.$original.pics;
          return {
            $loopState__temp4: $loopState__temp4,
            $original: item.$original
          };
        });
        return {
          $loopState__temp2: $loopState__temp2,
          $anonymousCallee__0: $anonymousCallee__0,
          $original: cart.$original
        };
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        couponText: couponText
      });
      return this.__state;
    }
  }]);

  return CartCheckout;
}(_index.Component), _class2.properties = {
  "fastbuy": {
    "type": null,
    "value": null
  },
  "__fn_onClearFastbuy": {
    "type": null,
    "value": null
  },
  "list": {
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
}, _class2.$$events = ["toggleAddressPicker", "handleCouponsClick", "handleAddressChange", "toggleState", "toggleCheckoutItems", "handlePay"], _class2.defaultProps = {
  list: [],
  fastbuy: null
}, _temp2)) || _class);
exports.default = CartCheckout;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CartCheckout, true));