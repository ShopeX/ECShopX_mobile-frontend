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
import Taro from '@tarojs/taro'
import { payment_platform } from '@/utils/platform'
import { isWxWeb, isAlipay } from '@/utils'
import api from '@/api'

export default async function getPaymentList(distributor_id) {
  let params = {}
  if (distributor_id) {
    params = {
      distributor_id,
      platform: isWxWeb ? 'wxPlatform' : payment_platform
    }
  }
  if (isAlipay) {
    params = {
      platform: payment_platform
    }
  }
  let list = await api.member.getTradePaymentList(params)
  console.log('===list===', list)
  const isHasAlipay = list.some((item) => item.pay_type_code === 'alipayh5')
  return {
    list,
    isHasAlipay
  }
}
