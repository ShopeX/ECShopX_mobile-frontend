export const PAYMENT_ITEM = {
  paymentCode: 'pay_type_code',
  paymentName: 'pay_type_name',
  paymentChannel: 'pay_channel'
}

export const APP_PAYMENT_ITEM = {
  paymentCode: ({ id }) => {
    if (id == 'wxpay') {
      return 'wxpayapp'
    } else if (id == 'alipay') {
      return 'alipayapp'
    }
  },
  paymentName: 'name'
}
