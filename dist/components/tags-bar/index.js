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

var TagsBar = (_temp2 = _class = function (_BaseComponent) {
  _inherits(TagsBar, _BaseComponent);

  function TagsBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TagsBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TagsBar.__proto__ || Object.getPrototypeOf(TagsBar)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "list", "curId", "__fn_onChange"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TagsBar, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TagsBar.prototype.__proto__ || Object.getPrototypeOf(TagsBar.prototype), "_constructor", this).call(this, props);

      var current = props.current;

      this.state = {
        curId: current
      };
    }
  }, {
    key: "handleClickItem",
    value: function handleClickItem(id) {
      this.setState({
        curId: id
      });
      this.__triggerPropsFn("onChange", [null].concat([{
        current: id
      }]));
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var list = this.__props.list;


      var loopArray0 = list.length > 0 ? list.map(function (item, idx) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        var isCurrent = _this2.__state.curId === item.$original.tag_id;

        var $loopState__temp2 = list.length > 0 ? (0, _index3.classNames)('tag-item', isCurrent && 'active') : null;
        return {
          isCurrent: isCurrent,
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      }) : [];
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        list: list
      });
      return this.__state;
    }
  }]);

  return TagsBar;
}(_index.Component), _class.properties = {
  "__fn_onChange": {
    "type": null,
    "value": null
  },
  "list": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClickItem"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  current: '',
  list: []
}, _temp2);
exports.default = TagsBar;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TagsBar));