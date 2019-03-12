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

var _index3 = require("../../utils/index.js");

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../hocs/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Recommend = (_dec = (0, _index6.withLogin)(), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Recommend, _BaseComponent);

  function Recommend() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Recommend);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Recommend.__proto__ || Object.getPrototypeOf(Recommend)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "detail"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Recommend, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Recommend.prototype.__proto__ || Object.getPrototypeOf(Recommend.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        info: {},
        detail: {}
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _index5.default.member.recommendUserInfo().then(function (res) {
                  var nList = (0, _index3.pickBy)(res, {
                    username: 'username',
                    promoter_grade_name: 'promoter_grade_name',
                    parent_info: 'parent_info.username',
                    headimgurl: 'headimgurl',
                    mobile: 'mobile'
                  });
                  console.log(nList, 65);
                  _this2.setState({
                    info: nList
                  });
                });

              case 2:
                _context.next = 4;
                return _index5.default.member.recommendIndexInfo().then(function (res) {
                  var nList = (0, _index3.pickBy)(res, {
                    itemTotalPrice: function itemTotalPrice(_ref3) {
                      var _itemTotalPrice = _ref3.itemTotalPrice;
                      return (_itemTotalPrice / 100).toFixed(2);
                    },
                    cashWithdrawalRebate: function cashWithdrawalRebate(_ref4) {
                      var _cashWithdrawalRebate = _ref4.cashWithdrawalRebate;
                      return (_cashWithdrawalRebate / 100).toFixed(2);
                    },
                    promoter_order_count: 'promoter_order_count',
                    promoter_grade_order_count: 'promoter_grade_order_count',
                    isbuy_promoter: 'isbuy_promoter',
                    notbuy_promoter: 'notbuy_promoter'
                  });
                  _this2.setState({
                    detail: nList
                  });
                });

              case 4:
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

      var _state = this.__state,
          info = _state.info,
          detail = _state.detail;

      console.log(detail, 65);

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return Recommend;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["navigateTo"], _temp2)) || _class);
exports.default = Recommend;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Recommend, true));