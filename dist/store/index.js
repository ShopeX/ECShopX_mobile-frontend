"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configStore;

var _redux = require("../npm/redux/lib/redux.js");

var _persistReducer = require("../npm/redux-persist/lib/persistReducer.js");

var _persistReducer2 = _interopRequireDefault(_persistReducer);

var _persistStore = require("../npm/redux-persist/lib/persistStore.js");

var _persistStore2 = _interopRequireDefault(_persistStore);

var _index = require("../npm/redux-thunk/lib/index.js");

var _index2 = _interopRequireDefault(_index);

var _reduxLogger = require("../npm/redux-logger/dist/redux-logger.js");

var _reducers = require("./reducers.js");

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = void 0;
{
  storage = require("../npm/redux-persist-weapp-storage/lib/bundle.js");
}

var middlewares = [_index2.default, (0, _reduxLogger.createLogger)()];

var reducer = (0, _persistReducer2.default)({
  key: 'root',
  storage: storage,
  blacklist: ['cart', 'member', 'address']
}, _reducers2.default);

var store = void 0,
    persistor = void 0;

function configStore() {
  if (!store) {
    store = (0, _redux.createStore)(reducer, _redux.applyMiddleware.apply(undefined, middlewares));
    persistor = (0, _persistStore2.default)(store);
  }

  return {
    store: store,
    persistor: persistor
  };
}