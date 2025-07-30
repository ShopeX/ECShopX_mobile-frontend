import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import S from '@/spx'
import { Provider } from 'react-redux'
import configStore from '@/store'
import api from '@/api'
// import { Tracker } from "@/service";
// import { youshuLogin } from '@/utils/youshu'
import {
  SG_ROUTER_PARAMS,
  SG_GUIDE_PARAMS,
  SG_GUIDE_PARAMS_UPDATETIME
} from '@/consts'
import { checkAppVersion, isWeixin, isWeb, isNavbar, log, entryLaunch, VERSION_STANDARD,tokenParse } from '@/utils'
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
    import('../package.json').then(res => {
      console.log(`App Name: ${res.name}, version: ${res.version}`)
    })

    // 导购参数缓存处理
    const guideUpdateTime = Taro.getStorageSync(SG_GUIDE_PARAMS_UPDATETIME) || 0
    const diffMilliseconds = dayjs().diff(dayjs(guideUpdateTime))
    // 参数保存超过3天，清除导购参数
    if (diffMilliseconds > 3 * 86400000) {
      Taro.removeStorageSync(SG_GUIDE_PARAMS)
      Taro.removeStorageSync(SG_GUIDE_PARAMS_UPDATETIME)
    }
  }

  getParamsOptions = async (options) => {
    const routeParams = await entryLaunch.getRouteParams(options)
    if (routeParams.gu || routeParams.gu_user_id) {
      Taro.setStorageSync(SG_GUIDE_PARAMS, routeParams)
      Taro.setStorageSync(SG_GUIDE_PARAMS_UPDATETIME, dayjs().unix())
    }
  }

  async componentDidShow(options) {
    if (isWeixin) {
      checkAppVersion()
    }
 // isWeb环境下，H5启动时，路由携带参数在options
    // 小程序环境，启动时，路由携带参数在options.query
    entryLaunch.getRouteParams(isWeb ? { query: options } : options).then(async (params) => {
      console.log(`app componentDidShow:`, options, params)
      Taro.setStorageSync(SG_ROUTER_PARAMS, params)
      let _ucd = ''
      //crmcode 区域code, ucd 用户会员 card,source_id, monitor_id, latest_source_id, latest_monitor_id
      const {
        crmcode,
        ucd = '',
        s = '',
        m = '',
        latest_source_id = '',
        latest_monitor_id = '',
      } = params || {}

      Taro.setStorageSync('user_card_code', ucd) //对方打开本小程序会传的参数
      Taro.setStorageSync('sourceInfo', {
        source_id: s,
        monitor_id: m,
        latest_source_id,
        latest_monitor_id
      })
      if (m && s) {
        await entryLaunch.trackViewNum(m, s)
      }
      if (crmcode) {
        this.getSystemConfig()
      }
      if (ucd) {
        const token = S.getAuthToken()
        const userInfo = token ? tokenParse(token) : {}
        _ucd = userInfo?.user_card_code
        if (ucd !== _ucd) {
          //如果有ucd 并且 与本地用户的_ucd相等说明是mob拉起 需要走自动登录
          S.setAuthToken('')
          Taro.removeStorageSync('userinfo')
          return
        }
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
    this.getParamsOptions(options)
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
          appLogo: appSettingInfo?.logo,
          open_divided: appSettingInfo?.open_divided?.status && VERSION_STANDARD && process.env.TARO_ENV !== 'h5', // 店铺隔离开关
          open_divided_templateId: appSettingInfo?.open_divided?.template // 店铺隔离自定义模版id
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

