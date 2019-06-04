"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2, _initialiseProps;

var _index = require("../../../../../../@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../../prop-types/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../../../../../classnames/index.js");

var _index6 = _interopRequireDefault(_index5);

var _isFunction2 = require("../../../../../../lodash/isFunction.js");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _component = require("../../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtListItem = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtListItem, _AtComponent);

  function AtListItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtListItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtListItem.__proto__ || Object.getPrototypeOf(AtListItem)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtListItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtListItem.prototype.__proto__ || Object.getPrototypeOf(AtListItem.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "handleSwitchClick",
    value: function handleSwitchClick(e) {
      e.stopPropagation();
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _props = this.__props,
          note = _props.note,
          arrow = _props.arrow,
          title = _props.title,
          thumb = _props.thumb,
          iconInfo = _props.iconInfo,
          disabled = _props.disabled,
          isSwitch = _props.isSwitch,
          extraText = _props.extraText,
          hasBorder = _props.hasBorder,
          extraThumb = _props.extraThumb,
          switchColor = _props.switchColor,
          switchIsCheck = _props.switchIsCheck;


      var rootClass = (0, _index6.default)('at-list__item', {
        'at-list__item--thumb': thumb,
        'at-list__item--multiple': note,
        'at-list__item--disabled': disabled,
        'at-list__item--no-border': !hasBorder
      }, this.__props.className);
      var iconClass = (0, _index6.default)(iconInfo.prefixClass || 'at-icon', _defineProperty({}, (iconInfo.prefixClass || 'at-icon') + "-" + iconInfo.value, iconInfo.value), iconInfo.className);

      var anonymousState__temp = iconInfo.value ? (0, _index.internal_inline_style)(this.mergeStyle({
        color: iconInfo.color || '',
        fontSize: (iconInfo.size || 24) + "px"
      }, iconInfo.customStyle)) : null;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        rootClass: rootClass,
        thumb: thumb,
        iconInfo: iconInfo,
        iconClass: iconClass,
        note: note,
        extraText: extraText,
        extraThumb: extraThumb,
        isSwitch: isSwitch,
        switchColor: switchColor,
        disabled: disabled,
        switchIsCheck: switchIsCheck,
        arrow: arrow,
        title: title
      });
      return this.__state;
    }
  }]);

  return AtListItem;
}(_component2.default), _class.properties = {
  "onClick": {
    "type": null,
    "value": null
  },
  "disabled": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "onSwitchChange": {
    "type": null,
    "value": null
  },
  "__fn_onSwitchChange": {
    "type": null,
    "value": null
  },
  "note": {
    "type": null,
    "value": null
  },
  "arrow": {
    "type": null,
    "value": null
  },
  "title": {
    "type": null,
    "value": null
  },
  "thumb": {
    "type": null,
    "value": null
  },
  "iconInfo": {
    "type": null,
    "value": null
  },
  "isSwitch": {
    "type": null,
    "value": null
  },
  "extraText": {
    "type": null,
    "value": null
  },
  "hasBorder": {
    "type": null,
    "value": null
  },
  "extraThumb": {
    "type": null,
    "value": null
  },
  "switchColor": {
    "type": null,
    "value": null
  },
  "switchIsCheck": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClick", "handleSwitchClick", "handleSwitchChange"], _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.$usedState = ["anonymousState__temp", "rootClass", "thumb", "iconInfo", "iconClass", "note", "extraText", "extraThumb", "isSwitch", "switchColor", "disabled", "switchIsCheck", "arrow", "title", "hasBorder", "className"];

  this.handleClick = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if ((0, _isFunction3.default)(_this2.props.onClick) && !_this2.props.disabled) {
      _this2.__triggerPropsFn("onClick", [null].concat([].concat(args)));
    }
  };

  this.handleSwitchChange = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    if ((0, _isFunction3.default)(_this2.props.onSwitchChange) && !_this2.props.disabled) {
      _this2.__triggerPropsFn("onSwitchChange", [null].concat([].concat(args)));
    }
  };

  this.$$refs = [];
}, _temp2);


AtListItem.defaultProps = {
  note: '',
  disabled: false,
  title: '',
  thumb: '',
  isSwitch: false,
  hasBorder: true,
  switchColor: '#6190E8',
  switchIsCheck: false,
  extraText: '',
  extraThumb: '',
  iconInfo: {},
  onSwitchChange: function onSwitchChange() {},
  onClick: function onClick() {}
};

AtListItem.propTypes = {
  note: _index4.default.string,
  disabled: _index4.default.bool,
  title: _index4.default.string,
  thumb: _index4.default.string,
  onClick: _index4.default.func,
  isSwitch: _index4.default.bool,
  hasBorder: _index4.default.bool,
  switchColor: _index4.default.string,
  switchIsCheck: _index4.default.bool,
  extraText: _index4.default.string,
  extraThumb: _index4.default.string,
  onSwitchChange: _index4.default.func,
  arrow: _index4.default.oneOf(['up', 'down', 'right']),
  iconInfo: _index4.default.shape({
    size: _index4.default.number,
    value: _index4.default.string,
    color: _index4.default.string,
    prefixClass: _index4.default.string,
    customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
    className: _index4.default.oneOfType([_index4.default.array, _index4.default.string])
  })
};
exports.default = AtListItem;

Component(require('../../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtListItem));