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

var AtDrawer = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtDrawer, _AtComponent);

  function AtDrawer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtDrawer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtDrawer.__proto__ || Object.getPrototypeOf(AtDrawer)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "_show", "items", "animShow", "mask", "width", "right", "className", "show", "children"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtDrawer, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtDrawer.prototype.__proto__ || Object.getPrototypeOf(AtDrawer.prototype), "_constructor", this).apply(this, arguments);
      this.state = {
        animShow: false,
        _show: props.show
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _show = this.state._show;

      if (_show) {
        this.animShow();
      }
    }
  }, {
    key: "onItemClick",
    value: function onItemClick(index, e) {
      this.props.onItemClick && this.__triggerPropsFn("onItemClick", [null].concat([index]));
      this.animHide(e, index);
    }
  }, {
    key: "onHide",
    value: function onHide() {
      var _this2 = this;

      this.setState({ _show: false }, function () {
        _this2.props.onClose && _this2.__triggerPropsFn("onClose", [null].concat([]));
      });
    }
  }, {
    key: "animHide",
    value: function animHide() {
      var _this3 = this,
          _arguments = arguments;

      this.setState({
        animShow: false
      });
      setTimeout(function () {
        _this3.onHide.apply(_this3, _arguments);
      }, 300);
    }
  }, {
    key: "animShow",
    value: function animShow() {
      var _this4 = this;

      this.setState({ _show: true });
      setTimeout(function () {
        _this4.setState({
          animShow: true
        });
      }, 200);
    }
  }, {
    key: "onMaskClick",
    value: function onMaskClick() {
      this.animHide.apply(this, arguments);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var show = nextProps.show;

      if (show !== this.state._show) {
        show ? this.animShow() : this.animHide.apply(this, arguments);
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _props = this.__props,
          mask = _props.mask,
          width = _props.width,
          right = _props.right,
          items = _props.items;
      var _state = this.__state,
          animShow = _state.animShow,
          _show = _state._show;

      var rootClassName = ['at-drawer'];

      var maskStyle = {
        display: mask ? 'block' : 'none',
        opacity: animShow ? 1 : 0
      };
      var listStyle = {
        width: width,
        transition: animShow ? 'all 225ms cubic-bezier(0, 0, 0.2, 1)' : 'all 195ms cubic-bezier(0.4, 0, 0.6, 1)'
      };

      var classObject = {
        'at-drawer--show': animShow,
        'at-drawer--right': right,
        'at-drawer--left': !right
      };

      var anonymousState__temp = _show ? (0, _index6.default)(rootClassName, classObject, this.__props.className) : null;
      var anonymousState__temp2 = _show ? (0, _index.internal_inline_style)(maskStyle) : null;
      var anonymousState__temp3 = _show ? (0, _index.internal_inline_style)(listStyle) : null;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        items: items
      });
      return this.__state;
    }
  }]);

  return AtDrawer;
}(_component2.default), _class.properties = {
  "onItemClick": {
    "type": null,
    "value": null
  },
  "__fn_onItemClick": {
    "type": null,
    "value": null
  },
  "onClose": {
    "type": null,
    "value": null
  },
  "__fn_onClose": {
    "type": null,
    "value": null
  },
  "mask": {
    "type": null,
    "value": null
  },
  "width": {
    "type": null,
    "value": null
  },
  "right": {
    "type": null,
    "value": null
  },
  "items": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  },
  "show": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["onMaskClick", "onItemClick"], _temp2);


AtDrawer.defaultProps = {
  show: false,
  mask: true,
  width: '',
  right: false,
  items: [],
  onItemClick: function onItemClick() {},
  onClose: function onClose() {}
};

AtDrawer.propTypes = {
  show: _index4.default.bool,
  mask: _index4.default.bool,
  width: _index4.default.string,
  items: _index4.default.arrayOf(_index4.default.string),
  onItemClick: _index4.default.func,
  onClose: _index4.default.func
};
exports.default = AtDrawer;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtDrawer));