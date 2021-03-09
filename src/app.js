import Taro, { Component } from '@tarojs/taro'
import S from '@/spx'
import { Provider } from '@tarojs/redux'
import configStore from '@/store'
import useHooks from '@/hooks'
import req from '@/api/req'
import api from '@/api'
import { normalizeQuerys } from '@/utils'
import { FormIds, Tracker } from "@/service";
import Index from './pages/index'
import LBS from './utils/lbs'
// import entry from '@/utils/entry'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const { store } = configStore()

// 获取首页配置
const getHomeSetting = async () => {
  const {
    echat = {},
    meiqia = {},
    youshu = {},
    disk_driver = 'qiniu',
    whitelist_status =  false,
    nostores_status = false
  } = await api.shop.homeSetting()
  // 美洽客服配置
  Taro.setStorageSync('meiqia', meiqia)
  // 一洽客服配置
  Taro.setStorageSync('echat', echat)
  // 白名单配置、门店配置、图片存储信息、有数配置
  Taro.setStorageSync('otherSetting', {
    whitelist_status,
    nostores_status,
    disk_driver,
    nostores_status,
    youshu
  })
  if (APP_TRACK) {
    const system = Taro.getSystemInfoSync();
    if (!(system && system.environment && system.environment === "wxwork")) {
      console.log('----------------aa--------------')
      console.log(Tracker)
      Tracker.use(APP_TRACK);
    }
  }
}

useHooks()

// 获取基础配置
getHomeSetting()

class App extends Component {
  // eslint-disable-next-line react/sort-comp
  componentWillMount () {
    this.init()
  }

  config = {
    pages: [
      
      //'{"path":"pages/pointitem/list","style":{"navigationStyle":"custom"}}',
      //'pages/pointitem/list',
      'pages/index',
     
      'pages/home/landing',
      'pages/category/index',
      'pages/floorguide/index',

      'pages/item/list',
      'pages/item/espier-detail',
      'pages/item/item-params',
      'pages/item/package-list',

      'pages/cart/espier-index',
      'pages/cart/espier-checkout',

      'pages/article/index',
      'pages/recommend/list',
      'pages/member/index',
      'pages/member/item-fav',
      'pages/store/index',
      'pages/store/list',
      'pages/store/ziti-list',

      'pages/custom/custom-page'
    ],
    subpackages: [
      {
        root: 'marketing',
        pages: [
          'pages/distribution/index',
          'pages/distribution/setting',
          'pages/distribution/shop-home',
          'pages/distribution/statistics',
          'pages/distribution/trade',
          'pages/distribution/subordinate',
          'pages/distribution/withdraw',
          'pages/distribution/withdrawals-record',
          'pages/distribution/withdrawals-acount',
          'pages/distribution/goods',
          'pages/distribution/shop',
          'pages/distribution/shop-setting',
          'pages/distribution/shop-form',
          'pages/distribution/qrcode',
          'pages/distribution/shop-category',
          'pages/distribution/good-category',
          'pages/distribution/shop-goods',
          'pages/distribution/shop-trade',
          'pages/distribution/shop-achievement',
          'pages/verified-card/index',
          'pages/verified-card/verified',
          'pages/verified-card/card',
          'pages/reservation/brand-list',
          'pages/reservation/brand-detail',
          'pages/reservation/brand-result',
          'pages/reservation/reservation-list',
          'pages/reservation/goods-reservate',
          'pages/reservation/reservation-detail',

          'pages/member/item-activity',
          'pages/member/activity-detail',
          'pages/member/user-info',
          'pages/member/complaint',
          'pages/member/complaint-record',
          'pages/member/coupon',
          'pages/member/coupon-detail',
          'pages/member/address',
          'pages/member/edit-address',
          'pages/member/crm-address-list',
          'pages/member/setting',
          'pages/member/userinfo',
          'pages/member/item-history',
          'pages/member/item-guess',
          'pages/member/member-code',
          'pages/member/group-list',

          'pages/wheel/index',
          'pages/item/espier-evaluation',
          'pages/item/espier-evaluation-detail',
          'pages/item/rate',
          'pages/item/success',

          'pages/item/seckill-goods-list',
          'pages/item/seckill-list',
          'pages/item/group-detail',
          'pages/item/group-list',

          'pages/plusprice/detail-plusprice-list',
          'pages/plusprice/cart-plusprice-list',
        ],
        "plugins": {
          // "live-player-plugin": {
          //   "version": "1.2.6", // 填写该直播组件版本号
          //   "provider": "wx2b03c6e691cd7370" // 必须填该直播组件appid
          // } 
          // "meiqia": {
          //   "version": "1.1.0",
          //   "provider": "wx2d2cd5fd79396601"
          // }
        }
      },
      {
        root: 'subpage',
        pages: [
          'pages/trade/list',
          'pages/trade/customer-pickup-list',
          'pages/trade/drug-list',
          'pages/trade/detail',
          'pages/trade/after-sale-detail',
          'pages/trade/delivery-info',
          'pages/trade/split-bagpack',
          'pages/trade/rate',
          'pages/trade/cancel',
          'pages/trade/after-sale',
          'pages/trade/refund',
          'pages/trade/refund-detail',
          'pages/trade/refund-sendback',
          'pages/trade/invoice-list',
          'pages/cashier/index',
          'pages/cashier/cashier-result',
          'pages/recommend/detail',
          'pages/qrcode-buy',
          'pages/vip/vipgrades',
          'pages/auth/reg',
          'pages/auth/reg-rule',
          'pages/auth/login',
          'pages/auth/forgotpwd',
          'pages/auth/wxauth',
          'pages/auth/pclogin',
          'pages/auth/store-reg',
        ]
      },
      // 团购
      {
        root: 'groupBy',
        pages: [
          'pages/home/index',
          'pages/cart/index',
          'pages/goodDetail/index',
          'pages/payOrder/index',
          'pages/orderDetail/index',
          'pages/orderList/index',
          'pages/shareDetail/index',
          'pages/nextNotice/index',
          'pages/community/index'
        ]
      },
      // 助力
      {
        root: 'boost',
        pages: [
          'pages/home/index',
          'pages/detail/index',
          'pages/flop/index',
          'pages/pay/index',
          'pages/payDetail/index',
          'pages/order/index',
        ]
      },
      {
        root: 'others',
        pages: [
          'pages/home/license',
          'pages/home/coupon-home',
          'pages/protocol/privacy',
          // 美恰客服
          'pages/meiqia/index',
          'pages/echat/index',
          // 扫码授权登录
          'pages/auth/index',
          // 储值
          'pages/recharge/index',
          'pages/recharge/history',
          // 店铺首页
          'pages/store/list',
          'pages/store/category',
          // cart
          'pages/cart/coupon-picker',
          'pages/cart/drug-info',
          // 绑定订单
          'pages/bindOrder/index'
        ]
      },
      {
        root:'pointitem',
        pages:[
          'pages/list',
        ]
      }
    ],
    permission: {
      "scope.userLocation": {
        "desc": "您的位置信息将用于定位附近门店"
      }
    },
    navigateToMiniProgramAppIdList: [
      'wx4721629519a8f25b',
      'wx2fb97cb696f68d22',
      'wxf91925e702efe3e3'
    ],
    // plugins: {
    //   contactPlugin: {
    //     version: "1.3.0",
    //     provider: "wx104a1a20c3f81ec2"
    //   }
    // }
  }

