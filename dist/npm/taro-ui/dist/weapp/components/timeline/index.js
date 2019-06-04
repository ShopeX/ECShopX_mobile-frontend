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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtTimeline = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtTimeline, _AtComponent);

  function AtTimeline() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtTimeline);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtTimeline.__proto__ || Object.getPrototypeOf(AtTimeline)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp5", "anonymousState__temp6", "loopArray0", "items", "pending", "customStyle", "className"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtTimeline, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtTimeline.prototype.__proto__ || Object.getPrototypeOf(AtTimeline.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          pending = _props.pending,
          items = _props.items,
          customStyle = _props.customStyle;


      var rootClassName = ['at-timeline'];
      if (pending) {
        rootClassName.push('at-timeline--pending');
      }var rootClassObject = {
        'at-timeline--pending': pending
      };

      var anonymousState__temp5 = (0, _index6.default)(rootClassName, rootClassObject, this.__props.className);
      var anonymousState__temp6 = (0, _index3.internal_inline_style)(customStyle);
      var loopArray0 = items.map(function (item, index) {
        item = {
          $original: (0, _index3.internal_get_original)(item)
        };

        var _item$$original = item.$original,
            _item$$original$title = _item$$original.title,
            title = _item$$original$title === undefined ? '' : _item$$original$title,
            color = _item$$original.color,
            icon = _item$$original.icon,
            _item$$original$conte = _item$$original.content,
            content = _item$$original$conte === undefined ? [] : _item$$original$conte;


        var iconClass = (0, _index6.default)(_defineProperty({
          'at-icon': true
        }, "at-icon-" + icon, icon));

        var itemRootClassName = ['at-timeline-item'];
        if (color) {
          itemRootClassName.push("at-timeline-item--" + color);
        }var dotClass = ['at-timeline-item__dot'];
        if (icon) {
          dotClass.push('at-timeline-item__icon');
        }var $loopState__temp2 = (0, _index6.default)(itemRootClassName);
        var $loopState__temp4 = (0, _index6.default)(dotClass);
        return {
          color: color,
          icon: icon,
          title: title,
          content: content,
          iconClass: iconClass,
          itemRootClassName: itemRootClassName,
          dotClass: dotClass,
          $loopState__temp2: $loopState__temp2,
          $loopState__temp4: $loopState__temp4,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp5: anonymousState__temp5,
        anonymousState__temp6: anonymousState__temp6,
        loopArray0: loopArray0,
        items: items
      });
      return this.__state;
    }
  }]);

  return AtTimeline;
}(_component2.default), _class.properties = {
  "pending": {
    "type": null,
    "value": null
  },
  "items": {
    "type": null,
    "value": null
  },
  "customStyle": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  }
}, _class.$$events = [], _temp2);


AtTimeline.defaultProps = {
  pending: false,
  items: [],
  customStyle: {}
};

AtTimeline.propTypes = {
  pending: _index2.default.bool,
  items: _index2.default.arrayOf(_index2.default.object),
  customStyle: _index2.default.oneOfType([_index2.default.object, _index2.default.string])
};
exports.default = AtTimeline;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtTimeline));