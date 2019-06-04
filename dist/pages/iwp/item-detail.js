"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../hocs/index.js");

var _index6 = require("../../utils/index.js");

var _index7 = require("../../spx/index.js");

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*@connect(({ cart, member }) => ({
  cart,
  favs: member.favs
}), (dispatch) => ({
  onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
  onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } }),
  onAddFav: ({ item_id }) => dispatch({ type: 'member/addFav', payload: { item_id } }),
  onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
}))*/
var Detail = (0, _index5.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Detail, _BaseComponent);

  function Detail() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Detail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Detail.__proto__ || Object.getPrototypeOf(Detail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "loopArray0", "info", "scrollTop", "imgInfo", "timer", "marketing", "isPromoter", "curSku", "$anonymousCallee__0", "desc", "hasStock", "startSecKill", "buyPanelType", "showBuyPanel", "cartCount", "windowWidth", "specImgsDict"], _this.handleClickToMiniProgram = function () {
      _index2.default.navigateToMiniProgram({
        appId: 'wx4721629519a8f25b', // 要跳转的小程序的appid
        path: "pages/item/espier-detail?id=" + _this.state.info.item_id, // 跳转的目标页面
        extraData: {
          id: _this.state.info.item_id
        },
        envVersion: 'trial',
        /*extarData: {
          open: 'auth'
        },*/
        success: function success(res) {
          // 打开成功
          console.log(res);
        }
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Detail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Detail.prototype.__proto__ || Object.getPrototypeOf(Detail.prototype), "_constructor", this).call(this, props);

      this.state = {
        marketing: 'normal',
        info: null,
        desc: null,
        windowWidth: 320,
        isPromoter: false,
        timer: null,
        startSecKill: true,
        hasStock: true,
        cartCount: '',
        showBuyPanel: false,
        buyPanelType: null,
        specImgsDict: {},
        curSku: null
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleResize();
      this.fetch();

      // 浏览记录
      if (_index8.default.getAuthToken()) {
        try {
          var id = this.$router.params.id;

          _index4.default.member.itemHistorySave(id);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetchCartCount();
    }
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage() {
      var info = this.state.info;


      return {
        title: info.item_name,
        path: "/pages/item/espier-detail?id=" + info.item_id
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
    key: "fetchCartCount",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_index8.default.getAuthToken()) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _context.next = 4;
                return _index4.default.cart.count();

              case 4:
                res = _context.sent;

                this.setState({
                  cartCount: res.item_count
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchCartCount() {
        return _ref2.apply(this, arguments);
      }

      return fetchCartCount;
    }()
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var id, info, desc, marketing, timer, hasStock, startSecKill, specImgsDict;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = this.$router.params.id;
                _context2.next = 3;
                return _index4.default.item.detail(id);

              case 3:
                info = _context2.sent;
                desc = info.intro;
                marketing = 'normal';
                timer = null;
                hasStock = info.store && info.store > 0;
                startSecKill = true;


                if (info.group_activity) {
                  //团购
                  marketing = 'group';
                  timer = (0, _index6.calcTimer)(info.group_activity.remaining_time);
                  hasStock = info.group_activity.store && info.group_activity.store > 0;
                } else if (info.seckill_activity) {
                  //秒杀
                  marketing = 'seckill';
                  timer = (0, _index6.calcTimer)(info.seckill_activity.last_seconds);
                  hasStock = info.seckill_activity.activity_store && info.seckill_activity.activity_store > 0;
                  startSecKill = info.seckill_activity.status === 'in_sale';
                }

                _index2.default.setNavigationBarTitle({
                  title: info.item_name
                });

                if (marketing === 'group' || marketing === 'seckill') {
                  _index2.default.setNavigationBarColor({
                    frontColor: '#ffffff',
                    backgroundColor: '#0b4137',
                    animation: {
                      duration: 400,
                      timingFunc: 'easeIn'
                    }
                  });
                }

                // info.is_fav = Boolean(this.props.favs[info.item_id])
                specImgsDict = this.resolveSpecImgs(info.item_spec_desc);


                this.setState({
                  info: info,
                  desc: desc,
                  marketing: marketing,
                  timer: timer,
                  hasStock: hasStock,
                  startSecKill: startSecKill,
                  specImgsDict: specImgsDict
                });
                _index6.log.debug('fetch: done', info);

              case 15:
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
    key: "resolveSpecImgs",
    value: function resolveSpecImgs(specs) {
      var ret = {};

      //只有一个图片类型规格
      specs.some(function (item) {
        if (item.is_image) {
          item.spec_values.forEach(function (v) {
            ret[v.spec_value_id] = v.spec_image_url;
          });
        }
      });

      return ret;
    }
  }, {
    key: "handleShare",


    /*handleMenuClick = async (type) => {
      const { info } = this.state
      const isAuth = S.getAuthToken()
        if (type === 'fav') {
        if (!isAuth) {
          Taro.showToast({
            title: '请登录后再收藏',
            icon: 'none'
          })
          return
        }
          if (!info.is_fav) {
          await api.member.addFav(info.item_id)
          this.props.onAddFav(info)
          Taro.showToast({
            title: '已加入收藏',
            icon: 'none'
          })
        } else {
          await api.member.delFav(info.item_id)
          this.props.onDelFav(info)
          Taro.showToast({
            title: '已移出收藏',
            icon: 'none'
          })
        }
          info.is_fav = !info.is_fav
        this.setState({
          info
        })
      }
    }
      handleSkuChange = (curSku) => {
      this.setState({
        curSku
      })
    }
      handleBuyBarClick = (type) => {
      if (!S.getAuthToken()) {
        Taro.showToast({
          title: '请先登录再购买',
          icon: 'none'
        })
          setTimeout(() => {
          S.login(this)
        }, 2000)
          return
      }
        this.setState({
        showBuyPanel: true,
        buyPanelType: type
      })
    }
      handleBuyAction = async () => {
      this.setState({
        showBuyPanel: false
      })
    }*/

    value: function handleShare() {}
  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          windowWidth = _state.windowWidth,
          desc = _state.desc,
          cartCount = _state.cartCount,
          scrollTop = _state.scrollTop,
          showBackToTop = _state.showBackToTop,
          curSku = _state.curSku;
      var _state2 = this.__state,
          marketing = _state2.marketing,
          timer = _state2.timer,
          isPromoter = _state2.isPromoter,
          startSecKill = _state2.startSecKill,
          hasStock = _state2.hasStock,
          showBuyPanel = _state2.showBuyPanel,
          buyPanelType = _state2.buyPanelType;


      if (!info) {
        return null;
      }

      var imgInfo = {
        img: info.pics[0],
        width: windowWidth + 'px'
      };

      var anonymousState__temp = isPromoter ? (info.promoter_price / 100).toFixed(2) : null;
      var anonymousState__temp2 = !showBackToTop;

      this.anonymousFunc0 = function () {
        return _this2.setState({ showBuyPanel: false });
      };

      var $anonymousCallee__0 = Object.keys(this.__state.specImgsDict);
      var loopArray0 = Object.keys(this.__state.specImgsDict).map(function (specValueId) {
        specValueId = {
          $original: (0, _index.internal_get_original)(specValueId)
        };

        var img = _this2.__state.specImgsDict[specValueId.$original];
        return {
          img: img,
          $original: specValueId.$original
        };
      }
      // onClick={this.handleBuyBarClick.bind(this, buyPanelType)}
      );
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        loopArray0: loopArray0,
        scrollTop: scrollTop,
        imgInfo: imgInfo,
        $anonymousCallee__0: $anonymousCallee__0
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(e) {
      ;
    }
  }]);

  return Detail;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleScroll", "handleShare", "scrollBackToTop", "handleClickToMiniProgram", "anonymousFunc0"], _class2.options = {
  addGlobalClass: true
}, _temp2)) || _class;

exports.default = Detail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Detail, true));