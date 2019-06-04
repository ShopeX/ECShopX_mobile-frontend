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

var _index7 = require("../../spx/index.js");

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pay = (0, _index3.withPager)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Pay, _BaseComponent);

  function Pay() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Pay);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Pay.__proto__ || Object.getPrototypeOf(Pay)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "list", "isActiveName", "ruleData", "totalDeposit", "ruleType", "isLoading"], _this.handleClickTag = function (ruleData, ruleType, obj) {
      _this.setState({
        isActiveName: obj.name,
        ruleData: ruleData,
        ruleType: ruleType
      });
    }, _this.handleClickPay = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var query, res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = {
                total_fee: _this.state.isActiveName * 100
              };

              if (query.total_fee) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", _index8.default.toast('请选择充值数额'));

            case 3:
              _index2.default.showLoading({
                title: '生成订单中',
                mask: true
              });
              _context.next = 6;
              return _index5.default.member.depositPay(query);

            case 6:
              res = _context.sent;

              _index2.default.hideLoading();
              _index2.default.navigateTo({
                url: "/pages/cashier/index?order_id=" + res.order_id
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleClickPayRule = function () {
      _index2.default.navigateTo({
        url: '/pages/member/pay-rule'
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Pay, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Pay.prototype.__proto__ || Object.getPrototypeOf(Pay.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        list: [],
        isLoading: false,
        isActiveName: '',
        totalDeposit: 0
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _ref4, list, total, _ref5, deposit, nList;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _index2.default.showLoading();
                _context2.next = 3;
                return _index5.default.member.getRechargeNumber();

              case 3:
                _ref4 = _context2.sent;
                list = _ref4.list;
                total = _ref4.total_count;
                _context2.next = 8;
                return _index5.default.member.depositTotal();

              case 8:
                _ref5 = _context2.sent;
                deposit = _ref5.deposit;
                nList = (0, _index6.pickBy)(list, {
                  money: function money(_ref6) {
                    var _money = _ref6.money;
                    return _money / 100;
                  },
                  ruleData: 'ruleData',
                  ruleType: 'ruleType'
                });

                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList)),
                  totalDeposit: (deposit / 100).toFixed(2)
                });
                _index2.default.hideLoading();
                return _context2.abrupt("return", {
                  total: total
                });

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch() {
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

      var _state = this.__state,
          list = _state.list,
          isActiveName = _state.isActiveName,
          ruleType = _state.ruleType,
          ruleData = _state.ruleData,
          totalDeposit = _state.totalDeposit;


      var loopArray0 = list.length > 0 ? list.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = list.length > 0 ? (0, _index6.classNames)('member-pay__list-item', item.$original.money === isActiveName ? 'member-pay__list-active' : null) : null;
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      }) : [];
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        ruleData: ruleData,
        ruleType: ruleType
      });
      return this.__state;
    }
  }]);

  return Pay;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickPayRule", "handleClickTag", "handleClickPay"], _temp2)) || _class;

exports.default = Pay;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Pay, true));