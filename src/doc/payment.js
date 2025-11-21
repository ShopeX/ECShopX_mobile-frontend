/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
export const PAYMENT_ITEM = {
  paymentCode: 'pay_type_code',
  paymentName: 'pay_type_name',
  paymentChannel: ({ pay_channel, pay_type_code }) => {
    return pay_channel || pay_type_code
  }
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
