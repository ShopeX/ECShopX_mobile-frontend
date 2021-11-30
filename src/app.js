import React, { Component } from 'react';
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro';
import S from "@/spx";
import { Provider } from "react-redux";
import configStore from "@/store";
import api from "@/api";
// import { Tracker } from "@/service";
// import { youshuLogin } from '@/utils/youshu'
import { DEFAULT_TABS, DEFAULT_THEME } from "@/consts";

import "./app.scss";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();
// 三天时间戳
const treeDay = 86400000 * 3

class App extends Component {
  componentWillMount() {
    this.getHomeSetting()
    // 获取收藏列表
    if (process.env.TARO_ENV === "weapp") {
      try {
        const {
          model,
          system,
          windowWidth,
          windowHeight,
          screenHeight,
          screenWidth,
          pixelRatio,
          brand
        } = Taro.getSystemInfoSync();
        const { networkType } = Taro.getNetworkType();

        let px = screenWidth / 750; //rpx换算px iphone5：1rpx=0.42px

        Taro.$systemSize = {
          windowWidth,
          windowHeight,
          screenHeight,
          screenWidth,
          model,
          px,
          pixelRatio,
          brand,
          system,
          networkType
        };

        if (system.indexOf("iOS") !== -1) {
          Taro.$system = "iOS";
        }

        S.set(
          "ipxClass",
          model.toLowerCase().indexOf("iphone x") >= 0 ? "is-ipx" : ""
        );
      } catch (e) {
        console.log(e);
      }
    }
    // if (S.getAuthToken() && !isGoodsShelves()) {
    if (S.getAuthToken() ) {
      api.member
        .favsList()
        .then(({ list }) => {
          if (!list) return;
          store.dispatch({
            type: "member/favs",
            payload: list
          });
        })
        .catch(e => {
          console.info(e);
        });
    }
    // H5定位
    // if (process.env.APP_PLATFORM === "standard" && Taro.getEnv() === "WEB") {
    //   // new LBS();
    // }
    // 设置购物车默认类型
    if (Taro.getStorageSync("cartType")) {
      Taro.setStorageSync("cartType", "normal");
    }
  }

  componentDidMount() {
    this.init();
  }

  componentDidShow(options) {
    const { referrerInfo } = options || {};
    if (referrerInfo) {
      console.log(referrerInfo);
    }
  }

  // 初始化
  async init() {
    // 过期时间
    const promoterExp = Taro.getStorageSync("distribution_shop_exp");
    if (Date.parse(new Date()) - promoterExp > treeDay) {
      Taro.setStorageSync("distribution_shop_id", "");
      Taro.setStorageSync("distribution_shop_exp", "");
    }

    // 导购数据过期时间
    const guideExp = Taro.getStorageSync("guideExp");
    if (!guideExp || Date.parse(new Date()) - guideExp > treeDay) {
      Taro.setStorageSync("s_smid", "");
      Taro.setStorageSync("chatId", "");
      Taro.setStorageSync("s_dtid", "");
      Taro.setStorageSync("store_bn", "");
    }
    // 欢迎语导购过期时间
    const guUserIdExp = Taro.getStorageSync("guUserIdExp");
    if (!guUserIdExp || Date.parse(new Date()) - guUserIdExp > treeDay) {
      Taro.setStorageSync("work_userid", "");
    }

    // 根据路由参数
    const { query = {} } = getCurrentInstance().router?.params || {};
    // 初始化清楚s_smid
    Taro.setStorageSync("s_smid", "");
    Taro.setStorageSync("s_dtid", "");
    Taro.setStorageSync("gu_user_id", "");

    console.log("query", query);

    if ((query && query.scene) || query.gu_user_id || query.smid) {
      const {
        smid,
        dtid,
        id,
        aid,
        cid,
        gu,
        chatId,
        gu_user_id = ""
      } = await normalizeQuerys(query);
      // 旧导购存放
      if (smid) {
        Taro.setStorageSync("s_smid", smid);
      }
      if (dtid) {
        Taro.setStorageSync("s_dtid", dtid);
      }
      // 新导购埋点数据存储导购员工工号
      if (gu) {
        const [employee_number, store_bn] = gu.split("_");
        Taro.setStorageSync("work_userid", employee_number);
        Taro.setStorageSync("store_bn", store_bn);
      }
      // 欢迎语小程序卡片分享参数处理
      if (gu_user_id) {
        Taro.setStorageSync("work_userid", gu_user_id);
        Taro.setStorageSync("gu_user_id", gu_user_id);
        // 如果是登录状态下打开分享且携带导购ID
        if (S.getAuthToken()) {
          api.user.bindSaleperson({
            work_userid: gu_user_id
          });
        }
      }
    }
    // 初始化系统配置
    this.getSystemConfig()
  }

