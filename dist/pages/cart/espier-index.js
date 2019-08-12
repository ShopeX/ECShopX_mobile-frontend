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
        invalidList: [],
        error: null
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

          return Object.assign(shopCart, { activity: activity, list: itemList });
        });

        // 无活动列表
        group.push(Object.assign(shopCart, { activity: null, list: Object.values(tDict) }));

        return group;
      });
      return groups;
    }
  }, {
    key: "processCart",
    value: function processCart(_ref5) {
      var _this3 = this;

      var _ref5$valid_cart = _ref5.valid_cart,
          valid_cart = _ref5$valid_cart === undefined ? [] : _ref5$valid_cart,
          _ref5$invalid_cart = _ref5.invalid_cart,
          invalid_cart = _ref5$invalid_cart === undefined ? [] : _ref5$invalid_cart;

      var list = valid_cart.map(function (shopCart) {
        var tList = _this3.transformCartList(shopCart.list);
        return _extends({}, shopCart, {
          list: tList
        });
      });

      var invalidList = this.transformCartList(invalid_cart);
      this.setState({
        invalidList: invalidList
      });

      _index4.log.debug('[cart fetchCart]', list);
      this.__triggerPropsFn("onUpdateCart", [null].concat([list]));

      return list;
    }
  }, {
    key: "fetchCart",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(cb) {
        var valid_cart, invalid_cart, _$router$params$type, type, params, res, list;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                valid_cart = [], invalid_cart = [];
                _$router$params$type = this.$router.params.type, type = _$router$params$type === undefined ? 'distributor' : _$router$params$type;
                params = { shop_type: type };

                try {
                  // const res = await api.cart.get(params)
                  res = {
                    "invalid_cart": [{
                      "cart_id": "183",
                      "company_id": "1",
                      "user_id": "6",
                      "user_ident": null,
                      "shop_type": "distributor",
                      "shop_id": "4",
                      "activity_type": "normal",
                      "activity_id": null,
                      "marketing_type": null,
                      "marketing_id": null,
                      "item_type": "normal",
                      "item_id": "99",
                      "items_id": [],
                      "item_name": "测试商品26",
                      "pics": "http://mmbiz.qpic.cn/mmbiz_png/MUQsdY0GdK5ae4n1MtSjK0aksB7yCoufslMJhO5zyE0PRUdYElo6CSicOnJEbkpnbvHtfdd39LVtknSdMEFpOHQ/0?wx_fmt=png",
                      "price": 1,
                      "num": 1,
                      "wxa_appid": null,
                      "is_checked": false,
                      "is_plus_buy": false,
                      "created": 1565507373,
                      "updated": 1565507373
                    }, {
                      "cart_id": "182",
                      "company_id": "1",
                      "user_id": "6",
                      "user_ident": null,
                      "shop_type": "distributor",
                      "shop_id": "4",
                      "activity_type": "normal",
                      "activity_id": null,
                      "marketing_type": null,
                      "marketing_id": null,
                      "item_type": "normal",
                      "item_id": "98",
                      "items_id": [],
                      "item_name": "测试商品25",
                      "pics": "http://mmbiz.qpic.cn/mmbiz_png/MUQsdY0GdK5ae4n1MtSjK0aksB7yCoufNBh17xk9Vq1dR5Vuh6vv9EEt61rKKv2DjW40VGV5JFOic77XyurzNsA/0?wx_fmt=png",
                      "price": 100,
                      "num": 1,
                      "wxa_appid": null,
                      "is_checked": false,
                      "is_plus_buy": false,
                      "created": 1565497994,
                      "updated": 1565497994
                    }, {
                      "cart_id": "161",
                      "company_id": "1",
                      "user_id": "6",
                      "user_ident": null,
                      "shop_type": "distributor",
                      "shop_id": "4",
                      "activity_type": "normal",
                      "activity_id": null,
                      "marketing_type": null,
                      "marketing_id": null,
                      "item_type": "normal",
                      "item_id": "100",
                      "items_id": [],
                      "item_name": " 云南白药 云丰 蒲地蓝消炎片 48片（消肿 咽炎 扁桃腺炎",
                      "pics": "http://bbctest.aixue7.com/1/2019/07/09/8400174a0ba5e5b3577e719196cf5c1chvjL9AZcwdtqZ8dujNNxqGLoaCTfYpBR",
                      "price": 10000,
                      "num": 3,
                      "wxa_appid": null,
                      "is_checked": false,
                      "is_plus_buy": false,
                      "created": 1565348713,
                      "updated": 1565348748
                    }],
                    "valid_cart": [{
                      "shop_name": "怡康医药·广电智慧社区大兴东路店",
                      "address": "安市莲湖区永安路9号龙湖水晶郦城",
                      "shop_id": "4",
                      "cart_total_price": 100,
                      "item_fee": 100,
                      "cart_total_num": 1,
                      "cart_total_count": 1,
                      "discount_fee": 0,
                      "total_fee": "100",
                      "list": [{
                        "cart_id": "184",
                        "company_id": "1",
                        "user_id": "6",
                        "user_ident": null,
                        "shop_type": "distributor",
                        "shop_id": "4",
                        "activity_type": "normal",
                        "activity_id": null,
                        "marketing_type": null,
                        "marketing_id": null,
                        "item_type": "normal",
                        "item_id": "207",
                        "items_id": [],
                        "item_name": "yao072901",
                        "pics": "http://mmbiz.qpic.cn/mmbiz_jpg/MUQsdY0GdK4avNsaHHwqSumaBer5LDj0oWwuebbnzibRsgcickolK72CzfGArmp80LLgmibFov5dfTMwTwoMFtQqw/0?wx_fmt=jpeg",
                        "price": 100,
                        "num": 1,
                        "wxa_appid": null,
                        "is_checked": true,
                        "is_plus_buy": false,
                        "created": 1565540165,
                        "updated": 1565540165,
                        "is_last_price": true,
                        "discount_fee": 0,
                        "total_fee": "100",
                        "store": 221,
                        "market_price": 100,
                        "brief": "072901",
                        "approve_status": "onsale",
                        "item_spec_desc": "颜色:绿",
                        "parent_id": 0,
                        "limitedTimeSaleAct": {
                          "activity_id": "5",
                          "marketing_type": "limited_time_sale",
                          "marketing_name": "测试活动",
                          "limit_total_money": 200,
                          "limit_money": 1,
                          "validity_period": 15,
                          "is_free_shipping": false,
                          "third_params": null,
                          "promotion_tag": "限时优惠"
                        },
                        "total_price": "100"
                      }],
                      "used_activity": [],
                      "used_activity_ids": [],
                      "activity_grouping": [],
                      "vipgrade_guide_title": {
                        "guide_title_desc": ""
                      }
                    }, {
                      "shop_id": "0",
                      "cart_total_price": 0,
                      "item_fee": 0,
                      "cart_total_num": 0,
                      "cart_total_count": 0,
                      "discount_fee": 0,
                      "total_fee": 0,
                      "list": [{
                        "cart_id": "179",
                        "company_id": "1",
                        "user_id": "6",
                        "user_ident": null,
                        "shop_type": "distributor",
                        "shop_id": "0",
                        "activity_type": "normal",
                        "activity_id": null,
                        "marketing_type": null,
                        "marketing_id": null,
                        "item_type": "normal",
                        "item_id": "213",
                        "items_id": [],
                        "item_name": "兔兔5",
                        "pics": "http://mmbiz.qpic.cn/mmbiz_jpg/MUQsdY0GdK7oJEMdx5fIyCIXwHkpN5ovseyoDNFo6ZiaicRJaPIyx3diaibjlia8JangYlLZMoLHpC5YTibbAqpAmHBg/0?wx_fmt=jpeg",
                        "price": "1",
                        "num": 1,
                        "wxa_appid": null,
                        "is_checked": false,
                        "is_plus_buy": false,
                        "created": 1565496251,
                        "updated": 1565496251,
                        "is_last_price": false,
                        "discount_fee": 0,
                        "total_fee": 1,
                        "store": 96,
                        "market_price": 0,
                        "brief": "",
                        "approve_status": "onsale",
                        "item_spec_desc": "",
                        "parent_id": 0,
                        "original_price": 1,
                        "discount_price": 0,
                        "grade_name": "高级会员",
                        "discount_desc": "",
                        "total_price": "1"
                      }, {
                        "cart_id": "178",
                        "company_id": "1",
                        "user_id": "6",
                        "user_ident": null,
                        "shop_type": "distributor",
                        "shop_id": "0",
                        "activity_type": "normal",
                        "activity_id": null,
                        "marketing_type": null,
                        "marketing_id": null,
                        "item_type": "normal",
                        "item_id": "212",
                        "items_id": [],
                        "item_name": "兔兔4",
                        "pics": "http://mmbiz.qpic.cn/mmbiz_png/MUQsdY0GdK5RFlB9L9G7RAp9MD1iaCIqa7gcuY6cKaicg0v8xvrUGMtYkxhtNkpXOJaE6zYw48JD7xad39nicGmZw/0?wx_fmt=png",
                        "price": "1",
                        "num": 1,
                        "wxa_appid": null,
                        "is_checked": false,
                        "is_plus_buy": false,
                        "created": 1565495984,
                        "updated": 1565496050,
                        "is_last_price": false,
                        "discount_fee": 0,
                        "total_fee": 1,
                        "store": 97,
                        "market_price": 0,
                        "brief": "",
                        "approve_status": "onsale",
                        "item_spec_desc": "",
                        "parent_id": 0,
                        "original_price": 1,
                        "discount_price": 0,
                        "grade_name": "高级会员",
                        "discount_desc": "",
                        "total_price": "1"
                      }, {
                        "cart_id": "177",
                        "company_id": "1",
                        "user_id": "6",
                        "user_ident": null,
                        "shop_type": "distributor",
                        "shop_id": "0",
                        "activity_type": "normal",
                        "activity_id": null,
                        "marketing_type": null,
                        "marketing_id": null,
                        "item_type": "normal",
                        "item_id": "118",
                        "items_id": [],
                        "item_name": "兔兔1 有规格",
                        "pics": "http://mmbiz.qpic.cn/mmbiz_jpg/MUQsdY0GdK7UY4x0PKJXNwsFp6Cic9RXsXOQszthYBhUibEEXOLHCNzwFBVZpMHqBHUQR2Wwjd0ftFia5sC0Wwv8g/0?wx_fmt=jpeg",
                        "price": "500",
                        "num": 1,
                        "wxa_appid": null,
                        "is_checked": false,
                        "is_plus_buy": false,
                        "created": 1565495559,
                        "updated": 1565495559,
                        "is_last_price": false,
                        "discount_fee": 0,
                        "total_fee": 500,
                        "store": 92,
                        "market_price": 0,
                        "brief": "",
                        "approve_status": "onsale",
                        "item_spec_desc": "100cm大图:aaa,200cm大图:一",
                        "parent_id": 0,
                        "original_price": 500,
                        "discount_price": 0,
                        "grade_name": "高级会员",
                        "discount_desc": "加入svip立省1元",
                        "total_price": "500"
                      }, {
                        "cart_id": "175",
                        "company_id": "1",
                        "user_id": "6",
                        "user_ident": null,
                        "shop_type": "distributor",
                        "shop_id": "0",
                        "activity_type": "normal",
                        "activity_id": null,
                        "marketing_type": null,
                        "marketing_id": null,
                        "item_type": "normal",
                        "item_id": "134",
                        "items_id": [],
                        "item_name": "兔兔3",
                        "pics": "http://mmbiz.qpic.cn/mmbiz_jpg/MUQsdY0GdK5ae4n1MtSjK0aksB7yCoufgw0qmw3TGmiarsWAViaZNn0bx2GaFIia50pkWkTl16kB80URxibt3ubOyg/0?wx_fmt=jpeg",
                        "price": "2000",
                        "num": 3,
                        "wxa_appid": null,
                        "is_checked": false,
                        "is_plus_buy": false,
                        "created": 1565494811,
                        "updated": 1565498543,
                        "is_last_price": false,
                        "discount_fee": 0,
                        "total_fee": 6000,
                        "store": 97,
                        "market_price": 0,
                        "brief": "",
                        "approve_status": "onsale",
                        "item_spec_desc": "",
                        "parent_id": 0,
                        "original_price": 2000,
                        "discount_price": 0,
                        "grade_name": "高级会员",
                        "discount_desc": "加入svip立省12元",
                        "total_price": "6000"
                      }],
                      "used_activity": [],
                      "used_activity_ids": [],
                      "activity_grouping": [],
                      "vipgrade_guide_title": {
                        "guide_title_desc": "是是是"
                      }
                    }]
                  };

                  console.log('res', res);
                  valid_cart = res.valid_cart || valid_cart;
                  invalid_cart = res.invalid_cart || invalid_cart;
                } catch (e) {
                  this.setState({
                    error: e
                  });
                }

                list = this.processCart({
                  valid_cart: valid_cart,
                  invalid_cart: invalid_cart
                });

                cb && cb(list);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchCart(_x2) {
        return _ref6.apply(this, arguments);
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
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(item_id, num) {
        var _$router$params$type2, type, res;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _$router$params$type2 = this.$router.params.type, type = _$router$params$type2 === undefined ? 'distributor' : _$router$params$type2;
                // this.updateCart.cancel()

                _context4.next = 3;
                return _index6.default.cart.updateNum(item_id, num, type);

              case 3:
                res = _context4.sent;

                this.processCart(res);
                // this.updateCart()

              case 5:
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
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
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
      var _$router$params$type3 = this.$router.params.type,
          type = _$router$params$type3 === undefined ? 'distributor' : _$router$params$type3;

      var isDrug = type === 'drug';
      var totalSelection = selection.size;
      var totalItems = totalSelection;
      var isEmpty = !list.length;
      console.log('groups', groups);
      var anonymousState__temp = (0, _index4.classNames)('page-cart-index', isDrug && 'is-drug');
      var anonymousState__temp8 = Boolean(curPromotions);
      var loopArray0 = groups.map(function (activityGroup, idx) {
        activityGroup = {
          $original: (0, _index.internal_get_original)(activityGroup)
        };

        console.log(1111, { activityGroup: activityGroup.$original });
        var $anonymousCallee__1 = activityGroup.$original.map(function (shopCart) {
          shopCart = {
            $original: (0, _index.internal_get_original)(shopCart)
          };

          console.log(2222, shopCart.$original);
          var activity = shopCart.$original.activity;


          var $loopState__temp5 = list.length && list[0].discount_fee > 0 ? cartMode !== 'edit' ? -1 * list[0].discount_fee : null : null;
          var $loopState__temp7 = shopCart.$original.list.length > 0 ? cartMode !== 'edit' ? totalItems <= 0 : null : null;
          var $anonymousCallee__0 = shopCart.$original.list.length > 0 ? shopCart.$original.list.map(function (item) {
            item = {
              $original: (0, _index.internal_get_original)(item)
            };
            var $loopState__temp3 = shopCart.$original.list.length > 0 ? selection.has(item.$original.cart_id) : null;
            return {
              activity: shopCart.activity,
              $loopState__temp3: $loopState__temp3,
              $original: item.$original
            };
          }) : [];
          return {
            activity: activity,
            $loopState__temp5: $loopState__temp5,
            $loopState__temp7: $loopState__temp7,
            $anonymousCallee__0: $anonymousCallee__0,
            $original: shopCart.$original
          };
        });
        return {
          $anonymousCallee__1: $anonymousCallee__1,
          $original: activityGroup.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp8: anonymousState__temp8,
        loopArray0: loopArray0,
        isEmpty: isEmpty,
        list: list,
        totalPrice: totalPrice,
        isDrug: isDrug,
        page: page,
        isTotalChecked: this.isTotalChecked
      });
      return this.__state;
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
}, _class2.$$events = ["nextPage", "handleQuantityChange", "handleClickPromotion", "handleClickToDetail", "handleSelectionChange", "handleDelect", "handleAllSelect", "handleCheckout", "navigateTo", "handleClickItem", "handleClosePromotions", "handleSelectPromotion"], _class2.defaultProps = {
  totalPrice: '0.00',
  list: null
}, _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.$usedState = ["anonymousState__temp", "anonymousState__temp8", "loopArray0", "loading", "isEmpty", "groups", "cartMode", "list", "totalPrice", "invalidList", "isDrug", "likeList", "page", "curPromotions", "selection", "error", "defaultAllSelect", "__fn_onUpdateCart", "cartIds", "__fn_onCartSelection", "__fn_onUpdateCartNum", "isTotalChecked"];

  this.handleClickItem = function (item) {
    var url = "/pages/item/espier-detail?id=" + item.item_id;
    _index2.default.navigateTo({
      url: url
    });
  };

  this.updateCart = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _index2.default.showLoading({
              mask: true
            });
            _this4.updating = true;
            _context5.prev = 2;
            _context5.next = 5;
            return _this4.fetchCart();

          case 5:
            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](2);

            console.log(_context5.t0);

          case 10:
            _this4.updating = false;
            _index2.default.hideLoading();

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, _this4, [[2, 7]]);
  }));
  this.asyncUpdateCart = (0, _debounce2.default)(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _this4.updateCart();

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, _this4);
  })), 300);

  this.toggleCartMode = function () {
    var cartMode = _this4.state.cartMode !== 'edit' ? 'edit' : 'default';
    _this4.setState({
      cartMode: cartMode
    });
  };

  this.handleDelect = function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(cart_id) {
      var res, cartIds;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return _index2.default.showModal({
                title: '将当前商品移出购物车?',
                showCancel: true,
                cancel: '取消',
                confirmText: '确认',
                confirmColor: '#0b4137'
              });

            case 2:
              res = _context7.sent;

              if (res.confirm) {
                _context7.next = 5;
                break;
              }

              return _context7.abrupt("return");

            case 5:
              _context7.next = 7;
              return _index6.default.cart.del({ cart_id: cart_id });

            case 7:
              cartIds = _this4.props.cartIds.filter(function (t) {
                return t !== cart_id;
              });


              _this4.updateSelection(cartIds);
              _this4.updateCart();

            case 10:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, _this4);
    }));

    return function (_x8) {
      return _ref15.apply(this, arguments);
    };
  }();

  this.handleQuantityChange = function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(item, num, e) {
      var item_id, cart_id;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              e.stopPropagation();

              item_id = item.item_id, cart_id = item.cart_id;

              _index2.default.showLoading({
                mask: true
              });

              _this4.__triggerPropsFn("onUpdateCartNum", [null].concat([cart_id, num]));
              _context8.next = 6;
              return _this4.changeCartNum(item_id, num);

            case 6:
              _index2.default.hideLoading();
              // this.updateCart.cancel()

              // if (this.lastCartId === cart_id || this.lastCartId === undefined) {
              //   await this.debounceChangeCartNum(cart_id, num)
              // } else {
              //   this.lastCartId = cart_id
              //   await this.changeCartNum(cart_id, num)
              // }

            case 7:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, _this4);
    }));

    return function (_x9, _x10, _x11) {
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
              selection = _this4.state.selection;
              cartIds = _this4.props.cartIds;


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
              _this4.updateSelection([].concat(_toConsumableArray(selection)));

            case 14:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, _this4, [[4, 9]]);
    }));

    return function (_x12) {
      return _ref17.apply(this, arguments);
    };
  }();

  this.handleClickPromotion = function (cart_id, e) {
    _this4.isTodetail = 0;
    var promotions = void 0;
    _this4.props.list.some(function (cart) {
      cart.list.some(function (item) {
        if (item.cart_id === cart_id) {
          promotions = item.promotions.slice();
        }
      });
    });

    _this4.setState({
      curPromotions: promotions
    }, function () {
      _this4.isTodetail = 1;
    });
  };

  this.handleClickToDetail = function (item_id) {
    if (_this4.isTodetail === 0) {
      return false;
    }
    _this4.isTodetail = 1;
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
              _this4.setState({
                curPromotions: null
              });
              _context10.next = 5;
              return _index6.default.cart.updatePromotion({
                activity_id: activity_id,
                cart_id: cart_id
              });

            case 5:
              _context10.next = 7;
              return _this4.fetchCart();

            case 7:
              _index2.default.hideLoading();

            case 8:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, _this4);
    }));

    return function (_x13) {
      return _ref18.apply(this, arguments);
    };
  }();

  this.handleClosePromotions = function () {
    _this4.setState({
      curPromotions: null
    });
  };

  this.handleCheckout = function () {
    var type = _this4.$router.params.type;

    if (_this4.updating) {
      _index2.default.showToast({
        title: '正在计算价格，请稍后',
        icon: 'none'
      });
      return;
    }

    _index2.default.navigateTo({
      url: "/pages/cart/espier-checkout?cart_type=cart&type=" + type
    });
  };

  this.navigateTo = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _index4.navigateTo.apply(_this4, args);
  };

  this.$$refs = [];
}, _temp2)) || _class) || _class) || _class);
exports.default = CartIndex;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(CartIndex, true));