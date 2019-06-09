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

var IconMenu = (_temp2 = _class = function (_BaseComponent) {
  _inherits(IconMenu, _BaseComponent);

  function IconMenu() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, IconMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = IconMenu.__proto__ || Object.getPrototypeOf(IconMenu)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "className", "hoverClass", "openType", "img", "icon", "iconPrefixClass", "size", "title", "to", "iconStyle"], _this.handleClick = function () {
      var _this$props = _this.props,
          to = _this$props.to,
          onClick = _this$props.onClick;

      if (to) {
        if (to === 'new-mini') {
          _index2.default.navigateToMiniProgram({
            appId: 'wx2fb97cb696f68d22', // 要跳转的小程序的appid
            path: '/pages/index/index', // 跳转的目标页面
            success: function success(res) {
              // 打开成功
              console.log(res);
            }
          });
        } else if (to === 'makephone') {
          _index2.default.makePhoneCall({
            phoneNumber: '1340000'
          });
        } else {
          _index2.default.navigateTo({
            url: to
          });
        }
      }

      _this.__triggerPropsFn("onClick", [null].concat([]));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(IconMenu, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(IconMenu.prototype.__proto__ || Object.getPrototypeOf(IconMenu.prototype), "_constructor", this).call(this, props);
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
          icon = _props.icon,
          iconStyle = _props.iconStyle,
          iconPrefixClass = _props.iconPrefixClass,
          title = _props.title,
          size = _props.size,
          className = _props.className,
          hoverClass = _props.hoverClass,
          openType = _props.openType;


      var anonymousState__temp = icon ? (0, _index3.styleNames)(iconStyle) : null;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        className: className,
        hoverClass: hoverClass,
        openType: openType,
        img: img,
        icon: icon,
        iconPrefixClass: iconPrefixClass,
        size: size,
        title: title
      });
      return this.__state;
    }
  }]);

  return IconMenu;
}(_index.Component), _class.properties = {
  "to": {
    "type": null,
    "value": null
  },
  "onClick": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "img": {
    "type": null,
    "value": null
  },
  "icon": {
    "type": null,
    "value": null
  },
  "iconStyle": {
    "type": null,
    "value": null
  },
  "iconPrefixClass": {
    "type": null,
    "value": null
  },
  "title": {
    "type": null,
    "value": null
  },
  "size": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  },
  "hoverClass": {
    "type": null,
    "value": null
  },
  "openType": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClick"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  title: '',
  onClick: function onClick() {},
  size: 32,
  img: '',
  icon: '',
  iconStyle: '',
  iconPrefixClass: 'sp-icon',
  hoverClass: '',
  openType: null
}, _temp2);
exports.default = IconMenu;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(IconMenu));