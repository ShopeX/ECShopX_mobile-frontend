"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DistributionWithdrawalsAcount = (_temp2 = _class = function (_BaseComponent) {
  _inherits(DistributionWithdrawalsAcount, _BaseComponent);

  function DistributionWithdrawalsAcount() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, DistributionWithdrawalsAcount);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DistributionWithdrawalsAcount.__proto__ || Object.getPrototypeOf(DistributionWithdrawalsAcount)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["hasBind", "name", "acount", "isEdit", "new_acount"], _this.handleChange = function (name, val) {
      _this.setState(_defineProperty({}, name, val));
    }, _this.handleClick = function () {
      _this.setState({
        isEdit: true
      });
    }, _this.handleSubmit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this$state, name, acount, new_acount, hasBind, isEdit, params, _ref3, list, _list$, alipay_name, alipay_account;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$state = _this.state, name = _this$state.name, acount = _this$state.acount, new_acount = _this$state.new_acount, hasBind = _this$state.hasBind, isEdit = _this$state.isEdit;
              params = {
                alipay_name: name,
                alipay_account: !hasBind ? acount : new_acount
              };
              _context.next = 4;
              return _index4.default.distribution.update(params);

            case 4:
              _ref3 = _context.sent;
              list = _ref3.list;
              _list$ = list[0], alipay_name = _list$.alipay_name, alipay_account = _list$.alipay_account;

              _this.setState({
                name: alipay_name,
                acount: alipay_account,
                new_acount: '',
                isEdit: false
              });

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DistributionWithdrawalsAcount, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(DistributionWithdrawalsAcount.prototype.__proto__ || Object.getPrototypeOf(DistributionWithdrawalsAcount.prototype), "_constructor", this).call(this, props);

      this.state = {
        acount: '',
        name: '',
        new_acount: '',
        hasBind: false,
        isEdit: false
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
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _ref5, alipay_name, alipay_account;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _index4.default.distribution.info();

              case 2:
                _ref5 = _context2.sent;
                alipay_name = _ref5.alipay_name;
                alipay_account = _ref5.alipay_account;

                this.setState({
                  name: alipay_name,
                  acount: alipay_account,
                  hasBind: !!alipay_name && !!alipay_account
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch() {
        return _ref4.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          name = _state.name,
          acount = _state.acount,
          isEdit = _state.isEdit,
          hasBind = _state.hasBind;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return DistributionWithdrawalsAcount;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleChange", "handleSubmit", "handleClick"], _temp2);
exports.default = DistributionWithdrawalsAcount;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(DistributionWithdrawalsAcount, true));