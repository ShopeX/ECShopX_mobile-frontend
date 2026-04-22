/**
 * 仅给 `app.config.js` 等 Node 端编译期使用：不初始化 i18next / 不引用 Taro，避免 `window is not defined`。
 * 语言与 `instance.js` 中 `APP_DEFAULT_LANGUAGE`（zhcn | en | ar）一致。
 */
import zhCN from './locales/zh-CN.json'
import en from './locales/en.json'
import ar from './locales/ar.json'

const BY_STORAGE_LANG = {
  zhcn: zhCN,
  en,
  ar
}

function pickDict() {
  const env =
    typeof process !== 'undefined' && process.env && process.env.APP_DEFAULT_LANGUAGE
      ? String(process.env.APP_DEFAULT_LANGUAGE).trim()
      : ''
  if (env && BY_STORAGE_LANG[env]) {
    return BY_STORAGE_LANG[env]
  }
  return en
}

/** @param {string} key */
export function appConfigT(key) {
  const d = pickDict()
  return (d && d[key]) != null ? d[key] : key
}
