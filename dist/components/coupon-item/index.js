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

var CouponItem = (_temp2 = _class = function (_BaseComponent) {
  _inherits(CouponItem, _BaseComponent);

  function CouponItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CouponItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CouponItem.__proto__ || Object.getPrototypeOf(CouponItem)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "info", "isShowCheckout", "isChoosed", "isItemChecked", "curKey", "__fn_onClickBtn", "children"], _this.handleClickChecked = function (index) {
      if (_this.props.curKey === index) {
        _this.setState({
          isItemChecked: !_this.state.isItemChecked
        });
      } else {
        _this.setState({
          isItemChecked: true
        });
      }
      _this.__triggerPropsFn("onClickBtn", [null].concat([index]));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CouponItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CouponItem.prototype.__proto__ || Object.getPrototypeOf(CouponItem.prototype), "_constructor", this).call(this, props);

      this.state = {
        isItemChecked: false
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          info = _props.info,
          isShowCheckout = _props.isShowCheckout,
          isChoosed = _props.isChoosed,
          onClick = _props.onClick;
      var isItemChecked = this.__state.isItemChecked;


      if (!info) {
        return null;
      }

      var anonymousState__temp = info.card_type === 'cash' ? (0, _index3.classNames)('coupon-item__name', info.status === '2' ? 'coupon-item__name-not' : null) : null;
      var anonymousState__temp2 = info.card_type === 'gift' ? (0, _index3.classNames)('coupon-item__name', info.status === '2' ? 'coupon-item__name-not' : null) : null;
      var anonymousState__temp3 = info.card_type === 'discount' ? (0, _index3.classNames)('coupon-item__name', info.status === '2' ? 'coupon-item__name-not' : null) : null;
      var anonymousState__temp4 = info.card_type === 'member' ? (0, _index3.classNames)('coupon-item__name', info.status === '2' ? 'coupon-item__name-not' : null) : null;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        info: info,
        isShowCheckout: isShowCheckout,
        isChoosed: isChoosed
      });
      return this.__state;
    }
  }, {
    key: "funPrivatePGYQl",
    value: function funPrivatePGYQl() {
      this.__triggerPropsFn("onClick", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return CouponItem;
}(_index.Component), _class.properties = {
  "curKey": {
    "type": null,
    "value": null
  },
  "__fn_onClickBtn": {
    "type": null,
    "value": null
  },
  "info": {
    "type": null,
    "value": null
  },
  "isShowCheckout": {
    "type": null,
    "value": null
  },
  "isChoosed": {
    "type": null,
    "value": null
  },
  "onClick": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["funPrivatePGYQl", "handleClickChecked"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  onClick: function onClick() {},
  info: null,
  isShowCheckout: false
}, _temp2);
exports.default = CouponItem;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CouponItem));