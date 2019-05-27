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

var _mapKeys2 = require("../../npm/lodash/mapKeys.js");

var _mapKeys3 = _interopRequireDefault(_mapKeys2);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../hocs/index.js");

var _index6 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TradeList = (_dec = (0, _index5.withLogin)(), (0, _index5.withPager)(_class = _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(TradeList, _BaseComponent);

  function TradeList() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, TradeList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TradeList.__proto__ || Object.getPrototypeOf(TradeList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "curTabIdx", "tabList", "list", "page", "curItemActionsId"], _this.handleClickTab = function (idx) {
      _this.hideLayer();
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
    }, _this.handleClickItem = function (trade) {
      var tid = trade.tid;


      _index2.default.navigateTo({
        url: "/pages/trade/detail?id=" + tid
      });
    }, _this.handleClickItemBtn = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type, trade) {
        var tid, _getCurrentRoute, fullPath;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                tid = trade.tid;

                if (!(type === 'confirm')) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return _index4.default.trade.confirm(tid);

              case 4:
                _getCurrentRoute = (0, _index6.getCurrentRoute)(_this.$router), fullPath = _getCurrentRoute.fullPath;

                _index2.default.redirectTo({
                  url: fullPath
                });
                return _context.abrupt("return");

              case 7:
                _context.t0 = type;
                _context.next = _context.t0 === 'pay' ? 10 : _context.t0 === 'cancel' ? 12 : _context.t0 === 'detail' ? 14 : 16;
                break;

              case 10:
                _index2.default.navigateTo({
                  url: "/pages/cashier/index?order_id=" + tid
                });
                return _context.abrupt("break", 16);

              case 12:
                _index2.default.navigateTo({
                  url: "/pages/trade/cancel?order_id=" + tid
                });
                return _context.abrupt("break", 16);

              case 14:
                _index2.default.navigateTo({
                  url: "/pages/trade/detail?id=" + tid
                });
                return _context.abrupt("break", 16);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.handleActionClick = function (type, item) {
      console.log(type, item);
      _this.hideLayer();
    }, _this.handleActionBtnClick = function (item) {
      console.log(item);
      _this.setState({
        curItemActionsId: item.tid
      });
    }, _this.hideLayer = function () {
      _this.setState({
        curItemActionsId: null
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TradeList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TradeList.prototype.__proto__ || Object.getPrototypeOf(TradeList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curTabIdx: 0,
        tabList: [{ title: '全部订单', status: '0' }, { title: '待付款', status: '5' }, { title: '待收货', status: '1' }, { title: '已完成', status: '3' }],
        list: [],
        curItemActionsId: null
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      var status = this.$router.params.status;

      var tabIdx = this.state.tabList.findIndex(function (tab) {
        return tab.status === status;
      });

      if (tabIdx >= 0) {
        this.setState({
          curTabIdx: tabIdx
        }, function () {
          _this3.nextPage();
        });
      } else {
        this.nextPage();
      }
    }
  }, {
    key: "onPullDownRefresh",
    value: function onPullDownRefresh() {
      // debugger
      // this.resetPage(() => {
      //   this.nextPage()
      // })
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.hideLayer();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
        var _state, tabList, curTabIdx, _ref4, list, total, nList;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _state = this.state, tabList = _state.tabList, curTabIdx = _state.curTabIdx;


                params = (0, _mapKeys3.default)(_extends({}, params, {
                  order_type: 'normal',
                  status: tabList[curTabIdx].status
                }), function (val, key) {
                  if (key === 'page_no') {
                    return 'page';
                  }if (key === 'page_size') {
                    return 'pageSize';
                  }return key;
                });

                _context2.next = 4;
                return _index4.default.trade.list(params);

              case 4:
                _ref4 = _context2.sent;
                list = _ref4.list;
                total = _ref4.pager.count;
                nList = (0, _index6.pickBy)(list, {
                  tid: 'order_id',
                  status_desc: 'order_status_msg',
                  status: function status(_ref5) {
                    var order_status = _ref5.order_status;
                    return (0, _index6.resolveOrderStatus)(order_status);
                  },
                  totalItems: function totalItems(_ref6) {
                    var items = _ref6.items;
                    return items.reduce(function (acc, item) {
                      return +item.num + acc;
                    }, 0);
                  },
                  payment: function payment(_ref7) {
                    var total_fee = _ref7.total_fee;
                    return (total_fee / 100).toFixed(2);
                  },
                  pay_type: 'pay_type',
                  point: 'point',
                  create_date: 'create_date',
                  order: function order(_ref8) {
                    var items = _ref8.items;
                    return (0, _index6.pickBy)(items, {
                      order_id: 'order_id',
                      item_id: 'item_id',
                      pic_path: 'pic',
                      title: 'item_name',
                      price: function price(_ref9) {
                        var item_fee = _ref9.item_fee;
                        return (+item_fee / 100).toFixed(2);
                      },
                      point: 'item_point',
                      num: 'num'
                    });
                  }
                });


                _index6.log.debug('[trade list] list fetched and processed: ', nList);

                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList))
                });

                _index2.default.stopPullDownRefresh();

                return _context2.abrupt("return", { total: total });

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch(_x3) {
        return _ref3.apply(this, arguments);
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

      var _state2 = this.__state,
          curTabIdx = _state2.curTabIdx,
          curItemActionsId = _state2.curItemActionsId,
          tabList = _state2.tabList,
          list = _state2.list,
          page = _state2.page;


      var loopArray0 = list.map(function (item) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = curItemActionsId === item.$original.tid;
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        page: page
      });
      return this.__state;
    }
  }]);

  return TradeList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickTab", "nextPage", "handleClickItem", "handleClickItemBtn", "handleActionBtnClick", "handleActionClick", "hideLayer"], _temp2)) || _class) || _class);
exports.default = TradeList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TradeList, true));