"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../../prop-types/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../@tarojs/taro-weapp/index.js");

var _index4 = _interopRequireDefault(_index3);

var _isNaN = require("../../../../../lodash/isNaN.js");

var _isNaN2 = _interopRequireDefault(_isNaN);

var _index5 = require("../../../../../classnames/index.js");

var _index6 = _interopRequireDefault(_index5);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtBadge = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtBadge, _AtComponent);

  function AtBadge() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtBadge);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtBadge.__proto__ || Object.getPrototypeOf(AtBadge)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "dot", "val", "value", "maxValue", "customStyle", "className", "children"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtBadge, [{
    key: "_constructor",
    value: function _constructor() {
      _get(AtBadge.prototype.__proto__ || Object.getPrototypeOf(AtBadge.prototype), "_constructor", this).apply(this, arguments);
      this.state = {};
    }
  }, {
    key: "formatValue",
    value: function formatValue(value, maxValue) {
      if (value === '' || value === null) {
        return '';
      }var numValue = +value;
      if ((0, _isNaN2.default)(numValue)) {
        return value;
      }
      return numValue > maxValue ? maxValue + "+" : numValue;
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          dot = _props.dot,
          value = _props.value,
          maxValue = _props.maxValue,
          customStyle = _props.customStyle;

      var rootClassName = ['at-badge'];

      var val = this.formatValue(value, maxValue);

      var anonymousState__temp = (0, _index6.default)(rootClassName, this.__props.className);
      var anonymousState__temp2 = (0, _index3.internal_inline_style)(customStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        dot: dot,
        val: val
      });
      return this.__state;
    }
  }]);

  return AtBadge;
}(_component2.default), _class.properties = {
  "dot": {
    "type": null,
    "value": null
  },
  "value": {
    "type": null,
    "value": null
  },
  "maxValue": {
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
  }
}, _class.$$events = [], _temp2);


AtBadge.defaultProps = {
  dot: false,
  value: '',
  maxValue: 99,
  customStyle: {},
  className: ''
};

AtBadge.propTypes = {
  dot: _index2.default.bool,
  value: _index2.default.oneOfType([_index2.default.string, _index2.default.number]),
  maxValue: _index2.default.number,
  customStyle: _index2.default.oneOfType([_index2.default.object, _index2.default.string]),
  className: _index2.default.oneOfType([_index2.default.array, _index2.default.string])
};
exports.default = AtBadge;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtBadge));