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

var SpCell = (_temp2 = _class = function (_BaseComponent) {
  _inherits(SpCell, _BaseComponent);

  function SpCell() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SpCell);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SpCell.__proto__ || Object.getPrototypeOf(SpCell)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "icon", "iconPrefix", "title", "value", "isLink", "arrow", "border", "className", "children"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SpCell, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(SpCell.prototype.__proto__ || Object.getPrototypeOf(SpCell.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          isLink = _props.isLink,
          value = _props.value,
          icon = _props.icon,
          iconPrefix = _props.iconPrefix,
          title = _props.title,
          onClick = _props.onClick,
          arrow = _props.arrow,
          border = _props.border,
          className = _props.className;

      var anonymousState__temp = (0, _index3.classNames)('sp-cell', className, isLink ? 'sp-cell__is-link' : null, border ? null : 'sp-cell__no-border');
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        icon: icon,
        iconPrefix: iconPrefix,
        title: title,
        value: value,
        isLink: isLink,
        arrow: arrow
      });
      return this.__state;
    }
  }, {
    key: "funPrivateNseGp",
    value: function funPrivateNseGp() {
      this.__triggerPropsFn("onClick", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return SpCell;
}(_index.Component), _class.properties = {
  "isLink": {
    "type": null,
    "value": null
  },
  "value": {
    "type": null,
    "value": null
  },
  "icon": {
    "type": null,
    "value": null
  },
  "iconPrefix": {
    "type": null,
    "value": null
  },
  "title": {
    "type": null,
    "value": null
  },
  "onClick": {
    "type": null,
    "value": null
  },
  "arrow": {
    "type": null,
    "value": null
  },
  "border": {
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
  }
}, _class.$$events = ["funPrivateNseGp"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  isLink: false,
  value: null,
  border: true,
  title: '',
  arrow: 'right',
  onClick: function onClick() {}
}, _temp2);
exports.default = SpCell;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(SpCell));