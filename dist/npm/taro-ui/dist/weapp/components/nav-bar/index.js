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

var AtNavBar = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtNavBar, _AtComponent);

  function AtNavBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtNavBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtNavBar.__proto__ || Object.getPrototypeOf(AtNavBar)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "anonymousState__temp5", "anonymousState__temp6", "anonymousState__temp7", "leftIconType", "leftIconClass", "rightSecondIconType", "rightSecondIconClass", "rightFirstIconType", "rightFirstIconClass", "leftText", "title", "__fn_onClickLeftIcon", "__fn_onClickRgIconSt", "__fn_onClickRgIconNd", "customStyle", "className", "color", "fixed", "border"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtNavBar, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtNavBar.prototype.__proto__ || Object.getPrototypeOf(AtNavBar.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "handleClickLeftView",
    value: function handleClickLeftView() {
      this.__triggerPropsFn("onClickLeftIcon", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "handleClickSt",
    value: function handleClickSt() {
      this.__triggerPropsFn("onClickRgIconSt", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "handleClickNd",
    value: function handleClickNd() {
      this.__triggerPropsFn("onClickRgIconNd", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          customStyle = _props.customStyle,
          className = _props.className,
          color = _props.color,
          fixed = _props.fixed,
          border = _props.border,
          leftIconType = _props.leftIconType,
          leftText = _props.leftText,
          title = _props.title,
          rightFirstIconType = _props.rightFirstIconType,
          rightSecondIconType = _props.rightSecondIconType;

      var linkStyle = { color: color };

      var leftIconClass = (0, _index6.default)('at-icon', _defineProperty({}, "at-icon-" + leftIconType, leftIconType));
      var rightFirstIconClass = (0, _index6.default)('at-icon', _defineProperty({}, "at-icon-" + rightFirstIconType, rightFirstIconType));
      var rightSecondIconClass = (0, _index6.default)('at-icon', _defineProperty({}, "at-icon-" + rightSecondIconType, rightSecondIconType));

      var anonymousState__temp = (0, _index6.default)({
        'at-nav-bar': true,
        'at-nav-bar--fixed': fixed,
        'at-nav-bar--no-border': !border
      }, className);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(customStyle);
      var anonymousState__temp3 = (0, _index.internal_inline_style)(linkStyle);
      var anonymousState__temp4 = (0, _index6.default)({
        'at-nav-bar__container': true,
        'at-nav-bar__container--hide': !rightSecondIconType
      });
      var anonymousState__temp5 = (0, _index.internal_inline_style)(linkStyle);
      var anonymousState__temp6 = (0, _index6.default)({
        'at-nav-bar__container': true,
        'at-nav-bar__container--hide': !rightFirstIconType
      });
      var anonymousState__temp7 = (0, _index.internal_inline_style)(linkStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        anonymousState__temp6: anonymousState__temp6,
        anonymousState__temp7: anonymousState__temp7,
        leftIconType: leftIconType,
        leftIconClass: leftIconClass,
        rightSecondIconType: rightSecondIconType,
        rightSecondIconClass: rightSecondIconClass,
        rightFirstIconType: rightFirstIconType,
        rightFirstIconClass: rightFirstIconClass,
        leftText: leftText,
        title: title
      });
      return this.__state;
    }
  }]);

  return AtNavBar;
}(_component2.default), _class.properties = {
  "__fn_onClickLeftIcon": {
    "type": null,
    "value": null
  },
  "__fn_onClickRgIconSt": {
    "type": null,
    "value": null
  },
  "__fn_onClickRgIconNd": {
    "type": null,
    "value": null
  },
  "customStyle": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  },
  "color": {
    "type": null,
    "value": null
  },
  "fixed": {
    "type": null,
    "value": null
  },
  "border": {
    "type": null,
    "value": null
  },
  "leftIconType": {
    "type": null,
    "value": null
  },
  "leftText": {
    "type": null,
    "value": null
  },
  "title": {
    "type": null,
    "value": null
  },
  "rightFirstIconType": {
    "type": null,
    "value": null
  },
  "rightSecondIconType": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClickLeftView", "handleClickNd", "handleClickSt"], _temp2);


AtNavBar.defaultProps = {
  customStyle: '',
  className: '',
  fixed: false,
  border: true,
  color: '',
  leftIconType: '',
  leftText: '',
  title: '',
  rightFirstIconType: '',
  rightSecondIconType: '',
  onClickLeftIcon: function onClickLeftIcon() {},
  onClickRgIconSt: function onClickRgIconSt() {},
  onClickRgIconNd: function onClickRgIconNd() {}
};

AtNavBar.propTypes = {
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  className: _index4.default.oneOfType([_index4.default.array, _index4.default.string]),
  fixed: _index4.default.bool,
  border: _index4.default.bool,
  color: _index4.default.string,
  leftIconType: _index4.default.string,
  leftText: _index4.default.string,
  title: _index4.default.string,
  rightFirstIconType: _index4.default.string,
  rightSecondIconType: _index4.default.string,
  onClickLeftIcon: _index4.default.func,
  onClickRgIconSt: _index4.default.func,
  onClickRgIconNd: _index4.default.func
};
exports.default = AtNavBar;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtNavBar));