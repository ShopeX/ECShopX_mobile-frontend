export const STATUS_TYPES_MAP = {
  NOTPAY: 'WAIT_BUYER_PAY',
  PAYED: 'WAIT_SELLER_SEND_GOODS',
  WAIT_BUYER_CONFIRM: 'WAIT_BUYER_CONFIRM_GOODS',
  // DONE: 'TRADE_SUCCESS',
  DONE: 'WAIT_RATE',
  CANCE: 'TRADE_CLOSED'
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

export const WGTS_NAV_MAP = {
  'luckdraw': '/pages/member/point-draw'
}

export default {}
