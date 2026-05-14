/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { $t } from '@/i18n'

export const STATUS_TYPES_MAP = () => ({
  NOTPAY: 'WAIT_BUYER_PAY',
  PAYED: 'WAIT_SELLER_SEND_GOODS',
  WAIT_BUYER_CONFIRM: 'WAIT_BUYER_CONFIRM_GOODS',
  DONE: 'TRADE_SUCCESS',
  CANCEL: 'TRADE_CLOSED',
  PART_PAYMENT: 'WAIT_BUYER_PAY'
})

export const ORDER_STATUS_INFO = () => ({
  NOTPAY: {
    msg: $t('e3a5dbf4.5baa74'),
    icon: 'order_daizhifu'
  },
  PAYED: {
    msg: $t('e3a5dbf4.c63417'),
    icon: 'order_daifahuo'
  },
  WAIT_BUYER_CONFIRM: {
    msg: $t('e3a5dbf4.74d259'),
    icon: 'order_daishouhuo'
  },
  CANCEL: {
    msg: $t('e3a5dbf4.c3c0cb'),
    icon: 'order_close'
  },
  DONE: {
    msg: $t('e3a5dbf4.694acb'),
    icon: 'order_success'
  },
  PART_PAYMENT: {
    msg: $t('e3a5dbf4.38b508'),
    icon: 'partial_payment'
  }
})

export const ORDER_DADA_STATUS = () => ({
  0: {
    msg: $t('e3a5dbf4.db981a'),
    icon: 'order_dengdai'
  },
  1: {
    msg: $t('e3a5dbf4.440965'),
    icon: 'order_jiedan'
  },
  2: {
    msg: $t('e3a5dbf4.440965'),
    icon: 'order_jiedan'
  },
  3: {
    msg: $t('e3a5dbf4.b56dd3'),
    icon: 'order_peisong'
  },
  4: {
    msg: $t('e3a5dbf4.5426ec'),
    icon: 'order_success'
  },
  10: {
    msg: $t('e3a5dbf4.5426ec'),
    icon: 'order_success'
  },
  5: {
    msg: $t('e3a5dbf4.9b10f9'),
    icon: 'order_close'
  },
  9: {
    msg: $t('e3a5dbf4.3b0c93'),
    icon: 'order_dizhiyichang'
  },
  100: {
    msg: $t('e3a5dbf4.86e559'),
    icon: 'order_qishou'
  }
})

export const AFTER_SALE_STATUS = () => ({
  '0': $t('e3a5dbf4.047109'),
  '1': $t('e3a5dbf4.5d459d'),
  '2': $t('e3a5dbf4.5ad605'),
  '3': $t('e3a5dbf4.dbf36d'),
  '4': $t('e3a5dbf4.9c5850')
})

export const REFUND_STATUS = () => ({
  '0': $t('e3a5dbf4.84a6bc'),
  '1': $t('e3a5dbf4.09505f'),
  '2': $t('e3a5dbf4.6b28d0'),
  '3': $t('e3a5dbf4.4555d5'),
  '4': $t('e3a5dbf4.74d259'),
  '5': $t('e3a5dbf4.771b8b'),
  '6': $t('e3a5dbf4.d58cbd'),
  '7': $t('e3a5dbf4.1c0852')
})

export const AFTER_SALE_TYPE = () => [
  { title: $t('e3a5dbf4.6b8821'), icon: 'icon-jintuikuan-01', type: 'ONLY_REFUND' },
  { title: $t('e3a5dbf4.cc0193'), icon: 'icon-tuikuantuihuo-01', type: 'REFUND_GOODS' }
]

export const AFTER_SALE_TYPE1 = () => [
  { title: $t('e3a5dbf4.cc0193'), icon: 'icon-tuikuantuihuo-01', type: 'REFUND_GOODS' }
]

export const REFUND_FEE_TYPE = () => [
  { title: $t('e3a5dbf4.ed91f2'), desc: $t('e3a5dbf4.64435c'), value: 'logistics' },
  { title: $t('e3a5dbf4.11b600'), desc: $t('e3a5dbf4.6bd56e'), value: 'offline' }
]

export const AFTER_SALE_STATUS_TEXT = () => ({
  0: $t('e3a5dbf4.6e6393'),
  1: $t('e3a5dbf4.cf1217'),
  2: $t('e3a5dbf4.6b28d0'),
  3: $t('e3a5dbf4.b20c52'),
  4: $t('e3a5dbf4.f933db'),
  5: $t('e3a5dbf4.771b8b'),
  6: $t('e3a5dbf4.714e43'),
  7: $t('e3a5dbf4.1c0852'),
  8: $t('e3a5dbf4.74759b'),
  9: $t('e3a5dbf4.73ce8f')
})

export const PROMOTION_TAG = () => ({
  single_group: $t('e3a5dbf4.f47464'),
  full_minus: $t('e3a5dbf4.94b1fd'),
  full_discount: $t('e3a5dbf4.1c120b'),
  full_gift: $t('e3a5dbf4.8e2405'),
  normal: $t('e3a5dbf4.55c758'),
  limited_time_sale: $t('e3a5dbf4.a0aaca'),
  plus_price_buy: $t('e3a5dbf4.54e654'),
  member_preference: $t('e3a5dbf4.ef977e')
})

export const ACTIVITY_LIST = () => ({
  group: $t('e3a5dbf4.0dc5dc'),
  seckill: $t('e3a5dbf4.55c758'),
  limited_time_sale: $t('e3a5dbf4.a0aaca')
})

export const ACTIVITY_STATUS = () => ({
  seckill: {
    in_the_notice: $t('e3a5dbf4.f20d70'),
    in_sale: $t('e3a5dbf4.77c458')
  },
  limited_time_sale: {
    in_the_notice: $t('e3a5dbf4.f20d70'),
    in_sale: $t('e3a5dbf4.77c458')
  },
  group: {
    nostart: $t('e3a5dbf4.f20d70'),
    noend: $t('e3a5dbf4.77c458')
  }
})

export const DEFAULT_POINT_NAME = () => $t('e3a5dbf4.9f68a8')

export const DEFAULT_THEME = () => ({
  colorPrimary: '#d42f29',
  colorMarketing: '#fba629',
  colorAccent: '#2e3030'
})

export const WGTS_NAV_MAP = () => ({
  luckdraw: '/pages/member/point-draw'
})

export const TABBAR_PATH = () => ({
  home: '/pages/index',
  category: '/pages/category/index',
  cart: '/pages/cart/espier-index',
  member: '/subpages/member/index',
  article: '/pages/recommend/list',
  liveroom: '/pages/liveroom/index',
  allGoods: '/subpages/item/list?isTabBar=true',
  ugc: '/subpages/mdugc/index',
  customPage: '/pages/custom/custom-page',
  kujiale: '/subpages/case/list',
  purchase: '/subpages/purchase/select-identity'
})

export const TABBAR_ICON = () => ({
  home: 'shouye',
  category: 'fenlei',
  cart: 'gwche',
  member: 'huiyuan',
  article: 'zhongcao',
  liveroom: 'zhibo',
  allGoods: 'quanbushangpin',
  ugc: 'shequ'
})

export const PURCHASE_TABBAR_PATH = () => ({
  home: '/subpages/purchase/index',
  category: '/subpages/purchase/category',
  cart: '/subpages/purchase/espier-index',
  member: '/subpages/purchase/member'
})

export const PURCHASE_TABBAR_ICON = () => ({
  home: 'shouye',
  category: 'fenlei',
  cart: 'gwche',
  member: 'huiyuan'
})

export const BUY_TOOL_BTNS = () => ({
  NOTICE: { title: $t('e3a5dbf4.46a6b2'), key: 'notice', btnStatus: 'active' },
  SUBSCRIBE: { title: $t('e3a5dbf4.6a26cf'), key: 'subscribe', btnStatus: 'default' },
  ADD_CART: { title: $t('e3a5dbf4.62d369'), key: 'addcart', btnStatus: 'default' },
  FAST_BUY: { title: $t('e3a5dbf4.5fd2f9'), key: 'fastbuy', btnStatus: 'active' },
  GIFT: { title: $t('e3a5dbf4.235979'), key: 'gift', btnStatus: 'disabled' },
  ACTIVITY_WILL_START: {
    title: $t('e3a5dbf4.689272'),
    key: 'activity_will_start',
    btnStatus: 'disabled'
  },
  ACTIVITY_FAST_BUY: {
    title: $t('e3a5dbf4.d8a40b'),
    key: 'activity_fast_buy',
    btnStatus: 'active'
  },
  ACTIVITY_BUY: { title: $t('e3a5dbf4.5fd2f9'), key: 'activity_buy', btnStatus: 'active' },
  ACTIVITY_GROUP_BUY: {
    title: $t('e3a5dbf4.ccb0dd'),
    key: 'activity_group_buy',
    btnStatus: 'active'
  },
  SHARE: { title: $t('e3a5dbf4.e2829e'), key: 'share', btnStatus: 'active' },
  NO_STORE: { title: $t('e3a5dbf4.7cfe76'), key: 'nostore', btnStatus: 'disabled' },
  ONLY_SHOW: { title: $t('e3a5dbf4.820df2'), key: 'only_show', btnStatus: 'disabled' },
  // 兑换券商品
  EX_CHANGE: { title: $t('e3a5dbf4.525bb2'), key: 'exchange', btnStatus: 'active' },
  // 兑换积分商品
  EX_CHANGE_POINT: { title: $t('e3a5dbf4.525bb2'), key: 'exchange_point', btnStatus: 'active' }
})
export const COUPON_TYPE = () => ({
  new_gift: {
    tag: $t('e3a5dbf4.8bc752'),
    bg: 'linear-gradient(122deg, #F4C486 0%, #D4A570 100%)',
    fc: '#AC8050',
    invalidBg: 'linear-gradient(122deg, #D8D8D8 0%, #A9A9A9 100%)',
    invalidFc: '#888888',
    opacity: '0.4'
  },
  cash: {
    tag: $t('e3a5dbf4.f23195'),
    bg: 'linear-gradient(299deg, #679BDD 0%, #9AC5FF 100%)',
    fc: '#4979B7',
    invalidBg: 'linear-gradient(122deg, #D8D8D8 0%, #A9A9A9 100%)',
    invalidFc: '#888888',
    opacity: '0.4'
  },
  discount: {
    tag: $t('e3a5dbf4.9268f9'),
    bg: 'linear-gradient(126deg, #CCC0EF 0%, #7E6FA9 100%)',
    fc: '#64578D',
    invalidBg: 'linear-gradient(122deg, #D8D8D8 0%, #A9A9A9 100%)',
    invalidFc: '#888888',
    opacity: '0.4'
  }
})

export const PAYTYPE = () => ({
  /** h5环境下 */
  WXH5: 'wxpayh5',
  ALIH5: 'alipayh5',
  /** 微信H5环境下 */
  WXH5JS: 'wxpayjs'
})

export const PAYMENT_TYPE = () => ({
  wxpay: $t('e3a5dbf4.bffe28'),
  hfpay: $t('e3a5dbf4.bffe28'),
  alipayh5: $t('e3a5dbf4.e3b206'),
  wxpayh5: $t('e3a5dbf4.bffe28'),
  wxpayjs: $t('e3a5dbf4.bffe28'),
  deposit: $t('e3a5dbf4.89ac23'),
  wxpayapp: $t('e3a5dbf4.bffe28'),
  alipayapp: $t('e3a5dbf4.e3b206'),
  adapay: $t('e3a5dbf4.bffe28'),
  wx_lite: $t('e3a5dbf4.bffe28'),
  wx_pub: $t('e3a5dbf4.bffe28'),
  alipay: $t('e3a5dbf4.e3b206'),
  alipay_wap: $t('e3a5dbf4.e3b206'),
  alipay_qr: $t('e3a5dbf4.e3b206'),
  pos: $t('e3a5dbf4.330ef6'),
  wxpaypos: $t('e3a5dbf4.bffe28'),
  alipaypos: $t('e3a5dbf4.e3b206'),
  alipaymini: $t('e3a5dbf4.e3b206'),
  point: $t('e3a5dbf4.accd19'),
  offline_pay: $t('e3a5dbf4.2d8019')
})

export const TRANSFORM_PAYTYPE = () => ({
  'wxpayh5': 'wxpayh5',
  'alipayh5': 'alipay',
  'wxpayjs': 'wxpayjs',
  'deposit': 'deposit',
  'wxpayapp': 'wxpay',
  'alipayapp': 'alipay',
  'adapay': 'adapay',
  'point': 'point'
})

export const POINT_TYPE = () => ({
  1: $t('e3a5dbf4.450ff4'),
  2: $t('e3a5dbf4.c40b4f'),
  3: $t('e3a5dbf4.bd673a'),
  4: $t('e3a5dbf4.033aae'),
  5: $t('e3a5dbf4.3c5eed'),
  6: $t('e3a5dbf4.757249'),
  7: $t('e3a5dbf4.b7c356'),
  8: $t('e3a5dbf4.168aa1'),
  9: $t('e3a5dbf4.f2bab8'),
  10: $t('e3a5dbf4.f6e977'),
  11: $t('e3a5dbf4.837c68'),
  12: $t('e3a5dbf4.f98dae')
})

export const FORM_COMP = () => ({
  INPUT: 1,
  NUMBER: 2,
  DATE: 3,
  RADIO: 4,
  CHECKBOX: 5,
  MOBILE: 6,
  IMAGE: 7
})

export const CHIEF_APPLY_STATUS = () => ({
  WAITE: 0,
  RESLOVE: 1,
  REJECT: 2
})

export const GOODS_TYPE = () => ({
  'normal': $t('e3a5dbf4.0f7a66'),
  'gift': $t('e3a5dbf4.d017cc'),
  'plus_buy': $t('e3a5dbf4.1687b1'),
  'package': $t('e3a5dbf4.159f49')
})

export const LOGISTICS_CODE = () => ({
  'SF': $t('e3a5dbf4.ce652e'),
  'HTKY': $t('e3a5dbf4.a71fe3'),
  'ZTO': $t('e3a5dbf4.bffaf8'),
  'STO': $t('e3a5dbf4.9a7d79'),
  'YTO': $t('e3a5dbf4.7f8ac8'),
  'YD': $t('e3a5dbf4.75c939'),
  'YZPY': $t('e3a5dbf4.81fa71'),
  'EMS': 'EMS',
  'HHTT': $t('e3a5dbf4.927cad'),
  'JD': $t('e3a5dbf4.cf9c27'),
  'UC': $t('e3a5dbf4.6ef050'),
  'DBL': $t('e3a5dbf4.7d2efe'),
  'ZJS': $t('e3a5dbf4.369b3d'),
  'FWX': $t('e3a5dbf4.b04f80'),
  'JTSD': $t('e3a5dbf4.7d5dc5')
})

export const enumdays = () => ({
  0: $t('e3a5dbf4.800dfd'),
  1: $t('e3a5dbf4.8bcbd7'),
  2: $t('e3a5dbf4.1dead9')
})

export const infotype = () => ({
  SYSTEM: 'system',
  REPLY: 'reply',
  LIKE: 'like',
  FAVORITEPOST: 'favoritePost',
  FOLLOWERUSER: 'followerUser'
})

