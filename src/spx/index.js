import Taro from "@tarojs/taro";
import api from "@/api";
import { getCurrentRoute, log } from "@/utils";

const globalData = {};
const TOKEN_IDENTIFIER = "auth_token";
const TOKEN_TIMESTAMP = "refresh_token_time";
const QW_SESSION_KEY_TIMESTAMP = "refresh_session_key_time"; //企业微信session_key过期时间
const QW_SESSION = "qw_session"; //企微用户信息
function remove(arr, item) {
  const idx = arr.indexOf(item);
  if (idx >= 0) {
    arr.splice(idx, 1);
  }
}

function isAsync(func) {
  const string = func.toString().trim();

  return !!(
    string.match(/^async /) ||
    string.match(/return _ref[^.]*\.apply/) || // babel transform
    func.then
  );
}

class Spx {
  constructor(options = {}) {
    this.hooks = [];
    this.options = {
      autoRefreshToken: true,
      ...options
    };

    if (this.options.autoRefreshToken) {
      this.startRefreshToken();
      this.refreshQwUserinfo();
    }
  }
  //写入企业微信用户详细身份
  async setQwUserInfo() {
    console.log("---------------SPX-企业微信录入--------------");
    let { code } = await this.getQyLoginCode();

    const QwUserInfo = await api.user.getQwUserInfo({
      appname: `${APP_NAME}`,
      code
    });
    this.set( "session3rd", QwUserInfo.session3rd );
    this.setAuthToken(QwUserInfo.session3rd);

    return await this.initGuideInfo(QwUserInfo);
  }
  //初始化导购身份
  async initGuideInfo(QwUserInfo) {
    console.log("初始化导购身份-initGuideInfo", QwUserInfo);

    if (!QwUserInfo) return;
    let { salesperson_id, distributor_id, employee_status } = QwUserInfo;
    //employee_status:1内部导购,2编外导购
    if (employee_status == 1) {
    } else {
      await api.guide.distributorlist();
    }
    //查询当前导购门店信息是否有效
    const res = await api.guide.is_valid({ salesperson_id, distributor_id });
    console.log("查询当前导购门店信息是否有效-is_valid", res);
    QwUserInfo.store_isValid = res;
    QwUserInfo.ba_info = {...QwUserInfo}
    this.set(
      "QwUserInfo",
      {
        ...QwUserInfo
      },
      true
    );
    return QwUserInfo;
  }
  refreshQwUserinfo() {
    if (this._refreshSessionKeyTimer) {
      clearTimeout(this._refreshSessionKeyTimer);
    }
    const checkAndRefresh = async () => {
      const expired = this.get(QW_SESSION_KEY_TIMESTAMP, true);
      if (!expired) return false;
      const delta = Date.now() - expired;

      if (delta > 0) {
        await this.setQwSession();
        clearTimeout(this._refreshSessionKeyTimer);
      }
    };
    //  let time= setInterval(checkAndRefresh, 7200*1000)
    let time = setInterval(checkAndRefresh, 7200 * 1000);
    this._refreshSessionKeyTimer = time;
  }

  getAuthToken() {
    const authToken = Taro.getStorageSync(TOKEN_IDENTIFIER);
    if (authToken && !this.get(TOKEN_IDENTIFIER)) {
      this.set(TOKEN_IDENTIFIER, authToken);
    }
    return authToken;
  }

  setAuthToken(token) {
    this.set(TOKEN_IDENTIFIER, token);
    Taro.setStorageSync(TOKEN_IDENTIFIER, token);
    Taro.setStorageSync(TOKEN_TIMESTAMP, Date.now() + 55 * 60 * 1000);
  }

