"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _req = require("../../api/req.js");

var _req2 = _interopRequireDefault(_req);

var _index4 = require("../../spx/index.js");

var _index5 = _interopRequireDefault(_index4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HomeIndex = (_dec = (0, _index3.connect)(function (store) {
  return {
    store: store
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(HomeIndex, _BaseComponent);

  function HomeIndex() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, HomeIndex);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = HomeIndex.__proto__ || Object.getPrototypeOf(HomeIndex)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["wgts", "authStatus", "store"], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(HomeIndex, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(HomeIndex.prototype.__proto__ || Object.getPrototypeOf(HomeIndex.prototype), "_constructor", this).call(this, props);

      this.state = {
        wgts: null,
        authStatus: false
      };
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.fetch();
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {}
  }, {
    key: "fetch",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var url, info;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=index';
                _context.next = 3;
                return _req2.default.get(url);

              case 3:
                info = _context.sent;

                if (!_index5.default.getAuthToken()) {
                  this.setState({
                    authStatus: true
                  });
                }
                this.setState({
                  wgts: info.config
                });

              case 6:
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
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          wgts = _state.wgts,
          authStatus = _state.authStatus;


      if (!wgts || !this.__props.store) {
        return null;
      }

      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return HomeIndex;
}(_index.Component), _class2.properties = {
  "store": {
    "type": null,
    "value": null
  }
}, _class2.$$events = [], _temp2)) || _class);
exports.default = HomeIndex;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(HomeIndex, true));