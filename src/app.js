import React, { Component } from 'react'
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import S from '@/spx'
import { Provider } from 'react-redux'
import configStore from '@/store'
import api from '@/api'
// import { Tracker } from "@/service";
// import { youshuLogin } from '@/utils/youshu'
import { fetchUserFavs } from '@/store/slices/user'
import { DEFAULT_TABS, DEFAULT_THEME, SG_APP_CONFIG, SG_MEIQIA, SG_YIQIA } from '@/consts'
import { checkAppVersion, isWeixin, isNavbar } from '@/utils'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()
class App extends Component {
  componentWillMount() {
    this.getSystemConfig()
    // if ( S.getAuthToken() ) {
    //   store.dispatch(fetchUserFavs());
    // }
  }

  componentDidMount() {
    if (isWeixin) {
      checkAppVersion()
    }
  }

  componentDidShow(options) {
    if (isNavbar()) {
      document.querySelector('title').addEventListener(
        'DOMSubtreeModified',
        () => {
          const pageTitle = document.querySelector('title').innerHTML
          console.log('document title:', pageTitle)
          store.dispatch({
            type: 'sys/updatePageTitle',
            payload: {
              pageTitle
            }
          })
        },
        false
      )
    }

    const deviceInfo = Taro.getSystemInfoSync()
    console.log('deviceInfo:', deviceInfo)
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
      color_style: { primary, accent, marketing }
    } = await api.shop.getAppBaseInfo()

    // // 美洽客服配置
    // Taro.setStorageSync(SG_MEIQIA, meiqia);
    // // 一洽客服配置
    // Taro.setStorageSync(SG_YIQIA, echat);
    // 白名单配置、门店配置、图片存储信息
    // Taro.setStorageSync(SG_APP_CONFIG, {
    // whitelist_status,
    // nostores_status,
    // openStore: !nostores_status,
    // disk_driver
    // })
    // 分享时是否携带参数
    Taro.setStorageSync('distributor_param_status', distributor_param_status)

    // Taro.setStorageSync(SG_APP_CONFIG, {
    //   openRecommend, // 猜你喜欢
    //   openScanQrcode, // 扫码
    //   openLocation, // 定位
    //   openOfficialAccount // 公众号组件
    // } );

    try {
      const tabBar = JSON.parse(tab_bar)
      store.dispatch({
        type: 'sys/setSysConfig',
        payload: {
          colorPrimary: primary,
          colorMarketing: marketing,
          colorAccent: accent,
          pointName: point_rule_name,
          tabbar: tabBar,
          openRecommend, // 猜你喜欢
          openScanQrcode, // 扫码
          openLocation, // 定位
          openOfficialAccount, // 公众号组件
          diskDriver: disk_driver,
          echat,
          meiqia
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

  componentDidCatchError() {}

  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}

export default App
