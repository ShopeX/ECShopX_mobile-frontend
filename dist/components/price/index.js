"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var Price = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Price, _BaseComponent);

  function Price() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Price);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Price.__proto__ || Object.getPrototypeOf(Price)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "minus", "noSymbol", "decimal", "undefined", "noDecimal", "appendText", "symbol", "value", "primary", "className", "unit"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Price, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Price.prototype.__proto__ || Object.getPrototypeOf(Price.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _props = this.__props,
          _props$value = _props.value,
          value = _props$value === undefined ? '' : _props$value,
          noSymbol = _props.noSymbol,
          primary = _props.primary,
          noDecimal = _props.noDecimal,
          className = _props.className,
          unit = _props.unit,
          appendText = _props.appendText;

      var priceVal = unit === 'cent' ? +value / 100 : value;
      if ((0, _index3.isNumber)(priceVal)) {
        priceVal = priceVal.toFixed(2);
      }

      var _split = (priceVal || '').split('.'),
          _split2 = _slicedToArray(_split, 2),
          int = _split2[0],
          decimal = _split2[1];

      var minus = value < 0;
      var symbol = this.__props.symbol || '¥';

      var anonymousState__temp = (0, _index3.classNames)('price', 'classes', primary ? 'price__primary' : null, className);
      var anonymousState__temp2 = int.indexOf('-') === 0 ? int.slice(1) : int;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        minus: minus,
        noSymbol: noSymbol,
        decimal: decimal,
        undefined: undefined,
        noDecimal: noDecimal,
        appendText: appendText,
        symbol: symbol
      });
      return this.__state;
    }
  }]);

  return Price;
}(_index.Component), _class.properties = {
  "value": {
    "type": null,
    "value": null
  },
  "noSymbol": {
    "type": null,
    "value": null
  },
  "primary": {
    "type": null,
    "value": null
  },
  "noDecimal": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  },
  "unit": {
    "type": null,
    "value": null
  },
  "appendText": {
    "type": null,
    "value": null
  },
  "symbol": {
    "type": null,
    "value": null
  }
}, _class.$$events = [], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  className: null,
  value: null,
  primary: false,
  noSymbol: false,
  noDecimal: false,
  unit: 'default',
  appendText: ''
}, _class.externalClasses = ['classes'], _temp2);
exports.default = Price;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Price));