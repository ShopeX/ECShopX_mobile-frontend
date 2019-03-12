'use strict';

exports.__esModule = true;
exports.default = createMigrate;

var _constants = require("./constants.js");

function createMigrate(migrations, config) {
  var _ref = config || {},
      debug = _ref.debug;

  return function (state, currentVersion) {
    if (!state) {
      if (debug) console.log('redux-persist: no inbound state, skipping migration');
      return Promise.resolve(undefined);
    }

    var inboundVersion = state._persist && state._persist.version !== undefined ? state._persist.version : _constants.DEFAULT_VERSION;
    if (inboundVersion === currentVersion) {
      if (debug) console.log('redux-persist: versions match, noop migration');
      return Promise.resolve(state);
    }
    if (inboundVersion > currentVersion) {
      console.error('redux-persist: downgrading version is not supported');
      return Promise.resolve(state);
    }

    var migrationKeys = Object.keys(migrations).map(function (ver) {
      return parseInt(ver);
    }).filter(function (key) {
      return currentVersion >= key && key > inboundVersion;
    }).sort(function (a, b) {
      return a - b;
    });

    if (debug) console.log('redux-persist: migrationKeys', migrationKeys);
    try {
      var migratedState = migrationKeys.reduce(function (state, versionKey) {
        if (debug) console.log('redux-persist: running migration for versionKey', versionKey);
        return migrations[versionKey](state);
      }, state);
      return Promise.resolve(migratedState);
    } catch (err) {
      return Promise.reject(err);
    }
  };
}