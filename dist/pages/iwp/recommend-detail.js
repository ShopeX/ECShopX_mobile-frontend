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

var _index6 = require("../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = recommendDetail.__proto__ || Object.getPrototypeOf(recommendDetail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "praiseCheckStatus", "collectArticleStatus"], _this.praiseCheck = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var id, _ref3, status;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = _this.$router.params.id;
              _context.next = 3;
              return _index4.default.article.praiseCheck(id);

            case 3:
              _ref3 = _context.sent;
              status = _ref3.status;

              _this.setState({
                praiseCheckStatus: status
              });

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleClickBar = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(recommendDetail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(recommendDetail.prototype.__proto__ || Object.getPrototypeOf(recommendDetail.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: null,
        praiseCheckStatus: false,
        collectArticleStatus: false
      };
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetch();
      // this.praiseCheck()
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "fetch",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var id, resFocus, res, info;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                id = this.$router.params.id;
                _context3.next = 3;
                return _index4.default.article.focus(id);

              case 3:
                resFocus = _context3.sent;
                _context3.next = 6;
                return _index4.default.article.delCollectArticleInfo({ article_id: id });

              case 6:
                res = _context3.sent;

                if (res.length === 0) {
                  this.setState({
                    collectArticleStatus: false
                  });
                } else {
                  this.setState({
                    collectArticleStatus: true
                  });
                }

                if (!resFocus) {
                  _context3.next = 21;
                  break;
                }

                if (!_index7.default.getAuthToken()) {
                  _context3.next = 15;
                  break;
                }

                _context3.next = 12;
                return _index4.default.article.authDetail(id);

              case 12:
                _context3.t0 = _context3.sent;
                _context3.next = 18;
                break;

              case 15:
                _context3.next = 17;
                return _index4.default.article.detail(id);

              case 17:
                _context3.t0 = _context3.sent;

              case 18:
                info = _context3.t0;


                info.updated_str = (0, _index5.formatTime)(info.updated * 1000, 'YYYY-MM-DD');
                this.setState({
                  info: info
                });

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetch() {
        return _ref5.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          praiseCheckStatus = _state.praiseCheckStatus,
          collectArticleStatus = _state.collectArticleStatus;


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