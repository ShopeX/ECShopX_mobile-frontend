"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../npm/@tarojs/redux/index.js");

var _index4 = require("../../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WgtGoods = (_dec = (0, _index3.connect)(function (_ref) {
  var cart = _ref.cart,
      member = _ref.member;
  return {
    cart: cart,
    favs: member.favs
  };
}, function (dispatch) {
  return {
    onFastbuy: function onFastbuy(item) {
      return dispatch({ type: 'cart/fastbuy', payload: { item: item } });
    },
    onAddCart: function onAddCart(item) {
      return dispatch({ type: 'cart/add', payload: { item: item } });
    },
    onAddFav: function onAddFav(_ref2) {
      var item_id = _ref2.item_id;
      return dispatch({ type: 'member/addFav', payload: { item_id: item_id } });
    },
    onDelFav: function onDelFav(_ref3) {
      var item_id = _ref3.item_id;
      return dispatch({ type: 'member/delFav', payload: { item_id: item_id } });
    }
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(WgtGoods, _BaseComponent);

  function WgtGoods() {
    var _ref4,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, WgtGoods);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref4 = WgtGoods.__proto__ || Object.getPrototypeOf(WgtGoods)).call.apply(_ref4, [this].concat(args))), _this), _this.$usedState = ["info", "base", "data", "is_fav", "curIdx", "count", "favs", "__fn_onAddFav", "__fn_onDelFav"], _this.handleClickItem = function (id) {
      var info = _this.props.info;


      if (info.data) {
        var onsale = true;
        info.data.map(function (item) {
          if (id === item.item_id) {
            if (!item.isOnsale) {
              onsale = false;
            }
          }
        });
        if (!onsale) {
          return false;
        }
      }
      try {
        _index2.default.navigateTo({
          url: "/pages/item/espier-detail?id=" + id
        });
      } catch (error) {
        console.log(error);
        _index2.default.navigateTo({
          url: "/pages/iwp/item-detail?id=" + id
        });
      }
    }, _this.handleSwiperChange = function (e) {
      var current = e.detail.current;


      _this.setState({
        curIdx: current
      });
    }, _this.handleClickOperate = function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item_data, type, e) {
        var info, onsale, is_fav;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                info = _this.props.info;


                e.stopPropagation();

                if (!info.data) {
                  _context.next = 7;
                  break;
                }

                onsale = true;

                info.data.map(function (item) {
                  if (item_data.item_id === item.item_id) {
                    if (!item.isOnsale) {
                      onsale = false;
                    }
                  }
                });

                if (onsale) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", false);

              case 7:
                _context.prev = 7;

                if (!(type === 'collect')) {
                  _context.next = 22;
                  break;
                }

                if (_this.state.count === 0) {
                  is_fav = Boolean(_this.props.favs[item_data.item_id]);

                  _this.setState({
                    count: 1,
                    is_fav: is_fav
                  });
                }

                if (_this.state.is_fav) {
                  _context.next = 17;
                  break;
                }

                _context.next = 13;
                return _index5.default.member.addFav(item_data.item_id);

              case 13:
                _this.__triggerPropsFn("onAddFav", [null].concat([item_data]));
                _index2.default.showToast({
                  title: '已加入收藏',
                  icon: 'none'
                });
                _context.next = 21;
                break;

              case 17:
                _context.next = 19;
                return _index5.default.member.delFav(item_data.item_id);

              case 19:
                _this.__triggerPropsFn("onDelFav", [null].concat([item_data]));
                _index2.default.showToast({
                  title: '已移出收藏',
                  icon: 'none'
                });

              case 21:
                _this.setState({
                  is_fav: !_this.state.is_fav
                });

              case 22:
                if (!(type === 'buy')) {
                  _context.next = 32;
                  break;
                }

                _context.prev = 23;
                _context.next = 26;
                return _index5.default.cart.add({
                  item_id: item_data.item_id,
                  num: 1
                });

              case 26:
                _context.next = 31;
                break;

              case 28:
                _context.prev = 28;
                _context.t0 = _context["catch"](23);

                console.log(_context.t0);

              case 31:

                _index2.default.showToast({
                  title: '成功加入购物车',
                  icon: 'success'
                });

              case 32:
                _context.next = 38;
                break;

              case 34:
                _context.prev = 34;
                _context.t1 = _context["catch"](7);

                console.log(_context.t1);
                _index2.default.navigateToMiniProgram({
                  appId: 'wx4721629519a8f25b', // 要跳转的小程序的appid
                  path: "pages/recommend/detail?id=" + item_data.item_id, // 跳转的目标页面
                  success: function success(res) {
                    // 打开成功
                    console.log(res);
                  }
                });

              case 38:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2, [[7, 34], [23, 28]]);
      }));

      return function (_x, _x2, _x3) {
        return _ref5.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WgtGoods, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(WgtGoods.prototype.__proto__ || Object.getPrototypeOf(WgtGoods.prototype), "_constructor", this).call(this, props);

      this.state = {
        curIdx: 0,
        is_fav: false,
        count: 0
      };
    }
  }, {
    key: "_createData",


    /*handleClickOperate = (item) => {
      Taro.navigateToMiniProgram({
        appId: 'wx4721629519a8f25b', // 要跳转的小程序的appid
        path: `pages/recommend/detail?id=${item.item_id}`, // 跳转的目标页面
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }*/

    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var info = this.__props.info;
      var _state = this.__state,
          curIdx = _state.curIdx,
          is_fav = _state.is_fav;

      if (!info) {
        return null;
      }

      var config = info.config,
          base = info.base,
          data = info.data;

      var curContent = (data[curIdx] || {}).content;

      Object.assign(this.__state, {
        info: info,
        base: base,
        data: data
      });
      return this.__state;
    }
  }]);

  return WgtGoods;
}(_index.Component), _class2.properties = {
  "info": {
    "type": null,
    "value": null
  },
  "favs": {
    "type": null,
    "value": null
  },
  "__fn_onAddFav": {
    "type": null,
    "value": null
  },
  "__fn_onDelFav": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleClickItem", "handleClickOperate"], _class2.options = {
  addGlobalClass: true
}, _class2.defaultProps = {
  info: null
}, _temp2)) || _class);
exports.default = WgtGoods;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WgtGoods));