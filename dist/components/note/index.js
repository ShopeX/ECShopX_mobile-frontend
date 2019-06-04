"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var NoteIndex = (_temp2 = _class = function (_BaseComponent) {
  _inherits(NoteIndex, _BaseComponent);

  function NoteIndex() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, NoteIndex);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NoteIndex.__proto__ || Object.getPrototypeOf(NoteIndex)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "img", "imgStyle", "styles", "className", "children"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(NoteIndex, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(NoteIndex.prototype.__proto__ || Object.getPrototypeOf(NoteIndex.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "resolveUrl",
    value: function resolveUrl(img) {
      return "/assets/imgs/" + img;
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          img = _props.img,
          imgStyle = _props.imgStyle,
          styles = _props.styles,
          className = _props.className;


      var anonymousState__temp = (0, _index3.classNames)('note', img ? 'note__has-img' : null, className);
      var anonymousState__temp2 = (0, _index.internal_inline_style)((0, _index3.styleNames)(styles));
      var anonymousState__temp3 = img ? (0, _index.internal_inline_style)((0, _index3.styleNames)(imgStyle)) : null;
      var anonymousState__temp4 = img ? this.resolveUrl(img) : null;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        img: img
      });
      return this.__state;
    }
  }]);

  return NoteIndex;
}(_index.Component), _class.properties = {
  "img": {
    "type": null,
    "value": null
  },
  "imgStyle": {
    "type": null,
    "value": null
  },
  "styles": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  }
}, _class.$$events = [], _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = NoteIndex;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(NoteIndex));