import Taro, { Component } from '@tarojs/taro'
import S from '@/spx'
import { Provider } from '@tarojs/redux'
import configStore from '@/store'
import req from '@/api/req'
import api from '@/api'
import { normalizeQuerys, isGoodsShelves, payTypeField } from '@/utils'
import { FormIds, Tracker } from '@/service'
import entryLaunch from '@/utils/entryLaunch'
import { youshuLogin } from '@/utils/youshu'
import { DEFAULT_TABS, DEFAULT_THEME } from '@/consts'
import qs from 'qs'
import Index from './pages/index' 

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const { store } = configStore()

// 三天时间戳
const treeDay = 86400000 * 3
// 获取首页配置
const getHomeSetting = async () => {
  const {
    echat = {},
    meiqia = {},
    youshu = {},
    disk_driver = 'qiniu',
    whitelist_status = false,
    nostores_status = false,
    distributor_param_status = false
  } = await api.shop.homeSetting()

  console.log('getHomeSetting1', echat)

  // 美洽客服配置
  Taro.setStorageSync('meiqia', meiqia)
  // 一洽客服配置
  Taro.setStorageSync('echat', echat)
  // 白名单配置、门店配置、图片存储信息、有数配置
  Taro.setStorageSync('otherSetting', {
    whitelist_status,
    nostores_status,
    openStore: !nostores_status,
    disk_driver,
    youshu
  })
  // 分享时是否携带参数
  Taro.setStorageSync('distributor_param_status', distributor_param_status)
}

// 获取基础配置
getHomeSetting()

class App extends Component {
  // eslint-disable-next-line react/sort-comp
  componentWillMount() {
    console.log('componentWillMount', process.env.APP_TRACK)
    if (process.env.APP_TRACK && process.env.TARO_ENV == 'weapp') {
      const system = Taro.getSystemInfoSync()
      if (!(system && system.environment && system.environment === 'wxwork')) {
        console.log('Tracker', Tracker.use)
        Tracker.use(process.env.APP_TRACK)
        youshuLogin()
      }
    }
    // 获取收藏列表
    if (process.env.TARO_ENV === 'weapp') {
      FormIds.startCollectingFormIds()
      try {
        const {
          model,
          system,
          windowWidth,
          windowHeight,
          screenHeight,
          screenWidth,
          pixelRatio,
          brand
        } = Taro.getSystemInfoSync()
        const { networkType } = Taro.getNetworkType()

        let px = screenWidth / 750 //rpx换算px iphone5：1rpx=0.42px

        Taro.$systemSize = {
          windowWidth,
          windowHeight,
          screenHeight,
          screenWidth,
          model,
          px,
          pixelRatio,
          brand,
          system,
          networkType
        }

        if (system.indexOf('iOS') !== -1) {
          Taro.$system = 'iOS'
        }

        S.set('ipxClass', model.toLowerCase().indexOf('iphone x') >= 0 ? 'is-ipx' : '')
      } catch (e) {
        console.log(e)
      }
    }
    if (S.getAuthToken() && !isGoodsShelves()) {
      api.member
        .favsList()
        .then(({ list }) => {
          if (!list) return
          store.dispatch({
            type: 'member/favs',
            payload: list
          })
        })
        .catch((e) => {
          console.info(e)
        })
    }
    // H5定位
    if (process.env.APP_PLATFORM === 'standard' && Taro.getEnv() === 'WEB') {
      // new LBS();
    }
    // 设置购物车默认类型
    if (Taro.getStorageSync('cartType')) {
      Taro.setStorageSync('cartType', 'normal')
    }
  }
  componentDidMount() {
    this.init()
  }

  system = Taro.getSystemInfoSync()

