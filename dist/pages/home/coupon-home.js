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

var CouponHome = (0, _index5.withPager)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(CouponHome, _BaseComponent);

  function CouponHome() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CouponHome);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CouponHome.__proto__ || Object.getPrototypeOf(CouponHome)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["list", "page"], _this.handleGetCard = function (cardId) {
      _index2.default.navigateToMiniProgram({
        appId: 'wx4721629519a8f25b', // 要跳转的小程序的appid
        path: "pages/recommend/detail?id=" + cardId, // 跳转的目标页面
        extraData: {
          id: cardId
        },
        envVersion: 'trial',
        success: function success(res) {
          // 打开成功
          console.log(res);
        }
      });
      /*const { list } = this.state
      const query = {
        card_id: cardId
      }
      try {
        const data = await api.member.homeCouponGet(query)
        S.toast('优惠券领取成功')
        if (data.status) {
          console.log(74 ,222)
          if (data.status.total_lastget_num <= 0 ) {
            list[idx].getted = 2
          } else if (data.status.lastget_num <= 0 ) {
            list[idx].getted = 1
          }
          this.setState({
            list
          })
        }
      } catch (e) {
       }*/
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CouponHome, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CouponHome.prototype.__proto__ || Object.getPrototypeOf(CouponHome.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
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
        var _ref3, list, total, nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                params = _extends({}, params, {
                  end_date: 1
                });
                _context.next = 3;
                return _index4.default.member.homeCouponList(params);

              case 3:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.pagers.total;
                nList = (0, _index6.pickBy)(list, {
                  status: 'status',
                  reduce_cost: 'reduce_cost',
                  least_cost: 'least_cost',
                  begin_date: 'begin_date',
                  end_date: function end_date(_ref4) {
                    var _end_date = _ref4.end_date;
                    return (0, _index6.formatTime)(_end_date * 1000, 'YYYY-MM-DD HH:mm:ss');
                  },
                  fixed_term: 'fixed_term',
                  card_type: 'card_type',
                  tagClass: 'tagClass',
                  title: 'title',
                  discount: 'discount',
                  get_limit: 'get_limit',
                  user_get_num: 'user_get_num',
                  quantity: 'quantity',
                  get_num: 'get_num',
                  card_id: 'card_id'
                });

                nList.map(function (item) {
                  if (item.get_limit - item.user_get_num <= 0) {
                    item.getted = 1;
                  } else if (item.quantity - item.get_num <= 0) {
                    item.getted = 2;
                  }
                });

                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList))
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
          list = _state.list,
          page = _state.page;


      Object.assign(this.__state, {
        page: page
      });
      return this.__state;
    }
  }]);

  return CouponHome;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["nextPage", "handleGetCard"], _temp2)) || _class;

exports.default = CouponHome;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CouponHome, true));