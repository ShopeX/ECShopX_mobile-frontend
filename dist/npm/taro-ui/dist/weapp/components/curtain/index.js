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

var AtCurtain = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtCurtain, _AtComponent);

  function AtCurtain() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtCurtain);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtCurtain.__proto__ || Object.getPrototypeOf(AtCurtain)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "curtainClass", "btnCloseClass", "__fn_onClose", "className", "customStyle", "isOpened", "closeBtnPosition", "children"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtCurtain, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtCurtain.prototype.__proto__ || Object.getPrototypeOf(AtCurtain.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "onClose",
    value: function onClose(e) {
      e.stopPropagation();
      this.__triggerPropsFn("onClose", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "_stopPropagation",
    value: function _stopPropagation(e) {
      e.stopPropagation();
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          className = _props.className,
          customStyle = _props.customStyle,
          isOpened = _props.isOpened,
          closeBtnPosition = _props.closeBtnPosition;


      var curtainClass = (0, _index6.default)({
        'at-curtain': true,
        'at-curtain--closed': !isOpened
      }, className);
      var btnCloseClass = (0, _index6.default)(_defineProperty({
        'at-curtain__btn-close': true
      }, "at-curtain__btn-close--" + closeBtnPosition, closeBtnPosition));

      var anonymousState__temp = (0, _index.internal_inline_style)(customStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        curtainClass: curtainClass,
        btnCloseClass: btnCloseClass
      });
      return this.__state;
    }
  }]);

  return AtCurtain;
}(_component2.default), _class.properties = {
  "__fn_onClose": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  },
  "customStyle": {
    "type": null,
    "value": null
  },
  "isOpened": {
    "type": null,
    "value": null
  },
  "closeBtnPosition": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["_stopPropagation", "onClose"], _temp2);


AtCurtain.defaultProps = {
  customStyle: '',
  className: '',
  isOpened: false,
  closeBtnPosition: 'bottom',
  onClose: function onClose() {}
};

AtCurtain.propTypes = {
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  className: _index4.default.oneOfType([_index4.default.array, _index4.default.string]),
  isOpened: _index4.default.bool,
  closeBtnPosition: _index4.default.string,
  onClose: _index4.default.func
};
exports.default = AtCurtain;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtCurtain));