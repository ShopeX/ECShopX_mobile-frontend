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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SeckillList = (0, _index3.withPager)(_class = (0, _index3.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(SeckillList, _BaseComponent);

  function SeckillList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SeckillList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SeckillList.__proto__ || Object.getPrototypeOf(SeckillList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["curTabIdx", "tabList", "scrollTop", "list", "timeCountDown", "showBackToTop", "query"], _this.config = {
      navigationBarTitleText: '限时秒杀'
    }, _this.handleClickTab = function (idx) {
      if (_this.state.page.isLoading) {
        return;
      }if (idx !== _this.state.curTabIdx) {
        _this.resetPage();
        // this.setState({
        //   list: []
        // })
      }

      _this.setState({
        curTabIdx: idx
      }, function () {
        _this.nextPage();
      });
    }, _this.handleClickItem = function () {
      _index2.default.navigateTo({
        url: '/pages/item/seckill-goods-list'
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SeckillList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(SeckillList.prototype.__proto__ || Object.getPrototypeOf(SeckillList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        curTabIdx: 0,
        tabList: [{ title: '进行中', status: 'valid' }, { title: '未开始', status: 'notice' }],
        query: null,
        list: [{
          last_seconds: 1759242,
          ad_pic: 'http://mmbiz.qpic.cn/mmbiz_jpg/1nDJByqmW2f7v2eYIjM9lKBnyGsyZyCUDmZEE648cE7VZlvlNkFJMQcic6VtG6YnElMYJzWV2nJDtFU09xibhxgg/0?wx_fmt=jpeg'
        }, {
          last_seconds: 1775245,
          ad_pic: 'http://mmbiz.qpic.cn/mmbiz_jpg/1nDJByqmW2f7v2eYIjM9lKBnyGsyZyCUDmZEE648cE7VZlvlNkFJMQcic6VtG6YnElMYJzWV2nJDtFU09xibhxgg/0?wx_fmt=jpeg'
        }],
        timeCountDown: []
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // this.setState({
      //   query: {
      //     status: this.state.curTabIdx === 0 ? 'valid' : 'notice',
      //     item_type: 'normal'
      //   }
      // }, () => {
      //   this.nextPage()
      // })
      this.fetch();
    }
  }, {
    key: "calcTimer",
    value: function calcTimer(t_index, totalSec) {
      var remainingSec = totalSec;
      var timeCountDown = this.state.timeCountDown;

      var dd = Math.floor(totalSec / 24 / 3600);
      remainingSec -= dd * 3600 * 24;
      var hh = Math.floor(remainingSec / 3600);
      remainingSec -= hh * 3600;
      var mm = Math.floor(remainingSec / 60);
      remainingSec -= mm * 60;
      var ss = Math.floor(remainingSec);
      timeCountDown.map(function (item, index) {
        if (index === t_index) {
          item.dd = dd, item.hh = hh, item.mm = mm, item.ss = ss;
        }
      });
      this.setState({
        timeCountDown: timeCountDown
      });
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var _this2 = this;

        var list, timeCountDown;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // const { page_no: page, page_size: pageSize } = params
                // const query = {
                //   status: this.state.curTabIdx === 0 ? 'valid' : 'notice',
                //   page,
                //   pageSize
                // }
                //
                // const { list, total_count: total } = await api.seckill.seckillList(query)
                list = this.state.list;
                timeCountDown = [];

                list.map(function (item) {
                  timeCountDown.push({
                    timer: null,
                    micro_second: item.last_seconds,
                    time: ''
                  });
                });

                this.setState({
                  timeCountDown: timeCountDown
                }, function () {
                  timeCountDown.map(function (t_item, t_index) {
                    if (t_item.micro_second === 0) {
                      t_item.time = 0;
                      return;
                    }
                    _this2.calcTimer(t_index, t_item.micro_second);
                  });
                });

                // console.log(this.state.list, 53)

                // const nList = pickBy(list, {
                //   img: 'pics[0]',
                //   item_id: 'item_id',
                //   title: 'itemName',
                //   desc: 'brief',
                //   price: 'point',
                // })
                //
                // this.setState({
                //   list: [...this.state.list, ...nList],
                //   query
                // })

                // return {
                //   total
                // }

              case 4:
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
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          curTabIdx = _state.curTabIdx,
          tabList = _state.tabList,
          showBackToTop = _state.showBackToTop,
          scrollTop = _state.scrollTop,
          page = _state.page,
          timeCountDown = _state.timeCountDown;

      Object.assign(this.__state, {
        scrollTop: scrollTop,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }]);

  return SeckillList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleClickTab", "handleScroll", "handleClickItem", "scrollBackToTop"], _temp2)) || _class) || _class;

exports.default = SeckillList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(SeckillList, true));