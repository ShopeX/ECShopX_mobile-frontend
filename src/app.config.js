export default {
  pages: [
    'pages/index', // 首页
    'pages/webview', // webview
    'pages/category/index', // 分类
    'pages/cart/espier-index', // 购物车页面
    'pages/cart/espier-checkout', // 结算页面
    'pages/cart/cashier-result', // 支付结果页面

    'pages/home/landing', // 跳转等待页面
    'pages/floorguide/index', // 楼层引导页面

    'pages/item/list', // 商品列表页面
    'pages/item/espier-detail', // 商品详情页面

    'pages/article/index', // 文章页面
    'pages/recommend/list', // 推荐软文列表
    'pages/member/item-fav', // 收藏页面

    'pages/custom/custom-page', // 自定义页面
    'pages/chat/index', // 客服
    'pages/liveroom/index', // 直播间页面

    // 'pages/store/index', // 店铺首页
    // 'pages/store/brand-info', // 店铺品牌
    // 'pages/store/item-list', // 店铺商品列表
    // 'pages/store/category', // 店铺商品分类
    // 'pages/store/list', // 选择店铺列表
    // 'pages/store/ziti-list' // 自提列表
  ],
  subPackages: [
    // 导购货架 guide
    {
      root: 'subpages/guide',
      pages: [
        'index', // 货架首页
        'category/index', // 分类页面
        'item/list', // 商品列表
        'item/espier-detail', // 商品详情
        'cart/espier-index', // 购物车
        'cart/espier-checkout', // 下单结算
        'coupon-home/index', // 优惠券
        'recommend/list', // 种草
        'recommend/detail', // 种草详情
        'custom/custom-page' // 自定义页面
      ]
    },
    // 门店
    {
      root: 'subpages/store',
      pages: [
        'index', // 店铺首页
        'brand-info', // 店铺品牌
        'item-list', // 店铺商品列表
        'category', // 店铺商品分类
        'list', // 选择店铺列表
        'ziti-list' // 自提列表
      ]
    },
    {
      root: 'subpages/ecshopx',
      pages: [
        'nearly-shop', // 店铺选择
        'shop-list' // 商家列表
      ]
    },
    {
      root: 'subpages/member',
      pages: [
        'index', // 会员中心
        'point-detail', // 积分明细
        'point-rule', // 积分规则
        'member-level' // 会员等级
      ]
    },
    {
      root: 'subpages/marketing',
      pages: [
        'package-list', // 组合优惠
        'certification' // 实名认证
      ]
    },
    {
      root: 'subpages/dianwu',
      pages: [
        'index' // 店务端
      ]
    },
    {
      root: 'subpages/community',
      pages: [
        'index', // 社区团购个人中心
        'group', // 一键开团
        'itemlist', // 商品选品
        'picker-community', // 选择社区
        'community-edit', // 添加社区
        'order', // 团员订单列表页
        'order-refund', // 订单退款页
        'espier-checkout', //结算页
        'wait-pay', //待支付订单
        'group-leaderdetail', // 社区团详情页（团长）
        'group-memberdetail', // 社区团详情页（团员）
        'order-manage', // 团长订单列表页
        'activity', // 我的活动
        'trade/refund', // 团购-售后申请提交页面
        'trade/refund-detail', // 团购-售后申请提交结果页面
        'trade/refund-sendback', // 团购-售后填写物流公司页面
        'trade/split-bagpack', // 团购-分单物流详情页面Ω
        'trade/delivery-info', // 团购-整单物流详情页面
        'trade/cancel', // 团购-取消订单页面,
        'trade/after-sale-detail', // 团购-售后详情页面
        'boxlist', // 箱数列表
        'list', // 商品列表
        'espier-detail', // 商品详情
        'apply-chief', // 申请团长
        'chief-licence' // 团长注册协议
      ]
    },
    {
      root: 'marketing',
      pages: [
        'pages/distribution/index', // 推广管理首页
        'pages/distribution/setting', // 推广管理会员资料
        'pages/distribution/shop-home', // 小店首页
        'pages/distribution/statistics', // 推广费详情页面
        'pages/distribution/trade', // 推广订单列表
        'pages/distribution/subordinate', // 我的会员列表
        'pages/distribution/withdraw', // 提现页面
        'pages/distribution/withdrawals-record', // 提现记录
        'pages/distribution/withdrawals-acount', // 提现绑定账户
        'pages/distribution/goods', // 推广商品列表
        'pages/distribution/shop', // 我的小店概览页面
        'pages/distribution/shop-setting', // 小店设置页面
        'pages/distribution/shop-form', // 小店设置编辑页面
        'pages/distribution/qrcode', // 小店二维码
        'pages/distribution/shop-category', // 小店商品分类
        'pages/distribution/good-category', // 推广商品分类页面
        'pages/distribution/shop-goods', // 小店商品页面
        'pages/distribution/shop-trade', // 小店订单页面
        'pages/distribution/shop-achievement', // 小店业绩页面

        'pages/distribution/point-platform',

        'pages/verified-card/index', // 实名认证以及绑定银行卡页面
        'pages/verified-card/verified', // 实名认证页面
        'pages/verified-card/card', // 绑定银行卡页面
        'pages/reservation/brand-list', // 预约列表
        'pages/reservation/brand-detail', // 预约详情
        'pages/reservation/brand-result', // 预约结果
        'pages/reservation/reservation-list', // 预约（代码逻辑显示）
        'pages/reservation/goods-reservate', // 预约报名
        'pages/reservation/reservation-detail', // 预约详情

        'pages/member/item-activity', // 活动列表
        'pages/member/activity-detail', // 活动详情
        'pages/member/user-info', // 用户注册
        'pages/member/complaint', // 投诉导购
        'pages/member/complaint-record', // 投诉导购记录
        'pages/member/coupon', // 我的优惠券列表
        'pages/member/coupon-detail', // 我的优惠券详情
        'pages/member/address', // 我的地址
        'pages/member/edit-address', // 编辑地址
        'pages/member/crm-address-list', // 收货地址
        'pages/member/setting', // 设置页面
        'pages/member/userinfo', // 用户信息
        'pages/member/item-history', // 浏览记录
        'pages/member/item-guess', // 猜你喜欢页面
        'pages/member/member-code', // 用户二维码
        'pages/member/group-list', // 我的拼团
        'pages/member/member-setting', // 会员中心设置
        'pages/member/destroy-member', // 会员注销页面

        'pages/wheel/index', // 大转盘
        'pages/item/espier-evaluation', // 商品评论列表
        'pages/item/espier-evaluation-detail', // 商品评论详情
        'pages/item/rate', //订单评价
        'pages/item/success', //评价结果

        'pages/item/seckill-goods-list', //秒杀商品列表
        'pages/item/seckill-list', //秒杀列表
        'pages/item/group-detail', //限时团购详情
        'pages/item/group-list', //限时团购列表

        'pages/plusprice/detail-plusprice-list', //商品进入换购详情页面
        'pages/plusprice/cart-plusprice-list', //购物车进入换购详情页面
        'pages/member/qrcode',
        'pages/member/purchase' //员工内购
      ]
    },
    {
      root: 'subpage',
      pages: [
        'pages/recommend/detail', //软文详情页面
        'pages/trade/list', //我的订单列表页面
        'pages/trade/customer-pickup-list', //我的自提订单列表
        'pages/trade/drug-list', //处方药订单列表
        'pages/trade/detail', //订单详情页面
        'pages/trade/after-sale-detail', //售后详情页面
        'pages/trade/delivery-info', //整单物流详情页面
        'pages/trade/split-bagpack', //分单物流详情页面Ω
        'pages/trade/rate', //订单评价页面
        'pages/trade/cancel', //取消订单页面
        'pages/trade/after-sale', //售后订单列表
        'pages/trade/refund', //售后申请提交页面
        'pages/trade/refund-detail', //售后申请提交结果页面
        'pages/trade/refund-sendback', //售后填写物流公司页面
        'pages/trade/invoice-list', //发票管理
        // 'pages/cashier/index', //收银台页面
        // 'pages/cashier/cashier-result', //支付结果页面
        'pages/qrcode-buy', //二维码购买页
        'pages/vip/vipgrades', //会员购买页面
        'pages/auth/pclogin', //pc登录页面
        // 编辑分享
        'pages/editShare/index'
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
    },
    // 商家入驻
    {
      root: 'subpages/merchant',
      pages: [
        'login', //登陆页面
        'apply', //申请页面
        'selector', //选择页面
        'audit', //审核页面
        'agreement' //协议页面
      ]
    },
    // 授权
    {
      root: 'subpages/auth',
      pages: [
        'reg', //注册页面
        'reg-rule', //注册协议页面
        'login', //登陆页
        'edit-password', //修改密码页面
        'bindPhone', //绑定手机页面
        'auth-loading', //授权加载页
        'forgotpwd', //找回密码页面
        'edit-phone' //修改密码页面
      ]
    }
  ],
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于定位附近门店'
    }
  },
  usingComponents: {
    'mp-html': './components/sp-html/mp-weixin/index'
  },
  window: {
    'backgroundTextStyle': 'light',
    'navigationBarBackgroundColor': '#fff',
    'navigationBarTitleText': '小程序',
    'navigationBarTextStyle': 'black'
  }
}
