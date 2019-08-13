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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewMemberList = (0, _index3.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(NewMemberList, _BaseComponent);

  function NewMemberList() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, NewMemberList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NewMemberList.__proto__ || Object.getPrototypeOf(NewMemberList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["scrollTop", "windowWidth", "curImgIdx", "imgs", "list", "showBackToTop", "query", "listType", "announce"], _this.handleSwiperChange = function (e) {
      var current = e.detail.current;

      _this.setState({
        curImgIdx: current
      });
    }, _this.handleClickItem = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item) {
        var url;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _index5.default.item.newbiesBuy();

              case 3:
                _context.next = 8;
                break;

              case 5:
                _context.prev = 5;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", false);

              case 8:
                url = "/pages/item/espier-detail?newbies=true&id=" + item.item_id;

                _index2.default.navigateTo({
                  url: url
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2, [[0, 5]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(NewMemberList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(NewMemberList.prototype.__proto__ || Object.getPrototypeOf(NewMemberList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        query: null,
        list: [],
        listType: '',
        windowWidth: 320,
        curImgIdx: 0,
        imgs: [],
        announce: null
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleResize();
      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _ref4, banner, items, nList;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _index5.default.item.newbies();

              case 2:
                _ref4 = _context2.sent;
                banner = _ref4.banner;
                items = _ref4.items;
                nList = (0, _index6.pickBy)(items, {
                  img: 'pics[0]',
                  item_id: 'itemId',
                  title: 'itemName',
                  desc: 'brief',
                  newbies_price: function newbies_price(_ref5) {
                    var _newbies_price = _ref5.newbies_price;
                    return (_newbies_price / 100).toFixed(2);
                  },
                  price: function price(_ref6) {
                    var _price = _ref6.price;
                    return (_price / 100).toFixed(2);
                  },
                  market_price: function market_price(_ref7) {
                    var _market_price = _ref7.market_price;
                    return (_market_price / 100).toFixed(2);
                  }
                });


                _index6.log.debug("[point draw picked]", nList);
                this.setState({
                  list: nList,
                  imgs: banner
                });

              case 8:
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
    key: "handleResize",
    value: function handleResize() {
      var _Taro$getSystemInfoSy = _index2.default.getSystemInfoSync(),
          windowWidth = _Taro$getSystemInfoSy.windowWidth;

      this.setState({
        windowWidth: windowWidth
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
          list = _state.list,
          showBackToTop = _state.showBackToTop,
          scrollTop = _state.scrollTop,
          windowWidth = _state.windowWidth,
          curImgIdx = _state.curImgIdx,
          imgs = _state.imgs;


      Object.assign(this.__state, {
        scrollTop: scrollTop,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }]);

  return NewMemberList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleScroll", "handleSwiperChange", "handleClickItem", "scrollBackToTop"], _temp2)) || _class;

exports.default = NewMemberList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(NewMemberList, true));