export const DELIVERY_PERSONNEL_INFORMATION = () => [
  {
    title: $t('e3a5dbf4.f3af96'),
    selector: [{ label: $t('e3a5dbf4.0e903e'), status: true }],
    extraText: $t('e3a5dbf4.0e903e'),
    status: 'select',
    value: 'all'
  },
  {
    title: $t('e3a5dbf4.b7765e'),
    selector: [{ label: '', status: true }],
    extraText: '',
    status: 'select',
    value: 'self_delivery_operator_name'
  },
  {
    title: $t('e3a5dbf4.ec9c94'),
    selector: [{ label: '', status: true }],
    extraText: '',
    status: 'select',
    value: 'self_delivery_operator_mobile'
  },
  {
    title: $t('e3a5dbf4.553e84'),
    selector: [{ label: '', status: true }],
    extraText: '',
    status: 'select',
    value: 'self_delivery_status'
  },
  {
    title: $t('e3a5dbf4.6d9262'),
    selector: '',
    extraText: '',
    status: 'textarea',
    value: 'delivery_remark'
  },
  {
    title: $t('e3a5dbf4.92d62c'),
    selector: [],
    extraText: '',
    status: 'image',
    value: 'delivery_pics'
  }
]

export const relationship = () => [
  {
    key: 1,
    value: $t('e3a5dbf4.6c6d18')
  },
  {
    key: 2,
    value: $t('e3a5dbf4.b23382')
  },
  {
    key: 3,
    value: $t('e3a5dbf4.61d549')
  },
  {
    key: 4,
    value: $t('e3a5dbf4.84e10d')
  },
  {
    key: 5,
    value: $t('e3a5dbf4.0d98c7')
  }
]

export const ACTIVITY_STATUS_MAP = () => ({
  'pending': $t('e3a5dbf4.5cb424'),
  'passed': $t('e3a5dbf4.ecfa64'),
  'rejected': $t('e3a5dbf4.81233d'),
  'verified': $t('e3a5dbf4.77af84'),
  'canceled': $t('e3a5dbf4.2111cc')
})

export const DELIVERY_LIST = () => [
  {
    type: 'logistics',
    name: $t('e3a5dbf4.249bfe'),
    key: 'is_delivery'
  },
  {
    type: 'dada',
    name: $t('e3a5dbf4.583dcd'),
    key: 'is_dada'
  },
  {
    type: 'merchant',
    name: $t('e3a5dbf4.583dcd'),
    key: 'is_self_delivery' //自配送也展示同城配文字，自配送和达达只展示一个
  },
  {
    type: 'ziti',
    name: $t('e3a5dbf4.93ab28'),
    key: 'is_ziti'
  }
]

export const INVITE_ACTIVITY_ID = 'INVITE_ACTIVITY_ID'

//需要注册的页面类型
export const needLoginPageType = [
  'vipgrades',
  'applyChief',
  'recharge',
  'purchase',
  'pointShop',
  'registActivity',
  'group',
  'boost_activity',
  'boost_order',
  'coupon_list',
  'my_coupon',
  'my_collect',
  'tenants',
  'address',
  'groups_list',
  'hottopic',
  'zitiOrder',
  'community_group_enable'
]

export const needLoginPage = ['purchase_activity', 'regactivity', 'lottery']

export const TAB_PAGES = [
  '/pages/index',
  '/pages/category/index',
  '/pages/cart/espier-index',
  '/subpages/member/index',
  '/subpages/guide/index',
  '/subpages/guide/category/index',
  '/subpages/guide/coupon-home/index',
  '/subpages/guide/recommend/list',
  '/subpages/guide/cart/espier-index'
]

export const DEFAULT_NAVIGATE_HEIGHT = 44
export const DEFAULT_FOOTER_HEIGHT = 124 // 默认底部高度，不包含页面底部安全距离
export const DEFAULT_SAFE_AREA_HEIGHT = 42 // 默认安全距离

export * from './localstorage'

export default {}
