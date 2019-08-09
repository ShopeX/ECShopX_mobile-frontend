"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../hocs/index.js");

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PackageList = (0, _index3.withPager)(_class = (0, _index3.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(PackageList, _BaseComponent);

  function PackageList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PackageList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PackageList.__proto__ || Object.getPrototypeOf(PackageList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["scrollTop", "list", "currentPackage", "page", "info", "buyPanelType", "showBuyPanel", "showBackToTop", "query", "curSku"], _this.config = {
      navigationBarTitleText: '优惠组合'
    }, _this.handleItemClick = function (id) {
      _this.setState({
        currentPackage: id
      });
    }, _this.handleBuyAction = function (type) {
      if (!S.getAuthToken()) {
        _index2.default.showToast({
          title: '请先登录再购买',
          icon: 'none'
        });

        setTimeout(function () {
          S.login(_this);
        }, 2000);

        return;
      }

      _this.setState({
        showBuyPanel: true,
        buyPanelType: type
      });
    }, _this.handleSkuChange = function (curSku) {
      _this.setState({
        curSku: curSku
      });
    }, _this.handleCartAdd = function () {
      console.log(111);
    }, _this.handleShowBuyPanel = function (data) {
      _this.setState({
        info: data,
        showBuyPanel: true,
        buyPanelType: 'cart'
      }, function () {
        var info = _this.state.info;

        console.log(info);
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PackageList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PackageList.prototype.__proto__ || Object.getPrototypeOf(PackageList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        query: null,
        currentPackage: 0,
        info: null,
        buyPanelType: null,
        showBuyPanel: false,
        curSku: null,
        list: []
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.nextPage();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var page, pageSize, id, currentPackage, query, _ref3, list, total, nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                id = this.$router.params.id;
                currentPackage = this.state.currentPackage;
                query = {
                  item_id: id,
                  page: page,
                  pageSize: pageSize
                };
                _context.next = 6;
                return _index5.default.item.packageList(query);

              case 6:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total_count;
                nList = (0, _index6.pickBy)(list, {
                  package_id: 'package_id',
                  package_name: 'package_name',
                  open: false
                });


                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList)),
                  query: query
                });

                if (!currentPackage) {
                  this.setState({
                    currentPackage: nList[0].package_id
                  });
                }

                return _context.abrupt("return", {
                  total: total
                });

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch(_x) {
        return _ref2.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          showBackToTop = _state.showBackToTop,
          scrollTop = _state.scrollTop,
          page = _state.page,
          currentPackage = _state.currentPackage,
          buyPanelType = _state.buyPanelType;


      this.anonymousFunc0 = function () {
        return _this2.setState({ showBuyPanel: false });
      };

      Object.assign(this.__state, {
        scrollTop: scrollTop,
        page: page,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(e) {
      ;
    }
  }]);

  return PackageList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleScroll", "nextPage", "handleItemClick", "handleCartAdd", "handleShowBuyPanel", "anonymousFunc0", "handleSkuChange", "handleBuyAction", "scrollBackToTop"], _temp2)) || _class) || _class;

exports.default = PackageList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(PackageList, true));