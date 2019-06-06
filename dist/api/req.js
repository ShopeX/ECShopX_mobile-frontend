"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../spx/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../npm/qs/lib/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function addQuery(url, query) {
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + query;
}

var API = function () {
  function API() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, API);

    var _options$baseURL = options.baseURL,
        baseURL = _options$baseURL === undefined ? '/' : _options$baseURL;

    if (!/\/$/.test(baseURL)) {
      baseURL = baseURL + '/';
    }

    options.company_id = 1;
    {
      var extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
      options.appid = extConfig.appid;
      if (extConfig.company_id) {
        options.company_id = extConfig.company_id;
      }
    }

    this.options = options;
    this.baseURL = baseURL;
    this.genMethods(['get', 'post', 'delete', 'put']);
  }

  _createClass(API, [{
    key: "genMethods",
    value: function genMethods(methods) {
      var _this = this;

      methods.forEach(function (method) {
        _this[method] = function (url, data) {
          var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          return _this.makeReq(_extends({}, config, {
            method: method,
            url: url,
            data: data
          }));
        };
      });
    }
  }, {
    key: "errorToast",
    value: function errorToast(data) {
      var errMsg = data.msg || data.err_msg || data.error && data.error.message || '操作失败，请稍后重试';
      setTimeout(function () {
        _index2.default.showToast({
          icon: 'none',
          title: errMsg
        });
      }, 200);
    }
  }, {
    key: "makeReq",
    value: function makeReq(config) {
      var _this2 = this;

      var url = config.url,
          data = config.data,
          _config$header = config.header,
          header = _config$header === undefined ? {} : _config$header,
          _config$method = config.method,
          method = _config$method === undefined ? 'GET' : _config$method,
          showLoading = config.showLoading,
          _config$showError = config.showError,
          showError = _config$showError === undefined ? true : _config$showError;

      var methodIsGet = method.toLowerCase() === 'get';

      var reqUrl = /^http/.test(url) ? url : "" + this.baseURL + url.replace(/^\//, '');
      var query = !data || typeof data === 'string' ? _index6.default.parse(data) : data;

      if (!methodIsGet) {
        header['content-type'] = header['content-type'] || 'application/x-www-form-urlencoded';
      }
      header['Authorization'] = "Bearer " + _index4.default.getAuthToken();

      var _options = this.options,
          company_id = _options.company_id,
          appid = _options.appid;

      {
        if (appid) {
          header['authorizer-appid'] = appid;
        }
      }

      var options = _extends({}, config, {
        url: reqUrl,
        data: query,
        method: method.toUpperCase(),
        header: header
      });

      if (showLoading) {
        _index2.default.showLoading({
          mask: true
        });
      }

      // TODO: update taro version
      // if (this.options.interceptor && Taro.addInterceptor) {
      //   Taro.addInterceptor(this.options.interceptor)
      // }
      options.data = _extends({}, options.data || {}, {
        company_id: company_id
      });
      if (options.method === 'GET') {
        options.url = addQuery(options.url, _index6.default.stringify(options.data));
        delete options.data;
      } else {
        // nest data
        options.data = _index6.default.stringify(options.data);
      }

      return _index2.default.request(options).then(function (res) {
        // eslint-disable-next-line
        var data = res.data,
            statusCode = res.statusCode,
            header = res.header;

        if (showLoading) {
          _index2.default.hideLoading();
        }

        if (statusCode >= 200 && statusCode < 300) {
          if (data.data !== undefined) {
            if (options.url.indexOf('token/refresh') >= 0) {
              data.data.token = res.header.Authorization.replace('Bearer ', '');
            }
            return data.data;
          } else {
            if (showError) {
              _this2.errorToast(data);
            }
            return Promise.reject(_this2.reqError(res));
          }
        }

        if (statusCode === 401) {
          _index4.default.logout();
          if (showError) {
            data.err_msg = data.err_msg || '授权过期请重新授权';
            _this2.errorToast(data);
          }
          _index2.default.redirectTo({
            url: "/pages/auth/wxauth"
          });
          return Promise.reject(_this2.reqError(res));
        }

        if (statusCode >= 400) {
          if (showError) {
            _this2.errorToast(data);
          }
          return Promise.reject(_this2.reqError(res));
        }

        return Promise.reject(_this2.reqError(res, "API error: " + statusCode));
      });
    }
  }, {
    key: "reqError",
    value: function reqError(res) {
      var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var data = res.data || {};
      var errMsg = data.msg || data.err_msg || msg;
      var err = new Error(errMsg);
      err.res = res;
      return err;
    }
  }]);

  return API;
}();

exports.default = new API({
  baseURL: "https://bbc54.shopex123.com/index.php/api/h5app/wxapp"

  // interceptor (chain) {
  //   const { requestParams } = chain
  //   requestParams.company_id = '1'

  //   return chain.proceed(requestParams)
  // }
});
exports.API = API;