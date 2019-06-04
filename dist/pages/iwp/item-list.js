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

// @connect(({
//   member
// }) => ({
//   favs: member.favs
// }))
var List = (0, _index3.withPager)(_class = (0, _index3.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(List, _BaseComponent);

  function List() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, List);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = List.__proto__ || Object.getPrototypeOf(List)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray0", "loopArray1", "curFilterIdx", "filterList", "showDrawer", "paramsList", "scrollTop", "listType", "list", "page", "showBackToTop", "query", "selectParams"], _this.handleFilterChange = function (data) {
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
    }, _this.handleClickItem = function (item) {
      var url = "/pages/iwp/item-detail?id=" + item.item_id;
      _index2.default.navigateTo({
        url: url
      });
      /*Taro.navigateToMiniProgram({
        appId: 'wxf91925e702efe3e3', // 要跳转的小程序的appid
        path: `/pages/item/espier-detail`, // 跳转的目标页面
        extraData: {
          id: item.item_id
        },
        /!*extarData: {
          open: 'auth'
        },*!/
        success(res) {
          // 打开成功
          console.log(res)
        }
      })*/
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
    }, _this.anonymousFunc0Array = [], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(List, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curFilterIdx: 0,
        filterList: [{ title: '综合' }, { title: '销量' }, { title: '价格', sort: -1 }],
        query: null,
        list: [],
        paramsList: [],
        listType: 'grid',
        showDrawer: false,
        selectParams: []
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.firstStatus = true;
      this.setState({
        query: {
          keywords: this.$router.params.keywords,
          item_type: 'normal',
          is_point: 'false',
          approve_status: 'onsale,only_show',
          category: this.$router.params.cat_id
        }
      }, function () {
        _this2.nextPage();
      });
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var page, pageSize, selectParams, query, _ref3, list, total, _ref3$item_params_lis, item_params_list, nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                selectParams = this.state.selectParams;
                query = _extends({}, this.state.query, {
                  item_params: selectParams,
                  page: page,
                  pageSize: pageSize
                });
                _context.next = 5;
                return _index5.default.item.search(query);

              case 5:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total_count;
                _ref3$item_params_lis = _ref3.item_params_list;
                item_params_list = _ref3$item_params_lis === undefined ? [] : _ref3$item_params_lis;

                // const { favs } = this.props

                item_params_list.map(function (item) {
                  if (selectParams.length < 4) {
                    selectParams.push({
                      attribute_id: item.attribute_id,
                      attribute_value_id: 'all'
                    });
                  }
                  item.attribute_values.unshift({ attribute_value_id: 'all', attribute_value_name: '全部', isChooseParams: true });
                });

                nList = (0, _index6.pickBy)(list, {
                  img: 'pics[0]',
                  item_id: 'item_id',
                  title: 'itemName',
                  desc: 'brief',
                  price: function price(_ref4) {
                    var _price = _ref4.price;
                    return (_price / 100).toFixed(2);
                  },
                  market_price: function market_price(_ref5) {
                    var _market_price = _ref5.market_price;
                    return (_market_price / 100).toFixed(2);
                  }
                  // is_fav: ({ item_id }) => Boolean(favs[item_id])
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

                return _context.abrupt("return", {
                  total: total
                });

              case 15:
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

    /*handleListTypeChange = () => {
      const listType = this.state.listType === 'grid' ? 'default' : 'grid'
        this.setState({
        listType
      })
    }
    */

  }, {
    key: "_createData",
    value: function _createData() {
      var _this3 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          listType = _state.listType,
          curFilterIdx = _state.curFilterIdx,
          filterList = _state.filterList,
          showBackToTop = _state.showBackToTop,
          scrollTop = _state.scrollTop,
          page = _state.page,
          showDrawer = _state.showDrawer,
          paramsList = _state.paramsList,
          selectParams = _state.selectParams;


      var anonymousState__temp = "" + _index2.default.pxTransform(570);
      var loopArray0 = paramsList.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $anonymousCallee__0 = item.$original.attribute_values.map(function (v_item, v_index) {
          v_item = {
            $original: (0, _index.internal_get_original)(v_item)
          };
          var $loopState__temp3 = (0, _index6.classNames)('drawer-item__options__item', v_item.$original.isChooseParams ? 'drawer-item__options__checked' : '');
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
      var loopArray1 = list.map(function (item, __index0) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        _this3.anonymousFunc0Array[__index0] = function () {
          return _this3.handleClickItem(item.$original);
        };

        return {
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        loopArray0: loopArray0,
        loopArray1: loopArray1,
        scrollTop: scrollTop,
        page: page,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(__index0, e) {
      ;
      this.anonymousFunc0Array[__index0] && this.anonymousFunc0Array[__index0](e);
    }
  }]);

  return List;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleFilterChange", "handleClickFilter", "handleClickParmas", "handleClickSearchParams", "handleScroll", "nextPage", "anonymousFunc0", "scrollBackToTop"], _temp2)) || _class) || _class;

exports.default = List;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(List, true));