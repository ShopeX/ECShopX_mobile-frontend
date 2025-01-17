import { isWeb, isWxWeb } from '@/utils'

export const initialState = {
  detailInfo: [],
  submitLoading: false,
  btnIsDisabled: false,
  addressList: [],
  receiptType: '', // 收货方式：ziti自提  logistics快递
  defalutPaytype: isWxWeb ? 'wxpayjs' : isWeb ? 'wxpayh5' : 'wxpay', // 默认支付方式
  payType: '', // wxpay 微信支付 point 积分支付 deposit 储值支付  alipaymini 支付宝小程序支付
  payChannel: '', // 支付渠道
  paymentName:'',//支付label
  isPointitemGood: false, // 是否为积分商城的商品
  shoppingGuideData: {}, //代客下单导购信息
  totalInfo: {
    market_fee: 0, // 原价
    item_fee_new: 0, // 总价
    items_count: 0, // 商品总件数
    total_fee: '0.00', // 商品总计
    promotion_discount: 0, // 促销
    discount_fee: 0,
    item_fee: '', // 商品金额
    freight_fee: 0, // 运费
    member_discount: '', // 会员折扣
    coupon_discount: '', // 优惠券折扣
    point: '', // 积分
    point_fee: '', // 积分抵扣
    freight_type: '', // 运费
    invoice_status: true // 是否需要开发票
  },
  distributorInfo: {}, // 店铺信息
  invoiceTitle: '', // 发票抬头
  packInfo: {}, // 打包信息
  disabledPayment: {}, // 是否禁用支付
  channel: '',
  paramsInfo: {}, // 结算接口参数
  discountInfo: [],
  couponInfo: {}, // 优惠券信息
  remark: '', // 备注
  // 积分相关
  isPointOpen: false,
  point_use: 0,
  pointInfo: {},
  streetCommunityList: [],
  openStreet: false,
  openBuilding: false,
  multiValue: [],
  multiIndex: [0, 0],
  streetCommunityTxt: '请选择',
  street: null, // 街道
  community: null, // 社区
  buildingNumber: '', // 楼号
  houseNumber: '', // 房号
  isPaymentOpend: false,
  isPackageOpend: false,
  isNeedPackage: false, // 是否需要打包
  openCashier: false,
  isPointOpenModal: false,
  routerParams: {},
  deliveryTimeList:{},
  salespersonInfo:{},// 导购信息
  pointPayFirst:null,
  isFirstCalc:true
}

export const deliveryList = [
  {
    type: 'logistics',
    name: '普通快递',
    key: 'is_delivery'
  },
  {
    type: 'dada',
    name: '同城配',
    key: 'is_dada'
  },
  {
    type: 'merchant',
    name: '同城配',
    key: 'is_self_delivery'//自配送也展示同城配文字，自配送和达达只展示一个
  },
  {
    type: 'ziti',
    name: '到店自提',
    key: 'is_ziti'
  }
]