  config = {
    pages: [
      //'{"path":"pages/pointitem/list","style":{"navigationStyle":"custom"}}',

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

      'pages/custom/custom-page',
      'pages/liveroom/index'
    ],
    subPackages: [
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

          'pages/distribution/point-platform',

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
          'pages/member/member-setting',
          'pages/member/destroy-member',

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
          'pages/member/qrcode'
        ],
        plugins: {
          // "live-player-plugin": {
          //   "version": "1.2.10", // 填写该直播组件版本号
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
          'pages/recommend/detail',
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
          'pages/qrcode-buy',
          'pages/vip/vipgrades',
          'pages/auth/reg',
          'pages/auth/reg-rule',
          'pages/auth/login',
          'pages/auth/forgotpwd',
          'pages/auth/wxauth',
          'pages/auth/pclogin',
          'pages/auth/store-reg',
          // 编辑分享
          'pages/editShare/index',
          'pages/auth/bindPhone'
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
          'pages/order/index'
        ]
      },
      // 导购货架 guide
      {
        root: 'guide',
        pages: [
          'index',
          'category/index',
          'item/list',
          'item/espier-detail',
          'item/item-params',
          'item/package-list',
          'cart/espier-index',
          'cart/espier-checkout',
          'coupon-home/index',
          'coupon-home/coupon-detail',
          'recommend/list',
          'recommend/detail',
          'custom/custom-page'
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
          'pages/bindOrder/index',
          // 过期优惠券
          'pages/nullify/coupon-nullify'
        ]
      },
      {
        root: 'pointitem',
        pages: ['pages/list']
      }
    ],
    permission: {
      'scope.userLocation': {
        desc: '您的位置信息将用于定位附近门店'
      }
    }
    // plugins: {
    //   contactPlugin: {
    //     version: "1.3.0",
    //     provider: "wx104a1a20c3f81ec2"
    //   }
    // }
  }

  componentDidShow(options) {
    const { referrerInfo } = options || {}
    if (referrerInfo) {
      console.log(referrerInfo)
    }
  }

  componentDidHide() {
    FormIds.stop()
  }

  // 初始化
  async init() {
    // 过期时间
    const promoterExp = Taro.getStorageSync('distribution_shop_exp')
    if (Date.parse(new Date()) - promoterExp > treeDay) {
      Taro.setStorageSync('distribution_shop_id', '')
      Taro.setStorageSync('distribution_shop_exp', '')
    }

    // 导购数据过期时间
    const guideExp = Taro.getStorageSync('guideExp')
    if (!guideExp || Date.parse(new Date()) - guideExp > treeDay) {
      Taro.setStorageSync('s_smid', '')
      Taro.setStorageSync('chatId', '')
      Taro.setStorageSync('s_dtid', '')
      Taro.setStorageSync('store_bn', '')
    }
    // 欢迎语导购过期时间
    const guUserIdExp = Taro.getStorageSync('guUserIdExp')
    if (!guUserIdExp || Date.parse(new Date()) - guUserIdExp > treeDay) {
      Taro.setStorageSync('work_userid', '')
    }

    // 根据路由参数
    const { query = {} } = this.$router.params
    // 初始化清楚s_smid
    Taro.setStorageSync('s_smid', '')
    Taro.setStorageSync('s_dtid', '')
    Taro.setStorageSync('gu_user_id', '')

    console.log('query', query)

    if ((query && query.scene) || query.gu_user_id || query.smid) {
      const { smid, dtid, id, aid, cid, gu, chatId, gu_user_id = '' } = await normalizeQuerys(query)
      // 旧导购存放
      if (smid) {
        Taro.setStorageSync('s_smid', smid)
      }
      if (dtid) {
        Taro.setStorageSync('s_dtid', dtid)
      }
      // 新导购埋点数据存储导购员工工号
      if (gu) {
        const [employee_number, store_bn] = gu.split('_')
        Taro.setStorageSync('work_userid', employee_number)
        Taro.setStorageSync('store_bn', store_bn)
      }
      // 欢迎语小程序卡片分享参数处理
      if (gu_user_id) {
        Taro.setStorageSync('work_userid', gu_user_id)
        Taro.setStorageSync('gu_user_id', gu_user_id)
        // 如果是登录状态下打开分享且携带导购ID
        if (S.getAuthToken()) {
          api.user.bindSaleperson({
            work_userid: gu_user_id
          })
        }
      }
    }
    //   if ( Taro.getStorageSync( "work_userid" ) && S.getAuthToken() ) {
    //     // uv 埋点
    //     api.user.uniquevisito({
    //       work_userid: Taro.getStorageSync("work_userid")
    //     });
    //   }
    //   // 存储群id
    //   if (chatId) {
    //     Taro.setStorageSync("chatId", chatId);
    //   }
    //   // 设置保存时间
    //   if (chatId || smid || gu) {
    //     Taro.setStorageSync("guideExp", Date.parse(new Date()));
    //   }
    //   if (gu_user_id) {
    //     Taro.setStorageSync("guUserIdExp", Date.parse(new Date()));
    //   }
    //   // 如果id、aid、cid同时存在则为团购分享详情
    //   if (id && aid && cid) {
    //     Taro.redirectTo({
    //       url: `/groupBy/pages/shareDetail/index?aid=${aid}&itemId=${id}&cid=${cid}`
    //     });
    //   }
    // }
    // 初始化系统配置
    this.getSystemConfig()
    // // 初始化tabbar
    // this.fetchTabs();
    // // 获取主题配色
    // this.fetchColors();
  }

  async getSystemConfig() {
    const appConfig = await api.shop.getAppConfig()
    const {
      tab_bar,
      is_open_recommend,
      is_open_scan_qrcode,
      is_open_wechatapp_location,
      is_open_official_account
    } = appConfig
    Taro.setStorageSync('settingInfo', {
      is_open_recommend, // 猜你喜欢
      is_open_scan_qrcode, // 扫码
      is_open_wechatapp_location, // 定位
      is_open_official_account // 公众号组件
    })

    const [colorConfig, pointConfig] = await Promise.all([
      api.shop.getPageParamsConfig({
        page_name: 'color_style'
      }),
      api.pointitem.getPointSetting()
    ])

    let tabbar = null
    try {
      tabbar = JSON.parse(tab_bar)
    } catch (error) {
      console.log(error)
    }
    store.dispatch({
      type: 'tabBar',
      payload: tabbar || DEFAULT_TABS
    })

    const { colorPrimary, colorMarketing, colorAccent } = DEFAULT_THEME
    const defaultColors = {
      data: [
        {
          primary: colorPrimary,
          accent: colorMarketing,
          marketing: colorAccent
        }
      ],
      name: 'base'
    }
    const themeColor = colorConfig.list.length ? colorConfig.list[0].params : defaultColors
    // 兼容老的主题
    store.dispatch({
      type: 'colors',
      payload: themeColor
    })

    // S.set("SYSTEM_THEME", {
    //   colorPrimary: themeColor.data[0].primary,
    //   colorMarketing: themeColor.data[0].marketing,
    //   colorAccent: themeColor.data[0].accent
    // } );

    store.dispatch({
      type: 'system/config',
      payload: {
        colorPrimary: themeColor.data[0].primary,
        colorMarketing: themeColor.data[0].marketing,
        colorAccent: themeColor.data[0].accent,
        pointName: pointConfig.name
      }
    })
  }

  // async fetchTabs() {
  //   Taro.setStorageSync("initTabBar", false);
  //   const {
  //     tab_bar,
  //     is_open_recommend,
  //     is_open_scan_qrcode,
  //     is_open_wechatapp_location,
  //     is_open_official_account
  //   } = await api.shop.getAppConfig()

  //   let tabbar = null
  //   try {
  //     tabbar = JSON.parse(tab_bar)
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   store.dispatch({
  //     type: "tabBar",
  //     payload: tabbar || DEFAULT_TABS
  //   } );

  //   Taro.setStorageSync("initTabBar", true);
  //   Taro.setStorageSync("settingInfo", {
  //     is_open_recommend,  // 猜你喜欢
  //     is_open_scan_qrcode,  // 扫码
  //     is_open_wechatapp_location, // 定位
  //     is_open_official_account  // 公众号组件
  //   });
  // }

  // async fetchColors() {
  //   const defaultColors = {
  //     data: [
  //       {
  //         primary: "#d42f29",
  //         accent: "#fba629",
  //         marketing: "#2e3030"
  //       }
  //     ],
  //     name: "base"
  //   };
  //   const info = await api.shop.getPageParamsConfig({
  //     page_name: "color_style"
  //   });
  //   const themeColor = info.list.length ? info.list[0].params : defaultColors;
  //   // 兼容老的主题
  //   store.dispatch({
  //     type: "colors",
  //     payload: themeColor
  //   });
  //   S.set("SYSTEM_THEME", {
  //     colorPrimary: themeColor.data[0].primary,
  //     colorMarketing: themeColor.data[0].marketing,
  //     colorAccent: themeColor.data[0].accent
  //   });
  // }

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
