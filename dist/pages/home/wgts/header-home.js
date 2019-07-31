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

var HeaderHome = (_temp2 = _class = function (_BaseComponent) {
  _inherits(HeaderHome, _BaseComponent);

  function HeaderHome() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, HeaderHome);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = HeaderHome.__proto__ || Object.getPrototypeOf(HeaderHome)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["storeName", "searchValue", "historyList", "isShowAction"], _this.handlePickStore = function () {
      _index2.default.navigateTo({
        url: 'shop_picker'
      });
    }, _this.handleScanCode = function () {
      _index2.default.scanCode({
        success: function success(res) {
          var scene = decodeURIComponent(res.path);
          var path = scene.replace('pages/', '');
          path = path.replace('scene=', '');
          //格式化二维码参数
          _index2.default.navigateTo({
            url: path
          });
        }
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(HeaderHome, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(HeaderHome.prototype.__proto__ || Object.getPrototypeOf(HeaderHome.prototype), "_constructor", this).call(this, props);

      this.state = {
        searchValue: '',
        historyList: [],
        isShowAction: false
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var storeName = this.__props.storeName;


      Object.assign(this.__state, {
        storeName: storeName
      });
      return this.__state;
    }
  }]);

  return HeaderHome;
}(_index.Component), _class.properties = {
  "storeName": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handlePickStore", "handleScanCode"], _class.defaultProps = {
  storeName: null
}, _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = HeaderHome;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(HeaderHome));