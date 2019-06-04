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

var DetailItem = (_temp2 = _class = function (_BaseComponent) {
  _inherits(DetailItem, _BaseComponent);

  function DetailItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DetailItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DetailItem.__proto__ || Object.getPrototypeOf(DetailItem)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "customFooter", "customHeader", "noHeader", "onClick", "showActions"], _this.handleClickAfterSale = function (item) {
      var order_id = _this.props.info.tid;

      console.log(item, order_id, 33);
      if (!item.aftersales_status || item.aftersales_status === 'SELLER_REFUSE_BUYER') {
        _index2.default.navigateTo({
          url: "/pages/trade/refund?order_id=" + order_id + "&item_id=" + item.item_id
        });
      } else {
        _index2.default.navigateTo({
          url: "/pages/trade/refund-detail?order_id=" + order_id + "&item_id=" + item.item_id
        });
      }
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DetailItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(DetailItem.prototype.__proto__ || Object.getPrototypeOf(DetailItem.prototype), "_constructor", this).call(this, props);
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
          showActions = _props.showActions;

      Object.assign(this.__state, {
        info: info,
        customFooter: customFooter
      });
      return this.__state;
    }
  }]);

  return DetailItem;
}(_index.Component), _class.properties = {
  "info": {
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
  "showActions": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClickAfterSale"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  // customHeader: false,
  customFooter: false
  // customRender: false,
  // noHeader: false,
  // showActions: false,
  // payType: '',
  // onClickBtn: () => {},
  // onClick: () => {}


  // handleClickBtn (type) {
  //   const { info } = this.props
  //   this.props.onClickBtn && this.props.onClickBtn(type, info)
  // }

}, _temp2);
exports.default = DetailItem;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(DetailItem));