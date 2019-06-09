"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../../prop-types/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../@tarojs/taro-weapp/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../../../../classnames/index.js");

var _index6 = _interopRequireDefault(_index5);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtNoticebar = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtNoticebar, _AtComponent);

  function AtNoticebar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtNoticebar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtNoticebar.__proto__ || Object.getPrototypeOf(AtNoticebar)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "anonymousState__temp5", "close", "icon", "showMore", "_moreText", "show", "animElemId", "dura", "isWEAPP", "isALIPAY", "isWEB", "animationData", "marquee", "speed", "single", "customStyle", "moreText", "className", "children"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtNoticebar, [{
    key: "_constructor",
    value: function _constructor() {
      _get(AtNoticebar.prototype.__proto__ || Object.getPrototypeOf(AtNoticebar.prototype), "_constructor", this).apply(this, arguments);
      var animElemId = "J_" + Math.ceil(Math.random() * 10e5).toString(36);
      this.state = {
        show: true,
        animElemId: animElemId,
        dura: 15,
        isWEAPP: _index4.default.getEnv() === _index4.default.ENV_TYPE.WEAPP,
        isALIPAY: _index4.default.getEnv() === _index4.default.ENV_TYPE.ALIPAY,
        isWEB: _index4.default.getEnv() === _index4.default.ENV_TYPE.WEB
      };
    }
  }, {
    key: "onClose",
    value: function onClose() {
      this.setState({
        show: false
      });
      this.props.onClose && this.__triggerPropsFn("onClose", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "onGotoMore",
    value: function onGotoMore() {
      this.props.onGotoMore && this.__triggerPropsFn("onGotoMore", [null].concat([].concat(Array.prototype.slice.call(arguments))));
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      if (!this.timeout) {
        this.interval && clearInterval(this.interval);
        this.initAnimation();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.marquee) {
        return;
      }this.initAnimation();
    }
  }, {
    key: "initAnimation",
    value: function initAnimation() {
      var _this2 = this;

      var _state = this.state,
          isWEAPP = _state.isWEAPP,
          isALIPAY = _state.isALIPAY;

      this.timeout = setTimeout(function () {
        _this2.timeout = null;
        if (_this2.state.isWEB) {
          var elem = document.querySelector("." + _this2.state.animElemId);
          if (!elem) {
            return;
          }var width = elem.getBoundingClientRect().width;
          var dura = width / +_this2.props.speed;
          _this2.setState({ dura: dura });
        } else if (isWEAPP || isALIPAY) {
          var query = isALIPAY ? _index4.default.createSelectorQuery() : _index4.default.createSelectorQuery().in(_this2.$scope);
          query.select("." + _this2.state.animElemId).boundingClientRect().exec(function (res) {
            res = res[0];
            if (!res) {
              return;
            }var _res = res,
                width = _res.width;

            var dura = width / +_this2.props.speed;
            var animation = _index4.default.createAnimation({
              duration: dura * 1000,
              timingFunction: 'linear'
            });
            var resetAnimation = _index4.default.createAnimation({
              duration: 0,
              timingFunction: 'linear'
            });
            var resetOpacityAnimation = _index4.default.createAnimation({
              duration: 0,
              timingFunction: 'linear'
            });
            var animBody = function animBody() {
              resetOpacityAnimation.opacity(0).step();
              _this2.setState({ animationData: resetOpacityAnimation.export() });

              setTimeout(function () {
                resetAnimation.translateX(0).step();
                _this2.setState({ animationData: resetAnimation.export() });
              }, 300);

              setTimeout(function () {
                resetOpacityAnimation.opacity(1).step();
                _this2.setState({ animationData: resetOpacityAnimation.export() });
              }, 600);

              setTimeout(function () {
                animation.translateX(-width).step();
                _this2.setState({ animationData: animation.export() });
              }, 900);
            };
            animBody();
            _this2.interval = setInterval(animBody, dura * 1000 + 1000);
          });
        }
      }, 100);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _props = this.__props,
          single = _props.single,
          icon = _props.icon,
          marquee = _props.marquee,
          customStyle = _props.customStyle;
      var _props2 = this.__props,
          showMore = _props2.showMore,
          close = _props2.close;
      var dura = this.__state.dura;

      var rootClassName = ['at-noticebar'];
      var _moreText = this.__props.moreText;

      if (!single) {
        showMore = false;
      }if (!_moreText) {
        _moreText = '查看详情';
      }var style = {};
      var innerClassName = ['at-noticebar__content-inner'];
      if (marquee) {
        close = false;
        style['animation-duration'] = dura + "s";
        innerClassName.push(this.__state.animElemId);
      }

      var classObject = {
        'at-noticebar--marquee': marquee,
        'at-noticebar--weapp': marquee && (this.__state.isWEAPP || this.__state.isALIPAY),
        'at-noticebar--single': !marquee && single
      };

      var iconClass = ['at-icon'];
      if (icon) {
        iconClass.push("at-icon-" + icon);
      }var anonymousState__temp = this.__state.show ? (0, _index6.default)(rootClassName, classObject, this.__props.className) : null;
      var anonymousState__temp2 = this.__state.show ? (0, _index3.internal_inline_style)(customStyle) : null;
      var anonymousState__temp3 = icon ? (0, _index6.default)(iconClass, iconClass) : null;
      var anonymousState__temp4 = this.__state.show ? (0, _index6.default)(innerClassName) : null;
      var anonymousState__temp5 = this.__state.show ? (0, _index3.internal_inline_style)(style) : null;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        close: close,
        icon: icon,
        showMore: showMore,
        _moreText: _moreText
      });
      return this.__state;
    }
  }]);

  return AtNoticebar;
}(_component2.default), _class.properties = {
  "onClose": {
    "type": null,
    "value": null
  },
  "__fn_onClose": {
    "type": null,
    "value": null
  },
  "onGotoMore": {
    "type": null,
    "value": null
  },
  "__fn_onGotoMore": {
    "type": null,
    "value": null
  },
  "marquee": {
    "type": null,
    "value": null
  },
  "speed": {
    "type": null,
    "value": null
  },
  "single": {
    "type": null,
    "value": null
  },
  "icon": {
    "type": null,
    "value": null
  },
  "customStyle": {
    "type": null,
    "value": null
  },
  "showMore": {
    "type": null,
    "value": null
  },
  "close": {
    "type": null,
    "value": null
  },
  "moreText": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["onClose", "onGotoMore"], _temp2);


AtNoticebar.defaultProps = {
  close: false,
  single: false,
  marquee: false,
  speed: 100,
  moreText: '查看详情',
  showMore: false,
  icon: '',
  customStyle: {},
  onClose: function onClose() {},
  onGotoMore: function onGotoMore() {}
};

AtNoticebar.propTypes = {
  close: _index2.default.bool,
  single: _index2.default.bool,
  marquee: _index2.default.bool,
  speed: _index2.default.number,
  moreText: _index2.default.string,
  showMore: _index2.default.bool,
  icon: _index2.default.string,
  customStyle: _index2.default.oneOfType([_index2.default.object, _index2.default.string]),
  onClose: _index2.default.func,
  onGotoMore: _index2.default.func
};
exports.default = AtNoticebar;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtNoticebar));