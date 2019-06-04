"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("./npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("./spx/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("./npm/@tarojs/redux/index.js");

var _index6 = require("./store/index.js");

var _index7 = _interopRequireDefault(_index6);

var _hooks = require("./hooks.js");

var _hooks2 = _interopRequireDefault(_hooks);

var _index8 = require("./api/index.js");

var _index9 = _interopRequireDefault(_index8);

var _index10 = require("./service/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

var _configStore = (0, _index7.default)(),
    store = _configStore.store;

(0, _index5.setStore)(store);
(0, _hooks2.default)();

var _App = function (_BaseComponent) {
  _inherits(_App, _BaseComponent);

  function _App() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, _App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _App.__proto__ || Object.getPrototypeOf(_App)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      pages: [
      /*'pages/home/index',
      'pages/home/landing',
      'pages/category/index',
      'pages/item/list',
      'pages/item/espier-detail',
      'pages/item/point-list',
      'pages/item/point-detail',
      'pages/item/group-list',
      'pages/item/seckill-list',
      'pages/item/seckill-goods-list',
      'pages/home/coupon-home',
        'pages/cart/espier-index',
      'pages/cart/espier-checkout',
      'pages/cart/coupon-picker',
      'pages/article/index',
        'pages/recommend/list',
      'pages/recommend/detail',
        'pages/auth/reg',
      'pages/auth/reg-rule',
      'pages/auth/login',
      'pages/auth/forgotpwd',
        'pages/cashier/index',
      'pages/cashier/cashier-result',
        'pages/member/index',
      'pages/member/point',
      'pages/member/point-draw',
      'pages/member/point-draw-detail',
      'pages/member/draw-rule',
      'pages/member/point-draw-order',
      // 'pages/member/point-order-detail',
      'pages/member/point-draw-record',
      'pages/member/point-all-record',
      'pages/member/point-draw-compute',
      'pages/member/pay',
      'pages/member/pay-rule',
      'pages/member/money-to-point',
      'pages/member/recharge',
      'pages/member/recommend',
      'pages/member/recommend-member',
      'pages/member/recommend-order',
      'pages/member/coupon',
      'pages/member/address',
      'pages/member/edit-address',
      'pages/member/setting',
      'pages/member/userinfo',
      'pages/member/item-history',
      'pages/member/item-fav',
      'pages/member/item-guess',
        'pages/trade/list',
      'pages/trade/detail',
      'pages/trade/delivery-info',
      'pages/trade/rate',
      'pages/trade/cancel',
      'pages/trade/after-sale',
      'pages/trade/refund',
      'pages/trade/refund-detail',
      'pages/trade/refund-sendback',
      'pages/trade/invoice-list',
        'pages/protocol/privacy',*/

      // 集成用，勿删
      'pages/iwp/item-list',
      // 'pages/iwp/coupon-home',
      'pages/iwp/item-detail', 'pages/iwp/recommend-list', 'pages/iwp/recommend-detail'
      // 'pages/iwp/article-index'
      ],
      navigateToMiniProgramAppIdList: ['wx4721629519a8f25b', 'wxf91925e702efe3e3'],
      window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: 'innisfree悦诗风吟',
        navigationBarTextStyle: 'black'
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(_App, [{
    key: "componentWillMount",
    value: function componentWillMount() {}
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentDidShow",
    value: function componentDidShow(options) {
      _index10.FormIds.startCollectingFormIds();
      try {
        if (_index4.default.getAuthToken()) {
          _index9.default.member.favsList().then(function (_ref2) {
            var list = _ref2.list;

            store.dispatch({
              type: 'member/favs',
              payload: list
            });
          });
        }
      } catch (e) {
        console.log(e);
      }

      var _ref3 = options || {},
          referrerInfo = _ref3.referrerInfo;

      if (referrerInfo) {
        console.log(referrerInfo);
      }
    }
  }, {
    key: "componentDidHide",
    value: function componentDidHide() {
      _index10.FormIds.stop();
    }
  }, {
    key: "componentDidCatchError",
    value: function componentDidCatchError() {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数

  }, {
    key: "_createData",
    value: function _createData() {}
  }]);

  return _App;
}(_index.Component);

exports.default = _App;

App(require('./npm/@tarojs/taro-weapp/index.js').default.createApp(_App));
_index2.default.initPxTransform({
  "designWidth": 750,
  "deviceRatio": {
    "640": 1.17,
    "750": 1,
    "828": 0.905
  }
});