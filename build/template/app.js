var _index = require("./npm/@tarojs/taro-weapp/index.js");
var _index2 = _interopRequireDefault(_index);
var _index5 = require("./npm/@tarojs/redux/index.js");
var _index6 = require("./store/index.js");
var _index7 = _interopRequireDefault(_index6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _configStore = (0, _index7.default)(),
    store = _configStore.store;
(0, _index5.setStore)(store);
_index2.default.initPxTransform({
  "designWidth": 750,
  "deviceRatio": {
    "640": 1.17,
    "750": 1,
    "828": 0.905
  }
});