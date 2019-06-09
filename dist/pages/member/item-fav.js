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

var _index4 = require("../../hocs/index.js");

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

var _index7 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemFav = (_dec = (0, _index3.connect)(function (_ref) {
  var member = _ref.member;
  return {
    favs: member.favs
  };
}), _dec(_class = (0, _index4.withPager)(_class = (0, _index4.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(ItemFav, _BaseComponent);

  function ItemFav() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, ItemFav);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = ItemFav.__proto__ || Object.getPrototypeOf(ItemFav)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "loopArray1", "curTabIdx", "tabList", "scrollTop", "list", "page", "showBackToTop", "favs"], _this.handleClickItem = function (item) {
      var url = _this.state.curTabIdx === 0 ? "/pages/item/espier-detail?id=" + item.item_id : "/pages/recommend/detail?id=" + item.item_id;
      _index2.default.navigateTo({
        url: url
      });
    }, _this.handleClickTab = function (idx) {
      if (_this.state.page.isLoading) {
        return;
      }if (idx !== _this.state.curTabIdx) {
        _this.resetPage();
        _this.setState({
          list: []
        });
      }

      _this.setState({
        curTabIdx: idx
      }, function () {
        _this.nextPage();
      });
    }, _this.anonymousFunc0Array = [], _this.anonymousFunc1Array = [], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ItemFav, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(ItemFav.prototype.__proto__ || Object.getPrototypeOf(ItemFav.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curTabIdx: 0,
        tabList: [{ title: '商品', status: '0' }, { title: '种草', status: '1' }],
        list: []
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.nextPage();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var page, pageSize, query, _ref4, list, total, favs, nList, _nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                query = {
                  page: page,
                  pageSize: pageSize
                };

                if (!(this.state.curTabIdx === 0)) {
                  _context.next = 8;
                  break;
                }

                _context.next = 5;
                return _index6.default.member.favsList(query);

              case 5:
                _context.t0 = _context.sent;
                _context.next = 11;
                break;

              case 8:
                _context.next = 10;
                return _index6.default.article.totalCollectArticle(query);

              case 10:
                _context.t0 = _context.sent;

              case 11:
                _ref4 = _context.t0;
                list = _ref4.list;
                total = _ref4.total_count;
                favs = this.props.favs;


                if (this.state.curTabIdx === 0) {
                  nList = (0, _index7.pickBy)(list, {
                    img: 'item_image',
                    fav_id: 'fav_id',
                    item_id: 'item_id',
                    title: 'item_name',
                    desc: 'brief',
                    price: function price(_ref5) {
                      var _price = _ref5.price;
                      return (_price / 100).toFixed(2);
                    },
                    market_price: function market_price(_ref6) {
                      var _market_price = _ref6.market_price;
                      return (_market_price / 100).toFixed(2);
                    },
                    is_fav: function is_fav(_ref7) {
                      var item_id = _ref7.item_id;
                      return Boolean(favs[item_id]);
                    }
                  });


                  this.setState({
                    list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList)),
                    query: query
                  });
                } else {
                  _nList = (0, _index7.pickBy)(list, {
                    img: 'image_url',
                    fav_id: 'fav_id',
                    item_id: 'article_id',
                    title: 'title',
                    desc: 'summary',
                    head_portrait: 'head_portrait',
                    author: 'author'
                  });


                  this.setState({
                    list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(_nList)),
                    query: query
                  });
                }

                return _context.abrupt("return", {
                  total: total
                });

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch(_x) {
        return _ref3.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          showBackToTop = _state.showBackToTop,
          scrollTop = _state.scrollTop,
          page = _state.page,
          curTabIdx = _state.curTabIdx,
          tabList = _state.tabList;


      var loopArray0 = curTabIdx === 0 ? list.map(function (item, __index0) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        _this2.anonymousFunc0Array[__index0] = function () {
          return _this2.handleClickItem(item.$original);
        };

        return {
          $original: item.$original
        };
      }) : [];
      var loopArray1 = !(curTabIdx === 0) ? list.map(function (item, __index1) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        _this2.anonymousFunc1Array[__index1] = function () {
          return _this2.handleClickItem(item.$original);
        };

        return {
          $original: item.$original
        };
      }) : [];
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        loopArray1: loopArray1,
        scrollTop: scrollTop,
        page: page,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(__index0, e) {
      ;
      this.anonymousFunc0Array[__index0] && this.anonymousFunc0Array[__index0](e);
    }
  }, {
    key: "anonymousFunc1",
    value: function anonymousFunc1(__index1, e) {
      ;
      this.anonymousFunc1Array[__index1] && this.anonymousFunc1Array[__index1](e);
    }
  }]);

  return ItemFav;
}(_index.Component), _class2.properties = {
  "favs": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleClickTab", "handleScroll", "nextPage", "anonymousFunc0", "anonymousFunc1", "scrollBackToTop"], _temp2)) || _class) || _class) || _class);
exports.default = ItemFav;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(ItemFav, true));