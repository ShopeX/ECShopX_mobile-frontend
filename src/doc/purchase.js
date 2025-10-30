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
import { formatDateTime } from '@/utils'

export const ACTIVITY_ITEM = {
  enterpriseId: 'enterprise_id',
  employeeBeginTime: ({ employee_begin_time }) => {
    return formatDateTime(employee_begin_time)
  },
  employeeEndTime: ({ employee_end_time }) => {
    return formatDateTime(employee_end_time)
  },
  id: 'id',
  name: 'name',
  pic: 'pic',
  pages_template_id: 'pages_template_id',
  role: ({ is_employee, is_relative }) => {
    if (is_employee == 1) {
      return '员工'
    } else if (is_relative == 1) {
      return '亲友'
    }
  },
  isDiscountDescriptionEnabled: ({ is_discount_description_enabled }) =>
    is_discount_description_enabled == 'true',
  discountDescription: 'discount_description',
  priceDisplayConfig: 'price_display_config'
}

export const ACTIVITY_LIMIT_ITEM = {
  name: 'name',
  employeeBeginTime: ({ employee_begin_time }) => {
    return formatDateTime(employee_begin_time)
  },
  employeeEndTime: ({ employee_end_time }) => {
    return formatDateTime(employee_end_time)
  },
  limitFee: ({ fee }) => (fee?.limit_fee / 100).toFixed(2),
  aggregateFee: ({ fee }) => (fee?.aggregate_fee / 100).toFixed(2),
  leftFee: ({ fee }) => (fee?.left_fee / 100).toFixed(2)
}
