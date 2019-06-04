"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2; /* eslint-disable no-nested-ternary */


var _index = require("../../../../../@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../prop-types/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../../../../classnames/index.js");

var _index6 = _interopRequireDefault(_index5);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

var _utils = require("../../common/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 生成 jsx 二维矩阵
var generateMatrix = function generateMatrix(files, col, showAddBtn) {
  var matrix = [];
  var length = showAddBtn ? files.length + 1 : files.length;
  var row = Math.ceil(length / col);
  for (var i = 0; i < row; i++) {
    if (i === row - 1) {
      // 最后一行数据加上添加按钮
      var lastArr = files.slice(i * col);
      if (lastArr.length < col) {
        if (showAddBtn) {
          lastArr.push({ type: 'btn', uuid: (0, _utils.uuid)() });
        }
        // 填补剩下的空列
        for (var j = lastArr.length; j < col; j++) {
          lastArr.push({ type: 'blank', uuid: (0, _utils.uuid)() });
        }
      }
      matrix.push(lastArr);
    } else {
      matrix.push(files.slice(i * col, (i + 1) * col));
    }
  }
  return matrix;
};

var ENV = _index2.default.getEnv();

var AtImagePicker = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtImagePicker, _AtComponent);

  function AtImagePicker() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtImagePicker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtImagePicker.__proto__ || Object.getPrototypeOf(AtImagePicker)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray0", "rootCls", "matrix", "mode", "files", "multiple", "__fn_onChange", "onFail", "__fn_onImageClick", "className", "customStyle", "length", "showAddBtn"], _this.chooseFile = function () {
      var _this$props = _this.props,
          _this$props$files = _this$props.files,
          files = _this$props$files === undefined ? [] : _this$props$files,
          multiple = _this$props.multiple;

      var filePathName = ENV === _index2.default.ENV_TYPE.ALIPAY ? 'apFilePaths' : 'tempFiles';
      var count = multiple ? 99 : 1;

      _index2.default.chooseImage({ count: count }).then(function (res) {
        var targetFiles = res.tempFilePaths.map(function (path, i) {
          return {
            url: path,
            file: res[filePathName][i]
          };
        });
        var newFiles = files.concat(targetFiles);
        _this.__triggerPropsFn("onChange", [null].concat([newFiles, 'add']));
      }).catch(_this.props.onFail);
    }, _this.handleImageClick = function (idx) {
      return _this.__triggerPropsFn("onImageClick", [null].concat([idx, _this.props.files[idx]]));
    }, _this.handleRemoveImg = function (idx) {
      var _this$props$files2 = _this.props.files,
          files = _this$props$files2 === undefined ? [] : _this$props$files2;

      if (ENV === _index2.default.ENV_TYPE.WEB) {
        window.URL.revokeObjectURL(files[idx].url);
      }
      var newFiles = files.filter(function (file, i) {
        return i !== idx;
      });
      _this.__triggerPropsFn("onChange", [null].concat([newFiles, 'remove', idx]));
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtImagePicker, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtImagePicker.prototype.__proto__ || Object.getPrototypeOf(AtImagePicker.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _props = this.__props,
          className = _props.className,
          customStyle = _props.customStyle,
          files = _props.files,
          mode = _props.mode,
          length = _props.length,
          showAddBtn = _props.showAddBtn;
      // 行数

      var matrix = generateMatrix(files, length, showAddBtn);
      var rootCls = (0, _index6.default)('at-image-picker', className);

      var anonymousState__temp = (0, _index.internal_inline_style)(customStyle);
      var loopArray0 = matrix.map(function (row, i) {
        row = {
          $original: (0, _index.internal_get_original)(row)
        };
        var $anonymousCallee__0 = row.$original.map(function (item, j) {
          item = {
            $original: (0, _index.internal_get_original)(item)
          };
          var $loopState__temp3 = item.$original.url ? i * length + j : null;
          var $loopState__temp5 = i * length + j;
          return {
            $loopState__temp3: $loopState__temp3,
            $loopState__temp5: $loopState__temp5,
            $original: item.$original
          };
        });
        return {
          $anonymousCallee__0: $anonymousCallee__0,
          $original: row.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        loopArray0: loopArray0,
        rootCls: rootCls,
        matrix: matrix,
        mode: mode
      });
      return this.__state;
    }
  }]);

  return AtImagePicker;
}(_component2.default), _class.properties = {
  "files": {
    "type": null,
    "value": null
  },
  "multiple": {
    "type": null,
    "value": null
  },
  "__fn_onChange": {
    "type": null,
    "value": null
  },
  "onFail": {
    "type": null,
    "value": null
  },
  "__fn_onImageClick": {
    "type": null,
    "value": null
  },
  "className": {
    "type": null,
    "value": null
  },
  "customStyle": {
    "type": null,
    "value": null
  },
  "mode": {
    "type": null,
    "value": null
  },
  "length": {
    "type": null,
    "value": null
  },
  "showAddBtn": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["handleRemoveImg", "handleImageClick", "chooseFile"], _temp2);


AtImagePicker.defaultProps = {
  isTest: false,
  className: '',
  customStyle: '',
  files: [],
  mode: 'aspectFill',
  showAddBtn: true,
  multiple: false,
  length: 4,
  onChange: function onChange() {},
  onImageClick: function onImageClick() {},
  onFail: function onFail() {}
};

AtImagePicker.propTypes = {
  className: _index4.default.oneOfType([_index4.default.string, _index4.default.array]),
  customStyle: _index4.default.oneOfType([_index4.default.string, _index4.default.object]),
  isTest: _index4.default.bool,
  files: _index4.default.array,
  mode: _index4.default.oneOf(['scaleToFill', 'aspectFit', 'aspectFill', 'widthFix', 'top', 'bottom', 'center', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right']),
  showAddBtn: _index4.default.bool,
  multiple: _index4.default.bool,
  length: _index4.default.number,
  onChange: _index4.default.func,
  onImageClick: _index4.default.func,
  onFail: _index4.default.func
};
exports.default = AtImagePicker;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtImagePicker));