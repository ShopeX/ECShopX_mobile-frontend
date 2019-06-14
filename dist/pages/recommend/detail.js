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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = recommendDetail.__proto__ || Object.getPrototypeOf(recommendDetail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "info", "screenWidth", "collectArticleStatus", "praiseCheckStatus", "item_id_List"], _this.confirmCollectArticle = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var id, res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = _this.$router.params.id;

              if (!_index8.default.getAuthToken()) {
                _context.next = 6;
                break;
              }

              _context.next = 4;
              return _index4.default.article.collectArticleInfo({ article_id: id });

            case 4:
              res = _context.sent;

              if (res.length === 0) {
                _this.setState({
                  collectArticleStatus: false
                });
              } else {
                _this.setState({
                  collectArticleStatus: true
                });
              }

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.detailInfo = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
        var info;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!_index8.default.getAuthToken()) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 3;
                return _index4.default.article.detailAuth(id);

              case 3:
                _context2.t0 = _context2.sent;
                _context2.next = 9;
                break;

              case 6:
                _context2.next = 8;
                return _index4.default.article.detail(id);

              case 8:
                _context2.t0 = _context2.sent;

              case 9:
                info = _context2.t0;


                info.updated_str = (0, _index6.formatTime)(info.updated * 1000, 'YYYY-MM-DD');

                _this.setState({
                  info: info
                });

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.handleClickBar = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(type) {
        var id, _ref5, count, resCollectArticle, query;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                id = _this.$router.params.id;

                if (!(type === 'like')) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 4;
                return _index4.default.article.praise(id);

              case 4:
                _ref5 = _context3.sent;
                count = _ref5.count;

                _this.detailInfo(id);
                /*if(this.state.praiseCheckStatus === true){
                  return false
                }*/
                /*const { count } = await api.article.praise(id)
                this.praiseCheck()
                this.fetchContent()*/

              case 7:
                if (!(type === 'mark')) {
                  _context3.next = 21;
                  break;
                }

                _context3.next = 10;
                return _index4.default.article.collectArticle(id);

              case 10:
                resCollectArticle = _context3.sent;

                if (!(resCollectArticle.fav_id && _this.state.collectArticleStatus === false)) {
                  _context3.next = 16;
                  break;
                }

                _this.setState({
                  collectArticleStatus: true
                });
                _index2.default.showToast({
                  title: '已加入心愿单',
                  icon: 'none'
                });
                _context3.next = 21;
                break;

              case 16:
                query = {
                  article_id: id
                };
                _context3.next = 19;
                return _index4.default.article.delCollectArticle(query);

              case 19:
                _this.setState({
                  collectArticleStatus: false
                });
                _index2.default.showToast({
                  title: '已移出心愿单',
                  icon: 'none'
                });

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.handleClickGoods = function () {
      var id = _this.$router.params.id;

      _this.detailInfo(id);
    }, _this.handleToGiftMiniProgram = function () {
      _index2.default.navigateToMiniProgram({
        appId: "wx2fb97cb696f68d22", // 要跳转的小程序的appid
        path: '/pages/index/index', // 跳转的目标页面
        success: function success(res) {
          // 打开成功
          console.log(res);
        }
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
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
        item_id_List: [],
        screenWidth: 0
      });
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.fetchContent();
      // this.praiseCheck()
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      _index2.default.getSystemInfo().then(function (res) {
        _this3.setState({
          screenWidth: res.screenWidth
        });
      });
    }

    /*async fetch (params) {
      const { page_no: page, page_size: pageSize } = params
      const query = {
        page,
        pageSize: 50,
        item_type: 'normal',
        item_id: this.state.item_id_List
      }
        const { list, total_count: total } = await api.item.search(query)
        list.map(item => {
        if(item.approve_status === 'onsale') {
          this.state.info.content.map(info_item => {
            if(info_item.name === 'goods') {
              info_item.data.map(id_item => {
                if(item.item_id === id_item.item_id) {
                  id_item.isOnsale = true
                }
              })
            }
          })
          this.setState({
            info: this.state.info
          })
        }
      })
      Taro.hideLoading()
        return {
        total
      }
    }*/

    // 确认本人文章是否已收藏


    // 拉取详情

  }, {
    key: "fetchContent",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var id, resFocus;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                id = this.$router.params.id;

                // 关注数加1

                _context4.next = 3;
                return _index4.default.article.focus(id);

              case 3:
                resFocus = _context4.sent;


                this.confirmCollectArticle();

                if (resFocus) {
                  this.detailInfo(id);
                  /*, ()=>{
                  //         Taro.showLoading()
                  //         let item_id_List = []
                  //         if(info.content){
                  //           info.content.map(item => {
                  //             if(item.name === 'goods') {
                  //               item.data.map(id_item => {
                  //                 item_id_List.push(id_item.item_id)
                  //               })
                  //             }
                  //           })
                  //           this.setState({
                  //             item_id_List
                  //           },()=>{
                  //             this.resetPage()
                  //             setTimeout(()=>{
                  //               this.nextPage()
                  //             }, 200)
                  //           })
                  //
                  //         }
                  //       }*/
                }

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetchContent() {
        return _ref6.apply(this, arguments);
      }

      return fetchContent;
    }()

    /*praiseCheck = async () => {
      if(!S.getAuthToken()){
        return false
      }
      const { id } = this.$router.params
      const { status } = await api.article.praiseCheck(id)
      this.setState({
        praiseCheckStatus: status
      })
    }*/

  }, {
    key: "handleShare",
    value: function handleShare() {}
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          praiseCheckStatus = _state.praiseCheckStatus,
          screenWidth = _state.screenWidth,
          collectArticleStatus = _state.collectArticleStatus,
          showBackToTop = _state.showBackToTop;


      if (!info) {
        return null;
      }

      var anonymousState__temp = !showBackToTop;
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp
      });
      return this.__state;
    }
  }]);

  return recommendDetail;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickGoods", "handleToGiftMiniProgram", "handleShare", "scrollBackToTop", "handleClickBar"], _temp2)) || _class;

exports.default = recommendDetail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(recommendDetail, true));