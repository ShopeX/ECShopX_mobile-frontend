"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../utils/index.js");

var _index4 = require("../../../spx/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../../api/index.js");

var _index7 = _interopRequireDefault(_index6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PackageItem = (_temp2 = _class = function (_BaseComponent) {
  _inherits(PackageItem, _BaseComponent);

  function PackageItem() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, PackageItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PackageItem.__proto__ || Object.getPrototypeOf(PackageItem)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray0", "info", "package_id", "package_name", "list", "curSku", "showBuyPanel", "buyPanelType", "current", "mainItem", "packageTotalPrice", "curId", "fromCheck", "packagePrices", "selection"], _this.handlePackageClick = function (pid) {
      var cur = _this.props.current;
      var selection = _this.state.selection;

      if (cur !== pid) {
        _this.setState({
          selection: new Set()
        });
      }
      _this.__triggerPropsFn("onClick", [null].concat([]));
    }, _this.handleSelectionChange = function (item, checked) {
      var selection = _this.state.selection;
      if (!item.checked_spec && item.spec_items.length) {
        _this.showBuyPanel(item, true);
        return;
      }
      selection[checked ? 'add' : 'delete'](item.checked_spec && item.checked_spec.item_id || item.item_id);
      _this.setState({
        selection: new Set(selection)
      }, function () {
        _this.countPackageTotal();
      });
    }, _this.handleSkuSelection = function (data) {
      _this.showBuyPanel(data);
    }, _this.showBuyPanel = function (data, fromCheck) {
      console.log(!!fromCheck);
      var curSku = _this.state.curSku;

      _this.setState({
        curSku: data,
        curId: data.item_id,
        showBuyPanel: true,
        buyPanelType: 'pick',
        fromCheck: !!fromCheck
      });
    }, _this.handleSpecSubmit = function (res) {
      var _this$state = _this.state,
          curId = _this$state.curId,
          fromCheck = _this$state.fromCheck;
      var list = _this.state.list;

      var idx = list.findIndex(function (item) {
        return item.item_id === curId;
      });
      var checked = null;
      if (list[idx].checked_spec) {
        checked = list[idx].checked_spec.item_id;
      }
      Object.assign(list[idx], { checked_spec: res });

      _this.setState({
        list: list,
        showBuyPanel: false
      });

      var selection = _this.state.selection;
      var id = [].concat(_toConsumableArray(selection)).find(function (item) {
        return item === checked;
      });

      if (id) {
        selection.delete(id, res.item_id);
        selection.add(res.item_id);
        _this.setState({
          selection: new Set(selection)
        }, function () {
          _this.countPackageTotal();
        });
      }

      if (fromCheck && ![].concat(_toConsumableArray(selection)).find(function (n) {
        return res.item_id === n;
      })) {
        selection.add(res.item_id);
        _this.setState({
          selection: new Set(selection)
        }, function () {
          _this.countPackageTotal();
        });
      }
    }, _this.handleAddCart = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this$state2, selection, mainItem, packageId, _Taro$getStorageSync, distributor_id, query, res;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (_index5.default.getAuthToken()) {
                _context.next = 4;
                break;
              }

              _index2.default.showToast({
                title: '请先登录再购买',
                icon: 'none'
              });

              setTimeout(function () {
                _index5.default.login(_this);
              }, 2000);

              return _context.abrupt("return");

            case 4:
              _this$state2 = _this.state, selection = _this$state2.selection, mainItem = _this$state2.mainItem;
              packageId = _this.props.current;
              _Taro$getStorageSync = _index2.default.getStorageSync('curStore'), distributor_id = _Taro$getStorageSync.distributor_id;
              query = {
                isAccumulate: false,
                item_id: mainItem.id,
                items_id: [].concat(_toConsumableArray(selection)),
                num: 1,
                shop_type: 'distributor',
                activity_id: packageId,
                activity_type: 'package',
                distributor_id: distributor_id
              };
              _context.next = 10;
              return _index7.default.cart.add(query);

            case 10:
              res = _context.sent;

              if (res) {
                _index2.default.showToast({
                  title: '成功加入购物车',
                  icon: 'success'
                });
              }

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PackageItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PackageItem.prototype.__proto__ || Object.getPrototypeOf(PackageItem.prototype), "_constructor", this).call(this, props);

      this.state = {
        list: [],
        mainItem: {},
        buyPanelType: null,
        showBuyPanel: false,
        packageTotalPrice: 0,
        curSku: null,
        curId: null,
        fromCheck: false,
        packagePrices: null,
        selection: new Set()
      };
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
        var package_id, _ref4, itemLists, main_item_id, main_item_price, package_price, nList;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                package_id = this.props.info.package_id;
                _context2.next = 3;
                return _index7.default.item.packageDetail(package_id);

              case 3:
                _ref4 = _context2.sent;
                itemLists = _ref4.itemLists;
                main_item_id = _ref4.main_item_id;
                main_item_price = _ref4.main_item_price;
                package_price = _ref4.package_price;
                nList = (0, _index3.pickBy)(itemLists, {
                  img: 'pics[0]',
                  item_id: 'item_id',
                  title: 'itemName',
                  desc: 'brief',
                  pics: 'pics',
                  spec_items: 'spec_items',
                  item_spec_desc: 'item_spec_desc',
                  checked_spec: null,
                  price: function price(_ref5) {
                    var package_price = _ref5.package_price;
                    return (package_price / 100).toFixed(2);
                  },
                  market_price: function market_price(_ref6) {
                    var price = _ref6.price;
                    return (price / 100).toFixed(2);
                  }
                });


                this.setState({
                  list: nList,
                  packagePrices: package_price,
                  mainItem: {
                    id: main_item_id,
                    price: main_item_price
                  }
                });

              case 10:
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
    key: "countPackageTotal",
    value: function countPackageTotal() {
      var _state = this.state,
          selection = _state.selection,
          packagePrices = _state.packagePrices,
          mainItem = _state.mainItem;

      var packageTotalPrice = 0;
      var selected = [].concat(_toConsumableArray(selection));
      if (selected.length) {
        packageTotalPrice += Number(mainItem.price);
        selected.map(function (id) {
          packageTotalPrice += Number(packagePrices[id]);
        });
      }
      this.setState({
        packageTotalPrice: (packageTotalPrice / 100).toFixed(2)
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this3 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          info = _props.info,
          onClick = _props.onClick,
          current = _props.current;

      if (!info) {
        return null;
      }
      var _state2 = this.__state,
          list = _state2.list,
          selection = _state2.selection,
          packagePrice = _state2.packagePrice;
      var package_id = info.package_id,
          package_name = info.package_name;


      var anonymousState__temp = current === package_id;

      this.anonymousFunc0 = function () {
        return _this3.setState({ showBuyPanel: false });
      };

      var loopArray0 = list.map(function (item) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp3 = selection.has(item.$original.checked_spec && item.$original.checked_spec.item_id || item.$original.item_id);
        var $loopState__temp5 = (0, _index.internal_inline_style)(item.$original.spec_items.length ? '' : 'display: none;');
        return {
          $loopState__temp3: $loopState__temp3,
          $loopState__temp5: $loopState__temp5,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        loopArray0: loopArray0,
        info: info,
        package_id: package_id,
        package_name: package_name,
        current: current
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(e) {
      ;
    }
  }]);

  return PackageItem;
}(_index.Component), _class.properties = {
  "info": {
    "type": null,
    "value": null
  },
  "current": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "onClick": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handlePackageClick", "handleSelectionChange", "handleSkuSelection", "handleAddCart", "anonymousFunc0", "handleSpecSubmit"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {}, _temp2);
exports.default = PackageItem;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PackageItem));