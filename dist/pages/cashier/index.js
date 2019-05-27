"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../utils/index.js");

var _index6 = require("../../hocs/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cashier = (_dec = (0, _index6.withLogin)(), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Cashier, _BaseComponent);

  function Cashier() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Cashier);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Cashier.__proto__ || Object.getPrototypeOf(Cashier)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info"], _this.state = {
      info: null
    }, _this.handleClickBack = function () {
      var order_type = _this.state.info.order_type;

      var url = order_type === 'recharge' ? '/pages/member/pay' : '/pages/trade/list';

      _index2.default.redirectTo({
        url: url
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Cashier, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Cashier.prototype.__proto__ || Object.getPrototypeOf(Cashier.prototype), "_constructor", this).call(this, props);
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
        var order_id, orderInfo, info;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                order_id = this.$router.params.order_id;

                _index2.default.showLoading();
                _context.next = 4;
                return _index4.default.cashier.getOrderDetail(order_id);

              case 4:
                orderInfo = _context.sent;
                info = (0, _index5.pickBy)(orderInfo, {
                  order_id: 'order_id',
                  order_type: 'order_type',
                  pay_type: 'pay_type',
                  point: 'point',
                  title: 'title',
                  total_fee: function total_fee(_ref3) {
                    var _total_fee = _ref3.total_fee;
                    return (_total_fee / 100).toFixed(2);
                  }
                });


                this.setState({
                  info: info
                });
                _index2.default.hideLoading();

              case 8:
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
      var __isRunloopRef = arguments[2];
      ;

      var info = this.__state.info;


      if (!info) {}

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return Cashier;
}(_index.Component), _class2.properties = {}, _class2.$$events = [], _temp2)) || _class);
exports.default = Cashier;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Cashier, true));