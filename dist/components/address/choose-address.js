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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddressChoose = (_dec = (0, _index3.connect)(function (_ref) {
  var address = _ref.address;
  return {
    address: address.current
  };
}, function (dispatch) {
  return {
    onAddressChoose: function onAddressChoose(address) {
      return dispatch({ type: 'address/choose', payload: address });
    }
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(AddressChoose, _BaseComponent);

  function AddressChoose() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, AddressChoose);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = AddressChoose.__proto__ || Object.getPrototypeOf(AddressChoose)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["isAddress"], _this.clickTo = function (choose) {
      _index2.default.navigateTo({
        url: "/pages/member/address?isPicker=" + choose
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AddressChoose, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AddressChoose.prototype.__proto__ || Object.getPrototypeOf(AddressChoose.prototype), "_constructor", this).call(this, props);

      this.state = {};
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var isAddress = this.__props.isAddress;


      Object.assign(this.__state, {
        isAddress: isAddress
      });
      return this.__state;
    }
  }]);

  return AddressChoose;
}(_index.Component), _class2.properties = {
  "isAddress": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["clickTo"], _class2.options = {
  addGlobalClass: true
}, _class2.defaultProps = {
  onClickBack: function onClickBack() {}
}, _temp2)) || _class);
exports.default = AddressChoose;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(AddressChoose));