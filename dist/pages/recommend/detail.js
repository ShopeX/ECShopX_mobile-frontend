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

var _index6 = require("../../utils/index.js");

var _index7 = require("../../spx/index.js");

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var recommendDetail = (0, _index5.withPager)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(recommendDetail, _BaseComponent);

  function recommendDetail() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, recommendDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = recommendDetail.__proto__ || Object.getPrototypeOf(recommendDetail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "praiseCheckStatus", "collectArticleStatus", "item_id_List"], _this.praiseCheck = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var id, _ref3, status;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (_index8.default.getAuthToken()) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", false);

            case 2:
              id = _this.$router.params.id;
              _context.next = 5;
              return _index4.default.article.praiseCheck(id);

            case 5:
              _ref3 = _context.sent;
              status = _ref3.status;

              _this.setState({
                praiseCheckStatus: status
              });

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleClickBar = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(type) {
        var id, _ref5, count, resCollectArticle, query;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = _this.$router.params.id;

                if (!(type === 'like')) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 4;
                return _index4.default.article.praise(id);

              case 4:
                _ref5 = _context2.sent;
                count = _ref5.count;

                _this.praiseCheck();
                _this.fetchContent();

              case 8:
                if (!(type === 'mark')) {
                  _context2.next = 23;
                  break;
                }

                _context2.next = 11;
                return _index4.default.article.collectArticle(id);

              case 11:
                resCollectArticle = _context2.sent;

                if (!(resCollectArticle.fav_id && _this.state.collectArticleStatus === false)) {
                  _context2.next = 17;
                  break;
                }

                _this.setState({
                  collectArticleStatus: true
                });
                _index2.default.showToast({
                  title: '已加入心愿单',
                  icon: 'none'
                });
                _context2.next = 22;
                break;

              case 17:
                query = {
                  article_id: id
                };
                _context2.next = 20;
                return _index4.default.article.delCollectArticle(query);

              case 20:
                _this.setState({
                  collectArticleStatus: false
                });
                _index2.default.showToast({
                  title: '已移出心愿单',
                  icon: 'none'
                });

              case 22:
                console.log(resCollectArticle, 62);

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(recommendDetail, [{
    key: "_constructor",
    value: function _constructor(props) {
      props = props || {};
      props.pageSize = 50;
      _get(recommendDetail.prototype.__proto__ || Object.getPrototypeOf(recommendDetail.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        info: null,
        praiseCheckStatus: false,
        collectArticleStatus: false,
        item_id_List: []
      });
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetchContent();
      this.praiseCheck();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "fetch",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(params) {
        var _this3 = this;

        var page, pageSize, query, _ref7, list, total;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                query = {
                  page: page,
                  pageSize: 50,
                  item_type: 'normal',
                  item_id: this.state.item_id_List
                };
                _context3.next = 4;
                return _index4.default.item.search(query);

              case 4:
                _ref7 = _context3.sent;
                list = _ref7.list;
                total = _ref7.total_count;

                list.map(function (item) {
                  if (item.approve_status === 'onsale') {
                    _this3.state.info.content.map(function (info_item) {
                      if (info_item.name === 'goods') {
                        info_item.data.map(function (id_item) {
                          if (item.item_id === id_item.item_id) {
                            id_item.isOnsale = true;
                          }
                        });
                      }
                    });
                    _this3.setState({
                      info: _this3.state.info
                    });
                  }
                });

                return _context3.abrupt("return", {
                  total: total
                });

              case 9:
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
    key: "fetchContent",
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this4 = this;

        var id, resFocus, res, info;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                id = this.$router.params.id;
                _context4.next = 3;
                return _index4.default.article.focus(id);

              case 3:
                resFocus = _context4.sent;

                if (!_index8.default.getAuthToken()) {
                  _context4.next = 9;
                  break;
                }

                _context4.next = 7;
                return _index4.default.article.delCollectArticleInfo({ article_id: id });

              case 7:
                res = _context4.sent;

                if (res.length === 0) {
                  this.setState({
                    collectArticleStatus: false
                  });
                } else {
                  this.setState({
                    collectArticleStatus: true
                  });
                }

              case 9:
                if (!resFocus) {
                  _context4.next = 22;
                  break;
                }

                if (!_index8.default.getAuthToken()) {
                  _context4.next = 16;
                  break;
                }

                _context4.next = 13;
                return _index4.default.article.authDetail(id);

              case 13:
                _context4.t0 = _context4.sent;
                _context4.next = 19;
                break;

              case 16:
                _context4.next = 18;
                return _index4.default.article.detail(id);

              case 18:
                _context4.t0 = _context4.sent;

              case 19:
                info = _context4.t0;


                info.updated_str = (0, _index6.formatTime)(info.updated * 1000, 'YYYY-MM-DD');
                this.setState({
                  info: info
                }, function () {
                  var item_id_List = [];
                  if (info.content) {
                    info.content.map(function (item) {
                      if (item.name === 'goods') {
                        console.log(item, 57);
                        item.data.map(function (id_item) {
                          item_id_List.push(id_item.item_id);
                        });
                      }
                    });
                    _this4.setState({
                      item_id_List: item_id_List
                    }, function () {
                      _this4.nextPage();
                    });
                  }
                });

              case 22:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetchContent() {
        return _ref8.apply(this, arguments);
      }

      return fetchContent;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          praiseCheckStatus = _state.praiseCheckStatus,
          collectArticleStatus = _state.collectArticleStatus;


      if (!info) {
        return null;
      }

      console.log(info.content, 44);

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return recommendDetail;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickBar"], _temp2)) || _class;

exports.default = recommendDetail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(recommendDetail, true));