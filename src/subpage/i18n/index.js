/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 统一出口：`app.config.js`、组件等 `import { $t, useTranslation, i18n } from '@/i18n'`
 */
import { useTranslation } from 'react-i18next'
import i18n from './instance'

export { useTranslation }
export {
  syncI18nLanguage,
  STORAGE_TO_I18N,
  I18N_TO_STORAGE,
  SUPPORTED_STORAGE_LANGS
} from './instance'

export { i18n }
export default i18n

/** 平铺文案 */
export function $t(key, options) {
  return i18n.t(key, options)
}

/**
 * 占位符为 ${0}、${1}… 的文案（与 locales JSON 中写法一致）
 * @param {string} key
 * @param {Array<string|number>} values
 */
export function ti(key, values = []) {
  let s = i18n.t(key)
  if (!Array.isArray(values) || values.length === 0) {
    return s
  }
  values.forEach((v, i) => {
    s = String(s)
      .split('${' + i + '}')
      .join(v != null ? String(v) : '')
  })
  return s
}
