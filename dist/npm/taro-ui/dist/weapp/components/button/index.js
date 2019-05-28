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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SIZE_CLASS = {
  normal: 'normal',
  small: 'small'
};

var TYPE_CLASS = {
  primary: 'primary',
  secondary: 'secondary'
};

var AtButton = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtButton, _AtComponent);

  function AtButton() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtButton.__proto__ || Object.getPrototypeOf(AtButton)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "loading", "loadingColor", "loadingSize", "formType", "openType", "lang", "sessionFrom", "sendMessageTitle", "sendMessagePath", "sendMessageImg", "showMessageCard", "appParameter", "isWEAPP", "disabled", "isALIPAY", "isWEB", "size", "type", "circle", "full", "customStyle", "className", "children"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtButton, [{
    key: "_constructor",
    value: function _constructor() {
      _get(AtButton.prototype.__proto__ || Object.getPrototypeOf(AtButton.prototype), "_constructor", this).apply(this, arguments);
      this.state = {
        isWEB: _index2.default.getEnv() === _index2.default.ENV_TYPE.WEB,
        isWEAPP: _index2.default.getEnv() === _index2.default.ENV_TYPE.WEAPP,
        isALIPAY: _index2.default.getEnv() === _index2.default.ENV_TYPE.ALIPAY
      };
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (!this.props.disabled) {
        this.props.onClick && this.__triggerPropsFn("onClick", [null].concat([].concat(Array.prototype.slice.call(arguments))));
      }
    }
  }, {
    key: "onGetUserInfo",
    value: function onGetUserInfo() {
      this.props.onGetUserInfo && this.__triggerPropsFn("onGetUserInfo", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "onContact",
    value: function onContact() {
      this.props.onContact && this.__triggerPropsFn("onContact", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "onGetPhoneNumber",
    value: function onGetPhoneNumber() {
      this.props.onGetPhoneNumber && this.__triggerPropsFn("onGetPhoneNumber", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "onError",
    value: function onError() {
      this.props.onError && this.__triggerPropsFn("onError", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "onOpenSetting",
    value: function onOpenSetting() {
      this.props.onOpenSetting && this.__triggerPropsFn("onOpenSetting", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "onSumit",
    value: function onSumit() {
      if (this.state.isWEAPP) {
        this.$scope.triggerEvent('submit', arguments[0].detail, {
          bubbles: true,
          composed: true
        });
      }
    }
  }, {
    key: "onReset",
    value: function onReset() {
      if (this.state.isWEAPP) {
        this.$scope.triggerEvent('reset', arguments[0].detail, {
          bubbles: true,
          composed: true
        });
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _classObject;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _props = this.__props,
          _props$size = _props.size,
          size = _props$size === undefined ? 'normal' : _props$size,
          _props$type = _props.type,
          type = _props$type === undefined ? '' : _props$type,
          circle = _props.circle,
          full = _props.full,
          loading = _props.loading,
          disabled = _props.disabled,
          customStyle = _props.customStyle,
          formType = _props.formType,
          openType = _props.openType,
          lang = _props.lang,
          sessionFrom = _props.sessionFrom,
          sendMessageTitle = _props.sendMessageTitle,
          sendMessagePath = _props.sendMessagePath,
          sendMessageImg = _props.sendMessageImg,
          showMessageCard = _props.showMessageCard,
          appParameter = _props.appParameter;
      var _state = this.__state,
          isWEAPP = _state.isWEAPP,
          isALIPAY = _state.isALIPAY;

      var rootClassName = ['at-button'];
      var classObject = (_classObject = {}, _defineProperty(_classObject, "at-button--" + SIZE_CLASS[size], SIZE_CLASS[size]), _defineProperty(_classObject, 'at-button--disabled', disabled), _defineProperty(_classObject, "at-button--" + type, TYPE_CLASS[type]), _defineProperty(_classObject, 'at-button--circle', circle), _defineProperty(_classObject, 'at-button--full', full), _classObject);
      var loadingColor = type === 'primary' ? '#fff' : '';
      var loadingSize = size === 'small' ? '30' : 0;
      var component = void 0;
      if (loading) {
        rootClassName.push('at-button--icon');
      }
      var anonymousState__temp = (0, _index6.default)(rootClassName, classObject, this.__props.className);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(customStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        loading: loading,
        loadingColor: loadingColor,
        loadingSize: loadingSize,
        formType: formType,
        openType: openType,
        lang: lang,
        sessionFrom: sessionFrom,
        sendMessageTitle: sendMessageTitle,
        sendMessagePath: sendMessagePath,
        sendMessageImg: sendMessageImg,
        showMessageCard: showMessageCard,
        appParameter: appParameter,
        disabled: disabled
      });
      return this.__state;
    }
  }]);

  return AtButton;
}(_component2.default), _class.properties = {
  "disabled": {
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
  },
  "onGetUserInfo": {
    "type": null,
    "value": null
  },
  "__fn_onGetUserInfo": {
    "type": null,
    "value": null
  },
  "onContact": {
    "type": null,
    "value": null
  },
  "__fn_onContact": {
    "type": null,
    "value": null
  },
  "onGetPhoneNumber": {
    "type": null,
    "value": null
  },
  "__fn_onGetPhoneNumber": {
    "type": null,
    "value": null
  },
  "onError": {
    "type": null,
    "value": null
  },
  "__fn_onError": {
    "type": null,
    "value": null
  },
  "onOpenSetting": {
    "type": null,
    "value": null
  },
  "__fn_onOpenSetting": {
    "type": null,
    "value": null
  },
  "size": {
    "type": null,
    "value": null
  },
  "type": {
    "type": null,
    "value": null
  },
  "circle": {
    "type": null,
    "value": null
  },
  "full": {
    "type": null,
    "value": null
  },
  "loading": {
    "type": null,
    "value": null
  },
  "customStyle": {
    "type": null,
    "value": null
  },
  "formType": {
    "type": null,
    "value": null
  },
  "openType": {
    "type": null,
    "value": null
  },
  "lang": {
    "type": null,
    "value": null
  },
  "sessionFrom": {
    "type": null,
    "value": null
  },
  "sendMessageTitle": {
    "type": null,
    "value": null
  },
  "sendMessagePath": {
    "type": null,
    "value": null
  },
  "sendMessageImg": {
    "type": null,
    "value": null
  },
  "showMessageCard": {
    "type": null,
    "value": null
  },
  "appParameter": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["onGetUserInfo", "onGetPhoneNumber", "onOpenSetting", "onError", "onContact", "onClick", "onSumit", "onReset"], _temp2);


AtButton.defaultProps = {
  size: 'normal',
  type: '',
  circle: false,
  full: false,
  loading: false,
  disabled: false,
  customStyle: {},
  onClick: function onClick() {},
  // Button props
  formType: '',
  openType: '',
  lang: 'en',
  sessionFrom: '',
  sendMessageTitle: '',
  sendMessagePath: '',
  sendMessageImg: '',
  showMessageCard: false,
  appParameter: '',
  onGetUserInfo: function onGetUserInfo() {},
  onContact: function onContact() {},
  onGetPhoneNumber: function onGetPhoneNumber() {},
  onError: function onError() {},
  onOpenSetting: function onOpenSetting() {}
};

AtButton.propTypes = {
  size: _index4.default.oneOf(['normal', 'small']),
  type: _index4.default.oneOf(['primary', 'secondary', '']),
  circle: _index4.default.bool,
  full: _index4.default.bool,
  loading: _index4.default.bool,
  disabled: _index4.default.bool,
  onClick: _index4.default.func,
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  formType: _index4.default.oneOf(['submit', 'reset', '']),
  openType: _index4.default.oneOf(['contact', 'share', 'getUserInfo', 'getPhoneNumber', 'launchApp', 'openSetting', 'feedback', 'getRealnameAuthInfo', '']),
  lang: _index4.default.string,
  sessionFrom: _index4.default.string,
  sendMessageTitle: _index4.default.string,
  sendMessagePath: _index4.default.string,
  sendMessageImg: _index4.default.string,
  showMessageCard: _index4.default.bool,
  appParameter: _index4.default.string,
  onGetUserInfo: _index4.default.func,
  onContact: _index4.default.func,
  onGetPhoneNumber: _index4.default.func,
  onError: _index4.default.func,
  onOpenSetting: _index4.default.func
};
exports.default = AtButton;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtButton));