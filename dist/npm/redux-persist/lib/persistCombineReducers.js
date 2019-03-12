'use strict';

exports.__esModule = true;
exports.default = persistCombineReducers;

var _redux = require("../../redux/lib/redux.js");

var _persistReducer = require("./persistReducer.js");

var _persistReducer2 = _interopRequireDefault(_persistReducer);

var _autoMergeLevel = require("./stateReconciler/autoMergeLevel2.js");

var _autoMergeLevel2 = _interopRequireDefault(_autoMergeLevel);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// combineReducers + persistReducer with stateReconciler defaulted to autoMergeLevel2
function persistCombineReducers(config, reducers) {
  config.stateReconciler = config.stateReconciler === undefined ? _autoMergeLevel2.default : config.stateReconciler;
  return (0, _persistReducer2.default)(config, (0, _redux.combineReducers)(reducers));
}