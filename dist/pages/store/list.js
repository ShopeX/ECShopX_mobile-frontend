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

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../hocs/index.js");

var _entry = require("../../utils/entry.js");

var _entry2 = _interopRequireDefault(_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StoreList = (0, _index5.withPager)(_class = (0, _index5.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(StoreList, _BaseComponent);

  function StoreList() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, StoreList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = StoreList.__proto__ || Object.getPrototypeOf(StoreList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loading", "scrollTop", "list", "showBackToTop", "current", "query"], _this.handleConfirm = function (val) {
      _this.setState({
        query: _extends({}, _this.state.query, {
          name: val
        })
      }, function () {
        _this.resetPage();
        _this.setState({
          list: []
        }, function () {
          _this.nextPage();
        });
      });
    }, _this.handleGetLocation = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var store;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.setState({
                loading: true
              });
              _context.next = 3;
              return _entry2.default.getLocal();

            case 3:
              store = _context.sent;

              if (store) {
                _index2.default.setStorageSync('curStore', store);
                _this.resetPage();
                _this.setState({
                  list: [],
                  current: store,
                  loading: false
                }, function () {
                  _this.nextPage();
                });
              } else {
                _this.setState({
                  current: null,
                  loading: false
                });
              }

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleClick = function (val) {
      _index2.default.setStorageSync('curStore', val);
      _index2.default.navigateBack();
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(StoreList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(StoreList.prototype.__proto__ || Object.getPrototypeOf(StoreList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        list: [],
        query: null,
        current: null,
        loading: false
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      var lnglat = _index2.default.getStorageSync('lnglat');
      var query = {};
      if (lnglat) {
        var latitude = lnglat.latitude,
            longitude = lnglat.longitude;

        query = {
          lat: lnglat.latitude,
          lng: lnglat.longitude
        };
      }
      var store = _index2.default.getStorageSync('curStore');
      if (store) {
        this.setState({
          current: store,
          query: query
        }, function () {
          _this3.nextPage();
        });
      }
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
        var page, pageSize, _state, selectParams, areaList, tagsList, curTagId, query, _ref4, list, total;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                _state = this.state, selectParams = _state.selectParams, areaList = _state.areaList, tagsList = _state.tagsList, curTagId = _state.curTagId;
                query = _extends({}, this.state.query, {
                  page: page,
                  pageSize: pageSize
                });
                _context2.next = 5;
                return _index4.default.shop.list(query);

              case 5:
                _ref4 = _context2.sent;
                list = _ref4.list;
                total = _ref4.total_count;


                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(list)),
                  query: query
                });

                return _context2.abrupt("return", {
                  total: total
                });

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch(_x) {
        return _ref3.apply(this, arguments);
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

      var _state2 = this.__state,
          list = _state2.list,
          scrollTop = _state2.scrollTop,
          showBackToTop = _state2.showBackToTop,
          loading = _state2.loading,
          current = _state2.current;


      Object.assign(this.__state, {
        scrollTop: scrollTop,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }]);

  return StoreList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleConfirm", "handleGetLocation", "handleScroll", "nextPage", "handleClick", "scrollBackToTop"], _temp2)) || _class) || _class;

exports.default = StoreList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(StoreList, true));