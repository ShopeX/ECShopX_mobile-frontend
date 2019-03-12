'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var wxApis = ['getStorage', 'setStorage', 'removeStorage', 'clearStorage', 'getStorageInfo'];
var api = Object.create(null);
wxApis.forEach(function (name) {
  api[name] = function (args) {
    return new Promise(function (resolve, reject) {
      wx[name](_objectSpread({}, args, {
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(res) {
          reject(res);
        }
      }));
    });
  };
});
var index = {
  getItem: function getItem(key) {
    return api.getStorage({
      key: key
    }).then(function (res) {
      return res.data;
    });
  },
  setItem: function setItem(key, data) {
    return api.setStorage({
      key: key,
      data: data
    });
  },
  removeItem: function removeItem(key) {
    return api.removeStorage({
      key: key
    });
  },
  clear: function clear() {
    return api.clearStorage();
  },
  getAllKeys: function getAllKeys() {
    return api.getStorageInfo().then(function (res) {
      return res.keys;
    });
  }
};

module.exports = index;