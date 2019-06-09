"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TradeItem = (_temp2 = _class = function (_BaseComponent) {
  _inherits(TradeItem, _BaseComponent);

  function TradeItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TradeItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TradeItem.__proto__ || Object.getPrototypeOf(TradeItem)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "info", "noHeader", "customHeader", "payType", "customFooter", "showActions", "customRender", "renderHeader", "renderFooter", "onActionBtnClick", "onActionClick"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TradeItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TradeItem.prototype.__proto__ || Object.getPrototypeOf(TradeItem.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "handleClickBtn",
    value: function handleClickBtn(type) {
      var info = this.props.info;

      this.props.onClickBtn && this.__triggerPropsFn("onClickBtn", [null].concat([type, info]));
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          customHeader = _props.customHeader,
          customFooter = _props.customFooter,
          noHeader = _props.noHeader,
          onClick = _props.onClick,
          info = _props.info,
          payType = _props.payType,
          showActions = _props.showActions;

      if (!info) {
        return null;
      }

      var anonymousState__temp = !customFooter && info.status === 'WAIT_BUYER_CONFIRM_GOODS' ? (0, _index3.classNames)('trade-item__dropdown', { 'is-active': showActions }) : null;
      var anonymousState__temp2 = !customFooter && info.status === 'WAIT_RATE' ? (0, _index3.classNames)('trade-item__dropdown', { 'is-active': showActions }) : null;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        info: info,
        noHeader: noHeader,
        customHeader: customHeader,
        payType: payType,
        customFooter: customFooter
      });
      return this.__state;
    }
  }, {
    key: "funPrivateRxPqK",
    value: function funPrivateRxPqK() {
      this.__triggerPropsFn("onClick", [].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "funPrivatewUvys",
    value: function funPrivatewUvys() {
      this.__triggerPropsFn("onActionBtnClick", [].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "funPrivatenHqNr",
    value: function funPrivatenHqNr() {
      this.__triggerPropsFn("onActionClick", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return TradeItem;
}(_index.Component), _class.properties = {
  "info": {
    "type": null,
    "value": null
  },
  "onClickBtn": {
    "type": null,
    "value": null
  },
  "__fn_onClickBtn": {
    "type": null,
    "value": null
  },
  "customHeader": {
    "type": null,
    "value": null
  },
  "customFooter": {
    "type": null,
    "value": null
  },
  "noHeader": {
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
  "showActions": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "customRender": {
    "type": null,
    "value": null
  },
  "onActionBtnClick": {
    "type": null,
    "value": null
  },
  "__fn_onActionBtnClick": {
    "type": null,
    "value": null
  },
  "onActionClick": {
    "type": null,
    "value": null
  },
  "__fn_onActionClick": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["funPrivateRxPqK", "handleClickBtn", "funPrivatewUvys", "funPrivatenHqNr"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  customHeader: false,
  customFooter: false,
  customRender: false,
  noHeader: false,
  showActions: false,
  payType: '',
  info: null,
  onClickBtn: function onClickBtn() {},
  onClick: function onClick() {}
}, _class.multipleSlots = true, _temp2);
exports.default = TradeItem;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TradeItem));