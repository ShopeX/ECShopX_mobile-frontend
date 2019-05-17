"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;
// import find from 'lodash/find'

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GoodsBuyPanel = (_temp2 = _class = function (_BaseComponent) {
  _inherits(GoodsBuyPanel, _BaseComponent);

  function GoodsBuyPanel() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, GoodsBuyPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GoodsBuyPanel.__proto__ || Object.getPrototypeOf(GoodsBuyPanel)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp4", "anonymousState__temp5", "info", "loopArray0", "curImg", "curSku", "maxStore", "quantity", "type", "hasStore", "fastBuyText", "selection", "isActive", "__fn_onChange", "__fn_onClick", "isOpened", "onClickAddCart", "onClickFastBuy"], _this.getSkuProps = function () {
      var info = _this.props.info;

      if (!info) {
        return '';
      }var curSku = _this.state.curSku;

      var propsText = '';

      if (!curSku) {
        // propsText = info.item_spec_desc.map(s => s.spec_name).join(' ')
        return "\u8BF7\u9009\u62E9";
      }

      propsText = curSku.propsText;
      return "\u5DF2\u9009 \u201C" + propsText + "\u201D";
    }, _this.handleQuantityChange = function (val) {
      _this.setState({
        quantity: val
      });
    }, _this.handleSelectSku = function (item, idx) {
      if (_this.props.info.spec_items.length <= 1 || _this.disabledSet.has(item.spec_value_id)) {
        return;
      }var selection = _this.state.selection;

      if (selection[idx] === item.spec_value_id) {
        selection[idx] = null;
      } else {
        selection[idx] = item.spec_value_id;
      }

      console.log(selection);
      _this.updateCurSku(selection);
      _this.setState({
        selection: selection
      });
    }, _this.toggleShow = function (isActive) {
      if (isActive === undefined) {
        isActive = !_this.state.isActive;
      }

      _this.setState({ isActive: isActive });
      _this.props.onClose && _this.__triggerPropsFn("onClose", [null].concat([]));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GoodsBuyPanel, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(GoodsBuyPanel.prototype.__proto__ || Object.getPrototypeOf(GoodsBuyPanel.prototype), "_constructor", this).call(this, props);

      this.state = {
        selection: [],
        curSku: null,
        curImg: null,
        quantity: 1,
        isActive: props.isOpened
      };

      this.disabledSet = new Set();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var info = this.props.info;

      var skuDict = {};

      info.spec_items.forEach(function (t) {
        var key = t.item_spec.map(function (s) {
          return s.spec_value_id;
        }).join('_');
        var propsText = t.item_spec.map(function (s) {
          return s.spec_value_name;
        }).join(' ');
        t.propsText = propsText;
        skuDict[key] = t;
      });
      var selection = Array(info.item_spec_desc.length).fill(null);
      this.skuDict = skuDict;
      this.setState({
        selection: selection
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var isOpened = nextProps.isOpened;

      if (isOpened !== this.state.isActive) {
        this.setState({
          isActive: isOpened
        });
      }
    }
  }, {
    key: "calcDisabled",
    value: function calcDisabled(selection) {
      var skuDict = this.skuDict;
      var disabledSet = new Set();
      var makeReg = function makeReg(sel, row, val) {
        var tSel = sel.slice();
        var regStr = tSel.map(function (s, idx) {
          return row === idx ? val : !s ? '(\\d+)' : s;
        }).join('_');

        return new RegExp(regStr);
      };

      var isNotDisabled = function isNotDisabled(sel, row, val) {
        var reg = makeReg(sel, row, val);

        return Object.keys(skuDict).some(function (key) {
          return key.match(reg) && skuDict[key].store > 0;
        });
      };

      var info = this.props.info;

      for (var i = 0, l = info.item_spec_desc.length; i < l; i++) {
        var spec_values = info.item_spec_desc[i].spec_values;

        for (var j = 0, k = spec_values.length; j < k; j++) {
          var id = spec_values[j].spec_value_id;
          if (!disabledSet.has(id) && !isNotDisabled(selection, i, id)) {
            disabledSet.add(id);
          }
        }
      }

      this.disabledSet = disabledSet;
    }
  }, {
    key: "getCurSkuImg",
    value: function getCurSkuImg(sku) {
      var img = this.props.info.pics[0];
      if (!sku) {
        return img;
      }

      sku.item_spec.some(function (s) {
        if (s.spec_image_url) {
          img = s.spec_image_url;
          return true;
        }
      });
      return img;
    }
  }, {
    key: "updateCurSku",
    value: function updateCurSku(selection) {
      selection = selection || this.state.selection;
      this.calcDisabled(selection);
      if (selection.some(function (s) {
        return !s;
      })) {
        this.setState({
          curSku: null,
          curImg: null
        });
        this.__triggerPropsFn("onChange", [null].concat([null]));
        return;
      }

      var curSku = this.skuDict[selection.join('_')];
      var curImg = this.getCurSkuImg(curSku);
      this.setState({
        curSku: curSku,
        curImg: curImg
      });

      this.__triggerPropsFn("onChange", [null].concat([curSku]));
      _index3.log.debug('[goods-buy-panel] updateCurSku: ', curSku);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          info = _props.info,
          type = _props.type,
          fastBuyText = _props.fastBuyText;
      var _state = this.__state,
          curSku = _state.curSku,
          curImg = _state.curImg,
          quantity = _state.quantity,
          selection = _state.selection,
          isActive = _state.isActive;


      if (!info) {
        return null;
      }

      var maxStore = +(curSku ? curSku.store : info.store || 99999);
      var hasStore = curSku ? curSku.store > 0 : true;

      var anonymousState__temp = (0, _index3.classNames)('goods-buy-panel', isActive ? 'goods-buy-panel__active' : null);

      this.anonymousFunc0 = function () {
        return _this2.toggleShow(false);
      };

      var anonymousState__temp4 = type === 'cart' || type === 'all' && hasStore ? (0, _index3.classNames)('goods-buy-panel__btn btn-add-cart', { 'is-disabled': !curSku }) : null;
      var anonymousState__temp5 = type === 'fastbuy' || type === 'all' && hasStore ? (0, _index3.classNames)('goods-buy-panel__btn btn-fast-buy', { 'is-disabled': !curSku }) : null;
      var loopArray0 = info.item_spec_desc.map(function (spec, idx) {
        spec = {
          $original: (0, _index.internal_get_original)(spec)
        };
        var $anonymousCallee__0 = spec.$original.spec_values.map(function (sku) {
          sku = {
            $original: (0, _index.internal_get_original)(sku)
          };
          var $loopState__temp3 = (0, _index3.classNames)('sku-item', { 'is-active': sku.$original.spec_value_id === selection[idx], 'is-disabled': _this2.disabledSet.has(sku.$original.spec_value_id) });
          return {
            $loopState__temp3: $loopState__temp3,
            $original: sku.$original
          };
        });
        return {
          $anonymousCallee__0: $anonymousCallee__0,
          $original: spec.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        info: info,
        loopArray0: loopArray0,
        maxStore: maxStore,
        type: type,
        hasStore: hasStore,
        fastBuyText: fastBuyText
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(e) {
      ;
    }
  }, {
    key: "funPrivatetvRWW",
    value: function funPrivatetvRWW() {
      this.__triggerPropsFn("onClickAddCart", [].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "funPrivateEQlkZ",
    value: function funPrivateEQlkZ() {
      this.__triggerPropsFn("onClickFastBuy", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return GoodsBuyPanel;
}(_index.Component), _class.properties = {
  "info": {
    "type": null,
    "value": null
  },
  "__fn_onChange": {
    "type": null,
    "value": null
  },
  "onClose": {
    "type": null,
    "value": null
  },
  "__fn_onClose": {
    "type": null,
    "value": null
  },
  "type": {
    "type": null,
    "value": null
  },
  "fastBuyText": {
    "type": null,
    "value": null
  },
  "onClickAddCart": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "__fn_onClickAddCart": {
    "type": null,
    "value": null
  },
  "onClickFastBuy": {
    "type": null,
    "value": null
  },
  "__fn_onClickFastBuy": {
    "type": null,
    "value": null
  },
  "isOpened": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["anonymousFunc0", "handleSelectSku", "handleQuantityChange", "funPrivatetvRWW", "funPrivateEQlkZ"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  info: null,
  isOpened: false,
  type: 'fastbuy',
  fastBuyText: '立即购买',
  onClose: function onClose() {},
  onChange: function onChange() {},
  onClickAddCart: function onClickAddCart() {},
  onClickFastBuy: function onClickFastBuy() {}
}, _temp2);
exports.default = GoodsBuyPanel;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(GoodsBuyPanel));