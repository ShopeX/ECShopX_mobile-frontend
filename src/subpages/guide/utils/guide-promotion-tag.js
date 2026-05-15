import { $t } from '@/i18n'

const PROMOTION_TAG_I18N_KEY = {
  团购: '2bb1a4ab.f47464',
  满减: '2bb1a4ab.94b1fd',
  满折: '2bb1a4ab.1c120b',
  满赠: '2bb1a4ab.8e2405',
  加价购: '2bb1a4ab.54e654',
  会员限购: '2bb1a4ab.ef977e',
  秒杀: '2bb1a4ab.55c758',
  限时特惠: '2bb1a4ab.a0aaca'
}

export function guidePromotionTagLabel(tag) {
  if (tag == null || tag === '') return ''
  const key = PROMOTION_TAG_I18N_KEY[tag]
  return key ? $t(key) : tag
}
