"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;
// import * as qiniu from 'qiniu-js'


var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../utils/index.js");

var _index6 = require("../../spx/index.js");

var _index7 = _interopRequireDefault(_index6);

var _qiniu = require("../../utils/qiniu.js");

var _qiniu2 = _interopRequireDefault(_qiniu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TradeRefund = (_temp2 = _class = function (_BaseComponent) {
  _inherits(TradeRefund, _BaseComponent);

  function TradeRefund() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, TradeRefund);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TradeRefund.__proto__ || Object.getPrototypeOf(TradeRefund)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "curSegIdx", "segTypes", "reason", "description", "imgs", "curReasonIdx", "goodStatus", "curGoodIdx", "isShowSegGoodSheet", "isSameCurSegGood", "curSegGoodValue", "isShowSegTypeSheet", "isSameCurSegType", "curSegTypeValue"], _this.handleClickTag = function (data) {
      var idx = _this.state.reason.indexOf(data.name);

      if (idx >= 0) {
        _this.setState({
          curReasonIdx: idx
        });
      }
    }, _this.handleTextChange = function (e) {
      var value = e.target.value;

      _this.setState({
        description: value
      });
    }, _this.handleImageChange = function (data, type) {

      if (type === 'remove') {
        _this.setState({
          imgs: data
        });

        return;
      }

      if (data.length > 3) {
        _index7.default.toast('最多上传3张图片');
      }
      var imgFiles = data.slice(0, 3);
      _qiniu2.default.uploadImageFn(imgFiles, '/espier/image_upload_token', 'qiniu', 'aftersales').then(function (res) {
        _this.setState({
          imgs: res
        });
      });
    }, _this.handleImageClick = function () {}, _this.handleClickTab = function (idx) {
      _this.setState({
        curSegIdx: idx
      });
    }, _this.handleChangeRefundOptions = function (type) {
      if (type === 'type') {
        _this.setState({
          isShowSegTypeSheet: true
        });
      }

      if (type === 'goods') {
        _this.setState({
          isShowSegGoodSheet: true
        });
      }
    }, _this.handleClickSheet = function (index, item, type) {
      if (type === 'type') {
        _this.setState({
          curSegIdx: index === _this.state.curSegIdx ? null : index,
          isSameCurSegType: index === _this.state.curSegIdx ? !_this.state.isSameCurSegType : true,
          isShowSegTypeSheet: false,
          curSegTypeValue: index === _this.state.curSegIdx ? null : item.value
        });
      }

      if (type === 'goods') {
        _this.setState({
          curGoodIdx: index === _this.state.curGoodIdx ? null : index,
          isSameCurSegGood: index === _this.state.curGoodIdx ? !_this.state.isSameCurSegGood : true,
          isShowSegGoodSheet: false,
          curSegGoodValue: index === _this.state.curGoodIdx ? null : item
        });
      }
    }, _this.handleSubmit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this$state, segTypes, curSegIdx, curReasonIdx, description, reason, aftersales_type, evidence_pic, _this$$router$params, item_id, order_id, aftersales_bn, data, method;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$state = _this.state, segTypes = _this$state.segTypes, curSegIdx = _this$state.curSegIdx, curReasonIdx = _this$state.curReasonIdx, description = _this$state.description;
              reason = _this.state.reason[curReasonIdx];
              aftersales_type = segTypes[curSegIdx].status;
              evidence_pic = _this.state.imgs.map(function (_ref3) {
                var url = _ref3.url;
                return url;
              });
              _this$$router$params = _this.$router.params, item_id = _this$$router$params.item_id, order_id = _this$$router$params.order_id, aftersales_bn = _this$$router$params.aftersales_bn;
              data = {
                item_id: item_id,
                order_id: order_id,
                aftersales_bn: aftersales_bn,
                aftersales_type: aftersales_type,
                reason: reason,
                description: description,
                evidence_pic: evidence_pic
              };


              console.log(data, 244);
              method = aftersales_bn ? 'modify' : 'apply';
              _context.next = 10;
              return _index4.default.aftersales[method](data);

            case 10:

              _index7.default.toast('操作成功');
              // setTimeout(() => {
              //   Taro.redirectTo({
              //     url: '/pages/trade/after-sale'
              //   })
              // }, 700)

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TradeRefund, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TradeRefund.prototype.__proto__ || Object.getPrototypeOf(TradeRefund.prototype), "_constructor", this).call(this, props);

      this.state = {
        // reason: ['多拍/拍错/不想要', '缺货', '买多了', '质量问题', '卖家发错货', '商品破损', '描述不符', '其他'],
        description: '',
        imgs: [],
        reason: ['物流破损', '产品描述与实物不符', '质量问题', '皮肤过敏'],
        curReasonIdx: null,
        goodStatus: ['未收到货', '已收到货'],
        curGoodIdx: null,
        isShowSegGoodSheet: false,
        isSameCurSegGood: false,
        curSegGoodValue: null,
        segTypes: [{ title: '仅退款', status: 'ONLY_REFUND' }, { title: '退货退款', status: 'REFUND_GOODS' }],
        curSegIdx: 0,
        isShowSegTypeSheet: false,
        isSameCurSegType: false,
        curSegTypeValue: null
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
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this3 = this;

        var _$router$params, aftersales_bn, item_id, order_id, res, params;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _index2.default.showLoading({
                  mask: true
                });

                _$router$params = this.$router.params, aftersales_bn = _$router$params.aftersales_bn, item_id = _$router$params.item_id, order_id = _$router$params.order_id;
                _context2.next = 4;
                return _index4.default.aftersales.info({
                  aftersales_bn: aftersales_bn,
                  item_id: item_id,
                  order_id: order_id
                });

              case 4:
                res = _context2.sent;

                _index2.default.hideLoading();

                if (res.aftersales) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return");

              case 8:
                params = (0, _index5.pickBy)(res.aftersales, {
                  curSegIdx: function curSegIdx(_ref5) {
                    var aftersales_type = _ref5.aftersales_type;
                    return _this3.state.segTypes.findIndex(function (t) {
                      return t.status === aftersales_type;
                    }) || 0;
                  },
                  curSegTypeValue: function curSegTypeValue(_ref6) {
                    var aftersales_type = _ref6.aftersales_type;
                    return _this3.state.segTypes[_this3.state.segTypes.findIndex(function (t) {
                      return t.status === aftersales_type;
                    })].title;
                  },
                  curReasonIdx: function curReasonIdx(_ref7) {
                    var reason = _ref7.reason;
                    return _this3.state.reason.indexOf(reason) || 0;
                  },
                  curSegReasonValue: 'reason',
                  description: 'description',
                  imgs: function imgs(_ref8) {
                    var evidence_pic = _ref8.evidence_pic;
                    return evidence_pic.map(function (url) {
                      return { url: url };
                    });
                  }
                });


                console.log(params, 70);

                this.setState(params);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
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
          segTypes = _state.segTypes,
          curSegIdx = _state.curSegIdx,
          reason = _state.reason,
          curReasonIdx = _state.curReasonIdx,
          goodStatus = _state.goodStatus,
          curGoodIdx = _state.curGoodIdx,
          isShowSegGoodSheet = _state.isShowSegGoodSheet,
          isSameCurSegGood = _state.isSameCurSegGood,
          curSegGoodValue = _state.curSegGoodValue,
          description = _state.description,
          imgs = _state.imgs;


      var loopArray0 = reason.map(function (item, idx) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = (0, _index5.classNames)('refund-reason', idx === curReasonIdx ? 'refund-reason__checked' : '');
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0
      });
      return this.__state;
    }
  }]);

  return TradeRefund;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleClickTab", "handleClickTag", "handleTextChange", "handleImageChange", "handleImageClick", "handleSubmit"], _temp2);
exports.default = TradeRefund;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TradeRefund, true));