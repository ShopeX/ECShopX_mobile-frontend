"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DistributionDashboard = (_temp2 = _class = function (_BaseComponent) {
  _inherits(DistributionDashboard, _BaseComponent);

  function DistributionDashboard() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DistributionDashboard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DistributionDashboard.__proto__ || Object.getPrototypeOf(DistributionDashboard)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DistributionDashboard, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(DistributionDashboard.prototype.__proto__ || Object.getPrototypeOf(DistributionDashboard.prototype), "_constructor", this).call(this, props);
      this.state = {
        info: {}
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      _index2.default.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#2f3030'
      });
      this.fetch();
    }
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage() {
      var _Taro$getStorageSync = _index2.default.getStorageSync('userinfo'),
          username = _Taro$getStorageSync.username,
          userId = _Taro$getStorageSync.userId;

      var info = this.state.info;


      return {
        title: info.shop_name || username + "\u7684\u5C0F\u5E97",
        imageUrl: info.shop_pic,
        path: "/pages/distribution/shop-home?uid=" + userId
      };
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var resUser, username, avatar, res, base, promoter, pInfo, info;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                resUser = _index2.default.getStorageSync('userinfo');
                username = resUser.username, avatar = resUser.avatar;
                _context.next = 4;
                return _index4.default.distribution.dashboard();

              case 4:
                res = _context.sent;
                base = (0, _index5.pickBy)(res, {
                  itemTotalPrice: 'itemTotalPrice',
                  cashWithdrawalRebate: 'cashWithdrawalRebate',
                  promoter_order_count: 'promoter_order_count',
                  promoter_grade_order_count: 'promoter_grade_order_count',
                  rebateTotal: 'rebateTotal',
                  isbuy_promoter: 'isbuy_promoter',
                  notbuy_promoter: 'notbuy_promoter'
                });
                _context.next = 8;
                return _index4.default.distribution.info();

              case 8:
                promoter = _context.sent;
                pInfo = (0, _index5.pickBy)(promoter, {
                  shop_name: 'shop_name',
                  shop_pic: 'shop_pic',
                  is_open_promoter_grade: 'is_open_promoter_grade',
                  promoter_grade_name: 'promoter_grade_name'
                });
                info = _extends({ username: username, avatar: avatar }, base, pInfo);


                this.setState({
                  info: info
                });

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch() {
        return _ref2.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var info = this.__state.info;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return DistributionDashboard;
}(_index.Component), _class.properties = {}, _class.$$events = [], _temp2);
exports.default = DistributionDashboard;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(DistributionDashboard, true));