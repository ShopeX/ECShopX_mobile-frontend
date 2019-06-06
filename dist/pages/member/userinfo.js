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

var _req = require("../../api/req.js");

var _req2 = _interopRequireDefault(_req);

var _index5 = require("../../hocs/index.js");

var _index6 = require("../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

var _qiniuMin = require("../../npm/qiniu-js/dist/qiniu.min.js");

var qiniu = _interopRequireWildcard(_qiniuMin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, type) {
        var imgFiles, promises, _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, results;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(type === 'remove')) {
                  _context2.next = 3;
                  break;
                }

                _this.setState({
                  imgs: data
                });

                return _context2.abrupt("return");

              case 3:

                if (data.length > 1) {
                  _index7.default.toast('最多上传1张图片');
                }
                imgFiles = data.slice(0, 1);
                promises = [];

                _loop = function _loop(item) {
                  var promise = new Promise(function () {
                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                      var filename, _ref4, region, token, key, domain, observable, blobImg;

                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              if (item.file) {
                                _context.next = 4;
                                break;
                              }

                              resolve(item);
                              _context.next = 24;
                              break;

                            case 4:
                              filename = item.url.slice(item.url.lastIndexOf('/') + 1);
                              _context.next = 7;
                              return _req2.default.get('/espier/image_upload_token', {
                                filesystem: 'qiniu',
                                filetype: 'avatar',
                                filename: filename
                              });

                            case 7:
                              _ref4 = _context.sent;
                              region = _ref4.region;
                              token = _ref4.token;
                              key = _ref4.key;
                              domain = _ref4.domain;
                              observable = void 0;
                              _context.prev = 13;
                              _context.next = 16;
                              return resolveBlobFromFile(item.url, item.file.type);

                            case 16:
                              blobImg = _context.sent;

                              observable = qiniu.upload(blobImg, key, token, {}, {
                                region: qiniu.region[region]
                              });
                              _context.next = 23;
                              break;

                            case 20:
                              _context.prev = 20;
                              _context.t0 = _context["catch"](13);

                              console.log(_context.t0);

                            case 23:

                              observable.subscribe({
                                next: function next(res) {},
                                error: function error(err) {
                                  reject(err);
                                },
                                complete: function complete(res) {
                                  resolve({
                                    url: domain + "/" + res.key
                                  });
                                }
                              });

                            case 24:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee, _this2, [[13, 20]]);
                    }));

                    return function (_x3, _x4) {
                      return _ref3.apply(this, arguments);
                    };
                  }());
                  promises.push(promise);
                };

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 10;


                for (_iterator = imgFiles[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  item = _step.value;

                  _loop(item);
                }

                _context2.next = 18;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](10);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 18:
                _context2.prev = 18;
                _context2.prev = 19;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 21:
                _context2.prev = 21;

                if (!_didIteratorError) {
                  _context2.next = 24;
                  break;
                }

                throw _iteratorError;

              case 24:
                return _context2.finish(21);

              case 25:
                return _context2.finish(18);

              case 26:
                _context2.next = 28;
                return Promise.all(promises);

              case 28:
                results = _context2.sent;

                console.log(results, 98);

                _this.setState({
                  imgs: results,
                  info: _extends({}, _this.state.info, {
                    avatar: results[0].url
                  })
                });

              case 31:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[10, 14, 18, 26], [19,, 21, 25]]);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.handleImageClick = function () {}, _this.handleChange = function (name, val) {
      var info = _this.state.info;

      info[name] = val;
    }, _this.handleSubmit = function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(e) {
        var value, data;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                value = e.detail.value;
                data = _extends({}, _this.state.info, value);
                _context3.prev = 2;
                _context3.next = 5;
                return _index4.default.member.setMemberInfo(data);

              case 5:
                _index7.default.toast('修改成功');
                setTimeout(function () {
                  _index2.default.redirectTo({
                    url: '/pages/member/index'
                  });
                }, 500);
                _context3.next = 12;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](2);

                console.log(_context3.t0);

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, _this2, [[2, 9]]);
      }));

      return function (_x5) {
        return _ref5.apply(this, arguments);
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
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _ref7, memberInfo, avatarArr;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _index4.default.member.memberInfo();

              case 2:
                _ref7 = _context4.sent;
                memberInfo = _ref7.memberInfo;
                avatarArr = [];

                if (memberInfo.avatar) {
                  avatarArr = [{ url: memberInfo.avatar }];
                }
                console.log(avatarArr, 38);
                this.setState({
                  info: {
                    user_name: memberInfo.username,
                    avatar: memberInfo.avatar
                  },
                  imgs: avatarArr
                });

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetch() {
        return _ref6.apply(this, arguments);
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