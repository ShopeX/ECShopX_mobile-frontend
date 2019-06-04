"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AlipayBtn = (_temp2 = _class = function (_BaseComponent) {
  _inherits(AlipayBtn, _BaseComponent);

  function AlipayBtn() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, AlipayBtn);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AlipayBtn.__proto__ || Object.getPrototypeOf(AlipayBtn)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["orderID", "payType", "orderType"], _this.handleClickPayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var query, _ref3, payment, el, formId;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = {
                order_id: _this.props.orderID,
                pay_type: _this.props.payType,
                order_type: _this.props.orderType
              };
              _context.prev = 1;
              _context.next = 4;
              return _index4.default.cashier.getPayment(query);

            case 4:
              _ref3 = _context.sent;
              payment = _ref3.payment;
              el = document.createElement('div');

              el.innerHTML = payment.replace(/<script>(.*)?<\/script>/, '');
              document.body.appendChild(el);
              formId = document.forms[0].id;


              document.getElementById(formId).submit();
              _context.next = 17;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](1);

              console.log(_context.t0);
              _index2.default.redirectTo({
                url: "/pages/cashier/cashier-result?payStatus=fail&order_id=" + _this.props.orderID
              });

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2, [[1, 13]]);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AlipayBtn, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AlipayBtn.prototype.__proto__ || Object.getPrototypeOf(AlipayBtn.prototype), "_constructor", this).call(this, props);

      this.state = {};
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var refMeta = document.querySelector('meta[name="referrer"]');
      refMeta.setAttribute('content', 'always');
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var refMeta = document.querySelector('meta[name="referrer"]');
      refMeta.setAttribute('content', 'never');
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;
      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return AlipayBtn;
}(_index.Component), _class.properties = {
  "orderID": {
    "type": null,
    "value": null
  },
  "payType": {
    "type": null,
    "value": null
  },
  "orderType": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClickPayment"], _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = AlipayBtn;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(AlipayBtn));