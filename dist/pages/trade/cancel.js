"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../spx/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TradeCancel = (_temp2 = _class = function (_BaseComponent) {
  _inherits(TradeCancel, _BaseComponent);

  function TradeCancel() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, TradeCancel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TradeCancel.__proto__ || Object.getPrototypeOf(TradeCancel)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "reason", "curReasonIdx", "otherReason", "textCount"], _this.handleClickTag = function (data) {
      var idx = _this.state.reason.indexOf(data.name);
      if (idx >= 0) {
        _this.setState({
          curReasonIdx: idx
        });
      }
    }, _this.handleTextChange = function (e) {
      var value = e.target.value;

      _this.setState({
        otherReason: value
      });
    }, _this.handleSubmit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this$state, curReasonIdx, reason, otherReason, order_id, data, res;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$state = _this.state, curReasonIdx = _this$state.curReasonIdx, reason = _this$state.reason, otherReason = _this$state.otherReason;

              if (!(curReasonIdx === 3 && !otherReason)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", _index4.default.toast('请输入其他理由'));

            case 3:
              order_id = _this.$router.params.order_id;
              data = {
                order_id: order_id,
                cancel_reason: reason[curReasonIdx],
                other_reason: otherReason
              };
              _context.next = 7;
              return _index6.default.trade.cancel(data);

            case 7:
              res = _context.sent;

              if (res) {
                _index4.default.toast('操作成功');
                _index2.default.navigateBack();
              }

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TradeCancel, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TradeCancel.prototype.__proto__ || Object.getPrototypeOf(TradeCancel.prototype), "_constructor", this).call(this, props);
      this.state = {
        reason: ['多买/错买', '不想要了', '买多了', '其他'],
        curReasonIdx: 0,
        textCount: 255,
        otherReason: ''
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          reason = _state.reason,
          curReasonIdx = _state.curReasonIdx,
          otherReason = _state.otherReason,
          textCount = _state.textCount;


      var loopArray0 = reason.map(function (item, idx) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = idx === curReasonIdx;
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0
      });
      return this.__state;
    }
  }]);

  return TradeCancel;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleClickTag", "handleTextChange", "handleSubmit"], _class.config = {
  navigationBarTitleText: '取消订单'
}, _temp2);
exports.default = TradeCancel;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TradeCancel, true));