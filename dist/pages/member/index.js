"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _dec2, _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _index4 = require("../../hocs/index.js");

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

var _index7 = require("../../spx/index.js");

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MemberIndex = (_dec = (0, _index3.connect)(function () {
  return {};
}, function (dispatch) {
  return {
    onFetchFavs: function onFetchFavs(favs) {
      return dispatch({ type: 'member/favs', payload: favs });
    }
  };
}), _dec2 = (0, _index4.withLogin)(), _dec(_class = _dec2(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(MemberIndex, _BaseComponent);

  function MemberIndex() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, MemberIndex);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MemberIndex.__proto__ || Object.getPrototypeOf(MemberIndex)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "isAvatatImg", "ordersCount", "__fn_onFetchFavs"], _this.handleClickRecommend = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var info;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              info = _this.state.info;

              if (info.is_open_popularize) {
                _context.next = 4;
                break;
              }

              _index8.default.toast('未开启推广');
              return _context.abrupt("return");

            case 4:
              if (!(info.is_open_popularize && !info.is_promoter)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return _index6.default.member.promoter();

            case 7:

              _index2.default.navigateTo({
                url: '/pages/member/recommend'
              });

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleClickApp = function () {
      console.log('跳转统合小程序');
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MemberIndex, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(MemberIndex.prototype.__proto__ || Object.getPrototypeOf(MemberIndex.prototype), "_constructor", this).call(this, props);
      this.state = {
        ordersCount: {
          normal_payed_daifahuo: '',
          normal_payed_daishouhuo: ''
        },
        info: {
          deposit: '',
          point: '',
          coupon: '',
          luckdraw: '',
          username: ''
        }
      };
    }
  }, {
    key: "navigateTo",
    value: function navigateTo(url) {
      _index2.default.navigateTo({ url: url });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _ref4, _ref5, res, favs;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Promise.all([_index6.default.member.memberInfo(), _index6.default.member.favsList()]);

              case 2:
                _ref4 = _context2.sent;
                _ref5 = _slicedToArray(_ref4, 2);
                res = _ref5[0];
                favs = _ref5[1].list;

                this.__triggerPropsFn("onFetchFavs", [null].concat([favs]));
                this.setState({
                  info: {
                    deposit: res.deposit ? (res.deposit / 100).toFixed(2) : 0,
                    point: res.point ? res.point : 0,
                    coupon: res.coupon ? res.coupon : 0,
                    luckdraw: res.luckdraw ? res.luckdraw : 0,
                    is_promoter: res.is_promoter,
                    is_open_popularize: res.is_open_popularize,
                    username: res.memberInfo.username,
                    avatar: res.memberInfo.avatar
                  }
                });

              case 8:
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

      var _state = this.__state,
          ordersCount = _state.ordersCount,
          info = _state.info;

      var isAvatatImg = void 0;
      if (info.avatar) {
        isAvatatImg = true;
      }

      Object.assign(this.__state, {
        isAvatatImg: isAvatatImg
      });
      return this.__state;
    }
  }]);

  return MemberIndex;
}(_index.Component), _class2.properties = {
  "__fn_onFetchFavs": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["navigateTo", "handleClickApp"], _temp2)) || _class) || _class);
exports.default = MemberIndex;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(MemberIndex, true));