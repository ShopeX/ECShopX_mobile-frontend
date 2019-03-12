"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = withLogin;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../spx/index.js");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LIFE_CYCLE_TYPES = {
  WILL_MOUNT: 0,
  DID_MOUNT: 1,
  DID_SHOW: 2
};

function withLogin(next) {
  var lifeCycle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LIFE_CYCLE_TYPES.WILL_MOUNT;

  if (LIFE_CYCLE_TYPES[lifeCycle] !== undefined) {
    console.warn("lifeCycle is not in defined types: " + lifeCycle);
    return function (Component) {
      return Component;
    };
  }

  return function withLoginComponent(Component) {
    return function (_Component) {
      _inherits(WithLogin, _Component);

      function WithLogin(props) {
        _classCallCheck(this, WithLogin);

        return _possibleConstructorReturn(this, (WithLogin.__proto__ || Object.getPrototypeOf(WithLogin)).call(this, props));
      }

      _createClass(WithLogin, [{
        key: "componentWillMount",
        value: function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(lifeCycle === LIFE_CYCLE_TYPES.WILL_MOUNT)) {
                      _context.next = 6;
                      break;
                    }

                    _context.next = 3;
                    return this.__autoLogin();

                  case 3:
                    res = _context.sent;

                    if (res) {
                      _context.next = 6;
                      break;
                    }

                    return _context.abrupt("return");

                  case 6:

                    if (_get(WithLogin.prototype.__proto__ || Object.getPrototypeOf(WithLogin.prototype), "componentWillMount", this)) {
                      _get(WithLogin.prototype.__proto__ || Object.getPrototypeOf(WithLogin.prototype), "componentWillMount", this).call(this);
                    }

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function componentWillMount() {
            return _ref.apply(this, arguments);
          }

          return componentWillMount;
        }()
      }, {
        key: "componentDidMount",
        value: function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var res;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(lifeCycle === LIFE_CYCLE_TYPES.DID_MOUNT)) {
                      _context2.next = 6;
                      break;
                    }

                    _context2.next = 3;
                    return this.__autoLogin();

                  case 3:
                    res = _context2.sent;

                    if (res) {
                      _context2.next = 6;
                      break;
                    }

                    return _context2.abrupt("return");

                  case 6:

                    if (_get(WithLogin.prototype.__proto__ || Object.getPrototypeOf(WithLogin.prototype), "componentDidMount", this)) {
                      _get(WithLogin.prototype.__proto__ || Object.getPrototypeOf(WithLogin.prototype), "componentDidMount", this).call(this);
                    }

                  case 7:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function componentDidMount() {
            return _ref2.apply(this, arguments);
          }

          return componentDidMount;
        }()
      }, {
        key: "componentDidShow",
        value: function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var res;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!(lifeCycle === LIFE_CYCLE_TYPES.DID_SHOW)) {
                      _context3.next = 6;
                      break;
                    }

                    _context3.next = 3;
                    return this.__autoLogin();

                  case 3:
                    res = _context3.sent;

                    if (res) {
                      _context3.next = 6;
                      break;
                    }

                    return _context3.abrupt("return");

                  case 6:

                    if (_get(WithLogin.prototype.__proto__ || Object.getPrototypeOf(WithLogin.prototype), "componentDidShow", this)) {
                      _get(WithLogin.prototype.__proto__ || Object.getPrototypeOf(WithLogin.prototype), "componentDidShow", this).call(this);
                    }

                  case 7:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));

          function componentDidShow() {
            return _ref3.apply(this, arguments);
          }

          return componentDidShow;
        }()
      }, {
        key: "__autoLogin",
        value: function () {
          var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return _index4.default.autoLogin(this);

                  case 2:
                    return _context4.abrupt("return", _context4.sent);

                  case 3:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));

          function __autoLogin() {
            return _ref4.apply(this, arguments);
          }

          return __autoLogin;
        }()
      }]);

      return WithLogin;
    }(Component);
  };
}