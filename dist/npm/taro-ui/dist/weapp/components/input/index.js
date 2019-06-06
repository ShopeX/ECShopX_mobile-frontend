"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../../@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../prop-types/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../../../../classnames/index.js");

var _index6 = _interopRequireDefault(_index5);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getInputProps(props) {
  var actualProps = {
    type: props.type,
    maxLength: props.maxLength,
    disabled: props.disabled,
    password: false
  };

  switch (actualProps.type) {
    case 'phone':
      actualProps.type = 'number';
      actualProps.maxLength = 11;
      break;
    case 'password':
      actualProps.password = true;
      break;
    default:
      break;
  }
  if (!props.disabled && !props.editable) {
    actualProps.disabled = true;
  }
  return actualProps;
}

var AtInput = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtInput, _AtComponent);

  function AtInput() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtInput.__proto__ || Object.getPrototypeOf(AtInput)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "rootCls", "containerCls", "overlayCls", "title", "name", "type", "password", "placeholderStyle", "placeholderCls", "placeholder", "cursorSpacing", "maxLength", "autoFocus", "focus", "value", "confirmType", "cursor", "selectionStart", "selectionEnd", "adjustPosition", "clear", "error", "__fn_onChange", "__fn_onFocus", "__fn_onBlur", "__fn_onConfirm", "editable", "__fn_onClick", "__fn_onErrorClick", "className", "customStyle", "border", "placeholderClass", "children"], _this.onInput = function (e) {
      for (var _len2 = arguments.length, arg = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        arg[_key2 - 1] = arguments[_key2];
      }

      return _this.__triggerPropsFn("onChange", [null].concat([e.target.value].concat(arg)));
    }, _this.onFocus = function (e) {
      for (var _len3 = arguments.length, arg = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        arg[_key3 - 1] = arguments[_key3];
      }

      return _this.__triggerPropsFn("onFocus", [null].concat([e.target.value].concat(arg)));
    }, _this.onBlur = function (e) {
      for (var _len4 = arguments.length, arg = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        arg[_key4 - 1] = arguments[_key4];
      }

      return _this.__triggerPropsFn("onBlur", [null].concat([e.target.value].concat(arg)));
    }, _this.onConfirm = function (e) {
      for (var _len5 = arguments.length, arg = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        arg[_key5 - 1] = arguments[_key5];
      }

      return _this.__triggerPropsFn("onConfirm", [null].concat([e.target.value].concat(arg)));
    }, _this.onClick = function () {
      for (var _len6 = arguments.length, arg = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        arg[_key6] = arguments[_key6];
      }

      return !_this.props.editable && _this.__triggerPropsFn("onClick", [null].concat([].concat(arg)));
    }, _this.clearValue = function () {
      for (var _len7 = arguments.length, arg = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        arg[_key7] = arguments[_key7];
      }

      return _this.__triggerPropsFn("onChange", [null].concat([''].concat(arg)));
    }, _this.onErrorClick = function () {
      for (var _len8 = arguments.length, arg = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        arg[_key8] = arguments[_key8];
      }

      return _this.__triggerPropsFn("onErrorClick", [null].concat([].concat(arg)));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtInput, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtInput.prototype.__proto__ || Object.getPrototypeOf(AtInput.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          className = _props.className,
          customStyle = _props.customStyle,
          name = _props.name,
          cursorSpacing = _props.cursorSpacing,
          confirmType = _props.confirmType,
          cursor = _props.cursor,
          selectionStart = _props.selectionStart,
          selectionEnd = _props.selectionEnd,
          adjustPosition = _props.adjustPosition,
          border = _props.border,
          title = _props.title,
          error = _props.error,
          clear = _props.clear,
          placeholder = _props.placeholder,
          placeholderStyle = _props.placeholderStyle,
          placeholderClass = _props.placeholderClass,
          autoFocus = _props.autoFocus,
          focus = _props.focus,
          value = _props.value;

      var _getInputProps = getInputProps(this.__props),
          type = _getInputProps.type,
          maxLength = _getInputProps.maxLength,
          disabled = _getInputProps.disabled,
          password = _getInputProps.password;

      var rootCls = (0, _index6.default)('at-input', {
        'at-input--without-border': !border
      }, className);
      var containerCls = (0, _index6.default)('at-input__container', {
        'at-input--error': error,
        'at-input--disabled': disabled
      });
      var overlayCls = (0, _index6.default)('at-input__overlay', {
        'at-input__overlay--hidden': !disabled
      });
      var placeholderCls = (0, _index6.default)('placeholder', placeholderClass);

      var anonymousState__temp = (0, _index.internal_inline_style)(customStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        rootCls: rootCls,
        containerCls: containerCls,
        overlayCls: overlayCls,
        title: title,
        name: name,
        type: type,
        password: password,
        placeholderStyle: placeholderStyle,
        placeholderCls: placeholderCls,
        placeholder: placeholder,
        cursorSpacing: cursorSpacing,
        maxLength: maxLength,
        autoFocus: autoFocus,
        focus: focus,
        value: value,
        confirmType: confirmType,
        cursor: cursor,
        selectionStart: selectionStart,
        selectionEnd: selectionEnd,
        adjustPosition: adjustPosition,
        clear: clear,
        error: error
      });
      return this.__state;
    }
  }]);

  return AtInput;
}(_component2.default), _class.properties = {
  "__fn_onChange": {
    "type": null,
    "value": null
  },
  "__fn_onFocus": {
    "type": null,
    "value": null
  },
  "__fn_onBlur": {
    "type": null,
    "value": null
  },
  "__fn_onConfirm": {
    "type": null,
    "value": null
  },
  "editable": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "__fn_onErrorClick": {
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
  },
  "name": {
    "type": null,
    "value": null
  },
  "cursorSpacing": {
    "type": null,
    "value": null
  },
  "confirmType": {
    "type": null,
    "value": null
  },
  "cursor": {
    "type": null,
    "value": null
  },
  "selectionStart": {
    "type": null,
    "value": null
  },
  "selectionEnd": {
    "type": null,
    "value": null
  },
  "adjustPosition": {
    "type": null,
    "value": null
  },
  "border": {
    "type": null,
    "value": null
  },
  "title": {
    "type": null,
    "value": null
  },
  "error": {
    "type": null,
    "value": null
  },
  "clear": {
    "type": null,
    "value": null
  },
  "placeholder": {
    "type": null,
    "value": null
  },
  "placeholderStyle": {
    "type": null,
    "value": null
  },
  "placeholderClass": {
    "type": null,
    "value": null
  },
  "autoFocus": {
    "type": null,
    "value": null
  },
  "focus": {
    "type": null,
    "value": null
  },
  "value": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["onClick", "onInput", "onFocus", "onBlur", "onConfirm", "clearValue", "onErrorClick"], _temp2);


