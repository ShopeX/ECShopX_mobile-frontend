import Taro from "@tarojs/taro";
import S from "@/spx";
import qs from "qs";
import { isGoodsShelves,isAlipay } from "@/utils"; 

function addQuery(url, query) {
  return url + (url.indexOf("?") >= 0 ? "&" : "?") + query;
}

class API {
  constructor(options = {}) {
    let { baseURL = "/" } = options;
    if (!/\/$/.test(baseURL)) {
      baseURL = baseURL + "/";
    }

    options.company_id = APP_COMPANY_ID;
    if (process.env.TARO_ENV === "weapp"||isAlipay) {
      const extConfig = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {};
      options.appid = extConfig.appid;
      if (extConfig.company_id) {
        options.company_id = extConfig.company_id;
      }
    }

    this.options = options;
    this.baseURL = baseURL;
    this.genMethods(["get", "post", "delete", "put"]);
  }

  genMethods(methods) {
    methods.forEach(method => {
      this[method] = (url, data, config = {}) =>
        this.makeReq({
          ...config,
          method,
          url,
          data
        });
    });
  }

  errorToast(data) {
    const errMsg =
      data.msg ||
      data.err_msg ||
      (data.error && data.error.message) ||
      "操作失败，请稍后重试";
    let newText = "";
    if (errMsg.length > 11) {
      newText = errMsg.substring(0, 11) + "\n" + errMsg.substring(11);
    } else {
      newText = errMsg;
    }
    setTimeout(() => {
      Taro.showToast({
        icon: "none",
        title: newText
      });
    }, 200);
  }

  makeReq(config) {
    const {
      url,
      data,
      header = {},
      method = "GET",
      showLoading,
      showError = true
    } = config;
    const methodIsGet = method.toLowerCase() === "get";

    let reqUrl = /^http/.test(url)
      ? url
      : `${this.baseURL}${url.replace(/^\//, "")}`;
    const query = !data || typeof data === "string" ? qs.parse(data) : data;

    if (!methodIsGet) {
      header["content-type"] =
        header["content-type"] || "application/x-www-form-urlencoded";
    }
   
    const token = S.getAuthToken();
    if (token) {
      header["Authorization"] = `Bearer ${token}`;
    }

    if(process.env.TARO_ENV){
      header["source"] =process.env.TARO_ENV;
    }

    const { company_id, appid } = this.options;
    if (process.env.TARO_ENV === "weapp"||isAlipay) {
      if (appid) {
        header["authorizer-appid"] = appid;
      }
      // 企微货架
      if (isGoodsShelves()) {
        header["salesperson-type"] = "shopping_guide";
        header["x-wxapp-session"] = token;
      }
    }

    const options = {
      ...config,
      url: reqUrl,
      data: query,
      method: method.toUpperCase(),
      header: header
    };

    if (showLoading) {
      Taro.showLoading({
        mask: true
      });
    }

    // TODO: update taro version
    // if (this.options.interceptor && Taro.addInterceptor) {
    //   Taro.addInterceptor(this.options.interceptor)
    // }
    options.data = {
      ...(options.data || {}),
      company_id
    };
    if (options.method === "GET") {
      options.url = addQuery(options.url, qs.stringify(options.data));
      delete options.data;
    } else {
      // nest data
      if(isAlipay && options.method==='DELETE'){
        options.url = addQuery(options.url, qs.stringify(options.data));
        options.data=options.data;
        options.dataType='json';
        options.headers=options.header;
        options.responseType='text';
        options.responseCharset='utf-8';
      }else{
        options.data = qs.stringify(options.data);
      }
      
    }
    const workEnv = S.get("workEnv", true);
    let ba_params = S.get("ba_params", true);

    if (workEnv && workEnv.environment === "wxwork") {
      //企业微信

      let guide_code = options.data.guide_code
        ? options.data.guide_code
        : ba_params
        ? ba_params.guide_code
        : null;
      options.data.guide = true;
      options.data.guide_code = guide_code;
      console.log("======导购端请求参数====");

      console.log(ba_params);
    }
    let resData = {};
    let isRefreshing = false;
    let requests = [];

    
    return Taro.request(options)
      .then(res => {
        resData = res;
      })
      .catch(err => {
        resData.statusCode = err.status;

        resData.header = {};

        err.headers.forEach((val, key) => {
          resData.header[key] = val;
        });

        if (config.responseType === "arraybuffer") {
          return err.arrayBuffer();
        }

        if (
          config.dataType === "json" ||
          typeof config.dataType === "undefined"
        ) {
          return err.json();
        }

        if (config.responseType === "text") {
          return err.text();
        }

        return Promise.resolve(null);
      })
      .then(res => {
        // 如果有错误则为错误信息
        if (res) {
          resData.data = res;
        }
        // eslint-disable-next-line
        const { data, statusCode, header } = resData;
        if (showLoading) {
          Taro.hideLoading();
        }

        if (statusCode >= 200 && statusCode < 300) {
          if (data.data !== undefined) {
            if (options.url.indexOf("token/refresh") >= 0) {
              data.data.token = resData.header.Authorization.replace(
                "Bearer ",
                ""
              );
            }
            return data.data;
          } else {
            if (showError) {
              this.errorToast(data);
            }
            return Promise.reject(this.reqError(resData));
          }
        }

        if (statusCode === 401) {
          if (data.error && data.error.code === 401002) {
            this.errorToast({
              msg: "帐号已被禁用"
            });
            return Promise.reject(this.reqError(resData, "帐号已被禁用"));
          }
          if ( data.error && data.error.code === 401001 ) {
            if ( isGoodsShelves() ) {
              S.logout();
              S.loginQW(this, true);
            } else {
              // 刷新token
              const config = options;
              if (isRefreshing) {
                return new Promise(resolve => {
                  requests.push(token => {
                    resolve(API.makeReq(config));
                  });
                });
              } else {
                isRefreshing = true;
                const token = S.getAuthToken();
                return Taro.request({
                  header: {
                    Authorization: `Bearer ${token}`
                  },
                  method: "get",
                  url: APP_BASE_URL + "/token/refresh"
                })
                .then( data => {
                  console.log( "/token/refresh", data );
                  if ( data.statusCode == 401 ) {
                    S.logout()
                    S.login(this, true)
                  }
                  S.setAuthToken(data.header.Authorization.split(" ")[1]);
                  requests.forEach(cb => cb());
                  requests = [];
                  return API.makeReq(config);
                })
                .catch(e => {
                  console.log( e );
                  
                })
                .finally(() => {
                  isRefreshing = false;
                });
              }
            }
          }
          return Promise.reject(this.reqError(resData));
        }

        if (statusCode >= 400) {
          if (
            showError &&
            data.error.message !== "当前余额不足以支付本次订单费用，请充值！" &&
            data.error.code !== 201 &&
            data.error.code !== 450
          ) {
            this.errorToast(data);
          }
          return Promise.reject(this.reqError(resData));
        }

        return Promise.reject(
          this.reqError(resData, `API error: ${statusCode}`)
        );
      });
  }

  reqError(res, msg = "") {
    const data = res.data.error || res.data;
    const errMsg = data.message || data.err_msg || msg;
    const err = new Error(errMsg);
    err.res = res;
    err.code = res.data.error.code
    return err;
  }
}

export default new API({
  baseURL: APP_BASE_URL

  // interceptor (chain) {
  //   const { requestParams } = chain
  //   requestParams.company_id = '1'

  //   return chain.proceed(requestParams)
  // }
});

export { API };
