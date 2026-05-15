/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import dayjs from 'dayjs'
import { formatDateTime } from '@/utils'
import { $t } from '@/i18n'

const toMs = (raw) => {
  if (raw == null || raw === '') return 0
  const s = String(raw)
  if (/\d{4}-\d{2}-\d{2}/.test(s)) {
    return dayjs(raw).valueOf()
  }
  const n = Number(raw)
  if (Number.isNaN(n)) return 0
  return s.length < 13 ? n * 1000 : n
}

export const ACTIVITY_ITEM = {
  enterpriseId: 'enterprise_id',
  employeeBeginTime: ({ employee_begin_time }) => {
    return formatDateTime(employee_begin_time)
  },
  employeeEndTime: ({ employee_end_time }) => {
    return formatDateTime(employee_end_time)
  },
  /** 用于活动卡片状态（即将开始 / 进行中 / 已结束） */
  beginTs: ({ employee_begin_time }) => toMs(employee_begin_time),
  endTs: ({ employee_end_time }) => toMs(employee_end_time),
  id: 'id',
  name: 'name',
  pic: 'pic',
  pages_template_id: 'pages_template_id',
  role: ({ is_employee, is_relative }) => {
    if (is_employee == 1) {
      return $t('00c5cea6.2ed392')
    } else if (is_relative == 1) {
      return $t('00c5cea6.4eca5b')
    }
  },
  isDiscountDescriptionEnabled: ({ is_discount_description_enabled }) =>
    is_discount_description_enabled == 'true',
  discountDescription: 'discount_description',
  priceDisplayConfig: 'price_display_config',
  isPassphraseEnabled: ({ is_passphrase_enabled }) => is_passphrase_enabled == 1, //是否开启口令通道 0/1
  authType: ({ auth_type }) => auth_type, //当前行关联内购企业认证方式：email/account/mobile/qr_code/no_verify 等
  passphraseUserVerified: ({ passphrase_user_verified }) => passphrase_user_verified, //当前登录用户是否已在该活动+本企业下口令校验成功；未开口令为 0
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
