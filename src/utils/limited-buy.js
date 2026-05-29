/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { ti } from '@/i18n'

export function formatLimitedBuyRuleText(rule) {
  if (!rule || rule.limit == null || rule.limit === '') return ''
  const limitNum = rule.limit
  if (Number(rule.day) === 0) {
    return ti('7d82f6d2.ffad24', [limitNum])
  }
  return ti('7d82f6d2.43357c', [rule.day, limitNum])
}

export function collectLimitedBuyTagTexts(info = {}) {
  const texts = []
  const seen = new Set()
  const push = (text) => {
    const value = text != null ? String(text).trim() : ''
    if (value && !seen.has(value)) {
      seen.add(value)
      texts.push(value)
    }
  }

  if (info.activityType === 'limited_buy') {
    push(formatLimitedBuyRuleText(info.activityInfo?.rule))
    push(info.activityInfo?.activity_tag)
    push(info.activityInfo?.promotion_tag)
  }

  const promotions = Array.isArray(info.promotion) ? info.promotion : []
  promotions.forEach((item) => {
    const type = item?.tag_type || item?.marketing_type
    if (type !== 'limited_buy') return
    push(item.promotion_tag || item.tag_name)
    push(formatLimitedBuyRuleText(item.rule || item.activity_rule))
  })

  return texts
}

export function getLimitedBuyDetailLines(info = {}) {
  if (!info || info.activityType !== 'limited_buy') return { ruleText: '', activityName: '' }
  const ruleText = info.activityInfo?.describe || formatLimitedBuyRuleText(info.activityInfo?.rule)
  const activityName =
    info.activityInfo?.activity_name ||
    info.activityInfo?.limit_name ||
    info.activityInfo?.activity_tag ||
    ''
  return { ruleText, activityName }
}

export function enrichGoodsDetailActivity(mapped, raw) {
  if (!mapped || !raw) return mapped
  return {
    ...mapped,
    activityType: mapped.activityType ?? raw.activity_type,
    activityInfo: mapped.activityInfo ?? raw.activity_info
  }
}
