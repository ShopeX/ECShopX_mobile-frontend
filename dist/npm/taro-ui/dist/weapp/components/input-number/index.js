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

var _toString2 = require("../../../../../lodash/toString.js");

var _toString3 = _interopRequireDefault(_toString2);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

var _utils = require("../../common/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 实现两数相加并保留小数点后最短尾数
function addNum(num1, num2) {
  var sq1 = void 0,
      sq2 = void 0;
  try {
    sq1 = (0, _toString3.default)(num1).split('.')[1].length;
  } catch (e) {
    sq1 = 0;
  }
  try {
    sq2 = (0, _toString3.default)(num2).split('.')[1].length;
  } catch (e) {
    sq2 = 0;
  }
  var m = Math.pow(10, Math.max(sq1, sq2));
  return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
}

// 格式化数字，处理01变成1,并且不处理1. 这种情况
function parseValue(num) {
  if (num === '') {
    return '0';
  }var numStr = (0, _toString3.default)(num);
  if (numStr.indexOf('0') === 0 && numStr.indexOf('.') === -1) {
    // 处理01变成1,并且不处理1.
    return (0, _toString3.default)(parseFloat(num));
  }
  return (0, _toString3.default)(num);
}

(0, _utils.initTestEnv)();

var AtInputNumber = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtInputNumber, _AtComponent);

  function AtInputNumber() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtInputNumber);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtInputNumber.__proto__ || Object.getPrototypeOf(AtInputNumber)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "rootCls", "minusBtnCls", "type", "inputValue", "disabled", "plusBtnCls", "value", "min", "max", "step", "__fn_onChange", "__fn_onBlur", "customStyle", "className", "width", "size"], _this.handleValue = function (value) {
      var _this$props = _this.props,
          max = _this$props.max,
          min = _this$props.min;

      var resultValue = value === '' ? min : value;
      // 此处不能使用 Math.max，会是字符串变数字，并丢失 .
      if (resultValue > max) {
        resultValue = max;
        _this.handleError({
          type: 'OVER',
          errorValue: resultValue
        });
      }
      if (resultValue < min) {
        resultValue = min;
        _this.handleError({
          type: 'LOW',
          errorValue: resultValue
        });
      }
      resultValue = parseValue(resultValue);
      return resultValue;
    }, _this.handleInput = function (e) {
      for (var _len2 = arguments.length, arg = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        arg[_key2 - 1] = arguments[_key2];
      }

      var value = e.target.value;
      var disabled = _this.props.disabled;

      if (disabled) {
        return;
      }var newValue = _this.handleValue(value);
      _this.__triggerPropsFn("onChange", [null].concat([newValue, e].concat(arg)));
      return newValue;
    }, _this.handleBlur = function () {
      for (var _len3 = arguments.length, arg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        arg[_key3] = arguments[_key3];
      }

      return _this.__triggerPropsFn("onBlur", [null].concat([].concat(arg)));
    }, _this.handleError = function (errorValue) {
      if (!_this.props.onErrorInput) {
        return;
      }
      _this.__triggerPropsFn("onErrorInput", [null].concat([errorValue]));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtInputNumber, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtInputNumber.prototype.__proto__ || Object.getPrototypeOf(AtInputNumber.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "handleClick",
    value: function handleClick(clickType) {
      var _props = this.props,
          disabled = _props.disabled,
          value = _props.value,
          min = _props.min,
          max = _props.max,
          step = _props.step;

      var lowThanMin = clickType === 'minus' && value <= min;
      var overThanMax = clickType === 'plus' && value >= max;
      if (lowThanMin || overThanMax || disabled) {
        var _deltaValue = clickType === 'minus' ? -step : step;
        var errorValue = addNum(value, _deltaValue);
        if (disabled) {
          this.handleError({
            type: 'DISABLED',
            errorValue: errorValue
          });
        } else {
          this.handleError({
            type: lowThanMin ? 'LOW' : 'OVER',
            errorValue: errorValue
          });
        }
        return;
      }
      var deltaValue = clickType === 'minus' ? -step : step;
      var newValue = addNum(value, deltaValue);
      newValue = this.handleValue(newValue);
      this.__triggerPropsFn("onChange", [null].concat([newValue]));
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props2 = this.__props,
          customStyle = _props2.customStyle,
          className = _props2.className,
          width = _props2.width,
          disabled = _props2.disabled,
          value = _props2.value,
          type = _props2.type,
          min = _props2.min,
          max = _props2.max,
          size = _props2.size;


      var inputStyle = {
        width: width ? "" + _index2.default.pxTransform(width) : ''
      };
      var inputValue = this.handleValue(value);
      var rootCls = (0, _index6.default)('at-input-number', {
        'at-input-number--lg': size
      }, className);
      var minusBtnCls = (0, _index6.default)('at-input-number__btn', {
        'at-input-number--disabled': inputValue <= min || disabled
      });
      var plusBtnCls = (0, _index6.default)('at-input-number__btn', {
        'at-input-number--disabled': inputValue >= max || disabled
      });

      var anonymousState__temp = (0, _index.internal_inline_style)(customStyle);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(inputStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        rootCls: rootCls,
        minusBtnCls: minusBtnCls,
        type: type,
        inputValue: inputValue,
        disabled: disabled,
        plusBtnCls: plusBtnCls
      });
      return this.__state;
    }
  }]);

  return AtInputNumber;
}(_component2.default), _class.properties = {
  "disabled": {
    "type": null,
    "value": null
  },
  "value": {
    "type": null,
    "value": null
  },
  "min": {
    "type": null,
    "value": null
  },
  "max": {
    "type": null,
    "value": null
  },
  "step": {
    "type": null,
    "value": null
  },
  "__fn_onChange": {
    "type": null,
    "value": null
  },
  "__fn_onBlur": {
    "type": null,
    "value": null
  },
  "onErrorInput": {
    "type": null,
    "value": null
  },
  "__fn_onErrorInput": {
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
  "width": {
    "type": null,
    "value": null
  },
  "type": {
    "type": null,
    "value": null
  },
  "size": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClick", "handleInput", "handleBlur"], _temp2);


AtInputNumber.defaultProps = {
  customStyle: '',
  className: '',
  disabled: false,
  value: 1,
  type: 'number',
  width: 0,
  min: 0,
  max: 100,
  step: 1,
  size: '',
  onChange: function onChange() {},
  onBlur: function onBlur() {}
};

AtInputNumber.propTypes = {
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  className: _index4.default.oneOfType([_index4.default.array, _index4.default.string]),
  value: _index4.default.oneOfType([_index4.default.number, _index4.default.string]),
  type: _index4.default.oneOf(['number', 'digit']),
  disabled: _index4.default.bool,
  width: _index4.default.number,
  min: _index4.default.number,
  max: _index4.default.number,
  step: _index4.default.number,
  size: _index4.default.string,
  onChange: _index4.default.func,
  onBlur: _index4.default.func,
  onErrorInput: _index4.default.func
};

exports.default = AtInputNumber;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtInputNumber));