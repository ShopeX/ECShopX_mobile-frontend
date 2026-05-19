/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 基于 i18next + react-i18next；文案在 src/i18n/locales。
 */
import i18n, {
  syncI18nLanguage,
  normalizeStorageLang,
  STORAGE_TO_I18N,
  I18N_TO_STORAGE,
  SUPPORTED_STORAGE_LANGS,
  isI18nResourceReady
} from './instance'

export {
  i18n,
  syncI18nLanguage,
  isI18nResourceReady,
  normalizeStorageLang,
  STORAGE_TO_I18N,
  I18N_TO_STORAGE,
  SUPPORTED_STORAGE_LANGS
}
export { useTranslation, Trans } from 'react-i18next'

/**
 * 当前存储侧语言码（zhcn | en | ar）
 */
export function getLocale() {
  const lng = i18n.resolvedLanguage || i18n.language || 'en'
  return I18N_TO_STORAGE[lng] || (String(lng).toLowerCase().startsWith('zh') ? 'zhcn' : 'en')
}

/**
 * 取文案（键需在 locales 中配置；组件内需调用 `useTranslation()` 以在切换语言时重渲染）
 * @param {string} key
 */
export function $t(key) {
  if (key == null || key === '') return ''
  if (!i18n.exists(key)) return ''
  return i18n.t(key)
}

/** @deprecated 请使用 $t */
export const t = $t

/**
 * 占位符 ${0}、${1}… 与 args 数组对应（与历史 $iS 习惯一致）
 */
export function ti(key, args) {
  const raw = $t(key)
  if (typeof raw !== 'string' || !Array.isArray(args)) return raw
  try {
    return raw.replace(/\$\{(\d+)\}/g, (match, index) => {
      const position = parseInt(index, 10)
      return args[position] !== undefined ? String(args[position]) : match
    })
  } catch {
    return raw
  }
}
