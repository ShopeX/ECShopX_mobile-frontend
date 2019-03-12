"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../utils/index.js");

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CashierResult = (_temp2 = _class = function (_BaseComponent) {
  _inherits(CashierResult, _BaseComponent);

  function CashierResult() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CashierResult);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CashierResult.__proto__ || Object.getPrototypeOf(CashierResult)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info"], _this.handleClickBack = function (order_id) {
      _index2.default.navigateTo({
        url: "/pages/trade/detail?id=" + order_id
      });
    }, _this.handleClickRoam = function () {
      _index2.default.navigateTo({
        url: '/pages/item/list'
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CashierResult, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CashierResult.prototype.__proto__ || Object.getPrototypeOf(CashierResult.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: {}
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var order_id, _ref3, orderInfo, tradeInfo, infoOrder, infoTrade, info;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                order_id = this.$router.params.order_id;
                _context.next = 3;
                return _index5.default.cashier.getOrderDetail(order_id);

              case 3:
                _ref3 = _context.sent;
                orderInfo = _ref3.orderInfo;
                tradeInfo = _ref3.tradeInfo;
                infoOrder = (0, _index3.pickBy)(orderInfo, {
                  create_time: function create_time(_ref4) {
                    var _create_time = _ref4.create_time;
                    return (0, _index3.formatDataTime)(_create_time * 1000);
                  },
                  order_id: 'order_id'
                });
                infoTrade = (0, _index3.pickBy)(tradeInfo, {
                  payDate: 'payDate',
                  tradeId: 'tradeId'
                });
                info = Object.assign(infoOrder, infoTrade, this.$router.params);
                // console.log(info, 33)

                this.setState({
                  info: info
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

      var info = this.__state.info;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return CashierResult;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleClickBack", "handleClickRoam"], _temp2);
exports.default = CashierResult;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CashierResult, true));