AtInput.defaultProps = {
  className: '',
  customStyle: '',
  value: '',
  name: '',
  placeholder: '',
  placeholderStyle: '',
  placeholderClass: '',
  title: '',
  cursorSpacing: 50,
  confirmType: '完成',
  cursor: 0,
  selectionStart: -1,
  selectionEnd: -1,
  adjustPosition: true,
  maxLength: 140,
  type: 'text',
  disabled: false,
  border: true,
  editable: true,
  error: false,
  clear: false,
  autoFocus: false,
  focus: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  onConfirm: function onConfirm() {},
  onErrorClick: function onErrorClick() {},
  onClick: function onClick() {}
};

AtInput.propTypes = {
  className: _index4.default.oneOfType([_index4.default.string, _index4.default.array]),
  customStyle: _index4.default.oneOfType([_index4.default.string, _index4.default.object]),
  value: _index4.default.oneOfType([_index4.default.string, _index4.default.number]),
  name: _index4.default.string,
  placeholder: _index4.default.string,
  placeholderStyle: _index4.default.string,
  placeholderClass: _index4.default.string,
  title: _index4.default.string,
  confirmType: _index4.default.string,
  cursor: _index4.default.oneOfType([_index4.default.string, _index4.default.number]),
  selectionStart: _index4.default.oneOfType([_index4.default.string, _index4.default.number]),
  selectionEnd: _index4.default.oneOfType([_index4.default.string, _index4.default.number]),
  adjustPosition: _index4.default.bool,
  cursorSpacing: _index4.default.oneOfType([_index4.default.string, _index4.default.number]),
  maxLength: _index4.default.oneOfType([_index4.default.string, _index4.default.number]),
  type: _index4.default.string,
  disabled: _index4.default.bool,
  border: _index4.default.bool,
  editable: _index4.default.bool,
  error: _index4.default.bool,
  clear: _index4.default.bool,
  backgroundColor: _index4.default.string,
  autoFocus: _index4.default.bool,
  focus: _index4.default.bool,
  onChange: _index4.default.func,
  onFocus: _index4.default.func,
  onBlur: _index4.default.func,
  onConfirm: _index4.default.func,
  onErrorClick: _index4.default.func,
  onClick: _index4.default.func
};
exports.default = AtInput;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtInput));