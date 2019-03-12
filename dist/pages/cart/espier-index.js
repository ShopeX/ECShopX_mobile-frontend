"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _dec2, _class, _class2, _temp2;
// import api from '@/api'


var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _index4 = require("../../utils/index.js");

var _index5 = require("../../hocs/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CartIndex = (_dec = (0, _index3.connect)(function (_ref) {
  var cart = _ref.cart;
  return {
    list: cart.list,
    defaultAllSelect: true
  };
}, function (dispatch) {
  return {
    onCartUpdate: function onCartUpdate(item, num) {
      return dispatch({ type: 'cart/update', payload: { item: item, num: num } });
    },
    onCartDel: function onCartDel(item) {
      return dispatch({ type: 'cart/delete', payload: item });
    },
    onCartSelection: function onCartSelection(selection) {
      return dispatch({ type: 'cart/selection', payload: selection });
    }
  };
}), _dec2 = (0, _index5.withLogin)(), _dec(_class = _dec2(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(CartIndex, _BaseComponent);

  function CartIndex() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, CartIndex);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = CartIndex.__proto__ || Object.getPrototypeOf(CartIndex)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp3", "loopArray0", "list", "isEmpty", "cartList", "cartMode", "totalPrice", "totalItems", "selection", "defaultAllSelect", "__fn_onCartSelection", "__fn_onCartUpdate", "__fn_onCartDel", "isTotalChecked"], _this.toggleCartMode = function () {
      var cartMode = _this.state.cartMode !== 'edit' ? 'edit' : 'default';
      _this.setState({
        cartMode: cartMode
      });
    }, _this.handleAllSelect = function (checked) {
      var selection = _this.state.selection;
      var list = _this.props.list;


      if (checked) {
        list.forEach(function (item) {
          selection.add(item.item_id);
        });
      } else {
        selection.clear();
      }

      _this.setState({
        selection: new Set(selection)
      });
      _this.__triggerPropsFn("onCartSelection", [null].concat([[].concat(_toConsumableArray(selection))]));
    }, _this.handleDelect = function () {
      var selection = [].concat(_toConsumableArray(_this.state.selection));
      selection.forEach(function (item_id) {
        _this.__triggerPropsFn("onCartDel", [null].concat([{ item_id: item_id }]));
      });

      _this.setState({
        selection: new Set(selection)
      });
      _this.__triggerPropsFn("onCartSelection", [null].concat([selection]));
    }, _this.handleCheckout = function () {
      _index2.default.navigateTo({
        url: '/pages/cart/espier-checkout'
      });
    }, _this.navigateTo = _index4.navigateTo, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CartIndex, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CartIndex.prototype.__proto__ || Object.getPrototypeOf(CartIndex.prototype), "_constructor", this).call(this, props);

      this.state = {
        selection: new Set(),
        totalPrice: '0.00',
        cartMode: 'default'
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.defaultAllSelect) {
        this.handleAllSelect(true);
      }
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      // this.fetch()
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
        return _ref3.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "handleSelectionChange",
    value: function handleSelectionChange(item_id, checked) {
      this.state.selection[checked ? 'add' : 'delete'](item_id);
      var selection = new Set(this.state.selection);

      this.setState({
        selection: selection
      });
      this.__triggerPropsFn("onCartSelection", [null].concat([[].concat(_toConsumableArray(selection))]));

      _index4.log.debug("[cart change] item: " + item_id + ", selection: " + selection);
    }
  }, {
    key: "handleQuantityChange",
    value: function handleQuantityChange(idx, quantity) {
      var item = this.props.list[idx];
      this.__triggerPropsFn("onCartUpdate", [null].concat([item, quantity]));
    }
  }, {
    key: "transformCartList",
    value: function transformCartList(list) {
      return (0, _index4.pickBy)(list, {
        item_id: 'item_id',
        title: 'item_name',
        desc: 'brief',
        curSymbol: 'cur.symbol',
        img: function img(_ref4) {
          var pics = _ref4.pics;
          return pics[0];
        },
        price: function price(_ref5) {
          var _price = _ref5.price;
          return (+_price / 100).toFixed(2);
        },
        market_price: function market_price(_ref6) {
          var _market_price = _ref6.market_price;
          return (+_market_price / 100).toFixed(2);
        },
        quantity: 'num'
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var list = this.__props.list;
      var _state = this.__state,
          selection = _state.selection,
          totalPrice = _state.totalPrice,
          cartMode = _state.cartMode;


      if (!list) {
        return null;
      }

      var totalSelection = selection.size;
      var totalItems = totalSelection;
      var isEmpty = !list.length;

      var cartList = this.transformCartList(list);

      var anonymousState__temp3 = cartMode !== 'edit' ? totalItems <= 0 : null;
      var loopArray0 = cartList.map(function (item, idx) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = selection.has(item.$original.item_id);
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp3: anonymousState__temp3,
        loopArray0: loopArray0,
        list: list,
        isEmpty: isEmpty,
        cartList: cartList,
        totalItems: totalItems,
        isTotalChecked: this.isTotalChecked
      });
      return this.__state;
    }
  }, {
    key: "isTotalChecked",
    get: function get() {
      return this.props.list.length === this.state.selection.size;
    }
  }]);

  return CartIndex;
}(_index.Component), _class2.properties = {
  "defaultAllSelect": {
    "type": null,
    "value": null
  },
  "list": {
    "type": null,
    "value": null
  },
  "__fn_onCartSelection": {
    "type": null,
    "value": null
  },
  "__fn_onCartUpdate": {
    "type": null,
    "value": null
  },
  "__fn_onCartDel": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["toggleCartMode", "handleSelectionChange", "handleQuantityChange", "navigateTo", "handleAllSelect", "handleCheckout", "handleDelect"], _temp2)) || _class) || _class);
exports.default = CartIndex;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CartIndex, true));