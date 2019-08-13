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

var _utils = require("../../common/utils.js");

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _utils.initTestEnv)();

var AtSegmentedControl = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtSegmentedControl, _AtComponent);

  function AtSegmentedControl() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtSegmentedControl);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtSegmentedControl.__proto__ || Object.getPrototypeOf(AtSegmentedControl)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray0", "rootCls", "values", "disable", "__fn_onClick", "customStyle", "className", "disabled", "selectedColor", "current", "color", "fontSize"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtSegmentedControl, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtSegmentedControl.prototype.__proto__ || Object.getPrototypeOf(AtSegmentedControl.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      if (this.props.disable) {
        return;
      }this.__triggerPropsFn("onClick", [null].concat([].concat(Array.prototype.slice.call(arguments))));
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
          disabled = _props.disabled,
          values = _props.values,
          selectedColor = _props.selectedColor,
          current = _props.current,
          color = _props.color,
          fontSize = _props.fontSize;


      var rootStyle = {
        borderColor: selectedColor
      };
      var itemStyle = {
        color: selectedColor,
        fontSize: (0, _utils.pxTransform)(fontSize),
        borderColor: selectedColor,
        backgroundColor: color
      };
      var selectedItemStyle = {
        color: color,
        fontSize: (0, _utils.pxTransform)(fontSize),
        borderColor: selectedColor,
        backgroundColor: selectedColor
      };
      var rootCls = (0, _index6.default)('at-segmented-control', {
        'at-segmented-control--disabled': disabled
      }, className);

      var anonymousState__temp = (0, _index.internal_inline_style)(this.mergeStyle(rootStyle, customStyle));
      var loopArray0 = values.map(function (value, i) {
        value = {
          $original: (0, _index.internal_get_original)(value)
        };
        var $loopState__temp3 = (0, _index6.default)('at-segmented-control__item', {
          'at-segmented-control__item--active': current === i
        });
        var $loopState__temp5 = (0, _index.internal_inline_style)(current === i ? selectedItemStyle : itemStyle);
        return {
          $loopState__temp3: $loopState__temp3,
          $loopState__temp5: $loopState__temp5,
          $original: value.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        loopArray0: loopArray0,
        rootCls: rootCls,
        values: values
      });
      return this.__state;
    }
  }]);

  return AtSegmentedControl;
}(_component2.default), _class.properties = {
  "disable": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
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
  "disabled": {
    "type": null,
    "value": null
  },
  "values": {
    "type": null,
    "value": null
  },
  "selectedColor": {
    "type": null,
    "value": null
  },
  "current": {
    "type": null,
    "value": null
  },
  "color": {
    "type": null,
    "value": null
  },
  "fontSize": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClick"], _temp2);


AtSegmentedControl.defaultProps = {
  customStyle: '',
  className: '',
  current: 0,
  color: '',
  fontSize: 0,
  disabled: false,
  selectedColor: '',
  values: [],
  onClick: function onClick() {}
};

AtSegmentedControl.propTypes = {
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  className: _index4.default.oneOfType([_index4.default.array, _index4.default.string]),
  current: _index4.default.number,
  color: _index4.default.string,
  fontSize: _index4.default.oneOfType([_index4.default.string, _index4.default.number]),
  disabled: _index4.default.bool,
  values: _index4.default.array,
  onClick: _index4.default.func
};
exports.default = AtSegmentedControl;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtSegmentedControl));