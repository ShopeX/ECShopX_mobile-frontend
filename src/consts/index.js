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

export const PAYTYPE = {
  /** h5环境下 */
  WXH5: 'wxpayh5',
  ALIH5: 'alipayh5',
  /** 微信H5环境下 */
  WXH5JS: 'wxpayjs'
}

export * from './localstorage'

export default {}
