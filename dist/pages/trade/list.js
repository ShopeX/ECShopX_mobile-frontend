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

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../hocs/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TradeList = (0, _index5.withPager)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(TradeList, _BaseComponent);

  function TradeList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TradeList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TradeList.__proto__ || Object.getPrototypeOf(TradeList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["curTabIdx", "tabList", "list", "page"], _this.handleClickTab = function (idx) {
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
    }, _this.handleClickItemBtn = function (type, trade) {
      console.log(type, trade);
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TradeList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TradeList.prototype.__proto__ || Object.getPrototypeOf(TradeList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curTabIdx: 0,
        tabList: [{ title: '全部', status: '' }, { title: '待付款', status: 'WAIT_BUYER_PAY' }, { title: '待发货', status: 'WAIT_SELLER_SEND_GOODS' }, { title: '待收货', status: 'WAIT_BUYER_CONFIRM_GOODS' }, { title: '待评价', status: 'WAIT_RATE' }],
        list: []
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var status = this.$router.params.status;

      var tabIdx = this.state.tabList.findIndex(function (tab) {
        return tab.status === status;
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
                  status: tabList[curTabIdx].status
                });
                _context.next = 4;
                return _index4.default.trade.list(params);

              case 4:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total_count;
                nList = this.state.list.concat(list);


                this.setState({
                  list: nList
                });

                return _context.abrupt("return", { total: total });

              case 10:
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
    key: "handleClickItem",
    value: function handleClickItem(trade) {
      var tid = trade.tid;

      _index2.default.navigateTo({
        url: "/pages/trade/detail?id=" + tid
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state2 = this.__state,
          curTabIdx = _state2.curTabIdx,
          tabList = _state2.tabList,
          list = _state2.list,
          page = _state2.page;


      Object.assign(this.__state, {
        page: page
      });
      return this.__state;
    }
  }]);

  return TradeList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickTab", "nextPage", "handleClickItem", "handleClickItemBtn"], _temp2)) || _class;

exports.default = TradeList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TradeList, true));