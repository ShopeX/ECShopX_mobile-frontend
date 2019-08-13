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

var AtProgress = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtProgress, _AtComponent);

  function AtProgress() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtProgress);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtProgress.__proto__ || Object.getPrototypeOf(AtProgress)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "rootClass", "isHidePercent", "status", "iconClass", "percent", "color", "strokeWidth", "className"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtProgress, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtProgress.prototype.__proto__ || Object.getPrototypeOf(AtProgress.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var color = this.__props.color;
      var percent = this.__props.percent;
      var _props = this.__props,
          strokeWidth = _props.strokeWidth,
          status = _props.status,
          isHidePercent = _props.isHidePercent;


      if (percent < 0) {
        percent = 0;
      } else if (percent > 100) {
        percent = 100;
      }

      var rootClass = (0, _index6.default)('at-progress', _defineProperty({}, "at-progress--" + status, !!status), this.__props.className);
      var iconClass = (0, _index6.default)('at-icon', {
        'at-icon-close-circle': status === 'error',
        'at-icon-check-circle': status === 'success'
      });

      var progressStyle = {
        width: percent && +percent + "%",
        height: strokeWidth && +strokeWidth + "px",
        backgroundColor: color
      };

      var anonymousState__temp = (0, _index.internal_inline_style)(progressStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        rootClass: rootClass,
        isHidePercent: isHidePercent,
        status: status,
        iconClass: iconClass,
        percent: percent
      });
      return this.__state;
    }
  }]);

  return AtProgress;
}(_component2.default), _class.properties = {
  "color": {
    "type": null,
    "value": null
  },
  "percent": {
    "type": null,
    "value": null
  },
  "strokeWidth": {
    "type": null,
    "value": null
  },
  "status": {
    "type": null,
    "value": null
  },
  "isHidePercent": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  }
}, _class.$$events = [], _temp2);


AtProgress.propTypes = {
  color: _index4.default.string,
  status: _index4.default.string,
  percent: _index4.default.number,
  strokeWidth: _index4.default.number,
  isHidePercent: _index4.default.bool
};
exports.default = AtProgress;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtProgress));