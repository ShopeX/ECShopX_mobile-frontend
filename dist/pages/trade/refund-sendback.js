"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../spx/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LOGISTICS_CODE = { "AAE": "AAE\u5168\u7403\u4E13\u9012", "ANE": "\u5B89\u80FD\u7269\u6D41", "ARAMEX": "Aramex", "AT": "\u5965\u5730\u5229\u90AE\u653F", "BALUNZHI": "\u5DF4\u4F26\u652F\u5FEB\u9012", "BEL": "\u6BD4\u5229\u65F6\u90AE\u653F", "BFDF": "\u767E\u798F\u4E1C\u65B9", "BHT": "BHT\u5FEB\u9012", "BKWL": "\u5B9D\u51EF\u7269\u6D41", "BQXHM": "\u5317\u9752\u5C0F\u7EA2\u5E3D", "BR": "\u5DF4\u897F\u90AE\u653F", "BSWL": "\u90A6\u9001\u7269\u6D41", "CA": "\u52A0\u62FF\u5927\u90AE\u653F", "CITY100": "\u57CE\u5E02100", "COE": "COE\u4E1C\u65B9\u5FEB\u9012", "CSCY": "\u957F\u6C99\u521B\u4E00", "D4PX": "\u9012\u56DB\u65B9\u901F\u9012", "DBL": "\u5FB7\u90A6", "DHL_C": "DHL(\u4E2D\u56FD\u4EF6)", "DHL_DE": "DHL(\u5FB7\u56FD\u4EF6)", "DHL_GLB": "DHL\u5168\u7403", "DHL_USA": "DHL(\u7F8E\u56FD)", "DK": "\u4E39\u9EA6\u90AE\u653F", "DPEX": "DPEX", "DSWL": "D\u901F\u7269\u6D41", "DTWL": "\u5927\u7530\u7269\u6D41", "EMS": "EMS\u56FD\u5185", "EMSGJ": "EMS\u56FD\u9645", "FAST": "\u5FEB\u6377\u901F\u9012", "FEDEX_C": "FedEx\u8054\u90A6\u5FEB\u9012(\u4E2D\u56FD\u4EF6)", "FKD": "\u98DE\u5EB7\u8FBE", "FKRFD": "\u51E1\u5BA2\u5982\u98CE\u8FBE", "GHX": "\u6302\u53F7\u4FE1", "GJYZ": "\u56FD\u9645\u90AE\u653F\u5305\u88F9", "GSD": "\u5171\u901F\u8FBE", "GTO": "\u56FD\u901A\u5FEB\u9012", "GTSD": "\u9AD8\u94C1\u901F\u9012", "HHTT": "\u5929\u5929\u5FEB\u9012", "HOAU": "\u5929\u5730\u534E\u5B87", "hq568": "\u534E\u5F3A\u7269\u6D41", "HTKY": "\u767E\u4E16\u6C47\u901A", "HXLWL": "\u534E\u590F\u9F99\u7269\u6D41", "HYLSD": "\u597D\u6765\u8FD0\u5FEB\u9012", "IE": "\u7231\u5C14\u5170\u90AE\u653F", "JD": "\u4EAC\u4E1C\u5FEB\u9012", "JGSD": "\u4EAC\u5E7F\u901F\u9012", "JJKY": "\u4F73\u5409\u5FEB\u8FD0", "JLDT": "\u5609\u91CC\u5927\u901A", "JP": "\u65E5\u672C\u90AE\u653F", "JTKD": "\u6377\u7279\u5FEB\u9012", "JXD": "\u6025\u5148\u8FBE", "JYKD": "\u664B\u8D8A\u5FEB\u9012", "JYM": "\u52A0\u8FD0\u7F8E", "JYWL": "\u4F73\u6021\u7269\u6D41", "LB": "\u9F99\u90A6\u5FEB\u9012", "LHTEX": "\u8054\u660A\u901A\u901F\u9012", "NEDA": "\u80FD\u8FBE\u901F\u9012", "NL": "\u8377\u5170\u90AE\u653F", "ONTRAC": "ONTRAC", "QFKD": "\u5168\u5CF0\u5FEB\u9012", "QRT": "\u5168\u65E5\u901A\u5FEB\u9012", "RDSE": "\u745E\u5178\u90AE\u653F", "SDWL": "\u4E0A\u5927\u7269\u6D41", "SF": "\u987A\u4E30\u5FEB\u9012", "SFWL": "\u76DB\u4E30\u7269\u6D41", "SHWL": "\u76DB\u8F89\u7269\u6D41", "ST": "\u901F\u901A\u7269\u6D41", "STO": "\u7533\u901A\u5FEB\u9012", "STSD": "\u4E09\u6001\u901F\u9012", "SURE": "\u901F\u5C14\u5FEB\u9012", "SWCH": "\u745E\u58EB\u90AE\u653F", "TSSTO": "\u5510\u5C71\u7533\u901A", "UAPEX": "\u5168\u4E00\u5FEB\u9012", "UC": "\u4F18\u901F\u5FEB\u9012", "UPS": "UPS", "USPS": "USPS\u7F8E\u56FD\u90AE\u653F", "XFEX": "\u4FE1\u4E30\u5FEB\u9012", "XYT": "\u5E0C\u4F18\u7279", "YADEX": "\u6E90\u5B89\u8FBE\u5FEB\u9012", "YAMA": "\u65E5\u672C\u5927\u548C\u8FD0\u8F93(Yamato)", "YD": "\u97F5\u8FBE\u5FEB\u9012", "YFEX": "\u8D8A\u4E30\u7269\u6D41", "YFHEX": "\u539F\u98DE\u822A\u7269\u6D41", "YJSD": "\u94F6\u6377\u901F\u9012", "YTO": "\u5706\u901A\u901F\u9012", "YZPY": "\u90AE\u653F\u5E73\u90AE/\u5C0F\u5305", "ZENY": "\u589E\u76CA\u5FEB\u9012", "ZJS": "\u5B85\u6025\u9001", "ZMKM": "\u829D\u9EBB\u5F00\u95E8", "ZTE": "\u4F17\u901A\u5FEB\u9012", "ZTKY": "\u4E2D\u94C1\u5FEB\u8FD0", "ZTO": "\u4E2D\u901A\u901F\u9012", "ZTWL": "\u4E2D\u94C1\u7269\u6D41", "ZY_AG": "\u7231\u8D2D\u8F6C\u8FD0", "ZY_AOZ": "\u7231\u6B27\u6D32", "ZY_AUSE": "\u6FB3\u4E16\u901F\u9012", "ZY_AXO": "AXO", "ZY_AZY": "\u6FB3\u8F6C\u8FD0", "ZY_BDA": "\u516B\u8FBE\u7F51", "ZY_BEE": "\u871C\u8702\u901F\u9012", "ZY_BH": "\u8D1D\u6D77\u901F\u9012", "ZY_BL": "\u767E\u5229\u5FEB\u9012", "ZY_BM": "\u6591\u9A6C\u7269\u6D41", "ZY_BOZ": "\u8D25\u6B27\u6D32", "ZY_BT": "\u767E\u901A\u7269\u6D41", "ZY_BYECO": "\u8D1D\u6613\u8D2D", "ZY_CM": "\u7B56\u9A6C\u8F6C\u8FD0", "ZY_CTM": "\u8D64\u5154\u9A6C\u8F6C\u8FD0", "ZY_CUL": "CUL\u4E2D\u7F8E\u901F\u9012", "ZY_DGHT": "\u5FB7\u56FD\u6D77\u6DD8\u4E4B\u5BB6", "ZY_DYW": "\u5FB7\u8FD0\u7F51", "ZY_EFS": "EFS POST", "ZY_ETD": "ETD", "ZY_FD": "\u98DE\u789F\u5FEB\u9012", "ZY_FG": "\u98DE\u9E3D\u5FEB\u9012", "ZY_FLSD": "\u98CE\u96F7\u901F\u9012", "ZY_FX": "\u98CE\u884C\u5FEB\u9012", "ZY_FXSD": "\u98CE\u884C\u901F\u9012", "ZY_FY": "\u98DE\u6D0B\u5FEB\u9012", "ZY_HC": "\u7693\u6668\u5FEB\u9012", "ZY_HCYD": "\u7693\u6668\u4F18\u9012", "ZY_HDB": "\u6D77\u5E26\u5B9D", "ZY_HFMZ": "\u6C47\u4E30\u7F8E\u4E2D\u901F\u9012", "ZY_HJSD": "\u8C6A\u6770\u901F\u9012", "ZY_HMKD": "\u534E\u7F8E\u5FEB\u9012", "ZY_HTAO": "360hitao\u8F6C\u8FD0", "ZY_HTCUN": "\u6D77\u6DD8\u6751", "ZY_HTKE": "365\u6D77\u6DD8\u5BA2", "ZY_HTONG": "\u534E\u901A\u5FEB\u8FD0", "ZY_HXKD": "\u6D77\u661F\u6865\u5FEB\u9012", "ZY_HXSY": "\u534E\u5174\u901F\u8FD0", "ZY_HYSD": "\u6D77\u60A6\u901F\u9012", "ZY_IHERB": "LogisticsY", "ZY_JA": "\u541B\u5B89\u5FEB\u9012", "ZY_JD": "\u65F6\u4EE3\u8F6C\u8FD0", "ZY_JDKD": "\u9A8F\u8FBE\u5FEB\u9012", "ZY_JDZY": "\u9A8F\u8FBE\u8F6C\u8FD0", "ZY_JH": "\u4E45\u79BE\u5FEB\u9012", "ZY_JHT": "\u91D1\u6D77\u6DD8", "ZY_LBZY": "\u8054\u90A6\u8F6C\u8FD0FedRoad", "ZY_LPZ": "\u9886\u8DD1\u8005\u5FEB\u9012", "ZY_LX": "\u9F99\u8C61\u5FEB\u9012", "ZY_LZWL": "\u91CF\u5B50\u7269\u6D41", "ZY_MBZY": "\u660E\u90A6\u8F6C\u8FD0", "ZY_MGZY": "\u7F8E\u56FD\u8F6C\u8FD0", "ZY_MJ": "\u7F8E\u5609\u5FEB\u9012", "ZY_MST": "\u7F8E\u901F\u901A", "ZY_MXZY": "\u7F8E\u897F\u8F6C\u8FD0", "ZY_MZ": "168 \u7F8E\u4E2D\u5FEB\u9012", "ZY_OEJ": "\u6B27e\u6377", "ZY_OZF": "\u6B27\u6D32\u75AF", "ZY_OZGO": "\u6B27\u6D32GO", "ZY_QMT": "\u5168\u7F8E\u901A", "ZY_QQEX": "QQ-EX", "ZY_RDGJ": "\u6DA6\u4E1C\u56FD\u9645\u5FEB\u7EBF", "ZY_RT": "\u745E\u5929\u5FEB\u9012", "ZY_RTSD": "\u745E\u5929\u901F\u9012", "ZY_SCS": "SCS\u56FD\u9645\u7269\u6D41", "ZY_SDKD": "\u901F\u8FBE\u5FEB\u9012", "ZY_SFZY": "\u56DB\u65B9\u8F6C\u8FD0", "ZY_SOHO": "SOHO\u82CF\u8C6A\u56FD\u9645", "ZY_SONIC": "Sonic-Ex\u901F\u9012", "ZY_ST": "\u4E0A\u817E\u5FEB\u9012", "ZY_TCM": "\u901A\u8BDA\u7F8E\u4E2D\u5FEB\u9012", "ZY_TJ": "\u5929\u9645\u5FEB\u9012", "ZY_TM": "\u5929\u9A6C\u8F6C\u8FD0", "ZY_TN": "\u6ED5\u725B\u5FEB\u9012", "ZY_TPAK": "TrakPak", "ZY_TPY": "\u592A\u5E73\u6D0B\u5FEB\u9012", "ZY_TSZ": "\u5510\u4E09\u85CF\u8F6C\u8FD0", "ZY_TTHT": "\u5929\u5929\u6D77\u6DD8", "ZY_TWC": "TWC\u8F6C\u8FD0\u4E16\u754C", "ZY_TX": "\u540C\u5FC3\u5FEB\u9012", "ZY_TY": "\u5929\u7FFC\u5FEB\u9012", "ZY_TZH": "\u540C\u821F\u5FEB\u9012", "ZY_UCS": "UCS\u5408\u4F17\u5FEB\u9012", "ZY_WDCS": "\u6587\u8FBE\u56FD\u9645DCS", "ZY_XC": "\u661F\u8FB0\u5FEB\u9012", "ZY_XDKD": "\u8FC5\u8FBE\u5FEB\u9012", "ZY_XDSY": "\u4FE1\u8FBE\u901F\u8FD0", "ZY_XF": "\u5148\u950B\u5FEB\u9012", "ZY_XGX": "\u65B0\u5E72\u7EBF\u5FEB\u9012", "ZY_XIYJ": "\u897F\u90AE\u5BC4", "ZY_XJ": "\u4FE1\u6377\u8F6C\u8FD0", "ZY_YGKD": "\u4F18\u8D2D\u5FEB\u9012", "ZY_YJSD": "\u53CB\u5BB6\u901F\u9012(UCS)", "ZY_YPW": "\u4E91\u7554\u7F51", "ZY_YQ": "\u4E91\u9A91\u5FEB\u9012", "ZY_YQWL": "\u4E00\u67D2\u7269\u6D41", "ZY_YSSD": "\u4F18\u665F\u901F\u9012", "ZY_YSW": "\u6613\u9001\u7F51", "ZY_YTUSA": "\u8FD0\u6DD8\u7F8E\u56FD", "ZY_ZCSD": "\u81F3\u8BDA\u901F\u9012", "ZYWL": "\u4E2D\u90AE\u7269\u6D41" };

