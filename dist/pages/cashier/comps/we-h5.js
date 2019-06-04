"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var WeappBtn = (_temp2 = _class = function (_BaseComponent) {
  _inherits(WeappBtn, _BaseComponent);

  function WeappBtn() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, WeappBtn);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WeappBtn.__proto__ || Object.getPrototypeOf(WeappBtn)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = [], _this.handleClickPay = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this$$router$params, order_id, _this$$router$params$, order_type, params, res, loc, redirect_url, form, _res$payment$mweb_url, _res$payment$mweb_url2, action, search, queryPair;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$$router$params = _this.$router.params, order_id = _this$$router$params.order_id, _this$$router$params$ = _this$$router$params.order_type, order_type = _this$$router$params$ === undefined ? 'normal' : _this$$router$params$;
              params = {
                pay_type: 'wxpayh5',
                order_id: order_id,
                order_type: order_type
              };
              _context.next = 4;
              return _index4.default.cashier.getPayment(params);

            case 4:
              res = _context.sent;

              // eslint-disable-next-line
              loc = location;
              redirect_url = loc.protocol + "//" + loc.host + "/pages/cashier/cashier-result?order_id=" + order_id;
              form = document.createElement('form');
              _res$payment$mweb_url = res.payment.mweb_url.split('?'), _res$payment$mweb_url2 = _slicedToArray(_res$payment$mweb_url, 2), action = _res$payment$mweb_url2[0], search = _res$payment$mweb_url2[1];
              queryPair = (search + "&redirect_url=" + redirect_url).split('&');


              form.setAttribute('method', 'get');
              form.setAttribute('action', action);
              form.innerHTML = queryPair.map(function (p) {
                var idx = p.indexOf('=');
                var _ref3 = [p.slice(0, idx), p.slice(idx + 1)],
                    name = _ref3[0],
                    value = _ref3[1];

                return "<input type=\"hidden\" name=\"" + name + "\" value=\"" + value + "\" />";
              }).join('');
              document.body.appendChild(form);

              form.submit();

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WeappBtn, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(WeappBtn.prototype.__proto__ || Object.getPrototypeOf(WeappBtn.prototype), "_constructor", this).call(this, props);

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

  return WeappBtn;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleClickPay"], _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = WeappBtn;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WeappBtn));