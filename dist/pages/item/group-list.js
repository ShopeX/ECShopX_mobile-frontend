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

var GroupList = (0, _index5.withPager)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(GroupList, _BaseComponent);

  function GroupList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, GroupList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GroupList.__proto__ || Object.getPrototypeOf(GroupList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "curTabIdx", "tabList", "list", "page"], _this.handleClickTab = function (idx) {
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
    }, _this.handleClickItem = function (item) {
      var goods_id = item.goods_id;


      _index2.default.navigateTo({
        url: "/pages/item/espier-detail?id=" + goods_id
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GroupList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(GroupList.prototype.__proto__ || Object.getPrototypeOf(GroupList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curTabIdx: 0,
        tabList: [{ title: '进行中', status: 0 }, { title: '未开始', status: 1 }],
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var curTabIdx, _ref3, list, total;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                curTabIdx = this.state.curTabIdx;


                params = (0, _mapKeys3.default)(_extends({}, params, {
                  group_goods_type: 'normal',
                  view: curTabIdx === 0 ? '2' : '1',
                  team_status: '0'
                }), function (val, key) {
                  if (key === 'page_no') {
                    return 'page';
                  }if (key === 'page_size') {
                    return 'pageSize';
                  }return key;
                });

                _context.next = 4;
                return _index4.default.item.groupList(params);

              case 4:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total_count;

                list.forEach(function (t) {
                  if (t.remaining_time > 0) {
                    t.remaining_time_obj = (0, _index6.calcTimer)(t.remaining_time);
                  }
                });

                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(list))
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
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          tabList = _state.tabList,
          curTabIdx = _state.curTabIdx,
          list = _state.list,
          page = _state.page;


      var loopArray0 = list.map(function (item, idx) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        var remaining_time_obj = item.$original.remaining_time_obj;

        var $loopState__temp2 = remaining_time_obj ? { day: '天', hours: ':', minutes: ':', seconds: '' } : null;
        return {
          remaining_time_obj: remaining_time_obj,
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

  return GroupList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickTab", "nextPage", "handleClickItem"], _class2.config = {
  navigationBarTitleText: '限时团购'
}, _temp2)) || _class;

exports.default = GroupList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(GroupList, true));