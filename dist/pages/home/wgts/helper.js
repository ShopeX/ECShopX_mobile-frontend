'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkPage = linkPage;

var _index = require('../../../npm/@tarojs/taro-weapp/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linkPage(type, id) {
  var url = '';

  switch (type) {
    case 'goods':
      url = '/pages/item/espier-detail?id=' + id;
      break;
    case 'category':
      url = '/pages/item/list?cat_id=' + id;
      break;
    case 'planting':
      url = '/pages/recommend/detail?id=' + id;
      break;
    case 'link':
      url = id;
      break;
    case 'custom':
      url = id;
      break;
    default:
  }

  _index2.default.navigateTo({
    url: url
  });
}

exports.default = {};