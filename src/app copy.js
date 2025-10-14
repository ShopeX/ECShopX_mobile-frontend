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
  SG_GUIDE_PARAMS_EXPRESSTIME,
  SG_GUIDE_PARAMS,
  SG_GUIDE_PARAMS_UPDATETIME,
  SG_CHECK_STORE_RULE
} from '@/consts'
import {
  checkAppVersion,
  isWeixin,
  isWeb,
  isNavbar,
  log,
  entryLaunch,
  VERSION_STANDARD,
  tokenParse
} from '@/utils'
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

  // componentDidMount() {
  //   const init = async () => {
  //     if (isWeixin) {
  //       checkAppVersion()
  //     }
  //     const { show_time } = await api.promotion.getScreenAd()
  //     let showAdv
  //     if (show_time === 'always') {
  //       showAdv = false
  //       store.dispatch({
  //         type: 'user/closeAdv',
  //         payload: showAdv
  //       })
  //     }
  //   }
  //   init()
  // }

  async onLaunch(options) {
    console.log(`app onLaunch:`, options)
    import('../package.json').then((res) => {
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

    // isWeb环境下，H5启动时，路由携带参数在options
    // 小程序环境，启动时，路由携带参数在options.query
    this.initRouterParams(options)
    const { show_time } = await api.promotion.getScreenAd()
    let showAdv
    if (show_time === 'always') {
      showAdv = false
      store.dispatch({
        type: 'user/closeAdv',
        payload: showAdv
      })
    }
    this.getSystemConfig()
    this.getParamsOptions(options)
  }

  initRouterParams = async (options) => {
    entryLaunch.getRouteParams(isWeb ? { query: options } : options).then(async (params) => {
      console.log(`app componentDidShow:`, options, params)
      Taro.setStorageSync(SG_ROUTER_PARAMS, params)

      if (params.gu || params.gu_user_id) {
        Taro.setStorageSync(SG_GUIDE_PARAMS, {
          ...params,
          gu_user_id: params.gu_user_id || params.gu.split('_')[0]
        })
        Taro.setStorageSync(SG_GUIDE_PARAMS_UPDATETIME, dayjs().unix() * 1000)
      }

      console.log(`app componentDidShow:`, params)

      if (typeof params.runFlag === 'undefined') {
        Taro.setStorageSync(SG_CHECK_STORE_RULE, 0)

        // 小程序启动时，如果路由带参有店铺码，则清除导购参数
        if (typeof params?.dtid !== 'undefined') {
          Taro.removeStorageSync(SG_GUIDE_PARAMS)
          Taro.removeStorageSync(SG_GUIDE_PARAMS_UPDATETIME)
        }
      }

      let _ucd = ''
      //crmcode 区域code, ucd 用户会员 card,source_id, monitor_id, latest_source_id, latest_monitor_id
      const {
        crmcode,
        ucd = '',
        s = '',
        m = '',
        latest_source_id = '',
        latest_monitor_id = ''
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
  }

  async componentDidShow(options) {
    this.getParamsOptions(options)
  }

  getParamsOptions = async (options) => {
    const routeParams = await entryLaunch.getRouteParams(options)
    if (routeParams.gu || routeParams.gu_user_id) {
      Taro.setStorageSync(SG_GUIDE_PARAMS, routeParams)
      Taro.setStorageSync(SG_GUIDE_PARAMS_UPDATETIME, dayjs().unix())
    }
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
      is_open_official_account: openOfficialAccount,
      color_style: { primary, accent, marketing },
      title // 商城应用名称
    } = await api.shop.getAppBaseInfo()

    const priceSetting = await api.shop.getAppGoodsPriceSetting()

    const appSettingInfo = await api.groupBy.getCompanySetting() // 获取小程序头像

    let enterStoreRule = null,
      entryStoreRules = []
    if (VERSION_STANDARD) {
      enterStoreRule = await api.shop.getStoreEnterRule()
      entryStoreRules = Object.entries({
        distributor_code: enterStoreRule.distributor_code,
        shop_assistant: enterStoreRule.shop_assistant,
        shop_white: enterStoreRule.shop_white,
        shop_assistant_pro: enterStoreRule.shop_assistant_pro
      })
        .map(([key, value]) => ({
          key,
          ...value
        }))
        .sort((a, b) => a.sort - b.sort)

      if (enterStoreRule.shop_assistant?.status) {
        Taro.setStorageSync(SG_GUIDE_PARAMS_EXPRESSTIME, enterStoreRule.shop_assistant.express_time) // 时间单位是天
      }
    }

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
          openOfficialAccount, // 开启关注公众号组件 1开启 2关闭
          diskDriver: disk_driver,
          appName: title,
          echat,
          meiqia,
          priceSetting,
          appLogo: appSettingInfo?.logo,

          // entryStoreByStoreCode: enterStoreRule?.distributor_code,
          // entryStoreByGuideMaterial: enterStoreRule?.shop_assistant,
          // enterStoreWhiteList: enterStoreRule?.shop_white,
          // entryStoreByGuide: enterStoreRule?.shop_assistant_pro,

          entryStoreRules: entryStoreRules,
          entryStoreByLBS: enterStoreRule?.shop_lbs,
          entryDefalutStore: enterStoreRule?.radio_type,
          guidderTemplateId: enterStoreRule?.intro_page
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
  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}

export default App
