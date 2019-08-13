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

var Detail = (_dec = (0, _index3.connect)(function (_ref) {
  var cart = _ref.cart,
      member = _ref.member;
  return {
    cart: cart,
    favs: member.favs
  };
}, function (dispatch) {
  return {
    onFastbuy: function onFastbuy(item) {
      return dispatch({ type: 'cart/fastbuy', payload: { item: item } });
    },
    onAddCart: function onAddCart(item) {
      return dispatch({ type: 'cart/add', payload: { item: item } });
    },
    onAddFav: function onAddFav(_ref2) {
      var item_id = _ref2.item_id,
          fav_id = _ref2.fav_id;
      return dispatch({ type: 'member/addFav', payload: { item_id: item_id, fav_id: fav_id } });
    },
    onDelFav: function onDelFav(_ref3) {
      var item_id = _ref3.item_id;
      return dispatch({ type: 'member/delFav', payload: { item_id: item_id } });
    }
  };
}), _dec(_class = (0, _index6.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Detail, _BaseComponent);

  function Detail() {
    var _ref4,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Detail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref4 = Detail.__proto__ || Object.getPrototypeOf(Detail)).call.apply(_ref4, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp3", "anonymousState__temp4", "anonymousState__temp5", "anonymousState__temp6", "loopArray0", "info", "scrollTop", "curImgIdx", "imgs", "sixSpecImgsDict", "timer", "marketing", "isPromoter", "promotion_activity", "promotion_package", "buyPanelType", "curSku", "store", "desc", "screenWidth", "sessionFrom", "hasStock", "startSecKill", "cartCount", "showBuyPanel", "itemParams", "windowWidth", "specImgsDict", "currentImgs", "favs", "__fn_onAddFav", "__fn_onDelFav"], _this.handleMenuClick = function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type) {
        var info, isAuth, favRes;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                info = _this.state.info;
                isAuth = _index9.default.getAuthToken();

                if (!(type === 'fav')) {
                  _context.next = 20;
                  break;
                }

                if (isAuth) {
                  _context.next = 6;
                  break;
                }

                _index2.default.showToast({
                  title: '请登录后再收藏',
                  icon: 'none'
                });
                return _context.abrupt("return");

              case 6:
                if (info.is_fav) {
                  _context.next = 14;
                  break;
                }

                _context.next = 9;
                return _index5.default.member.addFav(info.item_id);

              case 9:
                favRes = _context.sent;

                _this.__triggerPropsFn("onAddFav", [null].concat([favRes]));
                _index2.default.showToast({
                  title: '已加入收藏',
                  icon: 'none'
                });
                _context.next = 18;
                break;

              case 14:
                _context.next = 16;
                return _index5.default.member.delFav(info.item_id);

              case 16:
                _this.__triggerPropsFn("onDelFav", [null].concat([info]));
                _index2.default.showToast({
                  title: '已移出收藏',
                  icon: 'none'
                });

              case 18:

                info.is_fav = !info.is_fav;
                _this.setState({
                  info: info
                });

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref5.apply(this, arguments);
      };
    }(), _this.handleSkuChange = function (curSku) {
      _this.setState({
        curSku: curSku
      });
    }, _this.handleSepcImgClick = function (index) {
      var _this$state = _this.state,
          sixSpecImgsDict = _this$state.sixSpecImgsDict,
          info = _this$state.info;

      _this.setState({
        currentImgs: index
      });
      if (sixSpecImgsDict[index].images.length) {
        info.pics = sixSpecImgsDict[index].images;
        _this.setState({
          info: info,
          curImgIdx: 0
        });
      }
    }, _this.handlePackageClick = function () {
      var info = _this.state.info;


      _index2.default.navigateTo({
        url: "/pages/item/package-list?id=" + info.item_id
      });
    }, _this.handleBuyBarClick = function (type) {
      if (!_index9.default.getAuthToken()) {
        _index2.default.showToast({
          title: '请先登录再购买',
          icon: 'none'
        });

        setTimeout(function () {
          _index9.default.login(_this);
        }, 2000);

        return;
      }

      _this.setState({
        showBuyPanel: true,
        buyPanelType: type
      });
    }, _this.handleSwiperChange = function (e) {
      var current = e.detail.current;

      _this.setState({
        curImgIdx: current
      });
    }, _this.handleBuyAction = function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(type) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (type === 'cart') {
                  _this.fetchCartCount();
                }
                _this.setState({
                  showBuyPanel: false
                });

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x2) {
        return _ref6.apply(this, arguments);
      };
    }(), _this.handleClickLink = function () {
      _index2.default.navigateTo({
        url: '/pages/store/index'
      });
    }, _this.handleToGiftMiniProgram = function () {
      _index2.default.navigateToMiniProgram({
        appId: APP_GIFT_APPID, // 要跳转的小程序的appid
        path: '/pages/index/index', // 跳转的目标页面
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
        curImgIdx: 0,
        windowWidth: 320,
        isPromoter: false,
        timer: null,
        startSecKill: true,
        hasStock: true,
        cartCount: '',
        showBuyPanel: false,
        buyPanelType: null,
        specImgsDict: {},
        currentImgs: -1,
        sixSpecImgsDict: {},
        curSku: null,
        promotion_activity: [],
        promotion_package: [],
        itemParams: [],
        screenWidth: 0,
        sessionFrom: ''
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      this.handleResize();
      this.fetch();
      _index2.default.getSystemInfo().then(function (res) {
        _this3.setState({
          screenWidth: res.screenWidth
        });
      });
      // 浏览记录
      if (_index9.default.getAuthToken()) {
        try {
          var id = this.$router.params.id;

          _index5.default.member.itemHistorySave(id);
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
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var info, special_type, isDrug, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                info = this.state.info;

                if (!(!_index9.default.getAuthToken() || !info)) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                special_type = info.special_type;
                isDrug = special_type === 'drug';
                _context3.prev = 5;
                _context3.next = 8;
                return _index5.default.cart.count({ shop_type: isDrug ? 'drug' : 'distributor' });

              case 8:
                res = _context3.sent;

                this.setState({
                  cartCount: res.item_count || ''
                });
                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](5);

                console.log(_context3.t0);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[5, 12]]);
      }));

      function fetchCartCount() {
        return _ref7.apply(this, arguments);
      }

      return fetchCartCount;
    }()
  }, {
    key: "fetch",
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this4 = this;

        var id, info, promotion_package, _ref9, list, desc, promotion_activity, marketing, timer, hasStock, startSecKill, sessionFrom, item_params, itemParams, specImgsDict, sixSpecImgsDict;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                id = this.$router.params.id;
                _context4.next = 3;
                return _index5.default.item.detail(id);

              case 3:
                info = _context4.sent;
                promotion_package = null;
                _context4.next = 7;
                return _index5.default.item.packageList({ item_id: id });

              case 7:
                _ref9 = _context4.sent;
                list = _ref9.list;

                if (list.length) {
                  promotion_package = list.length;
                }
                desc = info.intro, promotion_activity = info.promotion_activity;
                marketing = 'normal';
                timer = null;
                hasStock = info.store && info.store > 0;
                startSecKill = true;
                sessionFrom = '';


                if (info.group_activity) {
                  //团购
                  marketing = 'group';
                  timer = (0, _index7.calcTimer)(info.group_activity.remaining_time);
                  hasStock = info.group_activity.store && info.group_activity.store > 0;
                } else if (info.seckill_activity) {
                  //秒杀
                  marketing = 'seckill';
                  timer = (0, _index7.calcTimer)(info.seckill_activity.last_seconds);
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

                item_params = info.item_params;
                itemParams = (0, _index7.pickBy)(item_params, {
                  label: 'attribute_name',
                  value: 'attribute_value_name'
                });


                info.is_fav = Boolean(this.props.favs[info.item_id]);
                specImgsDict = this.resolveSpecImgs(info.item_spec_desc);
                sixSpecImgsDict = (0, _index7.pickBy)(info.spec_images, {
                  url: 'spec_image_url',
                  images: 'item_image_url',
                  specValueId: 'spec_value_id'
                });


                sessionFrom += '{';
                if (_index2.default.getStorageSync('userinfo')) {
                  sessionFrom += "\"nickName\": \"" + _index2.default.getStorageSync('userinfo').username + "\", ";
                }
                sessionFrom += "\"\u5546\u54C1\": \"" + info.item_name + "\"";
                sessionFrom += '}';

                this.setState({
                  info: info,
                  desc: desc,
                  marketing: marketing,
                  timer: timer,
                  hasStock: hasStock,
                  startSecKill: startSecKill,
                  specImgsDict: specImgsDict,
                  sixSpecImgsDict: sixSpecImgsDict,
                  promotion_activity: promotion_activity,
                  promotion_package: promotion_package,
                  itemParams: itemParams,
                  sessionFrom: sessionFrom
                }, function () {
                  _this4.fetchCartCount();
                });

                _index7.log.debug('fetch: done', info);

              case 30:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetch() {
        return _ref8.apply(this, arguments);
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
    value: function handleShare() {}
  }, {
    key: "_createData",
    value: function _createData() {
      var _this5 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var store = _index2.default.getStorageSync('curStore');
      var _state = this.__state,
          info = _state.info,
          windowWidth = _state.windowWidth,
          screenWidth = _state.screenWidth,
          isGreaterSix = _state.isGreaterSix,
          sixSpecImgsDict = _state.sixSpecImgsDict,
          curImgIdx = _state.curImgIdx,
          desc = _state.desc,
          cartCount = _state.cartCount,
          scrollTop = _state.scrollTop,
          showBackToTop = _state.showBackToTop,
          curSku = _state.curSku,
          promotion_activity = _state.promotion_activity,
          promotion_package = _state.promotion_package,
          itemParams = _state.itemParams,
          sessionFrom = _state.sessionFrom,
          currentImgs = _state.currentImgs;
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

      // const imgInfo = {
      //   img: info.pics[0],
      //   width: windowWidth + 'px'
      // }

      var imgs = info.pics;


      var anonymousState__temp3 = isPromoter ? (info.promoter_price / 100).toFixed(2) : null;
      var anonymousState__temp4 = promotion_package ? "\u5171" + promotion_package + "\u79CD\u7EC4\u5408\u968F\u610F\u642D\u914D" : null;
      var anonymousState__temp5 = !showBackToTop;

      this.anonymousFunc0 = function () {
        return _this5.setState({ showBuyPanel: false });
      };

      var anonymousState__temp6 = (0, _index7.isArray)(desc);
      var loopArray0 = !info.nospec && sixSpecImgsDict.length ? sixSpecImgsDict.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = !info.nospec && sixSpecImgsDict.length ? (0, _index7.classNames)('specs-imgs__item', currentImgs === index && 'specs-imgs__item-active') : null;
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      }) : [];
      Object.assign(this.__state, {
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        anonymousState__temp6: anonymousState__temp6,
        loopArray0: loopArray0,
        scrollTop: scrollTop,
        imgs: imgs,
        store: store
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
}(_index.Component), _class2.properties = {
  "favs": {
    "type": null,
    "value": null
  },
  "__fn_onAddFav": {
    "type": null,
    "value": null
  },
  "__fn_onDelFav": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleScroll", "handleSwiperChange", "handleSepcImgClick", "handlePackageClick", "handleBuyBarClick", "handleClickLink", "handleShare", "scrollBackToTop", "handleMenuClick", "anonymousFunc0", "handleSkuChange", "handleBuyAction"], _class2.options = {
  addGlobalClass: true
}, _temp2)) || _class) || _class);
exports.default = Detail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Detail, true));