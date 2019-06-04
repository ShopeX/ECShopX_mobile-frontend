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

var Timer = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Timer, _BaseComponent);

  function Timer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Timer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Timer.__proto__ || Object.getPrototypeOf(Timer)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "msg", "countDur", "sent", "duration", "__fn_onStart", "timerMsg", "className", "defaultMsg"], _this.handleClick = function () {
      if (_this.timer) {
        return;
      }if (!_this.timer) {
        _this.start();
      }
      _this.setState({
        sent: true
      });
    }, _this.start = function () {
      _this.stop();

      var next = function next() {
        _this.timer = setTimeout(function () {
          var countDur = _this.state.countDur - 1;
          _this.props.onUpdateTimer && _this.__triggerPropsFn("onUpdateTimer", [null].concat([countDur]));
          _this.setState({
            countDur: countDur
          });
          if (countDur > 0) {
            next();
          } else {
            _this.stop();
            _this.setState({
              countDur: _this.props.duration
            });
            _this.props.onStop && _this.__triggerPropsFn("onStop", [null].concat([]));
          }
        }, 1000);
      };

      _this.__triggerPropsFn("onStart", [null].concat([function (start) {
        if (start !== false) {
          next();
        }
      }, _this.state.countDur]));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Timer, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Timer.prototype.__proto__ || Object.getPrototypeOf(Timer.prototype), "_constructor", this).call(this, props);

      this.state = {
        countDur: props.duration,
        sent: false
      };
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stop();
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var timer = this.timer;
      var _state = this.__state,
          countDur = _state.countDur,
          sent = _state.sent;
      var _props = this.__props,
          timerMsg = _props.timerMsg,
          className = _props.className;


      var msg = timerMsg || (timer ? countDur + "s" : sent ? this.__props.msg : this.__props.defaultMsg);

      var anonymousState__temp = (0, _index3.classNames)('mobile-timer', { 'mobile-timer__counting': timer }, className);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        msg: msg
      });
      return this.__state;
    }
  }]);

  return Timer;
}(_index.Component), _class.properties = {
  "onUpdateTimer": {
    "type": null,
    "value": null
  },
  "__fn_onUpdateTimer": {
    "type": null,
    "value": null
  },
  "duration": {
    "type": null,
    "value": null
  },
  "onStop": {
    "type": null,
    "value": null
  },
  "__fn_onStop": {
    "type": null,
    "value": null
  },
  "__fn_onStart": {
    "type": null,
    "value": null
  },
  "timerMsg": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  },
  "msg": {
    "type": null,
    "value": null
  },
  "defaultMsg": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClick"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  duration: 60,
  defaultMsg: '发送验证码',
  msg: '重新发送'
}, _temp2);
exports.default = Timer;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Timer));