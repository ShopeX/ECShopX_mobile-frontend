export default {
  pages: [
    //'{"path":"pages/pointitem/list","style":{"navigationStyle":"custom"}}',

    'pages/index',
    // 'pages/home/landing',
    // 'pages/category/index',
    // 'pages/floorguide/index',

    // 'pages/item/list',
    // 'pages/item/espier-detail',
    // 'pages/item/item-params',
    // 'pages/item/package-list',

    // 'pages/cart/espier-index',
    // 'pages/cart/espier-checkout',

    // 'pages/article/index',
    // 'pages/recommend/list',
    // 'pages/member/index',
    // 'pages/member/item-fav',

    // 'pages/custom/custom-page',
    // 'pages/liveroom/index'
  ],
  subPackages: [
    {
      root: 'subpages/member',
      pages: [
        'index'
      ]
    }
  //   {
  //     root: 'pages/store/',
  //     pages: ['index', 'list', 'ziti-list']
  //   },
  //   {
  //     root: 'marketing',
  //     pages: [
  //       'pages/distribution/index',
  //       'pages/distribution/setting',
  //       'pages/distribution/shop-home',
  //       'pages/distribution/statistics',
  //       'pages/distribution/trade',
  //       'pages/distribution/subordinate',
  //       'pages/distribution/withdraw',
  //       'pages/distribution/withdrawals-record',
  //       'pages/distribution/withdrawals-acount',
  //       'pages/distribution/goods',
  //       'pages/distribution/shop',
  //       'pages/distribution/shop-setting',
  //       'pages/distribution/shop-form',
  //       'pages/distribution/qrcode',
  //       'pages/distribution/shop-category',
  //       'pages/distribution/good-category',
  //       'pages/distribution/shop-goods',
  //       'pages/distribution/shop-trade',
  //       'pages/distribution/shop-achievement',

  //       'pages/distribution/point-platform',

  //       'pages/verified-card/index',
  //       'pages/verified-card/verified',
  //       'pages/verified-card/card',
  //       'pages/reservation/brand-list',
  //       'pages/reservation/brand-detail',
  //       'pages/reservation/brand-result',
  //       'pages/reservation/reservation-list',
  //       'pages/reservation/goods-reservate',
  //       'pages/reservation/reservation-detail',

  //       'pages/member/item-activity',
  //       'pages/member/activity-detail',
  //       'pages/member/user-info',
  //       'pages/member/complaint',
  //       'pages/member/complaint-record',
  //       'pages/member/coupon',
  //       'pages/member/coupon-detail',
  //       'pages/member/address',
  //       'pages/member/edit-address',
  //       'pages/member/crm-address-list',
  //       'pages/member/setting',
  //       'pages/member/userinfo',
  //       'pages/member/item-history',
  //       'pages/member/item-guess',
  //       'pages/member/member-code',
  //       'pages/member/group-list',
  //       'pages/member/member-setting',
  //       'pages/member/destroy-member',

  //       'pages/wheel/index',
  //       'pages/item/espier-evaluation',
  //       'pages/item/espier-evaluation-detail',
  //       'pages/item/rate',
  //       'pages/item/success',

  //       'pages/item/seckill-goods-list',
  //       'pages/item/seckill-list',
  //       'pages/item/group-detail',
  //       'pages/item/group-list',

  //       'pages/plusprice/detail-plusprice-list',
  //       'pages/plusprice/cart-plusprice-list',
  //       'pages/member/qrcode'
  //     ],
  //     plugins: {
  //       // "live-player-plugin": {
  //       //   "version": "1.3.0", // 填写该直播组件版本号
  //       //   "provider": "wx2b03c6e691cd7370" // 必须填该直播组件appid
  //       // }
  //       // "meiqia": {
  //       //   "version": "1.1.0",
  //       //   "provider": "wx2d2cd5fd79396601"
  //       // }
  //     }
  //   },
  //   {
  //     root: 'subpage',
  //     pages: [
  //       'pages/recommend/detail',
  //       'pages/trade/list',
  //       'pages/trade/customer-pickup-list',
  //       'pages/trade/drug-list',
  //       'pages/trade/detail',
  //       'pages/trade/after-sale-detail',
  //       'pages/trade/delivery-info',
  //       'pages/trade/split-bagpack',
  //       'pages/trade/rate',
  //       'pages/trade/cancel',
  //       'pages/trade/after-sale',
  //       'pages/trade/refund',
  //       'pages/trade/refund-detail',
  //       'pages/trade/refund-sendback',
  //       'pages/trade/invoice-list',
  //       'pages/cashier/index',
  //       'pages/cashier/cashier-result',
  //       'pages/qrcode-buy',
  //       'pages/vip/vipgrades',
  //       'pages/auth/reg',
  //       'pages/auth/reg-rule',
  //       'pages/auth/login',
  //       'pages/auth/forgotpwd',
  //       'pages/auth/wxauth',
  //       'pages/auth/pclogin',
  //       'pages/auth/store-reg',
  //       // 编辑分享
  //       'pages/editShare/index',
  //       'pages/auth/bindPhone'
  //     ]
  //   },
  //   // 团购
  //   {
  //     root: 'groupBy',
  //     pages: [
  //       'pages/home/index',
  //       'pages/cart/index',
  //       'pages/goodDetail/index',
  //       'pages/payOrder/index',
  //       'pages/orderDetail/index',
  //       'pages/orderList/index',
  //       'pages/shareDetail/index',
  //       'pages/nextNotice/index',
  //       'pages/community/index'
  //     ]
  //   },
  //   // 助力
  //   {
  //     root: 'boost',
  //     pages: [
  //       'pages/home/index',
  //       'pages/detail/index',
  //       'pages/flop/index',
  //       'pages/pay/index',
  //       'pages/payDetail/index',
  //       'pages/order/index'
  //     ]
  //   },
  //   // 导购货架 guide
  //   {
  //     root: 'guide',
  //     pages: [
  //       'index',
  //       'category/index',
  //       'item/list',
  //       'item/espier-detail',
  //       'item/item-params',
  //       'item/package-list',
  //       'cart/espier-index',
  //       'cart/espier-checkout',
  //       'coupon-home/index',
  //       'coupon-home/coupon-detail',
  //       'recommend/list',
  //       'recommend/detail',
  //       'custom/custom-page'
  //     ]
  //   },

  //   {
  //     root: 'others',
  //     pages: [
  //       'pages/home/license',
  //       'pages/home/coupon-home',
  //       'pages/protocol/privacy',
  //       // 美恰客服
  //       'pages/meiqia/index',
  //       'pages/echat/index',
  //       // 扫码授权登录
  //       'pages/auth/index',
  //       // 储值
  //       'pages/recharge/index',
  //       'pages/recharge/history',
  //       // 店铺首页
  //       'pages/store/list',
  //       'pages/store/category',
  //       // cart
  //       'pages/cart/coupon-picker',
  //       'pages/cart/drug-info',
  //       // 绑定订单
  //       'pages/bindOrder/index',
  //       // 过期优惠券
  //       'pages/nullify/coupon-nullify'
  //     ]
  //   },
  //   {
  //     root: 'pointitem',
  //     pages: ['pages/list']
  //   }
  ],
  permission: {
    'scope.userLocation': {
      "desc": '您的位置信息将用于定位附近门店'
    }
  }
  // plugins: {
  //   contactPlugin: {
  //     version: "1.3.0",
  //     provider: "wx104a1a20c3f81ec2"
  //   }
  // }
};