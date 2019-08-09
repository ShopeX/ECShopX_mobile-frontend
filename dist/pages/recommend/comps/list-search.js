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

var ListSearch = (_temp2 = _class = function (_BaseComponent) {
  _inherits(ListSearch, _BaseComponent);

  function ListSearch() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ListSearch);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ListSearch.__proto__ || Object.getPrototypeOf(ListSearch)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["searchValue", "isShowAction", "historyList", "__fn_onConfirm"], _this.handleFocusSearchHistory = function (isOpened) {
      _this.setState({
        showSearchDailog: isOpened,
        isShowAction: true,
        searchValue: ' '
      });
      _index2.default.getStorage({ key: 'searchHistory' }).then(function (res) {
        var stringArr = res.data.split(',');
        _this.setState({ historyList: stringArr });
      }).catch(function () {});
    }, _this.handleChangeSearch = function (value) {}, _this.handleBlur = function (e) {
      var text = e.detail.value;
      text = text.replace(/\s+/g, '');
      _this.setState({
        searchValue: text
      });
    }, _this.handleConfirm = function () {
      setTimeout(function () {
        if (_this.state.searchValue) {
          _this.__triggerPropsFn("onConfirm", [null].concat([_this.state.searchValue]));
        }
      }, 300);
    }, _this.handleClear = function () {
      _this.__triggerPropsFn("onConfirm", [null].concat(['']));
    }, _this.handleClickCancel = function (isOpened) {
      _this.setState({
        showSearchDailog: isOpened,
        searchValue: '',
        isShowAction: false
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ListSearch, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(ListSearch.prototype.__proto__ || Object.getPrototypeOf(ListSearch.prototype), "_constructor", this).call(this, props);

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
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          isShowAction = _state.isShowAction,
          searchValue = _state.searchValue;

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return ListSearch;
}(_index.Component), _class.properties = {
  "__fn_onConfirm": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleFocusSearchHistory", "handleClear", "handleBlur", "handleChangeSearch", "handleConfirm", "handleClickCancel"], _class.defaultProps = {
  isOpened: false
}, _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = ListSearch;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(ListSearch));