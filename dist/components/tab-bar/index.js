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

// @connect(({ cart }) => ({
//   cart,
//   cartTotalCount: getTotalCount(cart)
// }), (dispatch) => ({
//   onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: { list } })
// }))
var TabBar = (_temp2 = _class = function (_BaseComponent) {
  _inherits(TabBar, _BaseComponent);

  function TabBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TabBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TabBar.__proto__ || Object.getPrototypeOf(TabBar)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["tabList", "current", "cartTotalCount"], _this.handleClick = function (current) {
      var cur = _this.state.current;

      if (cur !== current) {
        var curTab = _this.state.tabList[current];
        var url = curTab.url,
            urlRedirect = curTab.urlRedirect,
            withLogin = curTab.withLogin;

        var _getCurrentRoute = (0, _index5.getCurrentRoute)(_this.$router),
            fullPath = _getCurrentRoute.fullPath;

        if (withLogin && !_index7.default.getAuthToken()) {
          return _index2.default.redirectTo({
            url: '/pages/auth/login'
          });
        }

        if (url && fullPath !== url) {
          if (!urlRedirect || url === '/pages/member/index' && !_index7.default.getAuthToken()) {
            _index2.default.navigateTo({ url: url });
          } else {
            _index2.default.redirectTo({ url: url });
          }
        }
      }
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TabBar, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TabBar.prototype.__proto__ || Object.getPrototypeOf(TabBar.prototype), "_constructor", this).call(this, props);

      this.state = {
        current: 0,
        tabList: [{ title: '首页', iconType: 'home', iconPrefixClass: 'in-icon', url: '/pages/home/index', urlRedirect: true }, { title: '分类', iconType: 'menu', iconPrefixClass: 'in-icon', url: '/pages/category/index', urlRedirect: true }, { title: '种草', iconType: 'grass', iconPrefixClass: 'in-icon', url: '/pages/recommend/list', urlRedirect: true }, { title: '购物车', iconType: 'cart', iconPrefixClass: 'in-icon', url: '/pages/cart/espier-index', text: this.props.cartTotalCount || '', max: '99', withLogin: true, urlRedirect: true }, { title: '个人中心', iconType: 'user', iconPrefixClass: 'in-icon', url: '/pages/member/index', urlRedirect: true, withLogin: true }]
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateCurTab();
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetchCart();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.current !== undefined) {
        this.setState({ current: nextProps.current });
      }
    }
  }, {
    key: "updateCurTab",
    value: function updateCurTab() {
      this.fetchCart();
      var _state = this.state,
          tabList = _state.tabList,
          current = _state.current;

      var _getCurrentRoute2 = (0, _index5.getCurrentRoute)(this.$router),
          fullPath = _getCurrentRoute2.fullPath;

      var url = tabList[current].url;

      if (url && url !== fullPath) {
        var nCurrent = tabList.findIndex(function (t) {
          return t.url === fullPath;
        }) || 0;
        this.setState({
          current: nCurrent
        });
      }
    }
  }, {
    key: "fetchCart",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var cartTabIdx, updateCartCount, _getCurrentRoute3, path, _ref3, item_count;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_index7.default.getAuthToken()) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                cartTabIdx = 3;

                updateCartCount = function updateCartCount(count) {
                  var tabList = _this2.state.tabList;

                  tabList[cartTabIdx].text = count || '';
                  _this2.setState({
                    tabList: tabList
                  });
                };

                _getCurrentRoute3 = (0, _index5.getCurrentRoute)(this.$router), path = _getCurrentRoute3.path;

                if (!(path === this.state.tabList[cartTabIdx].url)) {
                  _context.next = 8;
                  break;
                }

                updateCartCount('');
                return _context.abrupt("return");

              case 8:
                _context.prev = 8;
                _context.next = 11;
                return _index4.default.cart.count();

              case 11:
                _ref3 = _context.sent;
                item_count = _ref3.item_count;

                updateCartCount(item_count);
                _context.next = 19;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](8);

                console.error(_context.t0);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[8, 16]]);
      }));

      function fetchCart() {
        return _ref2.apply(this, arguments);
      }

      return fetchCart;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state2 = this.__state,
          tabList = _state2.tabList,
          current = _state2.current;

      // eslint-disable-next-line

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return TabBar;
}(_index.Component), _class.properties = {
  "cartTotalCount": {
    "type": null,
    "value": null
  },
  "current": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleClick"], _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = TabBar;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TabBar));