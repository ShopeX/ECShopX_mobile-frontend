import { $t } from '@/i18n'

const GUIDE_BUY_BTN_LABEL_KEY = {
  notice: '91cdd6e0.46a6b2',
  subscribe: '91cdd6e0.6a26cf',
  addcart: '91cdd6e0.62d369',
  fastbuy: '91cdd6e0.5fd2f9',
  gift: '91cdd6e0.235979',
  activity_will_start: '91cdd6e0.689272',
  activity_fast_buy: '91cdd6e0.d8a40b',
  activity_buy: '91cdd6e0.5fd2f9',
  activity_group_buy: '91cdd6e0.ccb0dd',
  share: '91cdd6e0.e2829e',
  nostore: '91cdd6e0.7cfe76',
  only_show: '91cdd6e0.820df2',
  exchange: '91cdd6e0.525bb2',
  exchange_point: '91cdd6e0.525bb2'
}

export function guideBuyBtnLabel(btn) {
  if (!btn) return ''
  const key = GUIDE_BUY_BTN_LABEL_KEY[btn.key]
  return key ? $t(key) : btn.title
}
