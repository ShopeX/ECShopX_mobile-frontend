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

var Integral = (0, _index3.withPager)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Integral, _BaseComponent);

  function Integral() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Integral);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Integral.__proto__ || Object.getPrototypeOf(Integral)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "page", "list", "isActiveName", "ruleData", "otherNumberStatus", "otherNumber", "isLoading"], _this.handleClickTag = function (ruleData, obj) {
      console.log(ruleData, obj);
      _this.setState({
        isActiveName: obj.name,
        ruleData: ruleData
      });
      if (obj.name === '其他金额') {
        _this.setState({
          otherNumberStatus: true
        });
      } else {
        _this.setState({
          otherNumberStatus: false
        });
      }
    }, _this.handleChangeOtherNum = function (val) {
      console.log(val);
      _this.setState({
        otherNumber: val,
        isActiveName: val
      });
    }, _this.handleClickPay = function () {
      console.log(_this.state.isActiveName, "提交");
      // Taro.navigateTo({
      //   url: '/pages/cart/checkout'
      // })
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Integral, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Integral.prototype.__proto__ || Object.getPrototypeOf(Integral.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        list: [],
        isLoading: false,
        isActiveName: '',
        otherNumberStatus: false
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.setState(function () {
        _this2.nextPage();
      });
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _ref3, list, total, nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _index5.default.member.getRechargeNumber();

              case 2:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total_count;
                nList = (0, _index6.pickBy)(list, {
                  money: 'money',
                  ruleData: 'ruleData',
                  ruleType: 'ruleType'
                });

                nList.push({
                  money: '其他金额',
                  ruleData: '',
                  ruleType: 'ruleType'
                });
                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList))
                });
                console.log(nList, 54);
                return _context.abrupt("return", {
                  total: total
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
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
          isActiveName = _state.isActiveName,
          otherNumber = _state.otherNumber,
          otherNumberStatus = _state.otherNumberStatus,
          ruleData = _state.ruleData,
          page = _state.page;


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
        page: page,
        ruleData: ruleData,
        otherNumber: otherNumber
      });
      return this.__state;
    }
  }]);

  return Integral;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickTag", "handleChangeOtherNum", "handleClickPay"], _temp2)) || _class;

exports.default = Integral;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Integral, true));