  startRefreshToken() {
    if (this._refreshTokenTimer) {
      clearTimeout(this._refreshTokenTimer);
    }
    const checkAndRefresh = async () => {
      const expired = Taro.getStorageSync(TOKEN_TIMESTAMP);
      if (!expired) return;
      const delta = expired - Date.now();
      if (delta > 0 && delta <= 5 * 60 * 1000) {
        const { token } = await api.user.refreshToken();
        clearTimeout(this._refreshTokenTimer);
        this.setAuthToken(token);
      }
    };

    setInterval(checkAndRefresh, 5 * 60 * 1000);
  }

  async getUserInfo() {
    let userInfo = this.get("userInfo");
    const token = this.getAuthToken();
    if (!userInfo && token) {
      userInfo = await api.user.info();
      this.set("userInfo", userInfo);
    }

    return userInfo;
  }

  get(key, forceLocal) {
    let val = globalData[key];
    if (forceLocal) {
      val = Taro.getStorageSync(key);
      this.set(key, val);
    }
    return val;
  }

  set(key, val, forceLocal) {
    globalData[key] = val;
    if (forceLocal) {
      Taro.setStorageSync(key, val);
    }
  }
  delete(key, forceLocal) {
    delete globalData[key];
    if (forceLocal) {
      Taro.removeStorageSync(key);
    }
  }
  hasHook(name) {
    return this.hooks[name] !== undefined;
  }

  async trigger(name, ...args) {
    const cbs = this.hooks[name];
    if (!cbs) return;

    const ret = [];

    for (let cb of cbs) {
      let rs = isAsync(cb) ? await cb.apply(this, args) : cb.apply(this, args);

      ret.push(rs);
    }

    return ret;
  }

  bind(name, fn) {
    const fns = this.hooks[name] || [];
    fns.push(fn);
    this.hooks[name] = fns;
  }

  unbind(name, fn) {
    const fns = this.hooks[name];
    if (!fns) return;

    remove(fns, fn);
  }

  async autoLogin(ctx, next) {
    try {
      await this.trigger("autoLogin", ctx);
      // if (process.env.NODE_ENV === 'weapp') {
      //   await Taro.checkSession()
      // }
      if (!this.getAuthToken()) {
        throw new Error("auth token not found");
      }

      let userInfo = await this.getUserInfo();
      if (next) await next(userInfo);
      if (!userInfo) throw new Error("userInfo is empty");

      return userInfo;
    } catch (e) {
      log.debug("[auth failed] redirect to login page: ", e);

      this.login(ctx);
    }
  }

  login(ctx, isRedirect = false) {
    const { path, fullPath } = getCurrentRoute(ctx.$router);
    const encodedRedirect = encodeURIComponent(fullPath);
    if (path === APP_AUTH_PAGE) {
      return;
    }
    const authUrl = APP_AUTH_PAGE + `?redirect=${encodedRedirect}`;

    Taro[isRedirect ? "redirectTo" : "navigateTo"]({
      url: authUrl
    });
  }

  logout() {
    Taro.removeStorageSync(TOKEN_IDENTIFIER);
    delete globalData[TOKEN_IDENTIFIER];
    this.trigger("logout");
  }

  globalData() {
    if (process.env.NODE_ENV === "production") {
      return null;
    } else {
      return globalData;
    }
  }
  //获取企业微信code
  getQyLoginCode() {
    return new Promise((reslove, reject) => {
      wx.qy.login({
        success: res => {
          reslove(res);
        },
        fail: err => {
          reject(err);
        }
      });
    });
  }
  setUvTimeStamp() {
    let uvstamp = Taro.getStorageSync("userVisitTime");
    let today = formatDataTime(new Date());
    if (!uvstamp || (uvstamp && new Date(today).getTime() > uvstamp)) {
      api.user.getuservisit();
      uvstamp = new Date(today).getTime() + 5 * 60 * 1000;
      Taro.setStorageSync("userVisitTime", uvstamp);
    }
  }
  toast(...args) {
    Taro.eventCenter.trigger.apply(Taro.eventCenter, [
      "sp-toast:show",
      ...args
    ]);
  }

  closeToast() {
    Taro.eventCenter.trigger("sp-toast:close");
  }
}

export default new Spx();
