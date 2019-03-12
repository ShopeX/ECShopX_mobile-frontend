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

var PointList = (0, _index3.withPager)(_class = (0, _index3.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(PointList, _BaseComponent);

  function PointList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PointList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PointList.__proto__ || Object.getPrototypeOf(PointList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["scrollTop", "listType", "list", "page", "showBackToTop", "curFilterIdx", "filterList", "query"], _this.handleFilterChange = function (data) {
      var current = data.current,
          sort = data.sort;


      var query = _extends({}, _this.state.query, {
        goodsSort: current === 0 ? null : current === 1 ? 1 : sort > 0 ? 3 : 2
      });

      if (current !== _this.state.curFilterIdx || current === _this.state.curFilterIdx && query.goodsSort !== _this.state.query.goodsSort) {
        _this.resetPage();
        _this.setState({
          list: []
        });
      }

      _this.setState({
        curFilterIdx: current,
        query: query
      }, function () {
        _this.nextPage();
      });
    }, _this.handleListTypeChange = function () {
      var listType = _this.state.listType === 'grid' ? 'default' : 'grid';

      _this.setState({
        listType: listType
      });
    }, _this.handleClickItem = function (item) {
      console.log(item.item_id, 109);
      var url = "/pages/item/point-detail?id=" + item.item_id;
      _index2.default.navigateTo({
        url: url
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PointList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PointList.prototype.__proto__ || Object.getPrototypeOf(PointList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curFilterIdx: 0,
        filterList: [{ title: '综合' }, { title: '销量' }, { title: '价格', sort: -1 }],
        query: null,
        list: [],
        listType: 'grid'
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.setState({
        query: {
          keywords: '',
          distributor_id: 16,
          item_type: 'normal',
          approve_status: 'onsale,only_show',
          is_point: true,
          category: this.$router.params.cat_id
        }
      }, function () {
        _this2.nextPage();
      });
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var page, pageSize, query, _ref3, list, total, nList;

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
                return _index5.default.item.search(query);

              case 4:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total_count;
                nList = (0, _index6.pickBy)(list, {
                  img: 'pics[0]',
                  item_id: 'item_id',
                  title: 'itemName',
                  desc: 'brief',
                  price: 'point'
                });

                nList.map(function (item) {
                  item.price_text = '积分';
                });
                console.log(nList, 64);
                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList)),
                  query: query
                });

                return _context.abrupt("return", {
                  total: total
                });

              case 12:
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
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          listType = _state.listType,
          showBackToTop = _state.showBackToTop,
          scrollTop = _state.scrollTop,
          page = _state.page;


      Object.assign(this.__state, {
        scrollTop: scrollTop,
        page: page,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }]);

  return PointList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleScroll", "nextPage", "handleClickItem", "scrollBackToTop"], _temp2)) || _class) || _class;

exports.default = PointList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PointList, true));