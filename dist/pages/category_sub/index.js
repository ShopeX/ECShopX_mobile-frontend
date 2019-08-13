"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _index4 = require("../../utils/index.js");

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CategoryPoint = (_dec = (0, _index3.connect)(function (store) {
  return {
    store: store
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(CategoryPoint, _BaseComponent);

  function CategoryPoint() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CategoryPoint);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CategoryPoint.__proto__ || Object.getPrototypeOf(CategoryPoint)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray0", "list", "info", "items", "pluralType", "imgType", "currentIndex"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CategoryPoint, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CategoryPoint.prototype.__proto__ || Object.getPrototypeOf(CategoryPoint.prototype), "_constructor", this).call(this, props);

      this.state = {
        list: null,
        pluralType: true,
        imgType: true,
        currentIndex: 0
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _index6.default.category.getSubCats(this.$router.params.cat_id);

              case 2:
                res = _context.sent;

                this.setState({
                  list: res.list
                });

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
        return _ref2.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "handleClickItem",
    value: function handleClickItem(item) {
      var category_id = item.category_id;


      var url = this.$router.params.is_point ? "/pages/item/point-list?" + (this.$router.params.is_point ? 'is_point=' + this.$router.params.is_point : '') + (category_id ? '&cat_id=' + category_id : '') : "/pages/item/list?" + (category_id ? 'cat_id=' + category_id : '');

      _index2.default.navigateTo({
        url: url
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          pluralType = _state.pluralType,
          imgType = _state.imgType,
          currentIndex = _state.currentIndex;

      var infoPoint = {};
      var infoId = {};
      if (this.$router.params.is_point) {
        infoPoint = { is_point: true };
      }
      if (this.$router.params.cat_id) {
        infoId = { cat_id: this.$router.params.cat_id };
      }
      var info = Object.assign(infoPoint, infoId);
      var items = void 0;
      if (list) {
        items = list;
      }
      if (!list) {
        return null;
      }

      var anonymousState__temp = (0, _index4.classNames)(pluralType ? 'category-content' : 'category-content-no');
      var loopArray0 = items.map(function (item) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp3 = (0, _index4.classNames)(imgType ? 'cat-img' : 'cat-img-no');
        return {
          $loopState__temp3: $loopState__temp3,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        loopArray0: loopArray0,
        info: info,
        items: items
      });
      return this.__state;
    }
  }]);

  return CategoryPoint;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickItem"], _temp2)) || _class);
exports.default = CategoryPoint;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CategoryPoint, true));