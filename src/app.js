import React, { Component, useEffect } from 'react'
import langObj from '@/lang/index.js' // 📍 必须在入口文件中第一行引入，文件会在运行插件时自动生成，默认位于打包配置目录同层的lang文件夹中，其中的index.js就是配置文件
import Taro, {
  getCurrentInstance,
  getCurrentPages,
  useDidShow,
  useLaunch,
  useReady,
  useRouter,
  useError
} from '@tarojs/taro'

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
  SG_MEIQIA,
  SG_YIQIA,
  SG_ROUTER_PARAMS,
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
  VERSION_STANDARD
} from '@/utils'
import { useEffectAsync } from '@/hooks'
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

function App({ children }) {
  useEffectAsync(async (options) => {
    console.log('useEffect %%%%%%%%%%%%%', options)
    if (isWeixin) {
      checkAppVersion()
    }

    // 导购参数缓存处理
    const guideUpdateTime = Taro.getStorageSync(SG_GUIDE_PARAMS_UPDATETIME) || 0
    if (guideUpdateTime != 0) {
      const diffMilliseconds = dayjs().diff(dayjs(guideUpdateTime))
      // 参数保存超过3天，清除导购参数
      if (diffMilliseconds > 3 * 86400000) {
        Taro.removeStorageSync(SG_GUIDE_PARAMS)
        Taro.removeStorageSync(SG_GUIDE_PARAMS_UPDATETIME)
      }
    }

    const { show_time } = await api.promotion.getScreenAd()
    let showAdv
    if (show_time === 'always') {
      showAdv = false
      store.dispatch({
        type: 'user/closeAdv',
        payload: showAdv
      })
    }
  }, [])

  useLaunch((options) => {
    console.log('useLaunch ***********', options)

    //分包异步加载语言包
    if (isWeixin) {
      __non_webpack_require__ &&
        __non_webpack_require__('subpages/i18n/index', (res) => {
          const langJSON = Taro['langJSON']
          console.log('langJSON--------', langJSON)
          langObj.setLanguagePackage(langJSON)
        })
    } else {
      import('@/subpages/i18n/index').then((res) => {
        const langJSON = Taro['langJSON']
        console.log('langJSON--------', langJSON, langObj.setLanguagePackage)
        langObj.setLanguagePackage(langJSON)
      })
    }
  })

  useDidShow(async (options) => {
    console.log('useDidShow &&&&&&&&&&&&', options)
    entryLaunch.getRouteParams(isWeb ? { query: options } : options).then((params) => {
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

        getSystemConfig()
      }
    })
  })

  useError((error) => {
    log.error('useError', error)
  })

  const getSystemConfig = async () => {
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

    let enterStoreRule = null
    if (VERSION_STANDARD) {
      enterStoreRule = await api.shop.getStoreEnterRule()
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

          entryStoreByStoreCode: enterStoreRule?.distributor_code,
          entryStoreByGuideMaterial: enterStoreRule?.shop_assistant,
          enterStoreWhiteList: enterStoreRule?.shop_white,
          entryStoreByGuide: enterStoreRule?.shop_assistant_pro,
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

  return <Provider store={store}>{children}</Provider>
}

export default App
