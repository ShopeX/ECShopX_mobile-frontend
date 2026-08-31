/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
  // H5 储值等场景可能无 distributor_id，仍需带 platform=h5
  if (payment_platform === 'h5' && !params.platform) {
    params.platform = 'h5'
  }
  let list = await api.member.getTradePaymentList(params)
  console.log('===list===', list)
  const isHasAlipay = list.some((item) => item.pay_type_code === 'alipayh5')
  return {
    list,
    isHasAlipay
  }
}
