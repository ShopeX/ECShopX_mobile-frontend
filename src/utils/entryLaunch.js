import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import qs from 'qs'
import S from '@/spx'
import dayjs from 'dayjs'
import { showToast, log, isArray, VERSION_STANDARD, resolveUrlParamsParse } from '@/utils'
import configStore from '@/store'
import _isEqual from 'lodash/isEqual'
import {
  SG_ROUTER_PARAMS,
  SG_GUIDE_PARAMS_UPDATETIME,
  SG_GUIDE_PARAMS
} from '@/consts/localstorage'

import MapLoader from '@/utils/lbs'

const geocodeUrl = 'https://apis.map.qq.com/ws/geocoder/v1'
const $instance = getCurrentInstance()
const { store } = configStore()
class EntryLaunch {
  constructor() {
    this.init()
  }

  init() {
    if (Taro.getEnv() == Taro.ENV_TYPE.WEB) {
      this.initAMap()
    }
  }

  /**
   * @function 获取小程序路由参数
   */
  async getRouteParams(options) {
    const params = options?.query || options?.params || $instance.router?.params || {}

    const pageStack = Taro.getCurrentPages()

    const resPage = pageStack.find(
      (item) => item.route == options?.path && _isEqual(options.query, item.$taroParams)
    )

    // 只返回小程序启动时的参数（包含冷启动和热启动）
    if (resPage) {
      return {
        ...Taro.getStorageSync(SG_ROUTER_PARAMS),
        runFlag: true // 标识小程序启动标志，用于判断是否是小程序启动
      }
    }

    let _options = {}
    console.log('$instance.router?.params', $instance.router?.params)
    if (params?.scene) {
      console.log('params scene:', params.scene, resolveUrlParamsParse(params.scene))
      _options = {
        ...resolveUrlParamsParse(params.scene)
      }
      if (_options.share_id) {
        const res = await api.wx.getShareId({
          share_id: _options.share_id
        })

        _options = {
          ..._options,
          ...res
        }
      }
    } else {
      _options = params
    }
    console.log(`getRouteParams:`, _options)
    return _options
  }

  /**
   * @function 获取小程序启动参数
   */
  getLaunchParams() {
    console.log(`app launch options:`, Taro.getLaunchOptionsSync())
    const { query } = Taro.getLaunchOptionsSync()
    let options = {
      ...query
    }

    if (query.scene) {
      options = {
        ...options,
        ...qs.parse(decodeURIComponent(query.scene))
      }
    }
    return options
  }

