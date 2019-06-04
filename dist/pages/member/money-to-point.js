"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../spx/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MoneyToPoint = (_temp2 = _class = function (_BaseComponent) {
  _inherits(MoneyToPoint, _BaseComponent);

  function MoneyToPoint() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, MoneyToPoint);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MoneyToPoint.__proto__ || Object.getPrototypeOf(MoneyToPoint)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "otherNumber", "isOpened", "totalPoint"], _this.handleChangeOtherNum = function (val) {
      _this.setState({
        otherNumber: val
      });
    }, _this.handleClosePay = function () {
      _this.setState({
        isOpened: false
      });
    }, _this.handleConfirmPay = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var query;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = {
                money: _this.state.otherNumber * 100
              };
              _context.prev = 1;
              _context.next = 4;
              return _index4.default.member.depositToPoint(query);

            case 4:
              _this.setState({
                isOpened: false,
                otherNumber: ''
              });
              _index2.default.showToast({
                title: '兑换成功',
                icon: 'none'
              });
              setTimeout(function () {
                _this.fetch();
              }, 700);
              _context.next = 12;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](1);

              console.log(_context.t0);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2, [[1, 9]]);
    })), _this.handleClickPay = function (val) {
      if (val <= 0) {
        return _index6.default.toast('请输入大于0的金额');
      }
      _this.setState({
        isOpened: true,
        otherNumber: val
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MoneyToPoint, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(MoneyToPoint.prototype.__proto__ || Object.getPrototypeOf(MoneyToPoint.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        otherNumber: '',
        isOpened: false,
        totalPoint: 0
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
        var _ref4, point;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _index4.default.member.pointTotal();

              case 2:
                _ref4 = _context2.sent;
                point = _ref4.point;

                this.setState({
                  totalPoint: point
                });

              case 5:
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
          otherNumber = _state.otherNumber,
          isOpened = _state.isOpened,
          totalPoint = _state.totalPoint;


      var anonymousState__temp = "\u8BF7\u786E\u8BA4\u662F\u5426\u5C06" + otherNumber + "\u5143\u5151\u6362\u6210\u79EF\u5206";
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp
      });
      return this.__state;
    }
  }]);

  return MoneyToPoint;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleChangeOtherNum", "handleClickPay", "handleClosePay", "handleConfirmPay"], _temp2);
exports.default = MoneyToPoint;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(MoneyToPoint, true));