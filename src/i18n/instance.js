/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * i18next 单例：weapp 经 subpages/i18n/resources 分包异步加载；H5 主包同步 require 同目录 resources。
 */
/* eslint-disable import/no-named-as-default-member -- i18next 默认导出即实例，需调用 .use / .changeLanguage */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

/** Taro 存储 / Redux 使用的语言码 → i18next lng */
export const STORAGE_TO_I18N = {
  zhcn: 'zh-CN',
  en: 'en',
  ar: 'ar'
}

/** i18next lng → 存储用语言码 */
export const I18N_TO_STORAGE = {
  'zh-CN': 'zhcn',
  en: 'en',
  ar: 'ar'
}

/** 可选语言顺序（与 Taro 存储 lang 一致） */
export const SUPPORTED_STORAGE_LANGS = ['zhcn', 'en', 'ar']

const STORAGE_LANG_ALIASES = {
  'zh-cn': 'zhcn',
  'zh_cn': 'zhcn',
  zh: 'zhcn',
  zhcn: 'zhcn',
  en: 'en',
  'en-us': 'en',
  'en_cn': 'en',
  ar: 'ar',
  'ar-sa': 'ar'
}

export function normalizeStorageLang(storageLang) {
  const lang = String(storageLang || '').trim()
  if (!lang) {
    return ''
  }
  return STORAGE_LANG_ALIASES[lang] || STORAGE_LANG_ALIASES[lang.toLowerCase()] || lang
}

function isNodeCompilerContext() {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    typeof process.versions.node === 'string'
  )
}

function readStorageLang() {
  // readConfig（esbuild + Node）会加载本模块：勿顶层 import Taro，否则会拉取 @tarojs/runtime 并在 TARO_PLATFORM=web 时访问 window 报错。
  if (isNodeCompilerContext()) {
    return ''
  }
  try {
    const Taro = require('@tarojs/taro').default
    return normalizeStorageLang(Taro.getStorageSync('lang'))
  } catch {
    return ''
  }
}

function resolveInitialLng() {
  const stored = readStorageLang()
  if (stored && STORAGE_TO_I18N[stored]) {
    return STORAGE_TO_I18N[stored]
  }
  const env =
    typeof process !== 'undefined' && process.env && process.env.APP_DEFAULT_LANGUAGE
      ? normalizeStorageLang(process.env.APP_DEFAULT_LANGUAGE)
      : ''
  if (env && STORAGE_TO_I18N[env]) {
    return STORAGE_TO_I18N[env]
  }
  return 'en'
}

function getTaro() {
  try {
    return require('@tarojs/taro').default
  } catch {
    return null
  }
}

function getLoadedPackageResource(storageLang) {
  const Taro = getTaro()
  if (!Taro || !Taro.__i18nResources) {
    return undefined
  }
  return Taro.__i18nResources[normalizeStorageLang(storageLang)]
}

function isAllLocalePackagesCached() {
  return SUPPORTED_STORAGE_LANGS.every((lang) => getLoadedPackageResource(lang))
}

function loadLocalePackage() {
  if (isAllLocalePackagesCached()) {
    return Promise.resolve()
  }

  const Taro = getTaro()
  if (process.env.TARO_ENV === 'weapp') {
    return new Promise((resolve, reject) => {
      if (typeof __non_webpack_require__ === 'undefined') {
        reject(new Error('subPackage require is unavailable'))
        return
      }
      __non_webpack_require__('subpages/i18n/resources', () => {
        const resources = __non_webpack_require__('subpages/i18n/resources')
        Taro.__i18nResources = {
          ...(Taro.__i18nResources || {}),
          ...resources
        }
        if (resources.zhcn || resources.en || resources.ar) {
          resolve()
        } else {
          reject(new Error('i18n subPackage loaded without resources'))
        }
      })
    })
  }

  // H5：语言包由 webpack 打进主包，同步 require 即可（weapp 依赖分包异步加载，勿在此 require 以免主包膨胀）
  if (process.env.TARO_ENV === 'h5') {
    const Taro = getTaro()
    try {
      const resources = require('../subpages/i18n/resources')
      if (Taro && resources && (resources.zhcn || resources.en || resources.ar)) {
        Taro.__i18nResources = {
          ...(Taro.__i18nResources || {}),
          ...resources
        }
        return Promise.resolve()
      }
      return Promise.reject(new Error('i18n H5 resources empty'))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return Promise.reject(
    new Error(`i18n resource loading unsupported for TARO_ENV=${process.env.TARO_ENV}`)
  )
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {},
    lng: resolveInitialLng(),
    fallbackLng: ['zh-CN'],
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    returnNull: false
  })
}

async function loadI18nResource(storageLang) {
  const normalizedLang = normalizeStorageLang(storageLang)
  const lng = STORAGE_TO_I18N[normalizedLang]
  if (!lng || i18n.hasResourceBundle(lng, 'translation')) {
    return lng
  }

  await loadLocalePackage()
  const resource = getLoadedPackageResource(normalizedLang)
  if (!resource) {
    throw new Error(`Missing i18n resource: ${normalizedLang}`)
  }
  i18n.addResourceBundle(lng, 'translation', resource, true, true)
  return lng
}

/**
 * 与 Taro 存储语言对齐（zhcn / en / ar）
 * @param {string} storageLang
 */
export async function syncI18nLanguage(storageLang) {
  const normalizedLang = normalizeStorageLang(storageLang)
  const targetLng = STORAGE_TO_I18N[normalizedLang]
  const hadResourceBundle = targetLng ? i18n.hasResourceBundle(targetLng, 'translation') : false
  const lng = await loadI18nResource(normalizedLang)
  if (!lng) {
    return
  }
  if (i18n.language === lng) {
    if (!hadResourceBundle) {
      i18n.emit('languageChanged', lng)
    }
    return
  }
  await i18n.changeLanguage(lng)
}

export function isI18nResourceReady(storageLang) {
  const lng = STORAGE_TO_I18N[normalizeStorageLang(storageLang)]
  return Boolean(lng && i18n.hasResourceBundle(lng, 'translation'))
}

export default i18n
