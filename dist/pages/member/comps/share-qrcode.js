"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../utils/index.js");

var _index4 = require("../../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RateItem = (_temp2 = _class = function (_BaseComponent) {
  _inherits(RateItem, _BaseComponent);

  function RateItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RateItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RateItem.__proto__ || Object.getPrototypeOf(RateItem)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["isOpened", "qrCode"], _this.handleCloseQrcode = function () {
      _this.setState({
        isOpened: false
      });
    }, _this.handleClickCopy = function () {
      (0, _index3.copyText)(_this.imgUrl);
      _index7.default.toast('复制成功');
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RateItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(RateItem.prototype.__proto__ || Object.getPrototypeOf(RateItem.prototype), "_constructor", this).call(this, props);

      this.state = {
        isOpened: true,
        qrCode: ''
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
                return _index5.default.member.h5_qrcodeData();

              case 2:
                res = _context.sent;

                this.imgUrl = res.share_uir;
                this.setState({
                  qrCode: res.share_qrcode
                });

              case 5:
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
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      this.setState({
        isOpened: true
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
          isOpened = _state.isOpened,
          qrCode = _state.qrCode;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return RateItem;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleCloseQrcode", "handleClickCopy"], _class.defaultProps = {
  isOpened: false
}, _temp2);
exports.default = RateItem;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(RateItem));