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

var GoodsBuyToolbar = (_temp2 = _class = function (_BaseComponent) {
  _inherits(GoodsBuyToolbar, _BaseComponent);

  function GoodsBuyToolbar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, GoodsBuyToolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GoodsBuyToolbar.__proto__ || Object.getPrototypeOf(GoodsBuyToolbar)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "cartCount", "type", "fastBuyText", "__fn_onClick", "customRender", "children", "onClickAddCart", "onClickFastBuy"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GoodsBuyToolbar, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(GoodsBuyToolbar.prototype.__proto__ || Object.getPrototypeOf(GoodsBuyToolbar.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          onClickAddCart = _props.onClickAddCart,
          onClickFastBuy = _props.onClickFastBuy,
          cartCount = _props.cartCount,
          type = _props.type,
          info = _props.info;


      var fastBuyText = type === 'normal' ? '立即购买' : type === 'seckill' ? '立即抢购' : '我要开团';

      Object.assign(this.__state, {
        info: info,
        cartCount: cartCount,
        type: type,
        fastBuyText: fastBuyText
      });
      return this.__state;
    }
  }, {
    key: "funPrivateqokRt",
    value: function funPrivateqokRt() {
      this.__triggerPropsFn("onFavItem", [].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "funPrivateKTZDX",
    value: function funPrivateKTZDX() {
      this.__triggerPropsFn("onClickAddCart", [].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "funPrivatezyniz",
    value: function funPrivatezyniz() {
      this.__triggerPropsFn("onClickFastBuy", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return GoodsBuyToolbar;
}(_index.Component), _class.properties = {
  "onClickAddCart": {
    "type": null,
    "value": null
  },
  "onClickFastBuy": {
    "type": null,
    "value": null
  },
  "cartCount": {
    "type": null,
    "value": null
  },
  "type": {
    "type": null,
    "value": null
  },
  "info": {
    "type": null,
    "value": null
  },
  "onFavItem": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "__fn_onFavItem": {
    "type": null,
    "value": null
  },
  "customRender": {
    "type": null,
    "value": null
  },
  "__fn_onClickAddCart": {
    "type": null,
    "value": null
  },
  "__fn_onClickFastBuy": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["funPrivateqokRt", "navigateTo", "funPrivateKTZDX", "funPrivatezyniz"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  type: 'normal',
  onClickAddCart: function onClickAddCart() {},
  onClickFastBuy: function onClickFastBuy() {},
  onFavItem: function onFavItem() {},
  cartCount: '',
  info: null
}, _temp2);
exports.default = GoodsBuyToolbar;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(GoodsBuyToolbar));