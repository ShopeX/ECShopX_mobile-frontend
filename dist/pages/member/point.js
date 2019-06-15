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

var _index4 = require("../../utils/index.js");

var _index5 = require("../../api/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Integral = (0, _index3.withPager)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Integral, _BaseComponent);

  function Integral() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Integral);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Integral.__proto__ || Object.getPrototypeOf(Integral)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["list", "page", "totalPoint", "isLoading"], _this.handleClickRoam = function () {
      _index2.default.navigateTo({
        url: '/pages/index'
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Integral, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Integral.prototype.__proto__ || Object.getPrototypeOf(Integral.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        list: [],
        isLoading: false,
        totalPoint: 0
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.nextPage();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var _params, page, size, _ref3, list, total, remainpt, nList;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _params = params, page = _params.page_no, size = _params.page_size;


                this.setState({ isLoading: true });
                params = {
                  page: page,
                  size: size
                };
                _context.next = 5;
                return _index6.default.member.pointList(params);

              case 5:
                _ref3 = _context.sent;
                list = _ref3.list;
                total = _ref3.total;
                remainpt = _ref3.remainpt;
                nList = (0, _index4.pickBy)(list, {
                  chngdate: function chngdate(_ref4) {
                    var _chngdate = _ref4.chngdate;
                    return _chngdate.substring(0, 4) + '-' + _chngdate.substring(4, 6) + '-' + _chngdate.substring(6, 8);
                  },
                  point: 'point',
                  accfl: 'accfl',
                  chngpt: 'chngpt',
                  rsnnm: 'rsnnm'
                });


                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList)),
                  totalPoint: remainpt
                });

                return _context.abrupt("return", {
                  total: total
                });

              case 12:
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
          page = _state.page,
          totalPoint = _state.totalPoint;


      Object.assign(this.__state, {
        page: page
      });
      return this.__state;
    }
  }]);

  return Integral;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["nextPage", "handleClickRoam"], _class2.defaultProps = {}, _temp2)) || _class;

exports.default = Integral;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Integral, true));