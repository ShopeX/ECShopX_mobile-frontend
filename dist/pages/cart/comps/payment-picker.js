"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PaymentPicker = (_temp2 = _class = function (_BaseComponent) {
  _inherits(PaymentPicker, _BaseComponent);

  function PaymentPicker() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PaymentPicker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PaymentPicker.__proto__ || Object.getPrototypeOf(PaymentPicker)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "isOpened", "disabledPayment", "loading", "localType", "type", "__fn_onClose", "__fn_onClick"], _this.componentWillReceiveProps = function (nextProps) {
      if (nextProps.type !== _this.props.type) {
        _this.setState({
          localType: nextProps.type
        });
      }
    }, _this.handleCancel = function () {
      _this.setState({
        localType: _this.props.type
      });
      _this.__triggerPropsFn("onClose", [null].concat([]));
    }, _this.handlePaymentChange = function (type) {
      var disabledPayment = _this.props.disabledPayment;

      if (disabledPayment && disabledPayment.name === type) {
        return;
      }_this.setState({
        localType: type
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PaymentPicker, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PaymentPicker.prototype.__proto__ || Object.getPrototypeOf(PaymentPicker.prototype), "_constructor", this).call(this, props);

      this.state = {
        localType: props.type
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _props = this.__props,
          isOpened = _props.isOpened,
          loading = _props.loading,
          disabledPayment = _props.disabledPayment;
      var localType = this.__state.localType;


      var anonymousState__temp = !!disabledPayment;
      var anonymousState__temp2 = localType === 'dhpoint';
      var anonymousState__temp3 = localType === 'amorepay';
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        isOpened: isOpened,
        disabledPayment: disabledPayment,
        loading: loading
      });
      return this.__state;
    }
  }, {
    key: "funPrivateErJJw",
    value: function funPrivateErJJw() {
      this.__triggerPropsFn("onChange", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return PaymentPicker;
}(_index.Component), _class.properties = {
  "type": {
    "type": null,
    "value": null
  },
  "__fn_onClose": {
    "type": null,
    "value": null
  },
  "disabledPayment": {
    "type": null,
    "value": null
  },
  "isOpened": {
    "type": null,
    "value": null
  },
  "loading": {
    "type": null,
    "value": null
  },
  "onChange": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "__fn_onChange": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleCancel", "handlePaymentChange", "funPrivateErJJw"], _class.defaultProps = {
  isOpened: false,
  type: 'amorepay',
  disabledPayment: null
}, _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = PaymentPicker;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PaymentPicker));