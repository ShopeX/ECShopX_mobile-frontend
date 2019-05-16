"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../../../@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../../prop-types/index.js");

var _index4 = _interopRequireDefault(_index3);

var _component = require("../../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtCountdownItem = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtCountdownItem, _AtComponent);

  function AtCountdownItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtCountdownItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtCountdownItem.__proto__ || Object.getPrototypeOf(AtCountdownItem)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "separator", "num"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtCountdownItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtCountdownItem.prototype.__proto__ || Object.getPrototypeOf(AtCountdownItem.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "formatNum",
    value: function formatNum(num) {
      return num <= 9 ? "0" + num : "" + num;
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          num = _props.num,
          separator = _props.separator;


      var anonymousState__temp = this.formatNum(num);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        separator: separator
      });
      return this.__state;
    }
  }]);

  return AtCountdownItem;
}(_component2.default), _class.properties = {
  "num": {
    "type": null,
    "value": null
  },
  "separator": {
    "type": null,
    "value": null
  }
}, _class.$$events = [], _temp2);


AtCountdownItem.defaultProps = {
  num: 0,
  separator: ':'
};

AtCountdownItem.propTypes = {
  num: _index4.default.number.isRequired,
  separator: _index4.default.string
};

exports.default = AtCountdownItem;

Component(require('../../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtCountdownItem));