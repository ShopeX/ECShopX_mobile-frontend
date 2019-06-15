"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _mapKeys2 = require("../../npm/lodash/mapKeys.js");

var _mapKeys3 = _interopRequireDefault(_mapKeys2);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../hocs/index.js");

var _index6 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InvoiceList = (_dec = (0, _index5.withLogin)(), (0, _index5.withPager)(_class = _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(InvoiceList, _BaseComponent);

  function InvoiceList() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, InvoiceList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InvoiceList.__proto__ || Object.getPrototypeOf(InvoiceList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["list", "page"], _this.handleClickItem = function (trade) {
      var tid = trade.tid;


      _index2.default.navigateTo({
        url: "/pages/trade/detail?id=" + tid
      });
    }, _this.handleClickItemBtn = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type, trade) {
        var params;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                params = _extends({}, trade);
                // console.log(trade, 84)

                _context.t0 = type;
                _context.next = _context.t0 === 'add-card' ? 4 : _context.t0 === 'open-card' ? 7 : 10;
                break;

              case 4:
                _context.next = 6;
                return _index2.default.addCard(params);

              case 6:
                return _context.abrupt("break", 10);

              case 7:
                _context.next = 9;
                return _index2.default.openCard(params);

              case 9:
                return _context.abrupt("break", 10);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.handleClickBtn = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(type) {
        var showErr;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (type === 'add-card') {
                  showErr = function showErr() {
                    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '下载失败';

                    return _index2.default.showToast({
                      icon: 'none',
                      title: title
                    });
                  };

                  (0, _index6.authSetting)('writePhotosAlbum', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                    var _ref5, tempFilePath;

                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return _index2.default.downloadFile({
                              url: 'http://mmbiz.qpic.cn/mmbiz_png/1nDJByqmW2drJSibeWL0bEib2rj4OxG6ep2Y8VggMzP2pSSHVGNW3eIEy9BUiaMfxD4MrWUQ2oVaNEZs4VfQg8tSw/0?wx_fmt=png'
                            });

                          case 2:
                            _ref5 = _context2.sent;
                            tempFilePath = _ref5.tempFilePath;
                            _context2.prev = 4;
                            _context2.next = 7;
                            return _index2.default.saveImageToPhotosAlbum({
                              filePath: tempFilePath
                            });

                          case 7:
                            _index2.default.showToast({
                              icon: 'success',
                              title: '成功保存照片'
                            });
                            _context2.next = 13;
                            break;

                          case 10:
                            _context2.prev = 10;
                            _context2.t0 = _context2["catch"](4);

                            console.log(_context2.t0);

                          case 13:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this2, [[4, 10]]);
                  })), function () {
                    showErr();
                  });
                }

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InvoiceList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(InvoiceList.prototype.__proto__ || Object.getPrototypeOf(InvoiceList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        list: []
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.nextPage();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "fetch",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(params) {
        var _ref7, list, total, nList;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                params = (0, _mapKeys3.default)(_extends({}, params), function (val, key) {
                  if (key === 'page_no') {
                    return 'page';
                  }if (key === 'page_size') {
                    return 'pageSize';
                  }return key;
                });

                _context4.next = 3;
                return _index4.default.trade.involiceList(params);

              case 3:
                _ref7 = _context4.sent;
                list = _ref7.list;
                total = _ref7.total_count;
                nList = (0, _index6.pickBy)(list, {
                  tid: 'order_id',
                  status_desc: 'order_status_msg',
                  status: function status(_ref8) {
                    var order_status = _ref8.order_status;
                    return (0, _index6.resolveOrderStatus)(order_status);
                  },
                  totalItems: function totalItems(_ref9) {
                    var items = _ref9.items;
                    return items.reduce(function (acc, item) {
                      return +item.num + acc;
                    }, 0);
                  },
                  payment: function payment(_ref10) {
                    var total_fee = _ref10.total_fee;
                    return (total_fee / 100).toFixed(2);
                  },
                  pay_type: 'pay_type',
                  point: 'point',
                  create_date: 'create_date',
                  order: function order(_ref11) {
                    var items = _ref11.items;
                    return (0, _index6.pickBy)(items, {
                      order_id: 'order_id',
                      item_id: 'item_id',
                      pic_path: 'pic',
                      title: 'item_name',
                      price: function price(_ref12) {
                        var item_fee = _ref12.item_fee;
                        return (+item_fee / 100).toFixed(2);
                      },
                      point: 'item_point',
                      num: 'num'
                    });
                  }
                });


                _index6.log.debug('[trade list] list fetched and processed: ', nList);

                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList))
                });

                return _context4.abrupt("return", { total: total });

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetch(_x5) {
        return _ref6.apply(this, arguments);
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

      var _state = this.__state,
          list = _state.list,
          page = _state.page;


      Object.assign(this.__state, {
        page: page
      });
      return this.__state;
    }
  }]);

  return InvoiceList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["nextPage", "handleClickItem", "handleClickItemBtn"], _temp2)) || _class) || _class);
exports.default = InvoiceList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(InvoiceList, true));