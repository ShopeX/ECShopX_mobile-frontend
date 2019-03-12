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

var _index6 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Coupon = (0, _index5.withPager)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Coupon, _BaseComponent);

  function Coupon() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Coupon);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Coupon.__proto__ || Object.getPrototypeOf(Coupon)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "curTabIdx", "tabList", "list", "page"], _this.handleClickTab = function (idx) {
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

  _createClass(Coupon, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Coupon.prototype.__proto__ || Object.getPrototypeOf(Coupon.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curTabIdx: 0,
        tabList: [{ title: '可用', status: '1' }, { title: '不可用', status: '2' }],
        list: []
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var tabIdx = this.state.tabList.findIndex(function (tab) {
        return tab.status === '1';
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
        var _params, page, pageSize, curTabIdx, vaildStatus, _ref3, list, total, nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _params = params, page = _params.page_no, pageSize = _params.page_size;
                curTabIdx = this.state.curTabIdx;

                console.log(curTabIdx, 43);
                vaildStatus = void 0;

                if (curTabIdx === 0) {
                  vaildStatus = true;
                } else {
                  vaildStatus = false;
                }
                params = _extends({}, params, {
                  valid: vaildStatus,
                  page: page,
                  pageSize: pageSize
                });
                _context.next = 8;
                return _index4.default.member.couponList(params);

              case 8:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.count;
                nList = (0, _index6.pickBy)(list, {
                  status: 'status',
                  reduce_cost: 'reduce_cost',
                  least_cost: 'least_cost',
                  begin_date: 'begin_date',
                  end_date: 'end_date',
                  card_type: 'card_type',
                  tagClass: 'tagClass',
                  title: 'title',
                  discount: 'discount'
                });


                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList))
                });
                this.setState({
                  list: nList
                });

                return _context.abrupt("return", { total: total });

              case 15:
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
          curTabIdx = _state.curTabIdx,
          tabList = _state.tabList,
          list = _state.list,
          page = _state.page;


      var loopArray0 = list.map(function (item, idx) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = item.$original.card_type === 'cash' ? (0, _index6.classNames)('coupon-item__name', item.$original.status === '2' ? 'coupon-item__name-not' : null) : null;
        var $loopState__temp4 = item.$original.card_type === 'gift' ? (0, _index6.classNames)('coupon-item__name', item.$original.status === '2' ? 'coupon-item__name-not' : null) : null;
        var $loopState__temp6 = item.$original.card_type === 'discount' ? (0, _index6.classNames)('coupon-item__name', item.$original.status === '2' ? 'coupon-item__name-not' : null) : null;
        return {
          $loopState__temp2: $loopState__temp2,
          $loopState__temp4: $loopState__temp4,
          $loopState__temp6: $loopState__temp6,
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

  return Coupon;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickTab", "nextPage"], _temp2)) || _class;

exports.default = Coupon;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Coupon, true));