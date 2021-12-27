export default {
  pages: [
    "pages/index",

    "pages/store/index",

    "pages/category/index",
    'pages/home/landing',

    'pages/floorguide/index',

    "pages/item/list",
    "pages/item/espier-detail",
    'pages/item/item-params',
    'pages/item/package-list',

    "pages/cart/espier-index",
    "pages/cart/espier-checkout",

    'pages/article/index',
    'pages/recommend/list',
    'pages/member/item-fav',

    'pages/custom/custom-page',
    'pages/liveroom/index'
  ],
  subPackages: [
    {
      root: "subpages/ecshopx",
      pages: ["nearly-shop", "shop-list"],
    },
    {
      root: "subpages/member",
      pages: ["index"],
    },
    // {
    //   root: "subpages/auth",
    //   pages: ["login"],
    // },
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
        'pages/item/rate', //订单评价
        'pages/item/success',//评价结果

        'pages/item/seckill-goods-list',//秒杀商品列表
        'pages/item/seckill-list',//秒杀列表
        'pages/item/group-detail',//限时团购详情
        'pages/item/group-list',//限时团购列表

        'pages/plusprice/detail-plusprice-list',//商品进入换购详情页面
        'pages/plusprice/cart-plusprice-list',//购物车进入换购详情页面
        'pages/member/qrcode'
      ],
    },
    {
      root: 'subpage',
      pages: [
        'pages/recommend/detail',//软文详情页面
        'pages/trade/list',//我的订单列表页面
        'pages/trade/customer-pickup-list',//我的自提订单列表
        'pages/trade/drug-list',//处方药订单列表
        'pages/trade/detail',//订单详情页面
        'pages/trade/after-sale-detail',//售后详情页面
        'pages/trade/delivery-info',//整单物流详情页面
        'pages/trade/split-bagpack',//分单物流详情页面Ω
        'pages/trade/rate',//订单评价页面
        'pages/trade/cancel',//取消订单页面
        'pages/trade/after-sale',//售后订单列表
        'pages/trade/refund',//售后申请提交页面
        'pages/trade/refund-detail',//售后申请提交结果页面
        'pages/trade/refund-sendback',//售后填写物流公司页面
        'pages/trade/invoice-list',//发票管理
        'pages/cashier/index',//收银台页面
        'pages/cashier/cashier-result',//支付结果页面
        'pages/qrcode-buy',//二维码购买页
        'pages/vip/vipgrades',//会员购买页面
        'pages/auth/reg',//新用户注册页面
        'pages/auth/reg-rule',//注册协议&充值协议页面
        'pages/auth/login',//登录页面
        'pages/auth/forgotpwd',//找回密码页面
        'pages/auth/wxauth',//微信授权页面
        'pages/auth/pclogin',//pc登录页面
        'pages/auth/store-reg',//申请店铺入驻页面
        // 编辑分享
        'pages/editShare/index',
        'pages/auth/bindPhone'
      ]
    },
  //   // 助力
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
    "scope.userLocation": {
      desc: "您的位置信息将用于定位附近门店",
    },
  }
};