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

var GoodsItem = (_temp2 = _class = function (_BaseComponent) {
  _inherits(GoodsItem, _BaseComponent);

  function GoodsItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, GoodsItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GoodsItem.__proto__ || Object.getPrototypeOf(GoodsItem)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "info", "img", "noCurSymbol", "price", "showMarketPrice", "className", "__fn_onClick", "children", "renderFooter"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GoodsItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(GoodsItem.prototype.__proto__ || Object.getPrototypeOf(GoodsItem.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _props = this.__props,
          info = _props.info,
          showMarketPrice = _props.showMarketPrice,
          noCurSymbol = _props.noCurSymbol,
          onClickImg = _props.onClickImg,
          className = _props.className;

      if (!info) {
        return null;
      }

      var price = (0, _index3.isObject)(info.price) ? info.price.total_price : info.price;
      var img = info.img || info.image_default_id;
      console.log(info, 19);

      var anonymousState__temp = (0, _index3.classNames)('goods-item', className);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        info: info,
        img: img,
        noCurSymbol: noCurSymbol,
        price: price,
        showMarketPrice: showMarketPrice
      });
      return this.__state;
    }
  }, {
    key: "funPrivatewrbBZ",
    value: function funPrivatewrbBZ() {
      this.__triggerPropsFn("onClickImg", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return GoodsItem;
}(_index.Component), _class.properties = {
  "info": {
    "type": null,
    "value": null
  },
  "showMarketPrice": {
    "type": null,
    "value": null
  },
  "noCurSymbol": {
    "type": null,
    "value": null
  },
  "onClickImg": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "__fn_onClickImg": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["funPrivatewrbBZ"], _class.defaultProps = {
  onClickImg: function onClickImg() {},
  showMarketPrice: true,
  noCurSymbol: false
}, _class.options = {
  addGlobalClass: true
}, _class.multipleSlots = true, _temp2);
exports.default = GoodsItem;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(GoodsItem));