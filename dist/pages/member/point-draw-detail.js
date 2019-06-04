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

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../hocs/index.js");

var _index7 = require("../../utils/index.js");

var _index8 = require("../../spx/index.js");

var _index9 = _interopRequireDefault(_index8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PointDrawDetail = (_dec = (0, _index3.connect)(function (_ref) {
  var cart = _ref.cart;
  return {
    cart: cart
  };
}, function (dispatch) {
  return {
    onFastbuy: function onFastbuy(item) {
      return dispatch({ type: 'cart/fastbuy', payload: { item: item } });
    },
    onAddCart: function onAddCart(item) {
      return dispatch({ type: 'cart/add', payload: { item: item } });
    }
  };
}), _dec(_class = (0, _index6.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(PointDrawDetail, _BaseComponent);

  function PointDrawDetail() {
    var _ref2,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, PointDrawDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = PointDrawDetail.__proto__ || Object.getPrototypeOf(PointDrawDetail)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "loopArray0", "info", "scrollTop", "luckyInfo", "windowWidth", "curImgIdx", "imgs", "rate", "isLucky", "isLogin", "isShowDesc", "intro", "showBackToTop", "isBuyBtnDisabled", "isDisabled", "totalRecord", "trade_id"], _this.handleSwiperChange = function (e) {
      var current = e.detail.current;

      _this.setState({
        curImgIdx: current
      });
    }, _this.handleBuyClick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res, orderInfo, query;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.setState({
                isDisabled: true
              });
              _index2.default.showLoading({
                title: '抽奖中',
                icon: 'none',
                mask: true
              });
              _context.prev = 2;
              _context.next = 5;
              return _index5.default.member.pointDrawPay(_this.$router.params);

            case 5:
              res = _context.sent;
              _context.next = 8;
              return _index5.default.cashier.getOrderDetail(res.luckydraw_trade_id);

            case 8:
              orderInfo = _context.sent;
              query = {
                order_id: orderInfo.order_id,
                pay_type: orderInfo.pay_type,
                order_type: orderInfo.order_type
              };
              _context.prev = 10;

              _index2.default.hideLoading();
              _context.next = 14;
              return _index5.default.cashier.getPayment(query);

            case 14:
              _index2.default.showToast({
                title: '抽奖成功',
                icon: 'none',
                duration: 1000
              });
              setTimeout(function () {
                _this.fetch();
                _this.setState({
                  isDisabled: false
                });
              }, 1500);
              // Taro.redirectTo({
              //   url: `/pages/cashier/cashier-result?payStatus=success&order_id=${orderInfo.order_id}`
              // })
              _context.next = 21;
              break;

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](10);

              console.log(_context.t0, 49);

            case 21:
              _context.next = 27;
              break;

            case 23:
              _context.prev = 23;
              _context.t1 = _context["catch"](2);

              _index2.default.hideLoading();
              console.log(_context.t1);

            case 27:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2, [[2, 23], [10, 18]]);
    })), _this.handleClickCompute = function () {
      _index2.default.navigateTo({
        url: "/pages/member/point-draw-compute?luckydraw_id=" + _this.$router.params.luckydraw_id
      });
    }, _this.handleClickToOrder = function () {
      _index2.default.navigateTo({
        url: "/pages/member/point-order-detail?id=" + _this.state.trade_id
      });
    }, _this.handleClickMyRecord = function () {
      _index2.default.navigateTo({
        url: "/pages/member/point-draw-record?luckydraw_id=" + _this.$router.params.luckydraw_id
      });
    }, _this.handleClickAllRecord = function () {
      _index2.default.navigateTo({
        url: "/pages/member/point-all-record?luckydraw_id=" + _this.$router.params.luckydraw_id
      });
    }, _this.handleClickShowDesc = function () {
      _this.setState({
        isShowDesc: true
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PointDrawDetail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PointDrawDetail.prototype.__proto__ || Object.getPrototypeOf(PointDrawDetail.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: null,
        windowWidth: 320,
        curImgIdx: 0,
        // timer: null,
        // luckName: '',
        intro: '',
        isShowDesc: false,
        totalRecord: 0,
        isLogin: false,
        luckyInfo: {},
        isLucky: false,
        trade_id: '',
        isDisabled: false
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleResize();
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
    key: "handleResize",
    value: function handleResize() {
      var _Taro$getSystemInfoSy = _index2.default.getSystemInfoSync(),
          windowWidth = _Taro$getSystemInfoSy.windowWidth;

      this.setState({
        windowWidth: windowWidth
      });
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _$router$params, luckydraw_id, item_id, info, _ref5, intro, data, res, _ref6, total_count;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _index2.default.showLoading();
                _$router$params = this.$router.params, luckydraw_id = _$router$params.luckydraw_id, item_id = _$router$params.item_id;
                _context2.next = 4;
                return _index5.default.member.pointDrawDetail(luckydraw_id);

              case 4:
                info = _context2.sent;
                _context2.next = 7;
                return _index5.default.member.pointDrawIntro(item_id);

              case 7:
                _ref5 = _context2.sent;
                intro = _ref5.intro;

                if (!(info.open_status === 'success')) {
                  _context2.next = 14;
                  break;
                }

                _context2.next = 12;
                return _index5.default.member.pointCompute(luckydraw_id);

              case 12:
                data = _context2.sent;

                this.setState({
                  luckyInfo: data
                });

              case 14:
                if (!(info.open_status === 'success' && _index9.default.getAuthToken())) {
                  _context2.next = 20;
                  break;
                }

                _context2.next = 17;
                return _index5.default.member.pointCheckLucky(luckydraw_id);

              case 17:
                res = _context2.sent;

                console.log(res, 78);
                if (res.luckydraw_id) {
                  this.setState({
                    isLucky: true,
                    trade_id: res.luckydraw_trade_id
                  });
                }

              case 20:
                if (!_index9.default.getAuthToken()) {
                  _context2.next = 26;
                  break;
                }

                _context2.next = 23;
                return _index5.default.member.pointMyOrder({ luckydraw_id: luckydraw_id });

              case 23:
                _ref6 = _context2.sent;
                total_count = _ref6.total_count;

                this.setState({
                  isLogin: true,
                  totalRecord: total_count
                });

              case 26:
                _index2.default.setNavigationBarTitle({
                  title: info.goods_info.itemName
                });

                _index2.default.setNavigationBarColor({
                  frontColor: '#ffffff',
                  backgroundColor: '#C40000',
                  animation: {
                    duration: 400,
                    timingFunc: 'easeIn'
                  }
                });

                this.setState({
                  info: info,
                  intro: intro
                  // luckName: luckuser.str_lucky || '',
                });
                _index2.default.hideLoading();

                _index7.log.debug('fetch: done', info);

              case 31:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch() {
        return _ref4.apply(this, arguments);
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
          windowWidth = _state.windowWidth,
          curImgIdx = _state.curImgIdx,
          scrollTop = _state.scrollTop,
          showBackToTop = _state.showBackToTop,
          isLogin = _state.isLogin,
          intro = _state.intro,
          isShowDesc = _state.isShowDesc,
          totalRecord = _state.totalRecord,
          luckyInfo = _state.luckyInfo,
          isLucky = _state.isLucky,
          isDisabled = _state.isDisabled;

      if (!info) {
        return null;
      }
      var rate = Number((info.sales_num / info.luckydraw_store * 100).toFixed(0));
      var imgs = info.goods_info.pics;

      var isBuyBtnDisabled = info.luckydraw_store - info.sales_num <= 0;

      var anonymousState__temp = info.open_status === 'success' ? (0, _index7.formatDataTime)(luckyInfo.updated * 1000) : null;
      var anonymousState__temp2 = info.open_status === 'success' ? (0, _index7.formatDataTime)(luckyInfo.created * 1000) : null;
      var loopArray0 = imgs.map(function (img, idx) {
        img = {
          $original: (0, _index.internal_get_original)(img)
        };
        var $loopState__temp4 = (0, _index.internal_inline_style)((0, _index7.styleNames)({ width: windowWidth + 'px', height: windowWidth + 'px' }));
        return {
          $loopState__temp4: $loopState__temp4,
          $original: img.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        loopArray0: loopArray0,
        scrollTop: scrollTop,
        imgs: imgs,
        rate: rate,
        showBackToTop: showBackToTop,
        isBuyBtnDisabled: isBuyBtnDisabled
      });
      return this.__state;
    }
  }]);

  return PointDrawDetail;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleScroll", "handleClickCompute", "handleSwiperChange", "handleClickToOrder", "handleClickMyRecord", "handleClickAllRecord", "handleClickShowDesc", "scrollBackToTop", "handleBuyClick"], _class2.options = {
  addGlobalClass: true
}, _temp2)) || _class) || _class);
exports.default = PointDrawDetail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PointDrawDetail, true));