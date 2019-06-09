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

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../hocs/index.js");

var _index6 = require("../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import AzureStorage from 'azure-storage/browser/azure-storage.blob.export'

function resolveBlobFromFile(url, type) {
  return fetch(url).then(function (res) {
    return res.blob();
  }).then(function (blob) {
    return blob.slice(0, blob.size, type);
  });
}

var UserInfo = (_dec = (0, _index5.withLogin)(), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(UserInfo, _BaseComponent);

  function UserInfo() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, UserInfo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = UserInfo.__proto__ || Object.getPrototypeOf(UserInfo)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["isHasAvator", "imgs", "info"], _this.handleImageChange = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, type) {
        var imgFiles;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(type === 'remove')) {
                  _context.next = 3;
                  break;
                }

                _this.setState({
                  imgs: data
                });

                return _context.abrupt("return");

              case 3:

                if (data.length > 1) {
                  _index7.default.toast('最多上传1张图片');
                }
                imgFiles = data.slice(0, 1);
                /* azureUploader.uploadImageFn(imgFiles, '/espier/image_upload_token', 'qiniu', 'aftersales')
                   .then(res => {
                     this.setState({
                       imgs: res
                     })
                   })*/

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.handleImageClick = function () {}, _this.handleChange = function (name, val) {
      var info = _this.state.info;

      info[name] = val;
    }, _this.handleSubmit = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
        var value, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                value = e.detail.value;
                data = _extends({}, _this.state.info, value);
                _context2.prev = 2;
                _context2.next = 5;
                return _index4.default.member.setMemberInfo(data);

              case 5:
                _index7.default.toast('修改成功');
                setTimeout(function () {
                  _index2.default.redirectTo({
                    url: '/pages/member/index'
                  });
                }, 500);
                _context2.next = 12;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](2);

                console.log(_context2.t0);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[2, 9]]);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(UserInfo, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(UserInfo.prototype.__proto__ || Object.getPrototypeOf(UserInfo.prototype), "_constructor", this).call(this, props);

      this.state = {
        isHasAvator: true,
        imgs: [],
        info: {}
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetch();
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _ref5, memberInfo, avatarArr;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _index4.default.member.memberInfo();

              case 2:
                _ref5 = _context3.sent;
                memberInfo = _ref5.memberInfo;
                avatarArr = [];

                if (memberInfo.avatar) {
                  avatarArr = [{ url: memberInfo.avatar }];
                }
                // console.log(avatarArr, 38)
                this.setState({
                  info: {
                    user_name: memberInfo.username,
                    avatar: memberInfo.avatar
                  },
                  imgs: avatarArr
                });

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetch() {
        return _ref4.apply(this, arguments);
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
          isHasAvator = _state.isHasAvator,
          info = _state.info,
          imgs = _state.imgs;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return UserInfo;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleSubmit", "handleImageChange", "handleImageClick", "handleErrorToastClose", "handleChange"], _temp2)) || _class);
exports.default = UserInfo;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(UserInfo, true));