var TradeRefundSendback = (_temp2 = _class = function (_BaseComponent) {
  _inherits(TradeRefundSendback, _BaseComponent);

  function TradeRefundSendback() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, TradeRefundSendback);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TradeRefundSendback.__proto__ || Object.getPrototypeOf(TradeRefundSendback)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["express", "logi_no", "curExpressIdx", "corp_code"], _this.handleExpressChange = function (e) {
      var value = e.detail.value;
      var express = _this.state.express;


      _this.setState({
        curExpressIdx: value,
        corp_code: express[value].corp_code
      });
    }, _this.handleChange = function (name, val) {
      _this.setState(_defineProperty({}, name, val));
    }, _this.handleSubmit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this$state, logi_no, corp_code, _this$$router$params, item_id, order_id, aftersales_bn;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$state = _this.state, logi_no = _this$state.logi_no, corp_code = _this$state.corp_code;
              _this$$router$params = _this.$router.params, item_id = _this$$router$params.item_id, order_id = _this$$router$params.order_id, aftersales_bn = _this$$router$params.aftersales_bn;

              if (corp_code) {
                _context.next = 5;
                break;
              }

              _index6.default.toast('请填写物流公司');
              return _context.abrupt("return");

            case 5:
              if (logi_no) {
                _context.next = 8;
                break;
              }

              _index6.default.toast('请填写物流单号');
              return _context.abrupt("return");

            case 8:
              _context.next = 10;
              return _index4.default.aftersales.sendback({
                item_id: item_id,
                order_id: order_id,
                aftersales_bn: aftersales_bn,
                logi_no: logi_no,
                corp_code: corp_code
              });

            case 10:

              _index6.default.toast('操作成功');
              setTimeout(function () {
                _index2.default.redirectTo({
                  url: '/pages/trade/after-sale'
                });
              }, 1000);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TradeRefundSendback, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(TradeRefundSendback.prototype.__proto__ || Object.getPrototypeOf(TradeRefundSendback.prototype), "_constructor", this).call(this, props);

      var express = [];
      for (var key in LOGISTICS_CODE) {
        express.push({
          corp_code: key,
          corp_name: LOGISTICS_CODE[key]
        });
      }

      this.state = {
        express: express,
        curExpressIdx: 0,
        corp_code: '',
        logi_no: ''
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          express = _state.express,
          logi_no = _state.logi_no,
          curExpressIdx = _state.curExpressIdx;


      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return TradeRefundSendback;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleExpressChange", "handleChange", "handleSubmit"], _temp2);
exports.default = TradeRefundSendback;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(TradeRefundSendback, true));