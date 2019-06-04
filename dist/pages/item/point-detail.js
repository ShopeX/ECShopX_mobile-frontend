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

var PointDetail = (_dec = (0, _index3.connect)(function (_ref) {
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
  _inherits(PointDetail, _BaseComponent);

  function PointDetail() {
    var _ref2,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, PointDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = PointDetail.__proto__ || Object.getPrototypeOf(PointDetail)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "info", "scrollTop", "windowWidth", "curImgIdx", "imgs", "desc", "showBackToTop", "marketing", "__fn_onFastbuy"], _this.handleSwiperChange = function (e) {
      var current = e.detail.current;

      _this.setState({
        curImgIdx: current
      });
    }, _this.handleBuyClick = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type) {
        var _this$state, marketing, info, url;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$state = _this.state, marketing = _this$state.marketing, info = _this$state.info;
                url = "/pages/cart/espier-checkout";

                if (_index9.default.getAuthToken()) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", _index9.default.login(_this, false));

              case 4:

                if (type === 'fastbuy') {
                  url += '?cart_type=fastbuy&pay_type=point';
                  if (marketing === 'group') {
                    url += "&type=" + marketing + "&group_id=" + _this.state.info.group_activity.groups_activity_id;
                  } else if (marketing === 'seckill') {
                    url += "&type=" + marketing + "&seckill_id=" + _this.state.info.seckill_activity.seckill_id;
                  }

                  _this.__triggerPropsFn("onFastbuy", [null].concat([info]));
                  _index2.default.navigateTo({
                    url: url
                  });
                }

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PointDetail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PointDetail.prototype.__proto__ || Object.getPrototypeOf(PointDetail.prototype), "_constructor", this).call(this, props);

      this.state = {
        marketing: 'normal',
        info: null,
        desc: null,
        windowWidth: 320,
        curImgIdx: 0
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleResize();
      this.fetch();
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
        var id, info, desc;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = this.$router.params.id;

                // workaround

                if (id) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                _context2.next = 5;
                return _index5.default.item.detail(id, { is_point: true });

              case 5:
                info = _context2.sent;
                desc = info.intro;


                _index2.default.setNavigationBarTitle({
                  title: info.item_name
                });

                this.setState({
                  info: info,
                  desc: desc
                });
                _index7.log.debug('fetch: done', info);

              case 10:
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
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          windowWidth = _state.windowWidth,
          curImgIdx = _state.curImgIdx,
          desc = _state.desc,
          scrollTop = _state.scrollTop,
          showBackToTop = _state.showBackToTop;


      if (!info) {
        return null;
      }

      var imgs = info.pics;


      var loopArray0 = imgs.map(function (img, idx) {
        img = {
          $original: (0, _index.internal_get_original)(img)
        };
        var $loopState__temp2 = (0, _index.internal_inline_style)((0, _index7.styleNames)({ width: windowWidth + 'px', height: windowWidth + 'px' }));
        return {
          $loopState__temp2: $loopState__temp2,
          $original: img.$original
        };
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        scrollTop: scrollTop,
        imgs: imgs,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }]);

  return PointDetail;
}(_index.Component), _class2.properties = {
  "__fn_onFastbuy": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleScroll", "handleSwiperChange", "scrollBackToTop", "handleBuyClick"], _class2.options = {
  addGlobalClass: true
}, _temp2)) || _class) || _class);
exports.default = PointDetail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PointDetail, true));