import React, { Component } from 'react'
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import S from '@/spx'
import { Provider } from 'react-redux'
import configStore from '@/store'
import api from '@/api'
// import { Tracker } from "@/service";
// import { youshuLogin } from '@/utils/youshu'
import { fetchUserFavs } from '@/store/slices/user'
import {
  DEFAULT_TABS,
  DEFAULT_THEME,
  SG_APP_CONFIG,
  SG_MEIQIA,
  SG_YIQIA,
  SG_ROUTER_PARAMS,
  SG_GUIDE_PARAMS,
  SG_GUIDE_PARAMS_UPDATETIME
} from '@/consts'
import { checkAppVersion, isWeixin, isWeb, isNavbar, log, entryLaunch } from '@/utils'
import { requestIntercept } from '@/plugin/requestIntercept'
import dayjs from 'dayjs'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const { store } = configStore()

// 如果是app模式，注入SAPP
if (process.env.APP_BUILD_TARGET == 'app') {
  import('@/plugin/app/index').then(({ SAPP }) => {
    SAPP.init(Taro, store)
  })
} else {
  import('@/plugin/routeIntercept').then(({ intercept }) => {
    intercept.init()
  })
}

requestIntercept()

class App extends Component {
  // componentWillMount() {
  //   this.getSystemConfig()
  //   // if ( S.getAuthToken() ) {
  //   //   store.dispatch(fetchUserFavs());
  //   // }
  // }

  componentDidMount() {

  }

  onLaunch(options) {
    console.log(`app onLaunch:`, options)
  }

  async componentDidShow(options) {
    if (isWeixin) {
      checkAppVersion()
    }
    // isWeb环境下，H5启动时，路由携带参数在options
    // 小程序环境，启动时，路由携带参数在options.query
    entryLaunch.getRouteParams(isWeb ? { query: options } : options).then((params) => {
      console.log(`app componentDidShow:`, options, params)
      Taro.setStorageSync(SG_ROUTER_PARAMS, params)

      // 已缓存的导购参数
      const guideParams = Taro.getStorageSync(SG_GUIDE_PARAMS) || {}
      const guideUpdateTime = Taro.getStorageSync(SG_GUIDE_PARAMS_UPDATETIME) || ''
      const diffMilliseconds = dayjs().diff(dayjs(guideUpdateTime))
      // 参数保存超过3天，清除导购参数
      if (diffMilliseconds > 3 * 86400000) {
        Taro.removeStorageSync(SG_GUIDE_PARAMS)
        Taro.removeStorageSync(SG_GUIDE_PARAMS_UPDATETIME)
      } else {
        // 欢迎语携带用户编号
        if (guideParams?.gu_user_id) { delete guideParams.gu_user_id }
        Taro.setStorageSync(SG_GUIDE_PARAMS, {
          ...guideParams,
          ...params
        })
        Taro.setStorageSync(SG_GUIDE_PARAMS_UPDATETIME, dayjs().unix())
      }

      // 导购UV上报
      if (S.getAuthToken()) {
        entryLaunch.postGuideUV()
        entryLaunch.postGuideTask()
      }
    })

    const { show_time } = await api.promotion.getScreenAd()
    let showAdv
    if (show_time === 'always') {
      showAdv = false
      store.dispatch({
        type: 'user/closeAdv', payload: showAdv
      })
    }
    this.getSystemConfig()
  }

  async getSystemConfig() {
    const {
      echat,
      meiqia,
      disk_driver = 'qiniu',
      whitelist_status = false,
      nostores_status = false,
      distributor_param_status = false,
      point_rule_name = '积分'
    } = await api.shop.homeSetting()

    const {
      tab_bar,
      is_open_recommend: openRecommend,
      is_open_scan_qrcode: openScanQrcode,
      is_open_wechatapp_location: openLocation,
      is_open_official_account: openOfficialAccount,
      color_style: { primary, accent, marketing },
      title // 商城应用名称
    } = await api.shop.getAppBaseInfo()

    const priceSetting = await api.shop.getAppGoodsPriceSetting()

    const appSettingInfo = await api.groupBy.getCompanySetting() // 获取小程序头像

    Taro.setStorageSync('distributor_param_status', distributor_param_status)

    try {
      const tabBar = JSON.parse(tab_bar)
      store.dispatch({
        type: 'sys/setSysConfig',
        payload: {
          initState: true,
          colorPrimary: primary,
          colorMarketing: marketing,
          colorAccent: accent,
          pointName: point_rule_name,
          tabbar: tabBar,
          openRecommend, // 开启猜你喜欢 1开启 2关闭
          openScanQrcode, // 开启扫码功能 1开启 2关闭
          openLocation, // 开启小程序定位 1开启 2关闭
          openOfficialAccount, // 开启关注公众号组件 1开启 2关闭
          diskDriver: disk_driver,
          appName: title,
          echat,
          meiqia,
          openStore: !nostores_status, // 前端店铺展示是否关闭 true:开启 false:关闭（接口返回值为true:关闭 false:不关闭）
          priceSetting,
          appLogo: appSettingInfo?.logo
        }
      })
      // 兼容老的主题方式
      store.dispatch({
        type: 'colors/setColor',
        payload: {
          primary,
          marketing,
          accent
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  componentDidCatchError() { }

  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}

export default App

