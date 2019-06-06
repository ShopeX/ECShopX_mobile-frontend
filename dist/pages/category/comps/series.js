"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../npm/@tarojs/redux/index.js");

var _index4 = require("../../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Series = (_dec = (0, _index3.connect)(function (store) {
  return {
    store: store
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Series, _BaseComponent);

  function Series() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Series);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Series.__proto__ || Object.getPrototypeOf(Series)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp3", "loopArray0", "loopArray1", "info", "itemsImg", "items", "pluralType", "imgType", "currentIndex"], _this.handleClickCategoryNav = function (gIndex) {
      _this.setState({
        currentIndex: gIndex
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Series, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Series.prototype.__proto__ || Object.getPrototypeOf(Series.prototype), "_constructor", this).call(this, props);

      this.state = {
        // list: null,
        pluralType: true,
        imgType: true,
        currentIndex: 0
      };
    }
  }, {
    key: "handleClickItem",
    value: function handleClickItem(item) {
      var category_id = item.category_id;

      var url = "/pages/item/list?cat_id=" + category_id;

      _index2.default.navigateTo({
        url: url
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var info = this.__props.info;
      var _state = this.__state,
          pluralType = _state.pluralType,
          imgType = _state.imgType,
          currentIndex = _state.currentIndex;

      var items = void 0,
          itemsImg = void 0;
      if (info) {
        items = info[currentIndex].children;
        itemsImg = info[currentIndex].image_url;
      }
      if (!info) {
        return null;
      }

      var anonymousState__temp3 = (0, _index4.classNames)(pluralType ? 'category-content' : 'category-content-no');
      var loopArray0 = info.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = (0, _index4.classNames)('category-nav__content', currentIndex === index ? 'category-nav__content-checked' : null);
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      });
      var loopArray1 = items.map(function (item) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp5 = (0, _index4.classNames)(imgType ? 'cat-img' : 'cat-img-no');
        return {
          $loopState__temp5: $loopState__temp5,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp3: anonymousState__temp3,
        loopArray0: loopArray0,
        loopArray1: loopArray1,
        info: info,
        itemsImg: itemsImg,
        items: items
      });
      return this.__state;
    }
  }]);

  return Series;
}(_index.Component), _class2.properties = {
  "info": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleClickCategoryNav", "handleClickItem"], _temp2)) || _class);
exports.default = Series;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Series));