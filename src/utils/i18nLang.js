/**
 * 与 `subpages/i18n/locales/*.json` 扁平键一致，走 i18next（见 `src/i18n/instance.js`）。
 * @param {string} key
 * @param {string} zhFallback 缺 key 或未加载 bundle 时的回退（通常为中文）
 */
import i18n from '@/i18n/instance'

export function tLang(key, zhFallback) {
  if (key == null || key === '') {
    return zhFallback != null ? String(zhFallback) : ''
  }
  const fb = zhFallback != null ? String(zhFallback) : ''
  return i18n.t(key, { defaultValue: fb })
}
