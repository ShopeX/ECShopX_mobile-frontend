import Taro from "@tarojs/taro";
import api from "@/api";
import qs from "qs";
import { showToast, log } from "@/utils";

class EntryLaunch {
  constructor() {}

  init(params) {
    const { query, scene } =
      process.env.TARO_ENV == "h5"
        ? { query: params }
        : Taro.getLaunchOptionsSync();

    let options = {
      ...query
    };

    if (scene) {
      options = {
        ...options,
        ...qs.parse(decodeURIComponent(query.scene))
      };
    }

    Taro.setStorageSync("launch_params", options);
    this.sence_params = options;
    return options;
  }

  /**
   * @function 获取当前店铺
   *
   */
  async getCurrentStore() {
    const { is_open_wechatapp_location } = Taro.getStorageSync("settingInfo");
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const { dtid } = currentPage.$router.params;
    let storeQuery = {}; // 店铺查询参数
    if (dtid) {
      storeQuery = {
        distributor_id: dtid
      };
    } else {
      // 小程序开启定位
      if (is_open_wechatapp_location == 1) {
        await this.getLocationInfo()
          .then(res => {
            debugger;
          })
          .catch(e => {
            log.debug(e);
          });
      }
    }
    const storeInfo = await api.shop.getShop(storeQuery);
    Taro.setStorageSync("curStore", storeInfo);
    return storeInfo;
  }

  /**
   * @function 根据经纬度获取定位信息
   */
  getLocationInfo() {
    if (process.env.TARO_ENV === "weapp") {
    } else {
      const geolocation = new qq.maps.Geolocation();
      return new Promise((resolve, reject) => {
        geolocation.getLocation(
          res => {
            // debugger;
            showToast(JSON.stringify(res));
            resolve(res);
          },
          error => {
            // showToast("获取定位失败");
            reject(`qq maps geolocation fail... ,`, error);
          },
          { timeout: 9000 }
        );
      });
    }
  }

  /**
   * @function 是否开启店铺
   * @returns Boolean
   * @description 标准版有门店，并且根据后台设置是否展示门店；平台版不显示门店
   */
  hasStores() {
    const { nostores_status } = Taro.getStorageSync("otherSetting");
    if (process.env.APP_PLATFORM === "standard") {
      return !nostores_status;
    } else {
      return false;
    }
  }
}

export default new EntryLaunch();
