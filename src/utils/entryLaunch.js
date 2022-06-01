import Taro, { getCurrentInstance } from '@tarojs/taro';
import api from '@/api';
import qs from 'qs';
import { showToast, log, isArray, VERSION_STANDARD } from '@/utils';
import configStore from '@/store';

import MapLoader from '@/utils/lbs';

const geocodeUrl = 'https://restapi.amap.com/v3/geocode';
const $instance = getCurrentInstance();
const { store } = configStore();
class EntryLaunch {
  constructor() {
    this.init();
  }

  
  init() {
    if (Taro.getEnv() == Taro.ENV_TYPE.WEB) {
      this.initAMap();
    }
  }

  /**
   * @function 获取小程序路由参数
   */
  async getRouteParams(options) {
    // const { params } = $instance.router;
    const params = options?.query || $instance.router.params
    let _options = {};
    if (params.scene) {
      console.log(qs.parse(decodeURIComponent(params.scene)))
      _options = {
        ...qs.parse(decodeURIComponent(params.scene)),
      };

      if (_options.share_id) {
        const res = await api.wx.getShareId({
          share_id: _options.share_id,
        });

        _options = {
          ..._options,
          ...res,
        };
      }
    } else {
      _options = params;
    }
    console.log(`getRouteParams:`, _options);
    return _options;
  }

  /**
   * @function 获取小程序启动参数
   */
  getLaunchParams() {
    console.log(`app launch options:`, Taro.getLaunchOptionsSync());
    const { query } = Taro.getLaunchOptionsSync();
    let options = {
      ...query,
    };

    if (query.scene) {
      options = {
        ...options,
        ...qs.parse(decodeURIComponent(query.scene)),
      };
    }
    return options;
  }

