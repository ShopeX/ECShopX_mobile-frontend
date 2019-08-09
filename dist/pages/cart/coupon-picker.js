"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _index4 = require("../../utils/index.js");

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CouponPicker = (_dec = (0, _index3.connect)(function (_ref) {
  var cart = _ref.cart;
  return {
    curCoupon: cart.coupon
  };
}, function (dispatch) {
  return {
    onChangeCoupon: function onChangeCoupon(coupon) {
      return dispatch({ type: 'cart/changeCoupon', payload: coupon });
    }
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(CouponPicker, _BaseComponent);

  function CouponPicker() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, CouponPicker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = CouponPicker.__proto__ || Object.getPrototypeOf(CouponPicker)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "coupons", "curCoupon", "__fn_onChangeCoupon"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CouponPicker, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CouponPicker.prototype.__proto__ || Object.getPrototypeOf(CouponPicker.prototype), "_constructor", this).call(this, props);
      this.state = {
        coupons: null
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
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _$router$params, items, _$router$params$use_p, use_platform, params, couponsData, coupons;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _$router$params = this.$router.params, items = _$router$params.items, _$router$params$use_p = _$router$params.use_platform, use_platform = _$router$params$use_p === undefined ? 'mall' : _$router$params$use_p;
                params = {
                  items: JSON.parse(items),
                  use_platform: use_platform,
                  page_type: 'picker',
                  valid: true
                };
                _context.next = 4;
                return _index6.default.cart.coupons(params);

              case 4:
                couponsData = _context.sent;
                coupons = (0, _index4.pickBy)(couponsData.list, {
                  card_type: 'card_type',
                  title: 'title',
                  card_id: 'card_id',
                  code: 'code',
                  valid: 'valid',
                  reduce_cost: 'reduce_cost',
                  least_cost: 'least_cost',
                  discount: 'discount',
                  begin_date: 'begin_date',
                  end_date: 'end_date'
                }).sort(function (a) {
                  return !a.valid;
                });


                this.setState({
                  coupons: coupons
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
        return _ref3.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "handleCouponSelect",
    value: function handleCouponSelect() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'coupon';
      var value = arguments[1];

      if (value && !value.valid) {
        return;
      }var payload = value ? { type: type, value: value } : null;
      this.__triggerPropsFn("onChangeCoupon", [null].concat([payload]));
      setTimeout(function () {
        _index2.default.navigateBack();
      }, 300);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var coupons = this.__state.coupons;
      var curCoupon = this.__props.curCoupon;


      if (!coupons) {
        return null;
      }

      // const memberCoupon = {
      //   card_type: 'member',
      //   title: '会员折扣价'
      // }

      var loopArray0 = coupons.map(function (coupon, idx) {
        coupon = {
          $original: (0, _index.internal_get_original)(coupon)
        };
        var $loopState__temp2 = !coupon.$original.valid;
        var $loopState__temp4 = !coupon.$original.valid;
        return {
          $loopState__temp2: $loopState__temp2,
          $loopState__temp4: $loopState__temp4,
          $original: coupon.$original
        };
      }

      // <View
      //   key={idx}
      //   className='coupon-item'
      //   onClick={this.handleCouponSelect.bind(this, 'coupon', coupon)}
      // >
      //   <View className='coupon-item__hd'>
      //     <View className='coupon-item__name'>
      //       {coupon.card_type === 'cash' && (<Price value={coupon.reduce_cost} unit='cent' />)}
      //       {coupon.card_type === 'discount' && (<Text>{(100 - coupon.discount) / 10}折</Text>)}
      //       {coupon.card_type === 'gift' && (<Text>兑换券</Text>)}
      //     </View>
      //     <Text className='coupon-item__type'>{typeStr}</Text>
      //   </View>
      //   <View className='coupon-item__bd'>
      //     <Text className='coupon-item__title'>{coupon.title}</Text>
      //     <View className='coupon-item__rule'>
      //       {(coupon.card_type !== 'gift' && coupon.least_cost > 0)
      //         ? <View className='coupon-item__rule-inner'>满<Price value={coupon.least_cost} unit='cent' />元可用</View>
      //         : (coupon.card_type != 'gift' && (<Text>满0.01可用</Text>))}
      //     </View>
      //     <Text className='coupon-item__time'>使用期限 {coupon.begin_date} ~ {coupon.end_date}</Text>
      //   </View>
      //   <View className='coupon-item__ft'>
      //     <SpCheckbox
      //       checked={curCoupon && curCoupon.type === 'coupon' && curCoupon.value.code === coupon.code}
      //     />
      //   </View>
      // </View>
      );
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        curCoupon: curCoupon
      });
      return this.__state;
    }
  }]);

  return CouponPicker;
}(_index.Component), _class2.properties = {
  "__fn_onChangeCoupon": {
    "type": null,
    "value": null
  },
  "curCoupon": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleCouponSelect"], _temp2)) || _class);
exports.default = CouponPicker;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CouponPicker, true));