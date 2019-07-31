"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _qiniu = require("../../utils/qiniu.js");

var _qiniu2 = _interopRequireDefault(_qiniu);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _req = require("../../api/req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DistributionShopForm = (_temp2 = _class = function (_BaseComponent) {
  _inherits(DistributionShopForm, _BaseComponent);

  function DistributionShopForm() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, DistributionShopForm);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DistributionShopForm.__proto__ || Object.getPrototypeOf(DistributionShopForm)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["info", "imgs"], _this.handleChange = function (e) {
      var value = e.detail ? e.detail.value : e;
      var _this$state$info = _this.state.info,
          key = _this$state$info.key,
          val = _this$state$info.val;

      _this.setState({
        info: {
          key: key,
          val: value
        }
      });
    }, _this.handleSubmit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this$state$info2, key, val, params, _ref3, list;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$state$info2 = _this.state.info, key = _this$state$info2.key, val = _this$state$info2.val;
              params = _defineProperty({}, key, val);
              _context.next = 4;
              return _index4.default.distribution.update(params);

            case 4:
              _ref3 = _context.sent;
              list = _ref3.list;

              if (list[0]) {
                _index2.default.navigateBack();
              }

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.handleImageChange = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, type) {
        var key, imgFiles, res, params, _ref5, list;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                key = _this.state.info.key;

                if (!(type === 'remove')) {
                  _context2.next = 4;
                  break;
                }

                _this.setState({
                  info: {
                    imgs: data
                  }
                });
                return _context2.abrupt("return");

              case 4:

                if (data.length > 3) {
                  S.toast('最多上传3张图片');
                }
                imgFiles = data.slice(0, 3);
                _context2.next = 8;
                return _qiniu2.default.uploadImageFn(imgFiles, _req2.default.baseURL + 'espier/image_upload_token', 'qiniu', 'jpg/png', 'z2');

              case 8:
                res = _context2.sent;

                _this.setState({
                  imgs: res
                });
                params = _defineProperty({}, key, res[0].url);
                _context2.next = 13;
                return _index4.default.distribution.update(params);

              case 13:
                _ref5 = _context2.sent;
                list = _ref5.list;

                if (list[0]) {
                  _index2.default.navigateBack();
                }

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x, _x2) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DistributionShopForm, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(DistributionShopForm.prototype.__proto__ || Object.getPrototypeOf(DistributionShopForm.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: {},
        imgs: []
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var imgs = this.state.imgs;
      var _$router$params = this.$router.params,
          key = _$router$params.key,
          val = _$router$params.val;

      this.setState({
        info: {
          key: key,
          val: val
        }
      });
      if (key === 'shop_pic') {
        imgs.push(val);
        this.setState({
          imgs: imgs
        });
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          info = _state.info,
          imgs = _state.imgs;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return DistributionShopForm;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleSubmit", "handleChange", "handleImageChange"], _temp2);
exports.default = DistributionShopForm;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(DistributionShopForm, true));