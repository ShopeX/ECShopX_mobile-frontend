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

var _index3 = require("../../utils/index.js");

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../hocs/index.js");

var _index7 = require("../../consts/index.js");

var _mapKeys2 = require("../../npm/lodash/mapKeys.js");

var _mapKeys3 = _interopRequireDefault(_mapKeys2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AfterSale = (_dec = (0, _index6.withLogin)(), (0, _index6.withPager)(_class = _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(AfterSale, _BaseComponent);

  function AfterSale() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AfterSale);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AfterSale.__proto__ || Object.getPrototypeOf(AfterSale)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["curTabIdx", "tabList", "list", "page"], _this.handleClickTab = function (idx) {
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
      var id = trade.id;


      _index2.default.navigateTo({
        url: "/pages/trade/refund-detail?aftersales_bn=" + id
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AfterSale, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AfterSale.prototype.__proto__ || Object.getPrototypeOf(AfterSale.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curTabIdx: 0,
        tabList: [{ title: '全部', status: '0' }, { title: '处理中', status: '1' }, { title: '已处理', status: '2' }, { title: '已驳回', status: '3' }, { title: '已关闭', status: '4' }],
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


                params = (0, _mapKeys3.default)(_extends({}, params, {
                  aftersales_status: tabList[curTabIdx].status
                }), function (val, key) {
                  if (key === 'page_no') {
                    return 'page';
                  }if (key === 'page_size') {
                    return 'pageSize';
                  }return key;
                });

                _context.next = 4;
                return _index5.default.aftersales.list(params);

              case 4:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total_count;
                nList = (0, _index3.pickBy)(list, {
                  id: 'aftersales_bn',
                  status_desc: function status_desc(_ref4) {
                    var aftersales_status = _ref4.aftersales_status;
                    return _index7.AFTER_SALE_STATUS[aftersales_status];
                  },
                  totalItems: 'num',
                  payment: function payment(_ref5) {
                    var item = _ref5.item;
                    return (item.refunded_fee / 100).toFixed(2);
                  },
                  pay_type: 'orderInfo.pay_type',
                  point: 'orderInfo.point',
                  order: function order(_ref6) {
                    var orderInfo = _ref6.orderInfo;
                    return (0, _index3.pickBy)(orderInfo.items, {
                      order_id: 'order_id',
                      item_id: 'item_id',
                      pic_path: 'pic',
                      title: 'item_name',
                      price: function price(_ref7) {
                        var item_fee = _ref7.item_fee;
                        return (+item_fee / 100).toFixed(2);
                      },
                      point: 'item_point',
                      num: 'num'
                    });
                  }
                });


                _index3.log.debug('[trade list] list fetched and processed: ', nList);

                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList))
                });

                return _context.abrupt("return", { total: total });

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
      var __isRunloopRef = arguments[2];
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

  return AfterSale;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickTab", "nextPage", "handleClickItem"], _temp2)) || _class) || _class);
exports.default = AfterSale;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(AfterSale, true));