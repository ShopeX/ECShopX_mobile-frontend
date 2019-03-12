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

function resolveTradeOrders(info) {
  return info.orders.map(function (order) {
    var item_id = order.item_id,
        title = order.title,
        img = order.pic_path,
        price = order.total_fee,
        num = order.num;

    return {
      item_id: item_id,
      title: title,
      img: img,
      price: price,
      num: num
    };
  });
}

var TradeDetail = (_temp2 = _class = function (_BaseComponent) {
  _inherits(TradeDetail, _BaseComponent);

  function TradeDetail() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, TradeDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TradeDetail.__proto__ || Object.getPrototypeOf(TradeDetail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "info"], _this.handleCopy = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var info, msg;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              info = _this.state.info;
              msg = "\u6536\u8D27\u4EBA\uFF1A" + info.receiver_name + " " + info.receiver_mobile + "\n\u6536\u8D27\u5730\u5740\uFF1A" + info.receiver_state + info.receiver_city + info.receiver_district + info.receiver_address + "\n\u8BA2\u5355\u53F7\uFF1A" + info.tid + "\n\u521B\u5EFA\u65F6\u95F4\uFF1A" + info.created_time_str + "\n";
              _context.next = 4;
              return (0, _index3.copyText)(msg);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TradeDetail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TradeDetail.prototype.__proto__ || Object.getPrototypeOf(TradeDetail.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: null
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
        var id, info;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = this.$router.params.id;
                _context2.next = 3;
                return _index5.default.trade.detail(id);

              case 3:
                info = _context2.sent;

                info.created_time_str = (0, _index3.formatTime)(info.created_time, 'YYYY-MM-DD hh:mm:ss');
                this.setState({
                  info: info
                });

              case 6:
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
    key: "handleClickBtn",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(type) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                console.log(type);

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function handleClickBtn(_x) {
        return _ref4.apply(this, arguments);
      }

      return handleClickBtn;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var info = this.__state.info;

      if (!info) {
        return null;
      }

      // TODO: orders 多商铺
      var tradeOrders = resolveTradeOrders(info);

      var anonymousState__temp = (0, _index3.classNames)('trade-detail', "trade-detail__status-" + info.status);
      var anonymousState__temp2 = "/assets/imgs/trade/ico_" + info.status.toLowerCase() + ".png";
      var anonymousState__temp3 = "-" + info.points_fee;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3
      });
      return this.__state;
    }
  }]);

  return TradeDetail;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleCopy", "handleClickBtn"], _temp2);
exports.default = TradeDetail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TradeDetail, true));