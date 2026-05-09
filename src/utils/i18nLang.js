/**
 * 与 `subpages/i18n/lang/index.json` 键一致，namespace 为 `lang`（见 `src/lang/index.js`）
 * @param {string} key
 * @param {string} zhFallback
 */
export function tLang(key, zhFallback) {
  if (typeof globalThis !== 'undefined' && typeof globalThis.$t === 'function') {
    return globalThis.$t(key, zhFallback, 'lang')
  }
  return zhFallback
}
