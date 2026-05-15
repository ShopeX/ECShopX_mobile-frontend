/**
 * 供 app.config.js 等在 Node 编译期执行的模块使用。
 * 不加载 i18next / Taro；文案为内联表，不 import 任何 locales 大 JSON，避免 Babel 解析巨量转义出错。
 * 与主包 $t 键名一致；若增 key，请在三语下同步。
 */
const TABLES = {
  zhcn: {
    '95285d68.93f311': '您的位置信息将用于定位附近门店',
    '95285d68.0ed510': '小程序'
  },
  en: {
    '95285d68.93f311': 'Your location is used to find nearby stores',
    '95285d68.0ed510': 'Mini Program'
  },
  ar: {
    '95285d68.93f311': 'يُستخدم موقعك للعثور على المتاجر القريبة',
    '95285d68.0ed510': 'تطبيق مصغر'
  }
}

function resolveTable() {
  const code =
    typeof process !== 'undefined' && process.env && process.env.APP_DEFAULT_LANGUAGE
      ? String(process.env.APP_DEFAULT_LANGUAGE).trim()
      : ''
  if (code && TABLES[code]) {
    return TABLES[code]
  }
  return TABLES.zhcn
}

export function $t(key) {
  if (key == null || key === '') return ''
  const table = resolveTable()
  const v = table[key]
  return v != null && v !== '' ? String(v) : String(key)
}
