// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
