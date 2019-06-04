"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../hocs/index.js");

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PointDraw = (0, _index3.withPager)(_class = (0, _index3.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(PointDraw, _BaseComponent);

  function PointDraw() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PointDraw);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PointDraw.__proto__ || Object.getPrototypeOf(PointDraw)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "scrollTop", "windowWidth", "curImgIdx", "imgs", "listType", "list", "page", "showBackToTop", "announce", "query"], _this.handleSwiperChange = function (e) {
      var current = e.detail.current;

      _this.setState({
        curImgIdx: current
      });
    }, _this.handleClickItem = function (item) {
      var url = "/pages/member/point-draw-detail?luckydraw_id=" + item.luckydraw_id + "&item_id=" + item.item_id;
      _index2.default.navigateTo({
        url: url
      });
    }, _this.handleClickRule = function () {
      _index2.default.navigateTo({
        url: '/pages/member/draw-rule'
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PointDraw, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PointDraw.prototype.__proto__ || Object.getPrototypeOf(PointDraw.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        query: null,
        list: [],
        listType: '',
        windowWidth: 320,
        curImgIdx: 0,
        imgs: [],
        announce: null
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.handleResize();

      this.setState({
        query: {
          item_type: 'normal',
          approve_status: 'onsale,only_show',
          is_point: true
        }
      }, function () {
        _this2.nextPage();
      });
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var page, pageSize, query, _ref3, list, total, nList, imgs, _ref5, announceList, announce;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                query = _extends({}, this.state.query, {
                  page: page,
                  pageSize: pageSize
                });
                _context.next = 4;
                return _index5.default.member.pointDraw(query);

              case 4:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total_count;
                nList = (0, _index6.pickBy)(list, {
                  luckydraw_id: 'luckydraw_id',
                  img: 'goods_info.pics[0]',
                  item_id: 'item_id',
                  title: 'goods_info.itemName',
                  desc: 'goods_info.brief',
                  price: 'luckydraw_point',
                  rate: function rate(_ref4) {
                    var sales_num = _ref4.sales_num,
                        luckydraw_store = _ref4.luckydraw_store;
                    return Math.round(sales_num / luckydraw_store * 100);
                  }
                });
                _context.next = 10;
                return _index5.default.member.pointDrawSwiper();

              case 10:
                imgs = _context.sent;

                // console.log(imgs, 60)
                _index6.log.debug("[point draw picked]", nList);
                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList)),
                  query: query,
                  imgs: imgs
                });

                _context.next = 15;
                return _index5.default.member.pointDrawLuckAll();

              case 15:
                _ref5 = _context.sent;
                announceList = _ref5.list;
                announce = announceList.map(function (t) {
                  return "[" + (0, _index6.formatTime)(t.created * 1000) + "] \u606D\u559C" + t.username + " " + (0, _index6.maskMobile)(t.mobile) + " \u83B7\u5F97\u4E86 " + t.item_name;
                }).join('　　');

                this.setState({
                  announce: announce
                });
                return _context.abrupt("return", {
                  total: total
                });

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch(_x) {
        return _ref2.apply(this, arguments);
      }

      return fetch;
    }()
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
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          listType = _state.listType,
          showBackToTop = _state.showBackToTop,
          scrollTop = _state.scrollTop,
          page = _state.page,
          windowWidth = _state.windowWidth,
          curImgIdx = _state.curImgIdx,
          imgs = _state.imgs,
          announce = _state.announce;


      var loopArray0 = imgs.map(function (img, idx) {
        img = {
          $original: (0, _index.internal_get_original)(img)
        };
        var $loopState__temp2 = (0, _index.internal_inline_style)((0, _index6.styleNames)({ width: windowWidth + 'px', height: windowWidth / 1.5 + 'px' }));
        return {
          $loopState__temp2: $loopState__temp2,
          $original: img.$original
        };
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        scrollTop: scrollTop,
        page: page,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }]);

  return PointDraw;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleScroll", "nextPage", "handleSwiperChange", "handleClickRule", "handleClickItem", "scrollBackToTop"], _temp2)) || _class) || _class;

exports.default = PointDraw;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PointDraw, true));