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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var _ref4;

    var _temp, _this, _ret;

    _classCallCheck(this, WgtGoods);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref4 = WgtGoods.__proto__ || Object.getPrototypeOf(WgtGoods)).call.apply(_ref4, [this].concat(args))), _this), _this.$usedState = ["info", "base", "data", "is_fav", "curIdx", "count"], _this.handleClickItem = function (id) {
      _index2.default.navigateTo({
        url: "/pages/iwp/item-detail?id=" + id
      });
    }, _this.handleSwiperChange = function (e) {
      var current = e.detail.current;


      _this.setState({
        curIdx: current
      });
    }, _this.handleClickOperate = function (item) {
      _index2.default.navigateToMiniProgram({
        appId: 'wx4721629519a8f25b', // 要跳转的小程序的appid
        path: "pages/recommend/detail?id=" + item.item_id, // 跳转的目标页面
        success: function success(res) {
          // 打开成功
          console.log(res);
        }
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
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

    /*handleClickOperate = async (item_data, type, e) => {
      e.stopPropagation()
      if(type === 'collect') {
        if(this.state.count === 0) {
          let is_fav = Boolean(this.props.favs[item_data.item_id])
          this.setState({
            count: 1,
            is_fav
          })
        }
        if(!this.state.is_fav) {
          await api.member.addFav(item_data.item_id)
          this.props.onAddFav(item_data)
          console.log(this.props.favs,this.props.favs[1192], 51,'addafter')
          Taro.showToast({
            title: '已加入收藏',
            icon: 'none'
          })
        } else {
          await api.member.delFav(item_data.item_id)
          this.props.onDelFav(item_data)
          console.log(this.props.favs, 51,'delafter')
          Taro.showToast({
            title: '已移出收藏',
            icon: 'none'
          })
        }
        this.setState({
          is_fav: !this.state.is_fav
        })
      }
        if(type === 'buy') {
        try {
          await api.cart.add({
            item_id:item_data.item_id,
            num: 1
          })
        } catch (e) {
          console.log(e)
        }
          Taro.showToast({
          title: '成功加入购物车',
          icon: 'success'
        })
      }
    }*/

  }, {
    key: "_createData",
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
  }
}, _class2.$$events = ["handleClickItem", "handleClickOperate"], _class2.options = {
  addGlobalClass: true
}, _class2.defaultProps = {
  info: null
}, _temp2)) || _class);
exports.default = WgtGoods;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WgtGoods));