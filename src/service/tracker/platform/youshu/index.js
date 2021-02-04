/*
 * @Author: your name
 * @Date: 2021-01-25 10:54:19
 * @LastEditTime: 2021-01-29 17:07:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/service/tracker/platform/youshu/index.js
 */
import sr from "sr-sdk-wxapp";
import S from "@/spx";
import Base from "../base";
import actions from "./actions";
import config from "./config";
import { tokenParse } from "@/utils";

export default class Youshu extends Base {
  name = "youshu";

  constructor(options = {}) {
    super(options);
    // const { onBeforeInit } = options;

    console.log('---------init--------')
    console.log(config)

    sr.init(config);

    this.actions = actions;
    this.sr = sr;

    const token = S.getAuthToken();
    if (token) {
      const userInfo = tokenParse(token);
      console.log("------useInfo------")
      console.log(userInfo)
      this.setVar({
        user_id: userInfo.user_id,
        open_id: userInfo.openid,
        union_id: userInfo.unionid
      });
    }
  }

  trackEvent({ category, action, label, value }) {
    action = category;

    const name = typeof label === "string" ? label : "";
    const data =
      typeof label === "string"
        ? { name, ...value }
        : { name, ...label, ...value };

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
