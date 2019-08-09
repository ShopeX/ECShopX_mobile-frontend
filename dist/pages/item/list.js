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

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _index4 = require("../../hocs/index.js");

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

var _index7 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var List = (_dec = (0, _index3.connect)(function (_ref) {
  var member = _ref.member;
  return {
    favs: member.favs
  };
}), _dec(_class = (0, _index4.withPager)(_class = (0, _index4.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(List, _BaseComponent);

  function List() {
    var _ref2,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, List);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = List.__proto__ || Object.getPrototypeOf(List)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp4", "loopArray0", "loopArray1", "tagsList", "curTagId", "curFilterIdx", "filterList", "multiIndex", "areaList", "showDrawer", "paramsList", "scrollTop", "listType", "list", "page", "showBackToTop", "info", "query", "selectParams", "favs"], _this.handleTagChange = function (data) {
      var current = data.current;


      _this.resetPage();
      _this.setState({
        list: []
      });

      _this.setState({
        curTagId: current
      }, function () {
        _this.nextPage();
      });
    }, _this.handleFilterChange = function (data) {
      console.log(111);
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
    }, _this.handleListTypeChange = function () {
      var listType = _this.state.listType === 'grid' ? 'default' : 'grid';

      _this.setState({
        listType: listType
      });
    }, _this.handleClickItem = function (item) {
      var url = "/pages/item/espier-detail?id=" + item.item_id;
      _index2.default.navigateTo({
        url: url
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
    }, _this.handleClickPicker = function () {
      var arrProvice = [];
      var arrCity = [];
      var arrCounty = [];
      if (_this.addList) {
        _this.addList.map(function (item, index) {
          arrProvice.push(item.label);
          if (index === 0) {
            item.children.map(function (c_item, c_index) {
              arrCity.push(c_item.label);
              if (c_index === 0) {
                c_item.children.map(function (cny_item) {
                  arrCounty.push(cny_item.label);
                });
              }
            });
          }
        });
        _this.setState({
          showDrawer: false,
          areaList: [arrProvice, arrCity, arrCounty],
          multiIndex: [0, 0, 0]
        });
      }
    }, _this.bindMultiPickerChange = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
        var info, regions;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                info = _this.state.info;

                _this.addList.map(function (item, index) {
                  console.log(item);
                  if (index === e.detail.value[0]) {
                    info.province = {
                      label: item.label,
                      id: item.id
                    };
                    item.children.map(function (s_item, sIndex) {
                      if (sIndex === e.detail.value[1]) {
                        info.city = {
                          label: s_item.label,
                          id: s_item.id
                        };
                        s_item.children.map(function (th_item, thIndex) {
                          if (thIndex === e.detail.value[2]) {
                            info.county = {
                              label: th_item.label,
                              id: th_item.id
                            };
                          }
                        });
                      }
                    });
                  }
                });

                regions = [info.province.id, info.city.id, info.county.id];


                _this.setState({
                  query: _extends({}, _this.state.query, {
                    regions_id: regions
                  })
                }, function () {
                  _this.resetPage();
                  _this.setState({
                    list: []
                  }, function () {
                    _this.nextPage();
                  });
                });
                _this.setState({ info: info });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.bindMultiPickerColumnChange = function (e) {
      var _this$state3 = _this.state,
          areaList = _this$state3.areaList,
          multiIndex = _this$state3.multiIndex;

      if (e.detail.column === 0) {
        _this.setState({
          multiIndex: [e.detail.value, 0, 0]
        });
        _this.addList.map(function (item, index) {
          if (index === e.detail.value) {
            var arrCity = [];
            var arrCounty = [];
            item.children.map(function (c_item, c_index) {
              arrCity.push(c_item.label);
              if (c_index === 0) {
                c_item.children.map(function (cny_item) {
                  arrCounty.push(cny_item.label);
                });
              }
            });
            areaList[1] = arrCity;
            areaList[2] = arrCounty;
            _this.setState({ areaList: areaList });
          }
        });
      } else if (e.detail.column === 1) {
        multiIndex[1] = e.detail.value;
        multiIndex[2] = 0;
        _this.setState({
          multiIndex: multiIndex
        }, function () {
          _this.addList[multiIndex[0]].children.map(function (c_item, c_index) {
            if (c_index === e.detail.value) {
              var arrCounty = [];
              c_item.children.map(function (cny_item) {
                arrCounty.push(cny_item.label);
              });
              areaList[2] = arrCounty;
              _this.setState({ areaList: areaList });
            }
          });
        });
      } else {
        multiIndex[2] = e.detail.value;
        _this.setState({
          multiIndex: multiIndex
        });
      }
    }, _this.handleConfirm = function (val) {
      _this.setState({
        query: _extends({}, _this.state.query, {
          keywords: val
        })
      }, function () {
        _this.resetPage();
        _this.setState({
          list: []
        }, function () {
          _this.nextPage();
        });
      });
    }, _this.anonymousFunc0Array = [], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(List, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curFilterIdx: 0,
        curTagId: '',
        filterList: [{ title: '综合' }, { title: '销量' }, { title: '价格', sort: -1 }],
        query: null,
        list: [],
        tagsList: [],
        paramsList: [],
        listType: 'grid',
        showDrawer: false,
        selectParams: [],
        info: {},
        areaList: [],
        multiIndex: []
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      this.firstStatus = true;
      console.log(this.$router.params);
      this.setState({
        query: {
          keywords: this.$router.params.keywords,
          item_type: 'normal',
          is_point: 'false',
          approve_status: 'onsale,only_show',
          category: this.$router.params.cat_id
        }
      }, function () {
        _this3.nextPage();
      });
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
        var page, pageSize, _state, selectParams, areaList, tagsList, curTagId, _Taro$getStorageSync, distributor_id, query, _ref5, list, total, _ref5$item_params_lis, item_params_list, _ref5$select_tags_lis, select_tags_list, _ref5$select_address_, select_address_list, favs, res, regions, addList, arrProvice, arrCity, arrCounty, nList;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                _state = this.state, selectParams = _state.selectParams, areaList = _state.areaList, tagsList = _state.tagsList, curTagId = _state.curTagId;
                _Taro$getStorageSync = _index2.default.getStorageSync('curStore'), distributor_id = _Taro$getStorageSync.distributor_id;
                query = _extends({}, this.state.query, {
                  item_params: selectParams,
                  tag_id: curTagId,
                  distributor_id: distributor_id,
                  page: page,
                  pageSize: pageSize
                });
                _context2.next = 6;
                return _index6.default.item.search(query);

              case 6:
                _ref5 = _context2.sent;
                list = _ref5.list;
                total = _ref5.total_count;
                _ref5$item_params_lis = _ref5.item_params_list;
                item_params_list = _ref5$item_params_lis === undefined ? [] : _ref5$item_params_lis;
                _ref5$select_tags_lis = _ref5.select_tags_list;
                select_tags_list = _ref5$select_tags_lis === undefined ? [] : _ref5$select_tags_lis;
                _ref5$select_address_ = _ref5.select_address_list;
                select_address_list = _ref5$select_address_ === undefined ? [] : _ref5$select_address_;
                favs = this.props.favs;

                if (!(areaList.length === 0)) {
                  _context2.next = 29;
                  break;
                }

                _context2.next = 19;
                return _index6.default.member.areaList();

              case 19:
                res = _context2.sent;
                regions = [];

                select_address_list.map(function (item) {
                  var match = res.find(function (area) {
                    return item == area.id;
                  });
                  if (match) {
                    regions.push(match);
                  }
                });
                addList = (0, _index7.pickBy)(regions, {
                  label: 'label',
                  id: 'id',
                  children: 'children'
                });

                this.addList = addList;
                arrProvice = [];
                arrCity = [];
                arrCounty = [];

                addList.map(function (item, index) {
                  arrProvice.push(item.label);
                  if (index === 0) {
                    item.children.map(function (c_item, c_index) {
                      arrCity.push(c_item.label);
                      if (c_index === 0) {
                        c_item.children.map(function (cny_item) {
                          arrCounty.push(cny_item.label);
                        });
                      }
                    });
                  }
                });
                this.setState({
                  areaList: [arrProvice, arrCity, arrCounty]
                });

              case 29:

                item_params_list.map(function (item) {
                  if (selectParams.length < 4) {
                    selectParams.push({
                      attribute_id: item.attribute_id,
                      attribute_value_id: 'all'
                    });
                  }
                  item.attribute_values.unshift({ attribute_value_id: 'all', attribute_value_name: '全部', isChooseParams: true });
                });

                nList = (0, _index7.pickBy)(list, {
                  img: 'pics[0]',
                  item_id: 'item_id',
                  title: 'itemName',
                  desc: 'brief',
                  price: function price(_ref6) {
                    var _price = _ref6.price;
                    return (_price / 100).toFixed(2);
                  },
                  market_price: function market_price(_ref7) {
                    var _market_price = _ref7.market_price;
                    return (_market_price / 100).toFixed(2);
                  },
                  is_fav: function is_fav(_ref8) {
                    var item_id = _ref8.item_id;
                    return Boolean(favs[item_id]);
                  }
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

                if (tagsList.length === 0) {
                  this.setState({
                    tagsList: select_tags_list
                  });
                }

                return _context2.abrupt("return", {
                  total: total
                });

              case 35:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch(_x2) {
        return _ref4.apply(this, arguments);
      }

      return fetch;
    }()

    // 选定开户地区

  }, {
    key: "_createData",
    value: function _createData() {
      var _this4 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state2 = this.__state,
          list = _state2.list,
          listType = _state2.listType,
          curFilterIdx = _state2.curFilterIdx,
          filterList = _state2.filterList,
          showBackToTop = _state2.showBackToTop,
          scrollTop = _state2.scrollTop,
          page = _state2.page,
          showDrawer = _state2.showDrawer,
          paramsList = _state2.paramsList,
          selectParams = _state2.selectParams,
          multiIndex = _state2.multiIndex,
          areaList = _state2.areaList,
          tagsList = _state2.tagsList,
          curTagId = _state2.curTagId,
          info = _state2.info;


      var anonymousState__temp = "" + _index2.default.pxTransform(570);
      var anonymousState__temp4 = (0, _index7.classNames)('goods-list__scroll', tagsList.length > 0 && 'with-tag-bar');
      var loopArray0 = paramsList.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $anonymousCallee__0 = item.$original.attribute_values.map(function (v_item, v_index) {
          v_item = {
            $original: (0, _index.internal_get_original)(v_item)
          };
          var $loopState__temp3 = (0, _index7.classNames)('drawer-item__options__item', v_item.$original.isChooseParams ? 'drawer-item__options__checked' : '');
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

        _this4.anonymousFunc0Array[__index0] = function () {
          return _this4.handleClickItem(item.$original);
        };

        return {
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp4: anonymousState__temp4,
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
}(_index.Component), _class2.properties = {
  "favs": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleConfirm", "handleTagChange", "handleFilterChange", "handleClickFilter", "handleClickPicker", "bindMultiPickerChange", "bindMultiPickerColumnChange", "handleClickParmas", "handleClickSearchParams", "handleScroll", "nextPage", "anonymousFunc0", "scrollBackToTop"], _temp2)) || _class) || _class) || _class);
exports.default = List;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(List, true));