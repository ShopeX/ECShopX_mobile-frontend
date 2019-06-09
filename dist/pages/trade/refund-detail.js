"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../consts/index.js");

var _index4 = require("../../utils/index.js");

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TradeRefundDetail = (_temp2 = _class = function (_BaseComponent) {
  _inherits(TradeRefundDetail, _BaseComponent);

  function TradeRefundDetail() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, TradeRefundDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TradeRefundDetail.__proto__ || Object.getPrototypeOf(TradeRefundDetail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "progress"], _this.handleBtnClick = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type) {
        var _this$state$info, aftersales_bn, order_id, item_id;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$state$info = _this.state.info, aftersales_bn = _this$state$info.aftersales_bn, order_id = _this$state$info.order_id, item_id = _this$state$info.item_id;

                if (!(type === 'cancel')) {
                  _context.next = 13;
                  break;
                }

                _index2.default.showLoading({
                  mask: true
                });
                _context.prev = 3;
                _context.next = 6;
                return _index6.default.aftersales.close({ aftersales_bn: aftersales_bn });

              case 6:
                _this.fetch();
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](3);

                console.log(_context.t0);

              case 12:

                _index2.default.hideLoading();

              case 13:

                if (type === 'contact') {
                  _index2.default.makePhoneCall({
                    phoneNumber: '1340000'
                  });
                }

                if (type === 'edit') {
                  _index2.default.navigateTo({
                    url: "/pages/trade/refund?aftersales_bn=" + aftersales_bn + "&order_id=" + order_id + "&item_id=" + item_id
                  });
                }

                if (type === 'refund') {
                  _index2.default.navigateTo({
                    url: "/pages/trade/refund?order_id=" + order_id + "&item_id=" + item_id
                  });
                }

                if (type === 'refund_send') {
                  _index2.default.navigateTo({
                    url: "/pages/trade/refund-sendback?aftersales_bn=" + aftersales_bn
                  });
                }

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2, [[3, 9]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TradeRefundDetail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TradeRefundDetail.prototype.__proto__ || Object.getPrototypeOf(TradeRefundDetail.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: null,
        progress: 0
      };
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
        var _$router$params, aftersales_bn, item_id, order_id, _ref4, info, orderInfo, progress;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _$router$params = this.$router.params, aftersales_bn = _$router$params.aftersales_bn, item_id = _$router$params.item_id, order_id = _$router$params.order_id;
                _context2.next = 3;
                return _index6.default.aftersales.info({
                  aftersales_bn: aftersales_bn,
                  item_id: item_id,
                  order_id: order_id
                });

              case 3:
                _ref4 = _context2.sent;
                info = _ref4.aftersales;
                orderInfo = _ref4.orderInfo;
                progress = +info.progress;

                info.status_str = _index3.REFUND_STATUS[String(progress)];
                info.creat_time_str = (0, _index4.formatTime)(info.create_time * 1000);
                this.setState({
                  orderInfo: orderInfo,
                  info: info,
                  progress: progress
                });

              case 10:
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
          info = _state.info,
          orderInfo = _state.orderInfo,
          progress = _state.progress;


      if (!info) {
        return null;
      }

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return TradeRefundDetail;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleBtnClick"], _temp2);
exports.default = TradeRefundDetail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TradeRefundDetail, true));