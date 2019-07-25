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

var _index3 = require("../../spx/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

var _index7 = require("../../hocs/index.js");

var _index8 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DistributionShop = (0, _index7.withPager)(_class = (0, _index7.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(DistributionShop, _BaseComponent);

  function DistributionShop() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, DistributionShop);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DistributionShop.__proto__ || Object.getPrototypeOf(DistributionShop)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray0", "loopArray1", "info", "curFilterIdx", "filterList", "showDrawer", "paramsList", "scrollTop", "list", "page", "query", "selectParams", "goodsIds"], _this.handleFilterChange = function (data) {
      _this.setState({
        showDrawer: false
      });
      var current = data.current,
          sort = data.sort;


      var query = _extends({}, _this.state.query, {
        goodsSort: current === 0 ? null : current === 1 ? 1 : sort > 0 ? 3 : 2
      });

      if (current !== _this.state.curFilterIdx || current === _this.state.curFilterIdx && query.goodsSort !== _this.state.query.goodsSort) {
        _this.resetPage();
        _this.setState({
          list: []
        });
      }

      _this.setState({
        curFilterIdx: current,
        query: query
      }, function () {
        _this.nextPage();
      });
    }, _this.handleClickFilter = function () {
      _this.setState({
        showDrawer: true
      });
    }, _this.handleClickParmas = function (id, child_id) {
      var _this$state = _this.state,
          paramsList = _this$state.paramsList,
          selectParams = _this$state.selectParams;

      paramsList.map(function (item) {
        if (item.attribute_id === id) {
          item.attribute_values.map(function (v_item) {
            if (v_item.attribute_value_id === child_id) {
              v_item.isChooseParams = true;
            } else {
              v_item.isChooseParams = false;
            }
          });
        }
      });
      selectParams.map(function (item) {
        if (item.attribute_id === id) {
          item.attribute_value_id = child_id;
        }
      });
      _this.setState({
        paramsList: paramsList,
        selectParams: selectParams
      });
    }, _this.handleClickSearchParams = function (type) {
      _this.setState({
        showDrawer: false
      });
      if (type === 'reset') {
        var _this$state2 = _this.state,
            paramsList = _this$state2.paramsList,
            selectParams = _this$state2.selectParams;

        _this.state.paramsList.map(function (item) {
          item.attribute_values.map(function (v_item) {
            if (v_item.attribute_value_id === 'all') {
              v_item.isChooseParams = true;
            } else {
              v_item.isChooseParams = false;
            }
          });
        });
        selectParams.map(function (item) {
          item.attribute_value_id = 'all';
        });
        _this.setState({
          paramsList: paramsList,
          selectParams: selectParams
        });
      }

      _this.resetPage();
      _this.setState({
        list: []
      }, function () {
        _this.nextPage();
      });
    }, _this.handleClickItem = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
        var goodsIds, goodsId, idx, isRelease, _ref3, status, _ref4, _status;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log(id);
                goodsIds = _this.state.goodsIds;
                goodsId = { goods_id: id };
                idx = goodsIds.findIndex(function (item) {
                  return id === item;
                });
                isRelease = idx !== -1;

                if (isRelease) {
                  _context.next = 13;
                  break;
                }

                _context.next = 8;
                return _index6.default.distribution.release(goodsId);

              case 8:
                _ref3 = _context.sent;
                status = _ref3.status;

                if (status) {
                  _this.setState({
                    goodsIds: [].concat(_toConsumableArray(_this.state.goodsIds), [id])
                  }, function () {
                    _index4.default.toast('上架成功');
                  });
                }
                _context.next = 18;
                break;

              case 13:
                _context.next = 15;
                return _index6.default.distribution.unreleased(goodsId);

              case 15:
                _ref4 = _context.sent;
                _status = _ref4.status;

                if (_status) {
                  goodsIds.splice(idx, 1);
                  _this.setState({
                    goodsIds: goodsIds
                  }, function () {
                    _index4.default.toast('下架成功');
                  });
                }

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.anonymousFunc0Array = [], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DistributionShop, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(DistributionShop.prototype.__proto__ || Object.getPrototypeOf(DistributionShop.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        info: {},
        curFilterIdx: 0,
        filterList: [{ title: '综合' }, { title: '销量' }, { title: '价格', sort: -1 }],
        query: null,
        showDrawer: false,
        paramsList: [],
        selectParams: [],
        list: [],
        goodsIds: []
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      this.firstStatus = true;
      this.setState({
        query: {
          item_type: 'normal',
          approve_status: 'onsale,only_show',
          is_promoter: true
        }
      }, function () {
        _this3.nextPage();
      });
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetchInfo();
    }
  }, {
    key: "fetchInfo",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var resUser, username, avatar, res, shop_name, brief, shop_pic;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                resUser = _index2.default.getStorageSync('userinfo');
                username = resUser.username, avatar = resUser.avatar;
                _context2.next = 4;
                return _index6.default.distribution.info();

              case 4:
                res = _context2.sent;
                shop_name = res.shop_name, brief = res.brief, shop_pic = res.shop_pic;


                this.setState({
                  info: {
                    username: username,
                    avatar: avatar,
                    shop_name: shop_name,
                    brief: brief,
                    shop_pic: shop_pic
                  }
                });

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchInfo() {
        return _ref5.apply(this, arguments);
      }

      return fetchInfo;
    }()
  }, {
    key: "fetch",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(params) {
        var _Taro$getStorageSync, userId, page, pageSize, selectParams, query, _ref7, list, total, _ref7$item_params_lis, item_params_list, nList, ids, param, _ref11, goods_id;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _Taro$getStorageSync = _index2.default.getStorageSync('userinfo'), userId = _Taro$getStorageSync.userId;
                page = params.page_no, pageSize = params.page_size;
                selectParams = this.state.selectParams;
                query = _extends({}, this.state.query, {
                  page: page,
                  pageSize: pageSize
                });
                _context3.next = 6;
                return _index6.default.item.search(query);

              case 6:
                _ref7 = _context3.sent;
                list = _ref7.list;
                total = _ref7.total_count;
                _ref7$item_params_lis = _ref7.item_params_list;
                item_params_list = _ref7$item_params_lis === undefined ? [] : _ref7$item_params_lis;


                item_params_list.map(function (item) {
                  if (selectParams.length < 4) {
                    selectParams.push({
                      attribute_id: item.attribute_id,
                      attribute_value_id: 'all'
                    });
                  }
                  item.attribute_values.unshift({ attribute_value_id: 'all', attribute_value_name: '全部', isChooseParams: true });
                });

                nList = (0, _index8.pickBy)(list, {
                  img: 'pics[0]',
                  item_id: 'item_id',
                  goods_id: 'goods_id',
                  title: 'itemName',
                  desc: 'brief',
                  price: function price(_ref8) {
                    var _price = _ref8.price;
                    return (_price / 100).toFixed(2);
                  },
                  promoter_price: function promoter_price(_ref9) {
                    var _promoter_price = _ref9.promoter_price;
                    return (_promoter_price / 100).toFixed(2);
                  },
                  market_price: function market_price(_ref10) {
                    var _market_price = _ref10.market_price;
                    return (_market_price / 100).toFixed(2);
                  }
                });
                ids = [];

                list.map(function (item) {
                  ids.push(item.goods_id);
                });

                param = {
                  goods_id: ids,
                  user_id: userId
                };
                _context3.next = 18;
                return _index6.default.distribution.items(param);

              case 18:
                _ref11 = _context3.sent;
                goods_id = _ref11.goods_id;


                this.setState({
                  goodsIds: [].concat(_toConsumableArray(this.state.goodsIds), _toConsumableArray(goods_id))
                });

                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList)),
                  showDrawer: false,
                  query: query
                });

                if (this.firstStatus) {
                  this.setState({
                    paramsList: item_params_list,
                    selectParams: selectParams
                  });
                  this.firstStatus = false;
                }

                return _context3.abrupt("return", {
                  total: total
                });

              case 24:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetch(_x2) {
        return _ref6.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage(res) {
      var _Taro$getStorageSync2 = _index2.default.getStorageSync('userinfo'),
          userId = _Taro$getStorageSync2.userId;

      var info = res.target.dataset.info;


      return {
        title: info.title,
        imageUrl: info.img,
        path: "/pages/item/espier-detail?id=" + info.item_id + "&userid=" + userId
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this4 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          page = _state.page,
          showDrawer = _state.showDrawer,
          paramsList = _state.paramsList,
          selectParams = _state.selectParams,
          scrollTop = _state.scrollTop,
          goodsIds = _state.goodsIds;


      var anonymousState__temp = "" + _index2.default.pxTransform(570);
      var loopArray0 = paramsList.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $anonymousCallee__0 = item.$original.attribute_values.map(function (v_item, v_index) {
          v_item = {
            $original: (0, _index.internal_get_original)(v_item)
          };
          var $loopState__temp3 = (0, _index8.classNames)('drawer-item__options__item', v_item.$original.isChooseParams ? 'drawer-item__options__checked' : '');
          return {
            $loopState__temp3: $loopState__temp3,
            $original: v_item.$original
          };
        });
        return {
          $anonymousCallee__0: $anonymousCallee__0,
          $original: item.$original
        };
      });
      var loopArray1 = list.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        var isRelease = goodsIds.findIndex(function (n) {
          return item.$original.goods_id == n;
        }) !== -1;
        console.log(isRelease);

        _this4.anonymousFunc0Array[index] = function () {
          return _this4.handleClickItem(item.$original.goods_id);
        };

        return {
          isRelease: isRelease,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        loopArray0: loopArray0,
        loopArray1: loopArray1,
        scrollTop: scrollTop,
        page: page
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(index, e) {
      ;
      this.anonymousFunc0Array[index] && this.anonymousFunc0Array[index](e);
    }
  }]);

  return DistributionShop;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleFilterChange", "handleClickFilter", "handleClickParmas", "handleClickSearchParams", "handleScroll", "nextPage", "anonymousFunc0"], _temp2)) || _class) || _class;

exports.default = DistributionShop;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(DistributionShop, true));