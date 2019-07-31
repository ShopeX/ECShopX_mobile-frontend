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

var _req = require("./api/req.js");

var _req2 = _interopRequireDefault(_req);

var _index8 = require("./api/index.js");

var _index9 = _interopRequireDefault(_index8);

var _index10 = require("./service/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
      pages: ['pages/index', 'pages/home/landing', 'pages/home/license', 'pages/category/index', 'pages/item/list', 'pages/item/espier-detail', 'pages/item/point-list', 'pages/item/point-detail', 'pages/item/group-list', 'pages/item/seckill-list', 'pages/item/seckill-goods-list', 'pages/home/coupon-home', 'pages/cart/espier-index', 'pages/cart/espier-checkout', 'pages/cart/coupon-picker', 'pages/article/index', 'pages/recommend/list', 'pages/recommend/detail', 'pages/auth/reg', 'pages/auth/reg-rule', 'pages/auth/login', 'pages/auth/forgotpwd', 'pages/auth/wxauth', 'pages/cashier/index', 'pages/cashier/cashier-result', 'pages/member/index', 'pages/member/point', 'pages/member/point-draw', 'pages/member/point-draw-detail', 'pages/member/draw-rule', 'pages/member/point-draw-order',
      // 'pages/member/point-order-detail',
      'pages/member/point-draw-record', 'pages/member/point-all-record', 'pages/member/point-draw-compute', 'pages/member/pay', 'pages/member/pay-rule', 'pages/member/money-to-point', 'pages/member/recharge', 'pages/member/recommend', 'pages/member/recommend-member', 'pages/member/recommend-order', 'pages/member/coupon', 'pages/member/address', 'pages/member/edit-address', 'pages/member/setting', 'pages/member/userinfo', 'pages/member/item-history', 'pages/member/item-fav', 'pages/member/item-guess', 'pages/distribution/index', 'pages/distribution/setting', 'pages/distribution/statistics', 'pages/distribution/trade', 'pages/distribution/subordinate', 'pages/distribution/withdraw', 'pages/distribution/withdrawals-record', 'pages/distribution/withdrawals-acount', 'pages/distribution/shop', 'pages/distribution/shop-setting', 'pages/distribution/shop-form', 'pages/distribution/qrcode', 'pages/distribution/shop-home', 'pages/store/index', 'pages/trade/list', 'pages/trade/detail', 'pages/trade/delivery-info', 'pages/trade/rate', 'pages/trade/cancel', 'pages/trade/after-sale', 'pages/trade/refund', 'pages/trade/refund-detail', 'pages/trade/refund-sendback', 'pages/trade/invoice-list', 'pages/protocol/privacy'],
      permission: {
        "scope.userLocation": {
          "desc": "您的位置信息将用于定位附近门店"
        }
      },
      navigateToMiniProgramAppIdList: ['wx4721629519a8f25b', 'wx2fb97cb696f68d22', 'wxf91925e702efe3e3'],
      window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: 'ecshopX商城',
        navigationBarTextStyle: 'black'
        // navigationStyle: 'custom'
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(_App, [{
    key: "componentWillMount",
    value: function componentWillMount() {}
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchTabs();
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow(options) {
      {
        _index10.FormIds.startCollectingFormIds();
        if (_index4.default.getAuthToken()) {
          _index9.default.member.favsList().then(function (_ref2) {
            var list = _ref2.list;

            if (!list) {
              return;
            }store.dispatch({
              type: 'member/favs',
              payload: list
            });
          }).catch(function (e) {
            console.info(e);
          });
        }
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
    key: "fetchTabs",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var url, info;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=tabs';
                _context.next = 3;
                return _req2.default.get(url);

              case 3:
                info = _context.sent;

                store.dispatch({
                  type: 'tabBar',
                  payload: info.list[0].params
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchTabs() {
        return _ref4.apply(this, arguments);
      }

      return fetchTabs;
    }()
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