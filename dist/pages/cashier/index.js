"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cashier = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Cashier, _BaseComponent);

  function Cashier() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Cashier);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Cashier.__proto__ || Object.getPrototypeOf(Cashier)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "isOpened", "pay_pay_type"], _this.handleClickPayment = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(val) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.setState({
                  isOpened: true,
                  pay_pay_type: val
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
      var _this$state, info, pay_pay_type, query;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _this$state = _this.state, info = _this$state.info, pay_pay_type = _this$state.pay_pay_type;
              query = {
                order_id: info.order_id,
                pay_type: pay_pay_type,
                order_type: info.order_type
              };
              _context2.next = 4;
              return _index4.default.cashier.getPayment(query).then(function (res) {
                _index2.default.redirectTo({
                  url: "/pages/cashier/cashier-result?payStatus=success&order_id=" + info.order_id
                });
                console.log(res);
              }).catch(function (error) {
                _index2.default.redirectTo({
                  url: "/pages/cashier/cashier-result?payStatus=fail&order_id=" + info.order_id
                });
                console.log(error);
              });

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Cashier, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Cashier.prototype.__proto__ || Object.getPrototypeOf(Cashier.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: {},
        isOpened: false,
        pay_pay_type: ''
      };
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {

      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var order_id, _ref5, orderInfo, info;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                order_id = this.$router.params.order_id;
                _context3.next = 3;
                return _index4.default.cashier.getOrderDetail(order_id);

              case 3:
                _ref5 = _context3.sent;
                orderInfo = _ref5.orderInfo;
                info = (0, _index5.pickBy)(orderInfo, {
                  order_id: 'order_id',
                  order_type: 'order_type',
                  pay_type: 'pay_type',
                  point: 'point',
                  total_fee: function total_fee(_ref6) {
                    var _total_fee = _ref6.total_fee;
                    return (_total_fee / 100).toFixed(2);
                  }
                });
                // const list = resolveCartItems(cartlist)
                // const items = normalizeItems(list)

                this.setState({
                  info: info
                });
                console.log(info, 26);

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetch() {
        return _ref4.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "_createData",

    // handleClickPayment = async (val) => {
    //   const { info } = this.state
    //   console.log(val)
    //   const query = {
    //     order_id: info.order_id,
    //     pay_type: val,
    //     order_type: info.order_type,
    //   }
    //   let res = await api.cashier.getPayment(query)
    //   console.log(res)
    // }


    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          isOpened = _state.isOpened;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return Cashier;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleClickPayment", "handleClosePay", "handleConfirmPay"], _temp2);
exports.default = Cashier;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Cashier, true));