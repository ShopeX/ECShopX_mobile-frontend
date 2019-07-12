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

var _index7 = require("../../spx/index.js");

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RecommendList = (0, _index3.withPager)(_class = (0, _index3.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(RecommendList, _BaseComponent);

  function RecommendList() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, RecommendList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RecommendList.__proto__ || Object.getPrototypeOf(RecommendList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray0", "loopArray1", "multiIndex", "areaList", "showDrawer", "columnList", "scrollTop", "list", "page", "showBackToTop", "address", "query", "selectColumn", "info"], _this.handleClickItem = function (item) {
      var url = "/pages/recommend/detail?id=" + item.item_id;
      _index2.default.navigateTo({
        url: url
      });
    }, _this.handleConfirm = function (val) {
      _this.setState({
        query: _extends({}, _this.state.query, {
          title: val
        })
      }, function () {
        _this.resetPage();
        _this.setState({
          list: []
        }, function () {
          _this.nextPage();
        });
      });
    }, _this.handleClickFilter = function () {
      _this.setState({
        showDrawer: true
      });
    }, _this.handleClickParmas = function (id) {
      var _this$state = _this.state,
          columnList = _this$state.columnList,
          selectColumn = _this$state.selectColumn;

      columnList.map(function (item) {
        if (item.id === id) {
          item.isChooseColumn = true;
          selectColumn = item;
        } else {
          item.isChooseColumn = false;
        }
      });
      _this.setState({
        columnList: columnList,
        selectColumn: selectColumn
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
            if (v_item.attribute_value_id === '') {
              v_item.isChooseParams = true;
            } else {
              v_item.isChooseParams = false;
            }
          });
        });
        selectParams.map(function (item) {
          item.attribute_value_id = '';
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
        var info, province, city, area;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                info = _this.state.info;

                _this.addList.map(function (item, index) {
                  if (index === e.detail.value[0]) {
                    info.province = item.label;
                    item.children.map(function (s_item, sIndex) {
                      if (sIndex === e.detail.value[1]) {
                        info.city = s_item.label;
                        s_item.children.map(function (th_item, thIndex) {
                          if (thIndex === e.detail.value[2]) {
                            info.county = th_item.label;
                          }
                        });
                      }
                    });
                  }
                });

                province = info.province, city = info.city, area = info.area;

                _this.setState({
                  query: _extends({}, _this.state.query, {
                    province: province,
                    city: city,
                    area: area
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
        return _ref2.apply(this, arguments);
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
    }, _this.anonymousFunc0Array = [], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RecommendList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(RecommendList.prototype.__proto__ || Object.getPrototypeOf(RecommendList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        list: [],
        query: null,
        showDrawer: false,
        selectColumn: {},
        columnList: [],
        info: {},
        areaList: [],
        multiIndex: []
      });
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      var _this3 = this;

      _index2.default.showLoading();
      this.resetPage();
      this.setState({
        list: []
      });
      setTimeout(function () {
        _this3.nextPage();
        _index2.default.hideLoading();
      }, 200);

      // this.praiseNum()
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
        var page, pageSize, _state, columnList, areaList, selectColumn, article_query, columns, clist, defaultItem, _ref4, list, total, province_list, res, regions, addList, arrProvice, arrCity, arrCounty, nList;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                _state = this.state, columnList = _state.columnList, areaList = _state.areaList;
                selectColumn = this.state.selectColumn;
                article_query = _extends({}, this.state.query, {
                  article_type: 'bring',
                  page: page,
                  pageSize: pageSize,
                  category_id: selectColumn.id
                });

                if (!(columnList.length === 0)) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 7;
                return _index5.default.article.columnList();

              case 7:
                columns = _context2.sent;
                clist = (0, _index6.pickBy)(columns, {
                  name: 'category_name',
                  id: 'category_id'
                });
                defaultItem = { id: '', name: '全部', isChooseColumn: true };

                selectColumn = Object.assign({}, defaultItem);
                clist.unshift(defaultItem);
                this.setState({
                  columnList: clist
                });

              case 13:
                if (!_index8.default.getAuthToken()) {
                  _context2.next = 19;
                  break;
                }

                _context2.next = 16;
                return _index5.default.article.authList(article_query);

              case 16:
                _context2.t0 = _context2.sent;
                _context2.next = 22;
                break;

              case 19:
                _context2.next = 21;
                return _index5.default.article.list(article_query);

              case 21:
                _context2.t0 = _context2.sent;

              case 22:
                _ref4 = _context2.t0;
                list = _ref4.list;
                total = _ref4.total_count;
                province_list = _ref4.province_list;

                if (!(areaList.length === 0)) {
                  _context2.next = 39;
                  break;
                }

                _context2.next = 29;
                return _index5.default.member.areaList();

              case 29:
                res = _context2.sent;
                regions = [];

                province_list.map(function (item) {
                  var match = res.find(function (area) {
                    return item == area.id;
                  });
                  if (match) {
                    regions.push(match);
                  }
                });
                addList = (0, _index6.pickBy)(regions, {
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

              case 39:
                nList = (0, _index6.pickBy)(list, {
                  img: 'image_url',
                  item_id: 'article_id',
                  title: 'title',
                  author: 'author',
                  summary: 'summary',
                  head_portrait: 'head_portrait',
                  isPraise: 'isPraise',
                  articlePraiseNum: 'articlePraiseNum.count'
                });


                nList.map(function (item) {
                  if (!item.articlePraiseNum) {
                    item.articlePraiseNum = 0;
                  }
                });

                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList))
                });

                return _context2.abrupt("return", {
                  total: total
                });

              case 43:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch(_x2) {
        return _ref3.apply(this, arguments);
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
      var __runloopRef = arguments[2];
      ;

      var _state2 = this.__state,
          list = _state2.list,
          showBackToTop = _state2.showBackToTop,
          scrollTop = _state2.scrollTop,
          page = _state2.page,
          showDrawer = _state2.showDrawer,
          info = _state2.info,
          columnList = _state2.columnList;

      var address = info.province + info.city;

      var anonymousState__temp = "" + _index2.default.pxTransform(570);
      var loopArray0 = columnList.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp3 = (0, _index6.classNames)('drawer-item__options__item', item.$original.isChooseColumn ? 'drawer-item__options__checked' : '');
        return {
          $loopState__temp3: $loopState__temp3,
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
        loopArray0: loopArray0,
        loopArray1: loopArray1,
        scrollTop: scrollTop,
        page: page,
        showBackToTop: showBackToTop,
        address: address
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

  return RecommendList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleConfirm", "handleClickFilter", "handleClickPicker", "bindMultiPickerChange", "bindMultiPickerColumnChange", "handleClickParmas", "handleClickSearchParams", "handleScroll", "nextPage", "anonymousFunc0", "scrollBackToTop"], _class2.config = {
  navigationBarTitleText: '种草'
}, _temp2)) || _class) || _class;

exports.default = RecommendList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(RecommendList, true));