"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PointDepositBtn = (_temp2 = _class = function (_BaseComponent) {
  _inherits(PointDepositBtn, _BaseComponent);

  function PointDepositBtn() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, PointDepositBtn);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PointDepositBtn.__proto__ || Object.getPrototypeOf(PointDepositBtn)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["payType", "isOpened", "pay_pay_type", "orderID", "orderType"], _this.handleClickPayment = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.setState({
                  isOpened: true,
                  pay_pay_type: type
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.handleClosePay = function () {
      _this.setState({
        isOpened: false
      });
    }, _this.handleConfirmPay = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var pay_pay_type, query;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              pay_pay_type = _this.state.pay_pay_type;

              console.log(pay_pay_type, _this.props.orderID, _this.props.orderType);

              query = {
                order_id: _this.props.orderID,
                pay_type: pay_pay_type,
                order_type: _this.props.orderType
              };
              _context2.prev = 3;
              _context2.next = 6;
              return _index4.default.cashier.getPayment(query);

            case 6:
              _index2.default.redirectTo({
                url: "/pages/cashier/cashier-result?payStatus=success&order_id=" + _this.props.orderID
              });
              _context2.next = 13;
              break;

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](3);

              console.log(_context2.t0, 49);
              _this.setState({
                isOpened: false
              });

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, _this2, [[3, 9]]);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PointDepositBtn, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PointDepositBtn.prototype.__proto__ || Object.getPrototypeOf(PointDepositBtn.prototype), "_constructor", this).call(this, props);

      this.state = {
        isOpened: false,
        pay_pay_type: ''
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var payType = this.__props.payType;
      var isOpened = this.__state.isOpened;


      Object.assign(this.__state, {
        payType: payType
      });
      return this.__state;
    }
  }]);

  return PointDepositBtn;
}(_index.Component), _class.properties = {
  "orderID": {
    "type": null,
    "value": null
  },
  "orderType": {
    "type": null,
    "value": null
  },
  "payType": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClickPayment", "handleClosePay", "handleConfirmPay"], _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = PointDepositBtn;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PointDepositBtn));