  /**
   * @function 初始化高德地图配置
   */
  async initAMap(callback) {
    return new Promise((reslove, reject) => {
      MapLoader().then((amap) => {
        amap.plugin(['AMap.Geolocation', 'AMap.Geocoder'], () => {
          this.geolocation = new amap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：5s
            position: 'RB', //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
          });
          this.geocoder = new AMap.Geocoder({
            radius: 1000, //范围，默认：500
          });
          reslove('ok');
        });
      });
    });
  }

  /**
   * @function 获取当前店铺
   */
  async getCurrentStore() {
    const { is_open_wechatapp_location } = Taro.getStorageSync('settingInfo');
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const { dtid } =
      process.env.TARO_ENV == 'weapp'
        ? currentPage.options
        : currentPage.$router.params;
    let storeQuery = {}; // 店铺查询参数
    if (dtid) {
      storeQuery = {
        distributor_id: dtid,
      };
    } else {
      // 开启定位
      if (is_open_wechatapp_location == 1) {
        try {
          const { lng, lat } = await this.getLocationInfo();
          storeQuery = {
            ...storeQuery,
            lng,
            lat,
          };

          const { addressComponent, formattedAddress } =
            await this.getAddressByLnglat(lng, lat);
          Taro.setStorageSync('locationAddress', {
            ...addressComponent,
            formattedAddress,
            lng,
            lat,
          });

          showToast(formattedAddress);
        } catch (e) {
          console.warn('location failed: ' + e.message);
        }
      }
    }
    const storeInfo = await api.shop.getShop(storeQuery);
    Taro.setStorageSync('curStore', storeInfo);
    this.store.dispatch({
      type: 'shop/setShop',
      payload: storeInfo,
    });

    return storeInfo;
  }

  /**
   * @function 根据经纬度获取定位信息
   */
  async getLocationInfo() {
    if (process.env.TARO_ENV === 'weapp') {
      return new Promise(async (resolve, reject) => {
        Taro.getLocation({
          type: 'gcj02',
          success: (res) => {
            if (res.errMsg == 'getLocation:ok') {
              resolve({
                lng: res.longitude,
                lat: res.latitude,
              });
            } else {
              resolve({});
              reject({ message: res.errMsg });
            }
          },
          fail: (error) => {
            resolve({});
            reject({ message: error });
          },
        });
      });
    } else {
      return new Promise(async (reslove, reject) => {
        this.geolocation.getCurrentPosition(function (status, result) {
          if (status == 'complete') {
            reslove({
              lng: result.position.lng,
              lat: result.position.lat,
            });
          } else {
            reject({ message: result.message });
          }
        });
      });
    }
  }

  async getCurrentAddressInfo(refresh = false) {
    const { lng, lat } = await this.getLocationInfo();
    let res = {};
    if (lat) {
      res = await this.getAddressByLnglatWebAPI(lng, lat);
    }
    log.debug('getCurrentAddressInfo: ', res)
    return res;
  }

  /**
   * @function 根据地址解析经纬度
   */
  async getLnglatByAddress(address) {
    const res = await Taro.request({
      url: `${geocodeUrl}/geo`,
      data: {
        key: process.env.APP_MAP_KEY,
        address,
      },
    });

    if (res.data.status == 1) {
      const { geocodes } = res.data;
      if (geocodes.length > 0) {
        return {
          address: geocodes[0].formatted_address,
          province: geocodes[0].province,
          city: geocodes[0].city,
          district: geocodes[0].district,
          lng: geocodes[0].location.split(',')[0],
          lat: geocodes[0].location.split(',')[1],
        };
      } else {
        return {
          error: '没有搜索到地址',
        };
      }
    } else {
      return {
        error: '地址解析错误',
      };
    }
  }

  /**
   * @function 根据经纬度解析地址
   * @params lnglat Array
   */
  getAddressByLnglat(lng, lat) {
    return new Promise((reslove, reject) => {
      this.geocoder.getAddress([lng, lat], function (status, result) {
        if (status === 'complete' && result.regeocode) {
          reslove(result.regeocode);
        } else {
          reject(status);
        }
      });
    });
  }

  async getAddressByLnglatWebAPI(lng, lat) {
    const res = await Taro.request({
      url: `${geocodeUrl}/regeo`,
      data: {
        key: process.env.APP_MAP_KEY,
        location: `${lng},${lat}`,
      },
    });

    if (res.data.status == 1) {
      const {
        formatted_address,
        addressComponent: { province, city, district },
      } = res.data.regeocode;
      return {
        lng,
        lat,
        address: formatted_address,
        province: province,
        city: isArray(city) ? province : city,
        district: district,
      };
    } else {
      return {
        error: '地址解析错误',
      };
    }
  }

  /**
   * @function 是否开启店铺
   * @returns Boolean
   * @description 标准版有门店，并且根据后台设置是否展示门店；平台版不显示门店
   */
  isOpenStore() {
    const { nostores_status } = Taro.getStorageSync('otherSetting');
    if (VERSION_STANDARD) {
      return !nostores_status;
    } else {
      return false;
    }
  }

  /**
   * 判断是否开启定位，去获取经纬度，根据经纬度去获取地址
   */
  async isOpenPosition(callback) {
    if (process.env.TARO_ENV === 'weapp') {
      const { authSetting } = await Taro.getSetting();
      if (!authSetting['scope.userLocation']) {
        Taro.authorize({
          scope: 'scope.userLocation',
          success: async () => {
            let { lng, lat } = await this.getLocationInfo();
            let res = {};
            if (lat) {
              res = await this.getAddressByLnglatWebAPI(lng, lat);
            }
            if (callback) callback(res);
          },
          fail: () => {
            Taro.showModal({
              title: '提示',
              content: '请打开定位权限',
              success: async (resConfirm) => {
                if (resConfirm.confirm) {
                  await Taro.openSetting();
                  const setting = await Taro.getSetting();
                  if (setting.authSetting['scope.userLocation']) {
                    let { lng, lat } = await this.getLocationInfo();
                    let res = {};
                    if (lat) {
                      res = await this.getAddressByLnglatWebAPI(lng, lat);
                    }
                    if (callback) callback(res);
                  } else {
                    Taro.showToast({ title: '获取定位权限失败', icon: 'none' });
                  }
                }
              },
            });
          },
        });
      } else {
        let { lng, lat } = await this.getLocationInfo();
        let res = {};
        if (lat) {
          res = await this.getAddressByLnglatWebAPI(lng, lat);
        }
        if (callback) callback(res);
      }
    } else {
      let { lng, lat } = await this.getLocationInfo();
      let res = {};
      if (lat) {
        res = await this.getAddressByLnglatWebAPI(lng, lat);
      }
      if (callback) callback(res);
    }
  }
}

export default new EntryLaunch();
