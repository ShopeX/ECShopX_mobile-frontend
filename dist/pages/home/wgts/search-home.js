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

var WgtSearchHome = (_temp2 = _class = function (_BaseComponent) {
  _inherits(WgtSearchHome, _BaseComponent);

  function WgtSearchHome() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, WgtSearchHome);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WgtSearchHome.__proto__ || Object.getPrototypeOf(WgtSearchHome)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["searchValue", "isShowAction", "historyList"], _this.handleFocusSearchHistory = function (isOpened) {
      _this.setState({
        showSearchDailog: isOpened,
        isShowAction: true,
        searchValue: ' '
      });
      _index2.default.getStorage({ key: 'searchHistory' }).then(function (res) {
        var stringArr = res.data.split(',');
        _this.setState({ historyList: stringArr });
      }).catch(function () {});
    }, _this.handleChangeSearch = function (value) {
      _this.setState({
        searchValue: value
      });
    }, _this.handleConfirm = function () {
      if (_this.state.searchValue) {
        _index2.default.getStorage({ key: 'searchHistory' }).then(function (res) {
          var stringArr = res.data.split(',');
          var arr = [].concat(stringArr);
          arr.unshift(_this.state.searchValue);
          arr = Array.from(new Set(arr));
          var arrString = arr.join(',');
          _index2.default.setStorage({ key: 'searchHistory', data: arrString });
          _this.setState({ searchValue: '' });
        }).catch(function () {
          var arr = [];
          arr.push(_this.state.searchValue);
          var arrString = arr.join(',');
          _index2.default.setStorage({ key: 'searchHistory', data: arrString });
        });
        _index2.default.navigateTo({
          url: "/pages/item/list?keywords=" + _this.state.searchValue
        });
      }
    }, _this.handleClickCancel = function (isOpened) {
      _this.setState({
        showSearchDailog: isOpened,
        searchValue: '',
        isShowAction: false
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WgtSearchHome, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(WgtSearchHome.prototype.__proto__ || Object.getPrototypeOf(WgtSearchHome.prototype), "_constructor", this).call(this, props);

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

      var _state = this.__state,
          isShowAction = _state.isShowAction,
          searchValue = _state.searchValue;

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return WgtSearchHome;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleFocusSearchHistory", "handleChangeSearch", "handleConfirm", "handleClickCancel"], _class.defaultProps = {
  isOpened: false
}, _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = WgtSearchHome;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WgtSearchHome));