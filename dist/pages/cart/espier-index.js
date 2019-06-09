"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _dec2, _class, _class2, _temp2, _initialiseProps;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _index4 = require("../../utils/index.js");

var _debounce = require("../../npm/lodash/debounce.js");

var _debounce2 = _interopRequireDefault(_debounce);

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

var _index7 = require("../../hocs/index.js");

var _cart = require("../../store/cart.js");

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
    cartIds: cart.cartIds,
    defaultAllSelect: false,
    totalPrice: (0, _cart.getTotalPrice)(cart),
    // workaround for none selection cartItem num change
    totalItems: (0, _cart.getTotalCount)(cart, true)
  };
}, function (dispatch) {
  return {
    onUpdateCartNum: function onUpdateCartNum(cart_id, num) {
      return dispatch({ type: 'cart/updateNum', payload: { cart_id: cart_id, num: +num } });
    },
    onUpdateCart: function onUpdateCart(list) {
      return dispatch({ type: 'cart/update', payload: list });
    },
    onCartSelection: function onCartSelection(selection) {
      return dispatch({ type: 'cart/selection', payload: selection });
    }
  };
}), _dec2 = (0, _index7.withLogin)(), _dec(_class = (0, _index7.withPager)(_class = _dec2(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(CartIndex, _BaseComponent);

  function CartIndex() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, CartIndex);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = CartIndex.__proto__ || Object.getPrototypeOf(CartIndex)).call.apply(_ref2, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CartIndex, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(CartIndex.prototype.__proto__ || Object.getPrototypeOf(CartIndex.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        loading: true,
        selection: new Set(),
        cartMode: 'default',
        curPromotions: null,
        groups: [],
        likeList: [],
        invalidList: []
      });

      this.updating = false;
      this.lastCartId = null;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.fetchCart(function (list) {
        if (_this2.props.defaultAllSelect) {
          _this2.handleAllSelect(true);
        }
        var groups = _this2.resolveActivityGroup(list);
        var selection = [];
        list.forEach(function (shopCart) {
          var checkedIds = shopCart.list.filter(function (t) {
            return t.is_checked;
          }).map(function (t) {
            return t.cart_id;
          });

          selection = [].concat(_toConsumableArray(selection), _toConsumableArray(checkedIds));
        });
        _this2.updateSelection(selection);

        // this.props.list 此时为空数组
        setTimeout(function () {
          _this2.setState({
            groups: groups,
            loading: false
          });
        }, 40);
      });

      this.nextPage();
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      if (this.state.loading) {
        return;
      }this.updateCart();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.list !== this.props.list) {
        var groups = this.resolveActivityGroup(nextProps.list);
        this.setState({
          groups: groups
        });
      }
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var page, pageSize, query, _ref4, list, total, nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                query = {
                  page: page,
                  pageSize: pageSize
                };
                _context.next = 4;
                return _index6.default.cart.likeList(query);

              case 4:
                _ref4 = _context.sent;
                list = _ref4.list;
                total = _ref4.total_count;
                nList = (0, _index4.pickBy)(list, {
                  img: 'pics[0]',
                  item_id: 'item_id',
                  title: 'itemName',
                  desc: 'brief'
                });


                this.setState({
                  likeList: [].concat(_toConsumableArray(this.state.likeList), _toConsumableArray(nList))
                });

                return _context.abrupt("return", {
                  total: total
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch(_x) {
        return _ref3.apply(this, arguments);
      }

      return fetch;
    }()

    // 活动分组

  }, {
    key: "resolveActivityGroup",
    value: function resolveActivityGroup(cartList) {
      var groups = cartList.map(function (shopCart) {
        var list = shopCart.list,
            _shopCart$used_activi = shopCart.used_activity,
            used_activity = _shopCart$used_activi === undefined ? [] : _shopCart$used_activi;

        var tDict = list.reduce(function (acc, val) {
          acc[val.cart_id] = val;
          return acc;
        }, {});
        var activityGrouping = shopCart.activity_grouping;
        var group = used_activity.map(function (act) {
          var activity = activityGrouping.find(function (a) {
            return String(a.activity_id) === String(act.activity_id);
          });
          var itemList = activity.cart_ids.map(function (id) {
            var cartItem = tDict[id];
            delete tDict[id];
            return cartItem;
          });

          return {
            activity: activity,
            list: itemList
          };
        });

        // 无活动列表
        group.push({
          activity: null,
          list: Object.values(tDict)
        });

        return group;
      });
      console.log(groups, 158);
      return groups;
    }
  }, {
    key: "fetchCart",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(cb) {
        var _this3 = this;

        var _ref6, valid_cart, invalid_cart, list, invalidList;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _index6.default.cart.get();

              case 2:
                _ref6 = _context2.sent;
                valid_cart = _ref6.valid_cart;
                invalid_cart = _ref6.invalid_cart;
                list = valid_cart.map(function (shopCart) {
                  var tList = _this3.transformCartList(shopCart.list);
                  return _extends({}, shopCart, {
                    list: tList
                  });
                });
                invalidList = this.transformCartList(invalid_cart);

                this.setState({
                  invalidList: invalidList
                });

                _index4.log.debug('[cart fetchCart]', list);
                this.__triggerPropsFn("onUpdateCart", [null].concat([list]));
                cb && cb(list);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchCart(_x2) {
        return _ref5.apply(this, arguments);
      }

      return fetchCart;
    }()
  }, {
    key: "updateSelection",
    value: function updateSelection() {
      var selection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      this.setState({
        selection: new Set(selection)
      });

      this.__triggerPropsFn("onCartSelection", [null].concat([selection]));
    }
  }, {
    key: "handleSelectionChange",
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(cart_id, checked) {
        var selection;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                selection = this.state.selection;

                selection[checked ? 'add' : 'delete'](cart_id);
                this.updateSelection([].concat(_toConsumableArray(selection)));

                _context3.next = 5;
                return _index6.default.cart.select({
                  cart_id: cart_id,
                  is_checked: checked
                });

              case 5:

                _index4.log.debug("[cart change] item: " + cart_id + ", selection:", selection);
                this.updateCart();

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function handleSelectionChange(_x4, _x5) {
        return _ref7.apply(this, arguments);
      }

      return handleSelectionChange;
    }()
  }, {
    key: "changeCartNum",
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(cart_id, num) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.updateCart.cancel();
                _context4.next = 3;
                return _index6.default.cart.updateNum({ cart_id: cart_id, num: num });

              case 3:
                this.updateCart();

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function changeCartNum(_x6, _x7) {
        return _ref8.apply(this, arguments);
      }

      return changeCartNum;
    }()
  }, {
    key: "transformCartList",
    value: function transformCartList(list) {
      return (0, _index4.pickBy)(list, {
        item_id: 'item_id',
        cart_id: 'cart_id',
        activity_id: 'activity_id',
        title: 'item_name',
        desc: 'brief',
        is_checked: 'is_checked',
        store: 'store',
        curSymbol: 'cur.symbol',
        promotions: function promotions(_ref9) {
          var _ref9$promotions = _ref9.promotions,
              _promotions = _ref9$promotions === undefined ? [] : _ref9$promotions,
              cart_id = _ref9.cart_id;

          return _promotions.map(function (p) {
            p.cart_id = cart_id;
            return p;
          });
        },
        img: function img(_ref10) {
          var pics = _ref10.pics;
          return pics;
        },
        price: function price(_ref11) {
          var _price = _ref11.price;
          return (+_price / 100).toFixed(2);
        },
        market_price: function market_price(_ref12) {
          var _market_price = _ref12.market_price;
          return (+_market_price / 100).toFixed(2);
        },
        num: 'num'
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this4 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          selection = _state.selection,
          groups = _state.groups,
          invalidList = _state.invalidList,
          cartMode = _state.cartMode,
          loading = _state.loading,
          curPromotions = _state.curPromotions,
          likeList = _state.likeList,
          page = _state.page;
      var _props = this.__props,
          totalPrice = _props.totalPrice,
          list = _props.list;


      if (loading) {
        return null;
      }

      var totalSelection = selection.size;
      var totalItems = totalSelection;
      var isEmpty = !list.length;

      var anonymousState__temp3 = list.length && list[0].discount_fee > 0 ? cartMode !== 'edit' ? -1 * list[0].discount_fee : null : null;
      var anonymousState__temp4 = cartMode !== 'edit' ? totalItems <= 0 : null;
      var anonymousState__temp5 = Boolean(curPromotions);
      var loopArray0 = groups.map(function (activityGroup, idx) {
        activityGroup = {
          $original: (0, _index.internal_get_original)(activityGroup)
        };
        var $anonymousCallee__1 = activityGroup.$original.map(function (shopCart) {
          shopCart = {
            $original: (0, _index.internal_get_original)(shopCart)
          };

          var activity = shopCart.$original.activity;


          var $anonymousCallee__0 = shopCart.$original.list.length > 0 ? shopCart.$original.list.map(function (item) {
            item = {
              $original: (0, _index.internal_get_original)(item)
            };
            var $loopState__temp2 = shopCart.$original.list.length > 0 ? selection.has(item.$original.cart_id) : null;
            return {
              activity: shopCart.activity,
              $loopState__temp2: $loopState__temp2,
              $original: item.$original
            };
          }) : [];
          return {
            activity: activity,
            $anonymousCallee__0: $anonymousCallee__0,
            $original: shopCart.$original
          };
        });
        return {
          $anonymousCallee__1: $anonymousCallee__1,
          $original: activityGroup.$original
        };
      });
      var loopArray1 = likeList.length ? likeList.map(function (item, __index0) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        _this4.anonymousFunc0Array[__index0] = function () {
          return _this4.handleClickItem(item.$original);
        };

        return {
          $original: item.$original
        };
      }) : [];
      Object.assign(this.__state, {
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        loopArray0: loopArray0,
        loopArray1: loopArray1,
        list: list,
        page: page,
        isEmpty: isEmpty,
        totalPrice: totalPrice,
        isTotalChecked: this.isTotalChecked
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(__index0, e) {
      ;
      this.anonymousFunc0Array[__index0] && this.anonymousFunc0Array[__index0](e);
    }
  }, {
    key: "isTotalChecked",
    get: function get() {
      return this.props.cartIds.length === this.state.selection.size;
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
  "__fn_onUpdateCart": {
    "type": null,
    "value": null
  },
  "cartIds": {
    "type": null,
    "value": null
  },
  "__fn_onCartSelection": {
    "type": null,
    "value": null
  },
  "__fn_onUpdateCartNum": {
    "type": null,
    "value": null
  },
  "totalPrice": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["nextPage", "handleQuantityChange", "handleClickPromotion", "handleClickToDetail", "handleSelectionChange", "handleDelect", "navigateTo", "anonymousFunc0", "handleAllSelect", "handleCheckout", "handleClosePromotions", "handleSelectPromotion"], _class2.defaultProps = {
  totalPrice: '0.00',
  list: null
}, _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.$usedState = ["anonymousState__temp3", "anonymousState__temp4", "anonymousState__temp5", "loopArray0", "loopArray1", "loading", "groups", "list", "invalidList", "likeList", "page", "isEmpty", "cartMode", "totalPrice", "curPromotions", "selection", "defaultAllSelect", "__fn_onUpdateCart", "cartIds", "__fn_onCartSelection", "__fn_onUpdateCartNum", "isTotalChecked"];

  this.handleClickItem = function (item) {
    var url = "/pages/item/espier-detail?id=" + item.item_id;
    _index2.default.navigateTo({
      url: url
    });
  };

  this.updateCart = (0, _debounce2.default)(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _this5.updating = true;
            _context5.prev = 1;
            _context5.next = 4;
            return _this5.fetchCart();

          case 4:
            _context5.next = 9;
            break;

          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5["catch"](1);

            console.log(_context5.t0);

          case 9:
            _this5.updating = false;

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, _this5, [[1, 6]]);
  })), 600);

  this.toggleCartMode = function () {
    var cartMode = _this5.state.cartMode !== 'edit' ? 'edit' : 'default';
    _this5.setState({
      cartMode: cartMode
    });
  };

  this.handleDelect = function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(cart_id) {
      var res, cartIds;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _index2.default.showModal({
                title: '将当前商品移出购物车?',
                showCancel: true,
                cancel: '取消',
                confirmText: '确认',
                confirmColor: '#0b4137'
              });

            case 2:
              res = _context6.sent;

              if (res.confirm) {
                _context6.next = 5;
                break;
              }

              return _context6.abrupt("return");

            case 5:
              _context6.next = 7;
              return _index6.default.cart.del({ cart_id: cart_id });

            case 7:
              cartIds = _this5.props.cartIds.filter(function (t) {
                return t !== cart_id;
              });


              _this5.updateSelection(cartIds);
              _this5.updateCart();

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, _this5);
    }));

    return function (_x8) {
      return _ref14.apply(this, arguments);
    };
  }();

  this.debounceChangeCartNum = (0, _debounce2.default)(function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(cart_id, num) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return _this5.changeCartNum(cart_id, num);

            case 2:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, _this5);
    }));

    return function (_x9, _x10) {
      return _ref15.apply(this, arguments);
    };
  }(), 400);

  this.handleQuantityChange = function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(cart_id, num, e) {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              e.stopPropagation();
              _this5.updating = true;
              _this5.__triggerPropsFn("onUpdateCartNum", [null].concat([cart_id, num]));
              _this5.updateCart.cancel();

              if (!(_this5.lastCartId === cart_id || _this5.lastCartId === undefined)) {
                _context8.next = 9;
                break;
              }

              _context8.next = 7;
              return _this5.debounceChangeCartNum(cart_id, num);

            case 7:
              _context8.next = 12;
              break;

            case 9:
              _this5.lastCartId = cart_id;
              _context8.next = 12;
              return _this5.changeCartNum(cart_id, num);

            case 12:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, _this5);
    }));

    return function (_x11, _x12, _x13) {
      return _ref16.apply(this, arguments);
    };
  }();

  this.handleAllSelect = function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(checked) {
      var selection, cartIds;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              selection = _this5.state.selection;
              cartIds = _this5.props.cartIds;


              if (checked) {
                cartIds.forEach(function (cartId) {
                  return selection.add(cartId);
                });
              } else {
                selection.clear();
              }

              _index2.default.showLoading();
              _context9.prev = 4;
              _context9.next = 7;
              return _index6.default.cart.select({
                cart_id: cartIds,
                is_checked: checked
              });

            case 7:
              _context9.next = 12;
              break;

            case 9:
              _context9.prev = 9;
              _context9.t0 = _context9["catch"](4);

              console.log(_context9.t0);

            case 12:
              _index2.default.hideLoading();
              _this5.updateSelection([].concat(_toConsumableArray(selection)));

            case 14:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, _this5, [[4, 9]]);
    }));

    return function (_x14) {
      return _ref17.apply(this, arguments);
    };
  }();

  this.handleClickPromotion = function (cart_id, e) {
    _this5.isTodetail = 0;
    var promotions = void 0;
    _this5.props.list.some(function (cart) {
      cart.list.some(function (item) {
        if (item.cart_id === cart_id) {
          promotions = item.promotions.slice();
        }
      });
    });

    _this5.setState({
      curPromotions: promotions
    }, function () {
      _this5.isTodetail = 1;
    });
  };

  this.handleClickToDetail = function (item_id) {
    if (_this5.isTodetail === 0) {
      return false;
    }
    _this5.isTodetail = 1;
    _index2.default.navigateTo({
      url: "/pages/item/espier-detail?id=" + item_id
    });
  };

  this.handleSelectPromotion = function () {
    var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(item) {
      var activity_id, cart_id;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              activity_id = item.marketing_id, cart_id = item.cart_id;

              _index2.default.showLoading({
                mask: true
              });
              _this5.setState({
                curPromotions: null
              });
              _context10.next = 5;
              return _index6.default.cart.updatePromotion({
                activity_id: activity_id,
                cart_id: cart_id
              });

            case 5:
              _context10.next = 7;
              return _this5.fetchCart();

            case 7:
              _index2.default.hideLoading();

            case 8:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, _this5);
    }));

    return function (_x15) {
      return _ref18.apply(this, arguments);
    };
  }();

  this.handleClosePromotions = function () {
    _this5.setState({
      curPromotions: null
    });
  };

  this.handleCheckout = function () {
    if (_this5.updating) {
      _index2.default.showToast({
        title: '正在计算价格，请稍后',
        icon: 'none'
      });
      return;
    }

    _index2.default.navigateTo({
      url: '/pages/cart/espier-checkout?cart_type=cart'
    });
  };

  this.navigateTo = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _index4.navigateTo.apply(_this5, args);
  };

  this.anonymousFunc0Array = [];
  this.$$refs = [];
}, _temp2)) || _class) || _class) || _class);
exports.default = CartIndex;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CartIndex, true));