  /**
   * @function 初始化腾讯地图配置
   */
  async initAMap() {
    // 初始化地图对象
    // this.geolocation = new qq.maps.Geolocation()
    return new Promise((resolve, reject) => {
      MapLoader()
        .then((qq) => {
          // 初始化地图对象
          this.geolocation = new qq.maps.Geolocation({
            key: process.env.APP_MAP_KEY,
            complete: function (result) {
              console.log('complete', result)
            },
            error: function (error) {
              console.error('error', error)
            }
          })

          // 初始化地址解析对象
          this.geocoder = new qq.maps.Geocoder({
            complete: function (result) {
              console.log('complete', result)
            },
            error: function (error) {
              console.error('error', error)
            }
          })

          console.log('entryLaunch', this)
          resolve('ok')
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * @function 获取当前店铺
   */
  async getCurrentStore() {
    const { is_open_wechatapp_location } = Taro.getStorageSync('settingInfo')
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const { dtid } =
      process.env.TARO_ENV == 'weapp' ? currentPage.options : currentPage.$router.params
    let storeQuery = {} // 店铺查询参数
    if (dtid) {
      storeQuery = {
        distributor_id: dtid
      }
    } else {
      // 开启定位
      if (is_open_wechatapp_location == 1) {
        try {
          const { lng, lat } = await this.getLocationInfo()
          storeQuery = {
            ...storeQuery,
            lng,
            lat
          }

          const { addressComponent, formattedAddress } = await this.getAddressByLnglat(lng, lat)
          Taro.setStorageSync('locationAddress', {
            ...addressComponent,
            formattedAddress,
            lng,
            lat
          })

          showToast(formattedAddress)
        } catch (e) {
          console.warn('location failed: ' + e.message)
        }
      }
    }
    const storeInfo = await api.shop.getShop(storeQuery)
    Taro.setStorageSync('curStore', storeInfo)
    this.store.dispatch({
      type: 'shop/setShop',
      payload: storeInfo
    })

    return storeInfo
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
                lat: res.latitude
              })
            } else {
              resolve({})
              reject({ message: res.errMsg })
            }
          },
          fail: (error) => {
            resolve({})
            reject({ message: error })
          }
        })
      })
    } else if (process.env.TARO_ENV === 'alipay') {
      // TODO 支付宝小程序 地图
      return new Promise(async (resolve, reject) => {
        my.getLocation({
          type: 0, // 获取经纬度和省市区县数据
          success: (res) => {
            console.log(11, res)
            resolve({
              lng: res.longitude,
              lat: res.latitude
            })
          },
          fail: (res) => {
            reject({ message: '定位失败' + JSON.stringify(res) })
          }
        })
      })
    } else {
      return new Promise(async (reslove, reject) => {
        this.geolocation?.getLocation(
          (res) => {
            reslove({
              lng: res.lng,
              lat: res.lat,
              province: res.province,
              city: res.city,
              district: res.district,
              address: res.addr
            })
          },
          (err) => {
            console.error('getLocationInfo error', err)
          },
          { timeout: 8000 }
        )
      })
    }
  }

  async getCurrentAddressInfo(refresh = false) {
    const { lng, lat } = await this.getLocationInfo()
    // console.log(' lng, lat', lng, lat);
    let res = {}
    if (lat) {
      res = await this.getAddressByLnglatWebAPI(lng, lat)
    }
    log.debug('getCurrentAddressInfo: ', res)
    return res
  }

  /**
   * @function 根据地址解析经纬度--腾讯
   */
  async getLnglatByAddress(address) {
    const res = await Taro.request({
      url: `${geocodeUrl}`,
      data: {
        key: process.env.APP_MAP_KEY,
        address,
        output: 'json'
      }
    })
    if (res.data.status === 0) {
      const { result } = res.data
      return {
        address: result.title,
        province: result.address_components.province,
        city: result.address_components.city,
        district: result.address_components.district,
        lng: result.location.lng,
        lat: result.location.lat
      }
    } else {
      return {
        error: '地址解析错误'
      }
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
          reslove(result.regeocode)
        } else {
          reject(status)
        }
      })
    })
  }

  /**
   * @function 根据经纬度解析地址 -- 腾讯
   * @params lnglat Array
   */
  async getAddressByLnglatWebAPI(lng, lat) {
    const res = await Taro.request({
      url: `${geocodeUrl}`,
      data: {
        key: process.env.APP_MAP_KEY,
        location: `${lat},${lng}`
      }
    })
    if (res.data.status == 0) {
      const {
        address,
        address_component: { province, city, district }
      } = res.data.result
      return {
        lng,
        lat,
        address: address,
        province: province,
        city: isArray(city) ? province : city,
        district: district
      }
    } else {
      return {
        error: '地址解析错误'
      }
    }
  }

  /**
   * @function 是否开启店铺
   * @returns Boolean
   * @description 标准版有门店，并且根据后台设置是否展示门店；平台版不显示门店
   */
  isOpenStore() {
    const { nostores_status } = Taro.getStorageSync('otherSetting')
    if (VERSION_STANDARD) {
      return !nostores_status
    } else {
      return false
    }
  }

  /**
   * 判断是否开启定位，去获取经纬度，根据经纬度去获取地址
   */
  async isOpenPosition(callback) {
    if (process.env.TARO_ENV === 'weapp') {
      const { authSetting } = await Taro.getSetting()
      if (!authSetting['scope.userLocation']) {
        Taro.authorize({
          scope: 'scope.userLocation',
          success: async () => {
            let { lng, lat } = await this.getLocationInfo()
            let res = {}
            if (lat) {
              res = await this.getAddressByLnglatWebAPI(lng, lat)
            }
            if (callback) callback(res)
          },
          fail: () => {
            Taro.showModal({
              title: '提示',
              content: '请打开定位权限',
              success: async (resConfirm) => {
                if (resConfirm.confirm) {
                  await Taro.openSetting()
                  const setting = await Taro.getSetting()
                  if (setting.authSetting['scope.userLocation']) {
                    let { lng, lat } = await this.getLocationInfo()
                    let res = {}
                    if (lat) {
                      res = await this.getAddressByLnglatWebAPI(lng, lat)
                    }
                    if (callback) callback(res)
                  } else {
                    Taro.showToast({ title: '获取定位权限失败', icon: 'none' })
                  }
                } else {
                  if (callback) callback(false)
                }
              }
            })
          }
        })
      } else {
        let { lng, lat } = await this.getLocationInfo()
        let res = {}
        if (lat) {
          res = await this.getAddressByLnglatWebAPI(lng, lat)
        }
        if (callback) callback(res)
      }
    } else {
      // h5环境
      const res = await this.getLocationInfo()
      if (callback) callback(res)
      // let res = {}
      // if (lat) {
      //   res = await this.getAddressByLnglatWebAPI(lng, lat)
      // }
    }
  }

  /**
   * 导购UV统计
   */
  async postGuideUV() {
    const routerParams =
      Taro.getStorageSync(SG_ROUTER_PARAMS) || Taro.getStorageSync(SG_GUIDE_PARAMS)
    const { gu, gu_user_id } = routerParams || {}
    let work_userid = ''
    if (gu) {
      work_userid = gu.split('_')[0]
    }
    if (gu_user_id) {
      work_userid = gu_user_id
    }
    if (work_userid) {
      await api.user.uniquevisito({
        work_userid
      })
      // 导购关系绑定
      await api.user.bindSaleperson({
        work_userid
      })
    }
  }

  /**
   * 导购任务埋点上报
   */
  async postGuideTask() {
    const { path } = $instance.router
    let params = await this.getRouteParams($instance.router)
    const routePath = {
      '/pages/item/espier-detail': 'activeItemDetail',
      '/pages/custom/custom-page': 'activeCustomPage',
      '/subpage/pages/recommend/detail': 'activeSeedingDetail',
      '/pages/marketing/coupon-center': 'activeDiscountCoupon',
      '/pages/cart/espier-checkout': 'orderPaymentSuccess'
    }
    if (!routePath[path]) {
      return
    }
    if (path == '/pages/cart/espier-checkout') {
      params = Taro.getStorageSync(SG_ROUTER_PARAMS) || Taro.getStorageSync(SG_GUIDE_PARAMS)
    }
    // gu_user_id: 欢迎语上带过来的员工编号, 同work_user_id
    const { gu, subtask_id, item_id, dtid, smid, gu_user_id, id } = params
    let work_userid = ''
    let shop_code = ''
    if (gu) {
      const [employeenumber, shopcode] = gu.split('_')
      work_userid = employeenumber
      shop_code = shopcode
    }
    if (gu_user_id) {
      work_userid = gu_user_id
    }
    if (work_userid && S.getAuthToken()) {
      const _params = {
        employee_number: work_userid,
        subtask_id,
        distributor_id: dtid,
        shop_code,
        item_id: item_id || id,
        event_type: routePath[path]
      }
      if (subtask_id) {
        api.wx.taskReportData(_params)
      }

      const { userInfo } = store.getState().user
      const { user_id } = userInfo
      api.wx.interactiveReportData({
        event_id: work_userid,
        user_type: 'wechat',
        user_id,
        event_type: routePath[path],
        store_bn: shop_code
      })
    }
  }
}

export default new EntryLaunch()
