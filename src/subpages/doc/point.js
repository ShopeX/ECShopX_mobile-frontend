/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { formatDateTime, thousandthFormat } from '@/utils'

/** 积分流水类型 → i18n 键（展示时在页面内 $t） */
const JOURNAL_TYPE_KEYS = {
  1: '242e836f.78f6e4',
  2: '242e836f.9b0017',
  3: '242e836f.17f26e',
  4: '242e836f.9d9685',
  5: '242e836f.3c5eed',
  6: '242e836f.e3cc00',
  7: '242e836f.c1e2f7',
  8: '242e836f.168aa1',
  9: '242e836f.4e338b',
  10: '242e836f.359748',
  11: '242e836f.5fa218',
  12: '242e836f.410349',
  13: '242e836f.e6555b',
  14: '242e836f.4f80c3',
  15: '242e836f.9a9487',
  16: '242e836f.07063e',
  20: '242e836f.5486d9',
  21: '242e836f.b331d9',
  22: '242e836f.7ee72e',
  23: '242e836f.0145c8',
  24: '242e836f.fb1d57',
  9920: '242e836f.9d05a6',
  9921: '242e836f.db0761',
  9922: '242e836f.8d25d4'
}

export const POINT_LIST_ITEM = {
  journalType: ({ journal_type }) => JOURNAL_TYPE_KEYS[journal_type] || '',
  outinType: ({ income, outcome }) => (income ? 'in' : outcome ? 'out' : ''),
  point: ({ point }) => thousandthFormat(point),
  orderId: 'order_id',
  point_desc: 'point_desc',
  created: ({ created }) => formatDateTime(created)
}
