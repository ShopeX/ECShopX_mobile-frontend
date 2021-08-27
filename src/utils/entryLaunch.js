import Taro from '@tarojs/taro';
import api from "@/api";
import qs from 'qs';
import { showToast } from '@/utils'

class EntryLaunch {
  constructor() {
  }

  init(params) {
    const { query, scene } =
      process.env.TARO_ENV == 'h5'
        ? { query: params }
        : Taro.getLaunchOptionsSync();
    let options = {
      ...query,
    };

    if (scene) {
      options = {
        ...options,
        ...qs.parse(decodeURIComponent(query.scene)),
      };
    }

    Taro.setStorageSync('sence_params', options);
    this.sence_params = options;
    return options;
  }

  /**
   * @function 获取当前店铺
   *
   */
  async getCurrentStore() {
    const { is_open_wechatapp_location } = Taro.getStorageSync('settingInfo');
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const { dtid } = currentPage.$route.params;
    if ( dtid ) {
      const storeInfo = await api.shop.getShop( { distributor_id: dtid } );
      Taro.setStorageSync("curStore", storeInfo);
    } else {
      // 小程序开启定位
      if ( is_open_wechatapp_location == 1 ) {
        await this.getLocationInfo()
      } else {
        await api.shop.getShop();
      }
    }
  }

  /**
   * @function 根据经纬度获取定位信息
   */
  async getLocationInfo() {
    return new Promise( ( reslove, reject ) => {
      if ( process.env.TARO_ENV === 'weapp' ) {
        
      } else {
        console.log(process.env.APP_MAP_KEY, process.env.APP_MAP_NAME);
        const geolocation = new qq.maps.Geolocation();
        // geolocation.getIpLocation(
        //   res => {
        //     debugger;
        //   },
        //   error => {
        //     debugger;
        //   }
        // );
        geolocation.getLocation(
          res => {
            debugger;
          },
          error => {
            debugger
            console.error(error);
            showToast("获取定位失败");
            reject();
          },
          { timeout: 9000 }
        );
      }
    })

  }

  /**
   * @function 是否开启店铺
   * @returns Boolean
   * @description 标准版有门店，并且根据后台设置是否展示门店；平台版不显示门店
   */
  hasStores() {
    const { nostores_status } = Taro.getStorageSync('otherSetting');
    if (process.env.APP_PLATFORM === 'standard') {
      return !nostores_status;
    } else {
      return false;
    }
  }
}

export default new EntryLaunch();
