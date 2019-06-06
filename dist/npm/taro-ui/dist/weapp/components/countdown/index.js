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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var toSeconds = function toSeconds(day, hours, minutes, seconds) {
  return day * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60 + seconds;
};

var AtCountdown = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtCountdown, _AtComponent);

  function AtCountdown() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtCountdown);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtCountdown.__proto__ || Object.getPrototypeOf(AtCountdown)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "isShowDay", "_day", "format", "_hours", "_minutes", "_seconds", "day", "hours", "minutes", "seconds", "__fn_onTimeUp", "className", "customStyle", "isCard"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtCountdown, [{
    key: "_constructor",
    value: function _constructor() {
      _get(AtCountdown.prototype.__proto__ || Object.getPrototypeOf(AtCountdown.prototype), "_constructor", this).apply(this, arguments);
      var _props = this.props,
          day = _props.day,
          hours = _props.hours,
          minutes = _props.minutes,
          seconds = _props.seconds;

      this.seconds = toSeconds(day, hours, minutes, seconds);
      this.state = {
        _day: day,
        _hours: hours,
        _minutes: minutes,
        _seconds: seconds
      };
      this.timer = null;
    }
  }, {
    key: "setTimer",
    value: function setTimer() {
      if (!this.timer) {
        this.countdonwn();
      }
    }
  }, {
    key: "clearTimer",
    value: function clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  }, {
    key: "countdonwn",
    value: function countdonwn() {
      var _this2 = this;

      var day = 0,
          hours = 0,
          minutes = 0,
          seconds = 0;


      if (this.seconds > 0) {
        day = Math.floor(this.seconds / 86400);
        hours = Math.floor(this.seconds / 3600) - day * 24;
        minutes = Math.floor(this.seconds / 60) - day * 24 * 60 - hours * 60;
        seconds = Math.floor(this.seconds) - day * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
      }

      this.setState({
        _day: day,
        _hours: hours,
        _minutes: minutes,
        _seconds: seconds
      });
      this.seconds--;

      if (this.seconds < 0) {
        this.clearTimer();
        this.__triggerPropsFn("onTimeUp", [null].concat([]));
        return;
      }

      this.timer = setTimeout(function () {
        _this2.countdonwn();
      }, 1000);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (JSON.stringify(this.props) === JSON.stringify(nextProps)) {
        return;
      }var day = nextProps.day,
          hours = nextProps.hours,
          minutes = nextProps.minutes,
          seconds = nextProps.seconds;

      this.seconds = toSeconds(day, hours, minutes, seconds);
      this.clearTimer();
      this.setTimer();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setTimer();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearTimer();
    }
  }, {
    key: "componentDidHide",
    value: function componentDidHide() {
      this.clearTimer();
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.setTimer();
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props2 = this.__props,
          className = _props2.className,
          customStyle = _props2.customStyle,
          format = _props2.format,
          isShowDay = _props2.isShowDay,
          isCard = _props2.isCard;
      var _state = this.__state,
          _day = _state._day,
          _hours = _state._hours,
          _minutes = _state._minutes,
          _seconds = _state._seconds;


      var anonymousState__temp = (0, _index6.default)({
        'at-countdown': true,
        'at-countdown--card': isCard
      }, className);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(customStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        isShowDay: isShowDay,
        format: format
      });
      return this.__state;
    }
  }]);

  return AtCountdown;
}(_component2.default), _class.properties = {
  "day": {
    "type": null,
    "value": null
  },
  "hours": {
    "type": null,
    "value": null
  },
  "minutes": {
    "type": null,
    "value": null
  },
  "seconds": {
    "type": null,
    "value": null
  },
  "__fn_onTimeUp": {
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
  "format": {
    "type": null,
    "value": null
  },
  "isShowDay": {
    "type": null,
    "value": null
  },
  "isCard": {
    "type": null,
    "value": null
  }
}, _class.$$events = [], _temp2);


AtCountdown.defaultProps = {
  customStyle: '',
  className: '',
  isCard: false,
  isShowDay: false,
  format: {
    day: '天',
    hours: '时',
    minutes: '分',
    seconds: '秒'
  },
  day: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  onTimeUp: function onTimeUp() {}
};

AtCountdown.propTypes = {
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  className: _index4.default.oneOfType([_index4.default.array, _index4.default.string]),
  isCard: _index4.default.bool,
  isShowDay: _index4.default.bool,
  format: _index4.default.object,
  day: _index4.default.number,
  hours: _index4.default.number,
  minutes: _index4.default.number,
  seconds: _index4.default.number,
  onTimeUp: _index4.default.func
};
exports.default = AtCountdown;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtCountdown));