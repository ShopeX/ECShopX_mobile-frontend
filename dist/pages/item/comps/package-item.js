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

var _index4 = require("../../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PackageItem = (_temp2 = _class = function (_BaseComponent) {
  _inherits(PackageItem, _BaseComponent);

  function PackageItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PackageItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PackageItem.__proto__ || Object.getPrototypeOf(PackageItem)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray0", "info", "package_name", "list", "selection", "__fn_onShowBuyPanel", "current"], _this.handleSelectionChange = function (id, checked) {
      console.log(id);
      var selection = _this.state.selection;
      selection[checked ? 'add' : 'delete'](id);
      _this.setState({
        selection: new Set(selection)
      });
      console.log(selection);
    }, _this.handleSkuPick = function (data) {
      _this.__triggerPropsFn("onShowBuyPanel", [null].concat([data]));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PackageItem, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PackageItem.prototype.__proto__ || Object.getPrototypeOf(PackageItem.prototype), "_constructor", this).call(this, props);

      this.state = {
        list: [],
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var package_id, _ref3, itemLists, nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                package_id = this.props.info.package_id;
                _context.next = 3;
                return _index5.default.item.packageDetail(package_id);

              case 3:
                _ref3 = _context.sent;
                itemLists = _ref3.itemLists;
                nList = (0, _index3.pickBy)(itemLists, {
                  img: 'pics[0]',
                  item_id: 'item_id',
                  title: 'itemName',
                  desc: 'brief',
                  spec_items: 'spec_items',
                  item_spec_desc: 'item_spec_desc',
                  price: function price(_ref4) {
                    var _price = _ref4.price;
                    return (_price / 100).toFixed(2);
                  },
                  market_price: function market_price(_ref5) {
                    var _market_price = _ref5.market_price;
                    return (_market_price / 100).toFixed(2);
                  }
                });


                this.setState({
                  list: nList
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
        return _ref2.apply(this, arguments);
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

      var _props = this.__props,
          info = _props.info,
          onClick = _props.onClick,
          current = _props.current,
          onAddCart = _props.onAddCart;

      if (!info) {
        return null;
      }
      var _state = this.__state,
          list = _state.list,
          selection = _state.selection;
      var package_id = info.package_id,
          package_name = info.package_name;


      var anonymousState__temp = current === package_id;
      var loopArray0 = list.map(function (item) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp3 = selection.has(item.$original.item_id);
        return {
          $loopState__temp3: $loopState__temp3,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        loopArray0: loopArray0,
        info: info,
        package_name: package_name
      });
      return this.__state;
    }
  }, {
    key: "funPrivateEdvey",
    value: function funPrivateEdvey() {
      this.__triggerPropsFn("onClick", [].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "funPrivateNHouG",
    value: function funPrivateNHouG() {
      this.__triggerPropsFn("onAddCart", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return PackageItem;
}(_index.Component), _class.properties = {
  "info": {
    "type": null,
    "value": null
  },
  "__fn_onShowBuyPanel": {
    "type": null,
    "value": null
  },
  "onClick": {
    "type": null,
    "value": null
  },
  "current": {
    "type": null,
    "value": null
  },
  "onAddCart": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "__fn_onAddCart": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["funPrivateEdvey", "handleSelectionChange", "handleSkuPick", "funPrivateNHouG"], _class.options = {
  addGlobalClass: true
}, _class.defaultProps = {
  onClick: function onClick() {},
  onAddCart: function onAddCart() {}
}, _temp2);
exports.default = PackageItem;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PackageItem));