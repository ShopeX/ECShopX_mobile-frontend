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

var OrderItem = (_temp2 = _class = function (_BaseComponent) {
  _inherits(OrderItem, _BaseComponent);

  function OrderItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, OrderItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = OrderItem.__proto__ || Object.getPrototypeOf(OrderItem)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "img", "showExtra", "customFooter", "payType", "renderDesc", "renderFooter"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(OrderItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(OrderItem.prototype.__proto__ || Object.getPrototypeOf(OrderItem.prototype), "_constructor", this).call(this, props);
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
          onClick = _props.onClick,
          payType = _props.payType,
          showExtra = _props.showExtra,
          customFooter = _props.customFooter;

      if (!info) {
        return null;
      }var img = info.pic_path ? info.pic_path : Array.isArray(info.pics) ? info.pics[0] : info.pics;

      Object.assign(this.__state, {
        info: info,
        img: img,
        showExtra: showExtra,
        customFooter: customFooter,
        payType: payType
      });
      return this.__state;
    }
  }, {
    key: "funPrivaterDgee",
    value: function funPrivaterDgee() {
      this.__triggerPropsFn("onClick", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return OrderItem;
}(_index.Component), _class.properties = {
  "info": {
    "type": null,
    "value": null
  },
  "onClick": {
    "type": null,
    "value": null
  },
  "payType": {
    "type": null,
    "value": null
  },
  "showExtra": {
    "type": null,
    "value": null
  },
  "customFooter": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["funPrivaterDgee"], _class.defaultProps = {
  onClick: function onClick() {},
  payType: '',
  showExtra: true,
  info: null
}, _class.options = {
  addGlobalClass: true
}, _class.multipleSlots = true, _temp2);
exports.default = OrderItem;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(OrderItem));