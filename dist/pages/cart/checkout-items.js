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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckoutItems = (_temp2 = _class = function (_BaseComponent) {
  _inherits(CheckoutItems, _BaseComponent);

  function CheckoutItems() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CheckoutItems);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CheckoutItems.__proto__ || Object.getPrototypeOf(CheckoutItems)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "list", "isOpened", "__fn_onClickLeftIcon"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CheckoutItems, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CheckoutItems.prototype.__proto__ || Object.getPrototypeOf(CheckoutItems.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          isOpened = _props.isOpened,
          list = _props.list,
          onClickBack = _props.onClickBack;


      var anonymousState__temp = (0, _index3.classNames)('checkout-items', isOpened ? 'checkout-items__active' : null);
      var anonymousState__temp2 = "\u5546\u54C1\u6E05\u5355(" + list.length + ")\u4EF6";
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        list: list
      });
      return this.__state;
    }
  }, {
    key: "funPrivatesWRIX",
    value: function funPrivatesWRIX() {
      this.__triggerPropsFn("onClickBack", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return CheckoutItems;
}(_index.Component), _class.properties = {
  "isOpened": {
    "type": null,
    "value": null
  },
  "list": {
    "type": null,
    "value": null
  },
  "onClickBack": {
    "type": null,
    "value": null
  },
  "__fn_onClickLeftIcon": {
    "type": null,
    "value": null
  },
  "__fn_onClickBack": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["funPrivatesWRIX"], _class.defaultProps = {
  isOpened: false,
  list: [],
  onClickBack: function onClickBack() {}
}, _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = CheckoutItems;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CheckoutItems));