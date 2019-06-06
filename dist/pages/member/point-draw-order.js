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

var PointDrawOrder = (0, _index3.withPager)(_class = (0, _index3.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(PointDrawOrder, _BaseComponent);

  function PointDrawOrder() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PointDrawOrder);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PointDrawOrder.__proto__ || Object.getPrototypeOf(PointDrawOrder)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["curTabIdx", "tabList", "scrollTop", "listType", "list", "page", "showBackToTop"], _this.handleClickItem = function (item) {
      console.log(item.luckydraw_trade_id);
      var url = "/pages/member/point-draw-detail?luckydraw_id=" + item.luckydraw_id + "&item_id=" + item.item_id;
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
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PointDrawOrder, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PointDrawOrder.prototype.__proto__ || Object.getPrototypeOf(PointDrawOrder.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curTabIdx: 0,
        tabList: [{ title: '进行中', status: '0' }, { title: '已揭晓', status: '1' }],
        list: [],
        listType: ''
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var tabIdx = this.state.tabList.findIndex(function (tab) {
        return tab.status === '0';
      });

      if (tabIdx >= 0) {
        this.setState({
          curTabIdx: tabIdx
        }, function () {
          _this2.nextPage();
        });
      } else {
        this.nextPage();
      }
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var _state, tabList, curTabIdx, _ref3, list, total, nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _state = this.state, tabList = _state.tabList, curTabIdx = _state.curTabIdx;

                params = _extends({}, params, {
                  is_lucky: tabList[curTabIdx].status
                });

                _context.next = 4;
                return _index5.default.member.pointDrawPayList(params);

              case 4:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total_count;
                nList = (0, _index6.pickBy)(list, {
                  img: 'item_pic',
                  luckydraw_trade_id: 'luckydraw_trade_id',
                  title: 'item_name',
                  price: 'luckydraw_point',
                  lucky_open_time: function lucky_open_time(_ref4) {
                    var _lucky_open_time = _ref4.lucky_open_time;
                    return (0, _index6.formatTime)(_lucky_open_time * 1000, 'YYYY-MM-DD HH:mm:ss');
                  },
                  lucky_status: 'lucky_status',
                  luckydraw_id: 'luckydraw_id',
                  item_id: 'item_id',
                  sales_num: 'sales_num',
                  luckydraw_store: 'luckydraw_store',
                  mobile: 'mobile',
                  join_num: 'join_num',
                  is_own_lucky: 'is_own_lucky',
                  rate: function rate(_ref5) {
                    var sales_num = _ref5.sales_num,
                        luckydraw_store = _ref5.luckydraw_store;
                    return Number((sales_num / luckydraw_store * 100).toFixed(0));
                  }
                });

                nList.map(function (item) {
                  // if(item.payment_status === 'unpay') {
                  //   item.payment_status = '未支付'
                  // } else if(item.payment_status === 'payed'){
                  //   item.payment_status = '已支付'
                  // }else if(item.payment_status === 'readyrefund'){
                  //   item.payment_status = '等待退款'
                  // } else {
                  //   item.payment_status = '已退款'
                  // }
                  if (item.lucky_status === 'lucky') {
                    item.lucky_status = '中奖';
                  } else if (item.lucky_status === 'unlukcy') {
                    item.lucky_status = '未中奖';
                  } else {
                    item.lucky_status = '尚未开奖';
                  }
                });
                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList))
                });

                return _context.abrupt("return", {
                  total: total
                });

              case 11:
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

      var _state2 = this.__state,
          list = _state2.list,
          listType = _state2.listType,
          showBackToTop = _state2.showBackToTop,
          scrollTop = _state2.scrollTop,
          page = _state2.page,
          curTabIdx = _state2.curTabIdx,
          tabList = _state2.tabList;


      Object.assign(this.__state, {
        scrollTop: scrollTop,
        page: page,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }]);

  return PointDrawOrder;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickTab", "handleScroll", "nextPage", "handleClickItem", "scrollBackToTop"], _temp2)) || _class) || _class;

exports.default = PointDrawOrder;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PointDrawOrder, true));