  async getSystemConfig() {
    const appConfig = await api.shop.getAppConfig()
    const {
      tab_bar,
      is_open_recommend,
      is_open_scan_qrcode,
      is_open_wechatapp_location,
      is_open_official_account
    } = appConfig;
    Taro.setStorageSync("settingInfo", {
      is_open_recommend, // 猜你喜欢
      is_open_scan_qrcode, // 扫码
      is_open_wechatapp_location, // 定位
      is_open_official_account // 公众号组件
    } );

    const [colorConfig, pointConfig] = await Promise.all([
      api.shop.getPageParamsConfig({
        page_name: "color_style"
      } ),
      api.pointitem.getPointSetting()
    ] );

    let tabbar = null;
    try {
      tabbar = JSON.parse(tab_bar);
    } catch (error) {
      console.log(error);
    }
    store.dispatch({
      type: "sys/setSysConfig",
      payload: tabbar || DEFAULT_TABS
    });

    const { colorPrimary, colorMarketing, colorAccent } = DEFAULT_THEME;
    const defaultColors = {
      data: [
        {
          primary: colorPrimary,
          accent: colorMarketing,
          marketing: colorAccent
        }
      ],
      name: "base"
    };
    const themeColor = colorConfig.list.length
      ? colorConfig.list[0].params
      : defaultColors;
    // 兼容老的主题
    store.dispatch({
      type: "colors",
      payload: themeColor
    });

    store.dispatch({
      type: "system/config",
      payload: {
        colorPrimary: themeColor.data[0].primary,
        colorMarketing: themeColor.data[0].marketing,
        colorAccent: themeColor.data[0].accent,
        pointName: pointConfig.name
      }
    });
  }

  async fetchTabs() {
    Taro.setStorageSync("initTabBar", false);
    const {
      tab_bar,
      is_open_recommend,
      is_open_scan_qrcode,
      is_open_wechatapp_location,
      is_open_official_account
    } = await api.shop.getAppConfig()

    let tabbar = null
    try {
      tabbar = JSON.parse(tab_bar)
    } catch (error) {
      console.log(error)
    }
    store.dispatch({
      type: "tabBar",
      payload: tabbar || DEFAULT_TABS
    } );

    Taro.setStorageSync("initTabBar", true);
    Taro.setStorageSync("settingInfo", {
      is_open_recommend,  // 猜你喜欢
      is_open_scan_qrcode,  // 扫码
      is_open_wechatapp_location, // 定位
      is_open_official_account  // 公众号组件
    });
  }

  async fetchColors() {
    const defaultColors = {
      data: [
        {
          primary: "#d42f29",
          accent: "#fba629",
          marketing: "#2e3030"
        }
      ],
      name: "base"
    };
    const info = await api.shop.getPageParamsConfig({
      page_name: "color_style"
    });
    const themeColor = info.list.length ? info.list[0].params : defaultColors;
    // 兼容老的主题
    store.dispatch({
      type: "colors",
      payload: themeColor
    });
    S.set("SYSTEM_THEME", {
      colorPrimary: themeColor.data[0].primary,
      colorMarketing: themeColor.data[0].marketing,
      colorAccent: themeColor.data[0].accent
    });
  }

  // 获取首页配置
async getHomeSetting () {
  const {
    echat = {},
    meiqia = {},
    disk_driver = "qiniu",
    whitelist_status = false,
    nostores_status = false,
    distributor_param_status=false
  } = await api.shop.homeSetting();

  // 美洽客服配置
  Taro.setStorageSync("meiqia", meiqia);
  // 一洽客服配置
  Taro.setStorageSync("echat", echat);
  // 白名单配置、门店配置、图片存储信息、有数配置
  Taro.setStorageSync("otherSetting", {
    whitelist_status,
    nostores_status,
    openStore: !nostores_status,
    disk_driver
  })
  // 分享时是否携带参数
  Taro.setStorageSync("distributor_param_status", distributor_param_status);
};

  componentDidCatchError() {}

  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App;
