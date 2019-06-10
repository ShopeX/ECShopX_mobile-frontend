"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../utils/index.js");

var _helper = require("./helper.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WgtSlider = (_temp2 = _class = function (_BaseComponent) {
  _inherits(WgtSlider, _BaseComponent);

  function WgtSlider() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, WgtSlider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WgtSlider.__proto__ || Object.getPrototypeOf(WgtSlider)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp4", "anonymousState__temp7", "loopArray0", "loopArray1", "info", "base", "config", "curIdx", "data", "curContent"], _this.handleClickItem = _helper.linkPage, _this.handleSwiperChange = function (e) {
      var current = e.detail.current;


      _this.setState({
        curIdx: current
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WgtSlider, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(WgtSlider.prototype.__proto__ || Object.getPrototypeOf(WgtSlider.prototype), "_constructor", this).call(this, props);

      this.state = {
        curIdx: 0
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var info = this.__props.info;
      var curIdx = this.__state.curIdx;


      if (!info) {
        return null;
      }

      var config = info.config,
          base = info.base,
          data = info.data;

      var curContent = (data[curIdx] || {}).content;

      var anonymousState__temp = config ? "height: " + _index2.default.pxTransform(config.height * 2) : null;
      var anonymousState__temp4 = data.length > 1 && config.dot ? config ? (0, _index3.classNames)('slider-dot', { 'dot-size-switch': config.animation }, config.dotLocation, config.dotCover ? 'cover' : 'no-cover', config.dotColor, config.shape) : null : null;
      var anonymousState__temp7 = data.length > 1 && !config.dot ? config ? (0, _index3.classNames)('slider-count', config.dotLocation, config.shape, config.dotColor) : null : null;
      var loopArray0 = config ? data.map(function (item, idx) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp3 = config ? "padding: 0 " + (config.padded ? _index2.default.pxTransform(20) : 0) : null;
        return {
          $loopState__temp3: $loopState__temp3,
          $original: item.$original
        };
      }) : [];
      var loopArray1 = data.length > 1 && config.dot ? data.map(function (dot, dotIdx) {
        dot = {
          $original: (0, _index.internal_get_original)(dot)
        };
        var $loopState__temp6 = data.length > 1 && config.dot ? config ? (0, _index3.classNames)('dot', { active: curIdx === dotIdx }) : null : null;
        return {
          $loopState__temp6: $loopState__temp6,
          $original: dot.$original
        };
      }) : [];
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp7: anonymousState__temp7,
        loopArray0: loopArray0,
        loopArray1: loopArray1,
        info: info,
        base: base,
        config: config,
        data: data,
        curContent: curContent
      });
      return this.__state;
    }
  }]);

  return WgtSlider;
}(_index.Component), _class.properties = {
  "info": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleSwiperChange", "handleClickItem"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  info: null
}, _temp2);
exports.default = WgtSlider;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WgtSlider));