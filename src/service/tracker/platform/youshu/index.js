/*
 * @Author: your name
 * @Date: 2021-01-25 10:54:19
 * @LastEditTime: 2021-04-08 15:52:04
 * @LastEditors: PrendsMoi
 * @Description: In User Settings Edit
 * @FilePath: /unite-vshop/src/service/tracker/platform/youshu/index.js
 */
import Taro from '@tarojs/taro'
import sr from "sr-sdk-wxapp";
import S from "@/spx";
import { tokenParse } from "@/utils";
import Base from "../base";
import actions from "./actions";
import config from "./config";

export default class Youshu extends Base {
  name = "youshu";

  constructor(options = {}) {
    super(options);
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
   
    // const { youshu = {} } =  Taro.getStorageSync('otherSetting') || {}

    config.token = extConfig.youshutoken;
    config.appid = extConfig.appid;

    console.log('extConfig',config)

    sr.init(config);

    this.actions = actions;
    this.sr = sr;

    const token = S.getAuthToken();
    
    if (token) {
      const userInfo = tokenParse(token); 
      this.setVar({
        user_id: userInfo.user_id,
        open_id: userInfo.openid,
        union_id: userInfo.unionid
      });
    }
  }

  trackEvent({ category, action, label, value }) {
    action = category;

    // const name = typeof label === "string" ? label : "";
    const data =
      typeof label === "string"
        ? { ...value }
        : { ...label, ...value };

    sr.track(action, data);
  }

  setVar(params) { 
    sr.setUser({
      user_id: params.user_id,
      open_id: params.open_id,
      union_id: params.union_id
    });
  }

  componentDidShow() {
    sr.track("browse_wxapp_page");
  }

  componentDidMount() {
    // sr.track("browse_wxapp_page");
  }

  componentDidHide() {
    sr.track("leave_wxapp_page");
  }

  componentWillUnmount() {
    sr.track("leave_wxapp_page");
  }
}
