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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DistributionWithdraw = (_temp2 = _class = function (_BaseComponent) {
  _inherits(DistributionWithdraw, _BaseComponent);

  function DistributionWithdraw() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DistributionWithdraw);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DistributionWithdraw.__proto__ || Object.getPrototypeOf(DistributionWithdraw)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["amount", "curIdx", "payList", "cashWithdrawalRebate", "alipay_account", "limit_rebate"], _this.handleWithdrawAll = function () {
      var cashWithdrawalRebate = _this.state.cashWithdrawalRebate;

      if (!cashWithdrawalRebate) {
        return;
      }_this.setState({
        amount: cashWithdrawalRebate
      });
    }, _this.handleChange = function (val) {
      _this.setState({
        amount: val
      });
    }, _this.handlePick = function (e) {
      var idx = e.detail.value;
      _this.setState({
        curIdx: idx
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DistributionWithdraw, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(DistributionWithdraw.prototype.__proto__ || Object.getPrototypeOf(DistributionWithdraw.prototype), "_constructor", this).call(this, props);

      this.state = {
        limit_rebate: 0,
        cashWithdrawalRebate: 0,
        amount: null,
        curIdx: 0,
        payList: ['微信(金额 ≦ 800)', '支付宝'],
        alipay_account: ''
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
        var _ref3, cashWithdrawalRebate, _ref4, alipay_account, config;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _index4.default.distribution.statistics();

              case 2:
                _ref3 = _context.sent;
                cashWithdrawalRebate = _ref3.cashWithdrawalRebate;

                if (cashWithdrawalRebate) {
                  this.setState({
                    cashWithdrawalRebate: cashWithdrawalRebate
                  });
                }

                _context.next = 7;
                return _index4.default.distribution.info();

              case 7:
                _ref4 = _context.sent;
                alipay_account = _ref4.alipay_account;
                config = _ref4.config;

                if (alipay_account) {
                  this.setState({
                    alipay_account: alipay_account
                  });
                }
                if (config.limit_rebate) {
                  this.setState({
                    limit_rebate: config.limit_rebate
                  });
                }

              case 12:
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
          cashWithdrawalRebate = _state.cashWithdrawalRebate,
          limit_rebate = _state.limit_rebate,
          amount = _state.amount,
          curIdx = _state.curIdx,
          payList = _state.payList,
          alipay_account = _state.alipay_account;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return DistributionWithdraw;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleChange", "handleWithdrawAll", "handlePick"], _temp2);
exports.default = DistributionWithdraw;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(DistributionWithdraw, true));