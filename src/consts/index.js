export const STATUS_TYPES_MAP = {
  NOTPAY: 'WAIT_BUYER_PAY',
  PAYED: 'WAIT_SELLER_SEND_GOODS',
  WAIT_BUYER_CONFIRM: 'WAIT_BUYER_CONFIRM_GOODS',
  DONE: 'TRADE_SUCCESS',
  CANCEL: 'TRADE_CLOSED'
}

export const AFTER_SALE_STATUS = {
  '0': '待处理',
  '1': '处理中',
  '2': '已处理',
  '3': '已驳回',
  '4': '已关闭'
}

export const REFUND_STATUS = {
  '0': '等待商家审核',
  '1': '商家接受申请，等回寄',
  '2': '消费者回寄，等待商家收货确认',
  '3': '申请已驳回',
  '4': '商家已发货',
  '5': '退款驳回',
  '6': '退款成功',
  '7': '售后关闭'
}

export const PROMOTION_TAG = {
  single_group: '团购',
  full_minus: '满减',
  full_discount: '满折',
  full_gift: '满赠',
  normal: '秒杀',
  limited_time_sale: '限时特惠',
  plus_price_buy: '加价购',
  member_preference: '会员限购'
}

export const ACTIVITY_LIST = {
  group: '拼团',
  seckill: '秒杀',
  limited_time_sale: '限时特惠'
}

export const ACTIVITY_STATUS = {
  seckill: {
    in_the_notice: '距开始还剩',
    in_sale: '距结束还剩'
  },
  limited_time_sale: {
    in_the_notice: '距开始还剩',
    in_sale: '距结束还剩'
  },
  group: {
    nostart: '距开始还剩',
    noend: '距结束还剩'
  }
}

export const DEFAULT_POINT_NAME = '积分'

export const DEFAULT_THEME = {
  colorPrimary: '#d42f29',
  colorMarketing: '#fba629',
  colorAccent: '#2e3030'
}

export const WGTS_NAV_MAP = {
  luckdraw: '/pages/member/point-draw'
}

export const TABBAR_PATH = {
  home: '/pages/index',
  category: '/pages/category/index',
  cart: '/pages/cart/espier-index',
  member: '/subpages/member/index',
  article: '/pages/recommend/list',
  liveroom: '/pages/liveroom/index',
  allGoods: '/pages/item/list?isTabBar=true'
}

export const TABBAR_ICON = {
  home: 'shouye',
  category: 'fenlei',
  cart: 'gwche',
  member: 'huiyuan',
  article: 'zhongcao',
  liveroom: 'zhibo',
  allGoods: 'quanbushangpin'
}

export const BUY_TOOL_BTNS = {
  NOTICE: { title: '到货通知', key: 'notice', btnStatus: 'active' },
  SUBSCRIBE: { title: '已订阅到货通知', key: 'subscribe', btnStatus: 'default' },
  ADD_CART: { title: '加入购物车', key: 'addcart', btnStatus: 'default' },
  FAST_BUY: { title: '立即购买', key: 'fastbuy', btnStatus: 'active' },
  GIFT: { title: '赠品不可购买', key: 'gift', btnStatus: 'disabled' },
  ACTIVITY_WILL_START: { title: '活动即将开始', key: 'activity_will_start', btnStatus: 'disabled' },
  ACTIVITY_FAST_BUY: { title: '立即抢购', key: 'activity_fast_buy', btnStatus: 'active' },
  ACTIVITY_BUY: { title: '立即购买', key: 'activity_buy', btnStatus: 'active' },
  ACTIVITY_GROUP_BUY: { title: '我要开团', key: 'activity_group_buy', btnStatus: 'active' },
  SHARE: { title: '我要分享', key: 'share', btnStatus: 'active' },
  NO_STORE: { title: '无货', key: 'nostore', btnStatus: 'disabled' },
  ONLY_SHOW: { title: '仅展示商品', key: 'only_show', btnStatus: 'disabled' }
}

export const COUPON_TYPE = {
  gift: {
    tag: '兑换券',
    bg: 'linear-gradient(122deg, #F4C486 0%, #D4A570 100%)',
    fc: '#AC8050',
    invalidBg: 'linear-gradient(122deg, #D8D8D8 0%, #A9A9A9 100%)',
    invalidFc: '#888888',
    opacity: '0.4'
  },
  cash: {
    tag: '满减券',
    bg: 'linear-gradient(299deg, #679BDD 0%, #9AC5FF 100%)',
    fc: '#4979B7',
    invalidBg: 'linear-gradient(122deg, #D8D8D8 0%, #A9A9A9 100%)',
    invalidFc: '#888888',
    opacity: '0.4'
  },
  discount: {
    tag: '折扣券',
    bg: 'linear-gradient(126deg, #CCC0EF 0%, #7E6FA9 100%)',
    fc: '#64578D',
    invalidBg: 'linear-gradient(122deg, #D8D8D8 0%, #A9A9A9 100%)',
    invalidFc: '#888888',
    opacity: '0.4'
  }
}

export const PAYTYPE = {
  /** h5环境下 */
  WXH5: 'wxpayh5',
  ALIH5: 'alipayh5',
  /** 微信H5环境下 */
  WXH5JS: 'wxpayjs'
}

export const PAYMENT_TYPE = {
  wxpay: '微信支付',
  hfpay: '微信支付',
  alipayh5: '支付宝支付',
  wxpayh5: '微信支付',
  wxpayjs: '微信支付',
  deposit: '余额支付',
  wxpayapp: '微信支付',
  alipayapp: '支付宝支付',
  adapay: '微信支付',
  wx_lite: '微信支付',
  wx_pub: '微信支付',
  alipay: '支付宝支付',
  alipay_wap: '支付宝支付',
  alipay_qr: "支付宝支付"
}

export const TRANSFORM_PAYTYPE = {
  'wxpayh5': 'wxpayh5',
  'alipayh5': 'alipay',
  'wxpayjs': 'wxpay',
  'deposit': 'deposit',
  'wxpayapp': 'wxpay',
  'alipayapp': 'alipay',
  'adapay': 'adapay'
}

export const POINT_TYPE = {
  1: '注册送积分',
  2: '推荐送分',
  3: '充值返积分',
  4: '推广注册返积分',
  5: '积分换购',
  6: '储值兑换积分',
  7: '订单返积分',
  8: '会员等级返佣',
  9: '取消订处理积分',
  10: '售后处理积分',
  11: '大转盘抽奖送积分',
  12: '管理员手动调整积分'
}

export const FORM_COMP = {
  INPUT: 1,
  NUMBER: 2,
  DATE: 3,
  RADIO: 4,
  CHECKBOX: 5,
  MOBILE: 6,
  IMAGE: 7,
}

export const CHIEF_APPLY_STATUS = {
  WAITE: 0,
  RESLOVE: 1,
  REJECT: 2
}

export const GOODS_TYPE = {
  'normal': '普通商品',
  'gift': '赠品',
  'plus_buy': '换购',
  'package': '组合商品'
}

export * from './localstorage'

export default {}
