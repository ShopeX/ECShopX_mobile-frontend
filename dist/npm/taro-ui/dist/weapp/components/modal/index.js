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

var _isFunction2 = require("../../../../../lodash/isFunction.js");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

var _utils = require("../../common/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtModal = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtModal, _AtComponent);

  function AtModal() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtModal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtModal.__proto__ || Object.getPrototypeOf(AtModal)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["title", "content", "_$isRenderAction", "cancelText", "confirmText", "rootClass", "_isOpened", "isOpened", "closeOnClickOverlay", "className", "children"], _this.handleClickOverlay = function () {
      if (_this.props.closeOnClickOverlay) {
        _this.setState({
          _isOpened: false
        }, _this.handleClose);
      }
    }, _this.handleClose = function () {
      if ((0, _isFunction3.default)(_this.props.onClose)) {
        _this.__triggerPropsFn("onClose", [null].concat([]));
      }
    }, _this.handleCancel = function () {
      if ((0, _isFunction3.default)(_this.props.onCancel)) {
        _this.__triggerPropsFn("onCancel", [null].concat([]));
      }
    }, _this.handleConfirm = function () {
      if ((0, _isFunction3.default)(_this.props.onConfirm)) {
        _this.__triggerPropsFn("onConfirm", [null].concat([]));
      }
    }, _this.handleTouchMove = function (e) {
      e.stopPropagation();
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtModal, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtModal.prototype.__proto__ || Object.getPrototypeOf(AtModal.prototype), "_constructor", this).apply(this, arguments);

      var isOpened = props.isOpened;

      this.state = {
        _isOpened: isOpened
      };
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var isOpened = nextProps.isOpened;


      if (this.props.isOpened !== isOpened) {
        (0, _utils.handleTouchScroll)(isOpened);
      }

      if (isOpened !== this.state._isOpened) {
        this.setState({
          _isOpened: isOpened
        });
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _$isRenderAction;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _isOpened = this.__state._isOpened;
      var _props = this.__props,
          title = _props.title,
          content = _props.content,
          cancelText = _props.cancelText,
          confirmText = _props.confirmText;


      var rootClass = (0, _index6.default)('at-modal', {
        'at-modal--active': _isOpened
      }, this.__props.className);

      if (title || content) {
        _$isRenderAction = cancelText || confirmText;
      }

      Object.assign(this.__state, {
        title: title,
        content: content,
        _$isRenderAction: _$isRenderAction,
        cancelText: cancelText,
        confirmText: confirmText,
        rootClass: rootClass
      });
      return this.__state;
    }
  }]);

  return AtModal;
}(_component2.default), _class.properties = {
  "isOpened": {
    "type": null,
    "value": null
  },
  "closeOnClickOverlay": {
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
  "onCancel": {
    "type": null,
    "value": null
  },
  "__fn_onCancel": {
    "type": null,
    "value": null
  },
  "onConfirm": {
    "type": null,
    "value": null
  },
  "__fn_onConfirm": {
    "type": null,
    "value": null
  },
  "title": {
    "type": null,
    "value": null
  },
  "content": {
    "type": null,
    "value": null
  },
  "cancelText": {
    "type": null,
    "value": null
  },
  "confirmText": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClickOverlay", "handleCancel", "handleConfirm", "handleTouchMove"], _temp2);


AtModal.defaultProps = {
  closeOnClickOverlay: true
};

AtModal.propTypes = {
  title: _index4.default.string,
  isOpened: _index4.default.bool,
  onCancel: _index4.default.func,
  onConfirm: _index4.default.func,
  onClose: _index4.default.func,
  content: _index4.default.string,
  closeOnClickOverlay: _index4.default.bool,
  cancelText: _index4.default.string,
  confirmText: _index4.default.string
};
exports.default = AtModal;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtModal));