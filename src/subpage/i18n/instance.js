/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * i18next 单例：资源来自 src/i18n/locales，语言与 Taro 存储 / Redux user.lang（zhcn|en|ar）同步。
 */
/* eslint-disable import/no-named-as-default-member -- i18next 默认导出即实例，需调用 .use / .changeLanguage */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Taro from '@tarojs/taro'

import zhCN from './locales/zh-CN.json'
import en from './locales/en.json'
import ar from './locales/ar.json'

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

function readStorageLang() {
  try {
    return Taro.getStorageSync('lang') || ''
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
      ? process.env.APP_DEFAULT_LANGUAGE
      : ''
  if (env && STORAGE_TO_I18N[env]) {
    return STORAGE_TO_I18N[env]
  }
  return 'en'
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      'zh-CN': { translation: zhCN },
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: resolveInitialLng(),
    fallbackLng: ['en', 'zh-CN'],
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    returnNull: false
  })
}

/**
 * 与 Taro 存储语言对齐（zhcn / en / ar）
 * @param {string} storageLang
 */
export function syncI18nLanguage(storageLang) {
  const lng = STORAGE_TO_I18N[storageLang]
  if (!lng) {
    return Promise.resolve()
  }
  if (i18n.language === lng) {
    return Promise.resolve()
  }
  return i18n.changeLanguage(lng)
}

export default i18n
