"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WgtGoodsFaverite = (_temp2 = _class = function (_BaseComponent) {
  _inherits(WgtGoodsFaverite, _BaseComponent);

  function WgtGoodsFaverite() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, WgtGoodsFaverite);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WgtGoodsFaverite.__proto__ || Object.getPrototypeOf(WgtGoodsFaverite)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "info"], _this.handleClickItem = function (item) {
      var url = "/pages/item/espier-detail?id=" + item.item_id;
      _index2.default.navigateTo({
        url: url
      });
    }, _this.anonymousFunc0Array = [], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WgtGoodsFaverite, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(WgtGoodsFaverite.prototype.__proto__ || Object.getPrototypeOf(WgtGoodsFaverite.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "navigateTo",
    value: function navigateTo(url) {
      _index2.default.navigateTo({ url: url });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var info = this.__props.info;

      if (!info) {
        return null;
      }

      var loopArray0 = info.map(function (item, __index0) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        _this2.anonymousFunc0Array[__index0] = function () {
          return _this2.handleClickItem(item.$original);
        };

        return {
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        info: info
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(__index0, e) {
      ;
      this.anonymousFunc0Array[__index0] && this.anonymousFunc0Array[__index0](e);
    }
  }]);

  return WgtGoodsFaverite;
}(_index.Component), _class.properties = {
  "info": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["anonymousFunc0"], _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = WgtGoodsFaverite;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WgtGoodsFaverite));