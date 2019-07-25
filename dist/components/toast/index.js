"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function resolveState() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var ret = _extends({}, props, state);

  return ret;
}

var SpToast = (_temp2 = _class = function (_BaseComponent) {
  _inherits(SpToast, _BaseComponent);

  function SpToast() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SpToast);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SpToast.__proto__ || Object.getPrototypeOf(SpToast)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["icon", "image", "status", "duration", "hasMask", "showToast", "newText", "text", "__fn_on"], _this.handleShow = function (text) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof text === 'string') {
        config = _extends({}, config, {
          text: text
        });
      } else if ((0, _index3.isObject)(text)) {
        config = _extends({}, config, text);
      }

      _this.setState(_extends({
        showToast: true
      }, config));
    }, _this.handleClose = function () {
      _this.setState({
        showToast: false
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SpToast, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(SpToast.prototype.__proto__ || Object.getPrototypeOf(SpToast.prototype), "_constructor", this).call(this, props);

      this.state = {
        showToast: false,
        text: ''
      };

      _index2.default.eventCenter.on('sp-toast:show', this.handleShow);
      _index2.default.eventCenter.on('sp-toast:close', this.handleClose);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _index2.default.eventCenter.off('sp-toast:show', this.handleShow);
      _index2.default.eventCenter.off('sp-toast:close', this.handleClose);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          showToast = _state.showToast,
          text = _state.text;

      var newText = '';
      if (text.length > 11) {
        newText = text.substring(0, 11) + '\n' + text.substring(11);
      } else {
        newText = text;
      }

      var _resolveState = resolveState(this.__props, this.__state),
          icon = _resolveState.icon,
          image = _resolveState.image,
          status = _resolveState.status,
          duration = _resolveState.duration,
          hasMask = _resolveState.hasMask;

      Object.assign(this.__state, {
        icon: icon,
        image: image,
        status: status,
        duration: duration,
        hasMask: hasMask,
        newText: newText
      });
      return this.__state;
    }
  }]);

  return SpToast;
}(_index.Component), _class.properties = {
  "__fn_on": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClose"], _temp2);
exports.default = SpToast;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(SpToast));