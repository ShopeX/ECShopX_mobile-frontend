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

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../utils/index.js");

var _index7 = require("../../spx/index.js");

var _index8 = _interopRequireDefault(_index7);

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
var TabBar = (_dec = (0, _index3.connect)(function (_ref) {
  var tabBar = _ref.tabBar;
  return {
    tabBar: tabBar.current
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(TabBar, _BaseComponent);

  function TabBar() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, TabBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = TabBar.__proto__ || Object.getPrototypeOf(TabBar)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["color", "backgroundColor", "selectedColor", "tabList", "current", "tabBar", "cartTotalCount"], _this.handleClick = function (current) {
      var cur = _this.state.current;

      if (cur !== current) {
        var curTab = _this.state.tabList[current];
        var url = curTab.url,
            urlRedirect = curTab.urlRedirect,
            withLogin = curTab.withLogin;

        var _getCurrentRoute = (0, _index6.getCurrentRoute)(_this.$router),
            fullPath = _getCurrentRoute.fullPath;

        if (withLogin && !_index8.default.getAuthToken()) {
          return _index2.default.redirectTo({
            url: "/pages/auth/wxauth"
          });
        }

        if (url && fullPath !== url) {
          if (!urlRedirect || url === '/pages/member/index' && !_index8.default.getAuthToken()) {
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
        backgroundColor: '',
        color: '',
        selectedColor: '',
        tabList: []
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _props$tabBar = this.props.tabBar,
          config = _props$tabBar.config,
          data = _props$tabBar.data;
      var backgroundColor = config.backgroundColor,
          color = config.color,
          selectedColor = config.selectedColor;

      this.setState({
        backgroundColor: backgroundColor,
        color: color,
        selectedColor: selectedColor
      });
      var list = [];
      data.map(function (item) {
        var obj = {
          title: item.text,
          iconType: item.iconPath && item.selectedIconPath ? '' : item.name,
          iconPrefixClass: 'icon',
          image: item.iconPath,
          selectedImage: item.selectedIconPath,
          url: item.pagePath,
          urlRedirect: true
        };
        if (item.name === 'cart') {
          Object.assign(obj, { withLogin: true });
        }
        if (item.name === 'member') {
          Object.assign(obj, { withLogin: true, text: _this2.props.cartTotalCount || '', max: '99' });
        }
        list.push(obj);
      });
      this.setState({
        tabList: list
      }, function () {
        _this2.updateCurTab();
      });
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      if (this.state.tabList.length > 0) {
        this.fetchCart();
      }
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

      var _getCurrentRoute2 = (0, _index6.getCurrentRoute)(this.$router),
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
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this3 = this;

        var tabList, cartTabIdx, updateCartCount, _getCurrentRoute3, path, _ref4, item_count;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_index8.default.getAuthToken()) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                tabList = this.state.tabList;
                cartTabIdx = tabList.findIndex(function (item) {
                  return item.url.indexOf('cart') !== -1;
                });

                updateCartCount = function updateCartCount(count) {
                  tabList[cartTabIdx].text = count || '';
                  _this3.setState({
                    tabList: tabList
                  });
                };

                _getCurrentRoute3 = (0, _index6.getCurrentRoute)(this.$router), path = _getCurrentRoute3.path;

                if (!(path === this.state.tabList[cartTabIdx].url)) {
                  _context.next = 9;
                  break;
                }

                updateCartCount('');
                return _context.abrupt("return");

              case 9:
                _context.prev = 9;
                _context.next = 12;
                return _index5.default.cart.count();

              case 12:
                _ref4 = _context.sent;
                item_count = _ref4.item_count;

                updateCartCount(item_count);
                _context.next = 20;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](9);

                console.error(_context.t0);

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[9, 17]]);
      }));

      function fetchCart() {
        return _ref3.apply(this, arguments);
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
}(_index.Component), _class2.properties = {
  "tabBar": {
    "type": null,
    "value": null
  },
  "cartTotalCount": {
    "type": null,
    "value": null
  },
  "current": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleClick"], _class2.options = {
  addGlobalClass: true
}, _temp2)) || _class);
exports.default = TabBar;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TabBar));