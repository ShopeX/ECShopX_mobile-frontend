"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _req = require("../../../api/req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: 用户信息验证
var WgtCoupon = (_temp2 = _class = function (_BaseComponent) {
  _inherits(WgtCoupon, _BaseComponent);

  function WgtCoupon() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, WgtCoupon);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WgtCoupon.__proto__ || Object.getPrototypeOf(WgtCoupon)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "base", "data"], _this.handleGetCard = function (cardId) {
      var _req$get = _req2.default.get('/user/receiveCard', { card_id: cardId }),
          status = _req$get.status;

      if (status) {
        _index2.default.showToast({
          title: '优惠券领取成功',
          icon: 'success'
        });
      }
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WgtCoupon, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(WgtCoupon.prototype.__proto__ || Object.getPrototypeOf(WgtCoupon.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "navigateTo",
    value: function navigateTo(url) {
      _index2.default.navigateTo({ url: url });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var info = this.__props.info;

      if (!info) {
        return null;
      }

      var base = info.base,
          data = info.data;


      Object.assign(this.__state, {
        info: info,
        base: base,
        data: data
      });
      return this.__state;
    }
  }]);

  return WgtCoupon;
}(_index.Component), _class.properties = {
  "info": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["navigateTo", "handleGetCard"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  info: null
}, _temp2);
exports.default = WgtCoupon;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WgtCoupon));