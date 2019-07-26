"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _qiniu = require("../../../utils/qiniu.js");

var _qiniu2 = _interopRequireDefault(_qiniu);

var _req = require("../../../api/req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrugInfo = (_temp2 = _class = function (_BaseComponent) {
  _inherits(DrugInfo, _BaseComponent);

  function DrugInfo() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DrugInfo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DrugInfo.__proto__ || Object.getPrototypeOf(DrugInfo)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["isOpened", "info", "onImgChange", "onImageClick", "__fn_onClick"], _this.handleChange = function (name, val) {
      var info = _this.state.info;

      info[name] = val;
      _this.setState({
        info: info
      });
    }, _this.handleImageChange = function (data, type) {
      if (type === 'remove') {
        _this.setState({
          info: {
            imgs: data
          }
        });
        return;
      }

      if (data.length > 3) {
        S.toast('最多上传3张图片');
      }
      var imgFiles = data.slice(0, 3);
      _qiniu2.default.uploadImageFn(imgFiles, _req2.default.baseURL + 'espier/image_upload_token', 'qiniu', 'jpg/png', 'z2').then(function (res) {
        console.log(res);
        _this.setState({
          info: {
            imgs: res
          }
        });
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DrugInfo, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(DrugInfo.prototype.__proto__ || Object.getPrototypeOf(DrugInfo.prototype), "_constructor", this).call(this, props);

      this.state = {
        info: {}
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _props = this.__props,
          isOpened = _props.isOpened,
          onChange = _props.onChange,
          onImgChange = _props.onImgChange,
          onImageClick = _props.onImageClick;
      var info = this.__state.info;


      Object.assign(this.__state, {
        isOpened: isOpened
      });
      return this.__state;
    }
  }, {
    key: "funPrivateSEycT",
    value: function funPrivateSEycT() {
      this.__triggerPropsFn("onChange", [].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return DrugInfo;
}(_index.Component), _class.properties = {
  "isOpened": {
    "type": null,
    "value": null
  },
  "onChange": {
    "type": null,
    "value": null
  },
  "onImgChange": {
    "type": null,
    "value": null
  },
  "onImageClick": {
    "type": null,
    "value": null
  },
  "__fn_onClick": {
    "type": null,
    "value": null
  },
  "__fn_onChange": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleChange", "handleImageChange", "funPrivateSEycT"], _class.defaultProps = {
  isOpened: false,
  onChange: function onChange() {}
}, _class.options = {
  addGlobalClass: true
}, _temp2);
exports.default = DrugInfo;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(DrugInfo));