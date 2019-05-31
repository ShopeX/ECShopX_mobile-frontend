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

var _index5 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var recommendDetail = (_temp2 = _class = function (_BaseComponent) {
  _inherits(recommendDetail, _BaseComponent);

  function recommendDetail() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, recommendDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = recommendDetail.__proto__ || Object.getPrototypeOf(recommendDetail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info"], _this.handleClickBar = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type) {
        var id, resPraise, resCollectArticle;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = _this.$router.params.id;

                if (!(type === 'like')) {
                  _context.next = 6;
                  break;
                }

                _context.next = 4;
                return _index4.default.article.praise(id);

              case 4:
                resPraise = _context.sent;

                console.log(resPraise, 48);

              case 6:
                if (!(type === 'mark')) {
                  _context.next = 10;
                  break;
                }

                _context.next = 9;
                return _index4.default.article.collectArticle(id);

              case 9:
                resCollectArticle = _context.sent;

              case 10:
                console.log(type);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(recommendDetail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(recommendDetail.prototype.__proto__ || Object.getPrototypeOf(recommendDetail.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: null
      };
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetch();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var id, resFocus, info;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = this.$router.params.id;
                _context2.next = 3;
                return _index4.default.article.focus(id);

              case 3:
                resFocus = _context2.sent;

                if (!resFocus) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 7;
                return _index4.default.article.detail(id);

              case 7:
                info = _context2.sent;


                console.log(info, 27);

                info.updated_str = (0, _index5.formatTime)(info.updated * 1000, 'YYYY-MM-DD');
                this.setState({
                  info: info
                });

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch() {
        return _ref3.apply(this, arguments);
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

      var info = this.__state.info;


      if (!info) {
        return null;
      }

      console.log(info.content, 44);

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return recommendDetail;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleClickBar"], _temp2);
exports.default = recommendDetail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(recommendDetail, true));