  componentDidShow (options) {
    const { referrerInfo } = options || {}
    if (referrerInfo) {
      console.log(referrerInfo)
    }
  }

  componentDidHide () {
    FormIds.stop()
  }

  // 初始化
  init () {
    // 获取收藏列表
    if (process.env.TARO_ENV === 'weapp') {
      FormIds.startCollectingFormIds()
    }
    if (S.getAuthToken()) {
      api.member.favsList()
        .then(({ list }) => {
          if (!list) return
          store.dispatch({
            type: 'member/favs',
            payload: list
          })
        })
        .catch(e => {
          console.info(e)
        })
    }
    // H5定位
    if (APP_PLATFORM === 'standard' && Taro.getEnv() === 'WEB') {
      new LBS()
    }
    // 设置购物车默认类型
    if (Taro.getStorageSync('cartType')) {
      Taro.setStorageSync('cartType', 'normal')
    }
    // 过期时间
    const promoterExp = Taro.getStorageSync('distribution_shop_exp')
    if (Date.parse(new Date()) - promoterExp > 86400000 * 3) {
      Taro.setStorageSync('distribution_shop_id', '')
      Taro.setStorageSync('distribution_shop_exp', '')
    }
    // 根据路由参数
    const { query } = this.$router.params
    if (query && query.scene) {
      const { smid , dtid, id, aid, cid,type  } = normalizeQuerys(query)
      if (smid) {
        Taro.setStorageSync('s_smid', smid)
      }
      if (dtid) {
        Taro.setStorageSync('s_dtid', dtid)
      }
      // 如果id、aid、cid同时存在则为团购分享详情
      if (id && aid && cid) {
        Taro.redirectTo({
          url: `/groupBy/pages/shareDetail/index?aid=${aid}&itemId=${id}&cid=${cid}`
        })
      }
    }
    // 初始化tabbar
    this.fetchTabs()
    // 获取主题配色
    this.fetchColors()
  }

  fetchTabs () {
    Taro.setStorageSync('initTabBar', false)
    const defaultTabs = {
      config: {
        backgroundColor: "#ffffff",
        color: "#333333",
        selectedColor: "#E33420"
      },
      data: [{
        name: "home",
        pagePath: "/pages/index",
        text: "首页"
      },{
        name: "category",
        pagePath: "/pages/category/index",
        text: "分类"
      },{
        name: "cart",
        pagePath: "/pages/cart/espier-index",
        text: "购物车"
      },{
        name: "member",
        pagePath: "/pages/member/index",
        text: "我"
      }],
      name: "tabs"
    }
    const setUrl = '/pagestemplate/setInfo'
    req.get(setUrl).then(({
      tab_bar,
      is_open_recommend,
      is_open_scan_qrcode,
      is_open_wechatapp_location,
      is_open_official_account
    }) => {
      store.dispatch({
        type: 'tabBar',
        payload: tab_bar ? JSON.parse(tab_bar) : defaultTabs
      })
      Taro.setStorageSync('initTabBar', true)
      Taro.setStorageSync('settingInfo', {
        is_open_recommend,
        is_open_scan_qrcode,
        is_open_wechatapp_location,
        is_open_official_account
      })
    })
  }

  fetchColors () {
    const url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=color_style'
    const defaultColors = {
      data: [
        {
          primary: '#d42f29',
          accent: '#fba629',
          marketing: '#2e3030'
        }
      ],
      name: 'base'
    }
    req.get(url).then(info => {
      store.dispatch({
        type: 'colors',
        payload: info.list.length ? info.list[0].params : defaultColors
      })
    })

  }


  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
