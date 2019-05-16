"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../../@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../classnames/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../../../../prop-types/index.js");

var _index6 = _interopRequireDefault(_index5);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtSearchBar = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtSearchBar, _AtComponent);

  function AtSearchBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtSearchBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtSearchBar.__proto__ || Object.getPrototypeOf(AtSearchBar)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "anonymousState__temp5", "rootCls", "value", "focus", "disabled", "maxLength", "placeholder", "actionName", "isFocus", "__fn_onFocus", "__fn_onBlur", "__fn_onChange", "__fn_onConfirm", "__fn_onActionClick", "fixed", "showActionButton", "className", "customStyle"], _this.handleFocus = function () {
      for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        arg[_key2] = arguments[_key2];
      }

      _this.setState({
        isFocus: true
      });
      _this.__triggerPropsFn("onFocus", [null].concat([].concat(arg)));
    }, _this.handleBlur = function () {
      for (var _len3 = arguments.length, arg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        arg[_key3] = arguments[_key3];
      }

      _this.setState({
        isFocus: false
      });
      _this.__triggerPropsFn("onBlur", [null].concat([].concat(arg)));
    }, _this.handleChange = function (e) {
      for (var _len4 = arguments.length, arg = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        arg[_key4 - 1] = arguments[_key4];
      }

      return _this.__triggerPropsFn("onChange", [null].concat([e.target.value].concat(arg)));
    }, _this.handleClear = function () {
      for (var _len5 = arguments.length, arg = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        arg[_key5] = arguments[_key5];
      }

      return _this.__triggerPropsFn("onChange", [null].concat([''].concat(arg)));
    }, _this.handleConfirm = function () {
      for (var _len6 = arguments.length, arg = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        arg[_key6] = arguments[_key6];
      }

      return _this.__triggerPropsFn("onConfirm", [null].concat([].concat(arg)));
    }, _this.handleActionClick = function () {
      for (var _len7 = arguments.length, arg = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        arg[_key7] = arguments[_key7];
      }

      return _this.__triggerPropsFn("onActionClick", [null].concat([].concat(arg)));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtSearchBar, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtSearchBar.prototype.__proto__ || Object.getPrototypeOf(AtSearchBar.prototype), "_constructor", this).apply(this, arguments);
      this.state = {
        isFocus: props.focus
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
          value = _props.value,
          placeholder = _props.placeholder,
          maxLength = _props.maxLength,
          fixed = _props.fixed,
          focus = _props.focus,
          disabled = _props.disabled,
          showActionButton = _props.showActionButton,
          actionName = _props.actionName,
          className = _props.className,
          customStyle = _props.customStyle;
      var isFocus = this.__state.isFocus;

      var fontSize = 14;
      var rootCls = (0, _index4.default)('at-search-bar', {
        'at-search-bar--fixed': fixed
      }, className);
      var placeholderWrapStyle = {};
      var actionStyle = {};
      if (isFocus || !isFocus && value) {
        placeholderWrapStyle.width = (placeholder.length + 2.5) * fontSize + "px";
        actionStyle.opacity = 1;
        actionStyle.marginRight = "0";
      } else if (!isFocus && !value) {
        placeholderWrapStyle.width = '100%';
        actionStyle.opacity = 0;
        actionStyle.marginRight = "-" + ((actionName.length + 1) * fontSize + 7) + "px";
      }
      if (showActionButton) {
        actionStyle.opacity = 1;
        actionStyle.marginRight = "0";
      }

      var clearIconStyle = { display: 'flex' };
      var placeholderStyle = { visibility: 'hidden' };
      if (!value.length) {
        clearIconStyle.display = 'none';
        placeholderStyle.visibility = 'visible';
      }

      var anonymousState__temp = (0, _index.internal_inline_style)(customStyle);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(placeholderWrapStyle);
      var anonymousState__temp3 = (0, _index.internal_inline_style)(placeholderStyle);
      var anonymousState__temp4 = (0, _index.internal_inline_style)(clearIconStyle);
      var anonymousState__temp5 = (0, _index.internal_inline_style)(actionStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        rootCls: rootCls,
        value: value,
        focus: focus,
        disabled: disabled,
        maxLength: maxLength,
        placeholder: placeholder,
        actionName: actionName
      });
      return this.__state;
    }
  }]);

  return AtSearchBar;
}(_component2.default), _class.properties = {
  "__fn_onFocus": {
    "type": null,
    "value": null
  },
  "__fn_onBlur": {
    "type": null,
    "value": null
  },
  "__fn_onChange": {
    "type": null,
    "value": null
  },
  "__fn_onConfirm": {
    "type": null,
    "value": null
  },
  "__fn_onActionClick": {
    "type": null,
    "value": null
  },
  "value": {
    "type": null,
    "value": null
  },
  "placeholder": {
    "type": null,
    "value": null
  },
  "maxLength": {
    "type": null,
    "value": null
  },
  "fixed": {
    "type": null,
    "value": null
  },
  "focus": {
    "type": null,
    "value": null
  },
  "disabled": {
    "type": null,
    "value": null
  },
  "showActionButton": {
    "type": null,
    "value": null
  },
  "actionName": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  },
  "customStyle": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleChange", "handleFocus", "handleBlur", "handleConfirm", "handleClear", "handleActionClick"], _temp2);


AtSearchBar.defaultProps = {
  value: '',
  placeholder: '搜索',
  maxLength: 140,
  fixed: false,
  focus: false,
  disabled: false,
  showActionButton: false,
  actionName: '搜索',
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  onConfirm: function onConfirm() {},
  onActionClick: function onActionClick() {}
};

AtSearchBar.propTypes = {
  value: _index6.default.string,
  placeholder: _index6.default.string,
  maxLength: _index6.default.number,
  fixed: _index6.default.bool,
  focus: _index6.default.bool,
  disabled: _index6.default.bool,
  showActionButton: _index6.default.bool,
  actionName: _index6.default.string,
  onChange: _index6.default.func,
  onFocus: _index6.default.func,
  onBlur: _index6.default.func,
  onConfirm: _index6.default.func,
  onActionClick: _index6.default.func
};

exports.default = AtSearchBar;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtSearchBar));