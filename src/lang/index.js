/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { syncI18nLanguage } from '@/i18n/instance'

class Lang {
  constructor() {
    this.init()
  }

  init() {
    const self = this
    // 定义翻译函数
    let $t = function (key, val, nameSpace) {
      // 获取指定命名空间下的语言包
      const langPackage = $t[nameSpace]
      // 返回翻译结果，如果不存在则返回默认值
      return (langPackage || {})[key] || val
    }
    // 定义简单翻译函数，直接返回传入的值
    let $$t = function (val) {
      return val
    }
    globalThis.$deepScan = function (val) {
      return val
    }
    globalThis.$iS = function (val, args) {
      // 如果参数不是字符串或数组，直接返回原值
      if (typeof val !== 'string' || !Array.isArray(args)) {
        return val
      }
      try {
        // 使用更安全的正则表达式替换方式
        return val.replace(/\$\{(\d+)\}/g, (match, index) => {
          // 将index转换为数字
          const position = parseInt(index, 10)
          // 如果args[position]存在则替换，否则保留原占位符
          return args[position] !== undefined ? String(args[position]) : match
        })
      } catch (error) {
        console.warn('字符串替换过程出现异常:', error)
        return val
      }
    }
    // 定义设置语言包的方法
    $t.locale = function (locale, nameSpace) {
      // 将指定命名空间下的语言包设置为传入的locale
      $t[nameSpace] = locale || {}
    }
    // 将翻译函数挂载到globalThis对象上，如果已经存在则使用已有的
    globalThis.$t = globalThis.$t || $t
    // 将简单翻译函数挂载到globalThis对象上
    globalThis.$$t = $$t
    // 定义从JSON文件中获取指定键的语言对象的方法
    globalThis._getJSONKey = function (key, insertJSONObj = undefined) {
      // 获取JSON对象
      const JSONObj = insertJSONObj
      // 初始化语言对象
      const langObj = {}
      // 遍历JSON对象的所有键
      Object.keys(JSONObj).forEach((value) => {
        // 将每个语言的对应键值添加到语言对象中
        langObj[value] = JSONObj[value][key]
      })
      // 返回语言对象
      return langObj
    }

    /**
     * 必须在首屏即可用：`setLanguagePackage` 在 useLaunch 里异步执行，
     * 用户在语言包就绪前进「设置 → 切换语言」会导致 Taro.$changeLang 未定义。
     */
    Taro.$changeLang = (lang) => {
      const apply = () => {
        globalThis._localStorage.setItem('lang', lang)
        globalThis.$t.locale(globalThis.langMap[lang], 'lang')
        if (Taro.eventCenter) {
          Taro.eventCenter.trigger('languageChanged', { lang, langMap: globalThis.langMap[lang] })
        }
        Promise.resolve(syncI18nLanguage(lang)).catch(() => {})
      }

      if (
        globalThis.langMap &&
        typeof globalThis.langMap === 'object' &&
        Object.keys(globalThis.langMap).length > 0
      ) {
        apply()
        return
      }
      import('@/subpages/i18n/index')
        .then(() => {
          const langJSON = Taro['langJSON']
          if (!langJSON) {
            console.error('[Lang] Taro.langJSON missing, cannot switch language')
            return
          }
          self.setLanguagePackage(langJSON)
          apply()
        })
        .catch((e) => {
          console.error('[Lang] Failed to load language bundle', e)
        })
    }
  }

  setLanguagePackage(langJSON) {
    const langMap = {
      'en':
        globalThis && globalThis.lang && globalThis.lang.en
          ? globalThis.lang.en
          : globalThis._getJSONKey('en', langJSON),
      'ja':
        globalThis && globalThis.lang && globalThis.lang.ja
          ? globalThis.lang.ja
          : globalThis._getJSONKey('ja', langJSON),
      'zhcn':
        globalThis && globalThis.lang && globalThis.lang.zhcn
          ? globalThis.lang.zhcn
          : globalThis._getJSONKey('zh-cn', langJSON),
      'zhtw':
        globalThis && globalThis.lang && globalThis.lang.zhtw
          ? globalThis.lang.zhtw
          : globalThis._getJSONKey('zh-tw', langJSON),
      'ar':
        globalThis && globalThis.lang && globalThis.lang.ar
          ? globalThis.lang.ar
          : globalThis._getJSONKey('ar', langJSON)
    }
    globalThis.langMap = langMap
    // 存储语言是否存在
    // 判断 globalThis._localStorage.getItem 是否为函数
    const isFunction = (fn) => {
      return typeof fn === 'function'
    }
    globalThis._localStorage = {
      getItem: (key) => {
        return Taro.getStorageSync(key)
      },
      setItem: (key, value) => {
        Taro.setStorageSync(key, value)
      },
      removeItem: (key) => {
        Taro.removeStorageSync(key)
      }
    }
    const withStorageLang =
      isFunction &&
      globalThis &&
      globalThis._localStorage &&
      isFunction(globalThis._localStorage.getItem) &&
      globalThis._localStorage.getItem('lang')
    const withStorageCommonLang =
      isFunction &&
      globalThis &&
      globalThis._localStorage &&
      isFunction(globalThis._localStorage.getItem) &&
      globalThis._localStorage.getItem('')
    // 从本地存储中获取通用语言，如果不存在则使用空字符串
    const commonLang = withStorageCommonLang ? globalThis._localStorage.getItem('') : ''
    // 从本地存储中获取当前语言，如果不存在则使用源语言
    const baseLang = withStorageLang
      ? globalThis._localStorage.getItem('lang')
      : process.env.APP_DEFAULT_LANGUAGE

    const lang = baseLang || commonLang || process.env.APP_DEFAULT_LANGUAGE || 'en'
    console.log('lang', lang)
    console.log('commonLang', commonLang)
    console.log('baseLang', baseLang)
    console.log('process.env.APP_DEFAULT_LANGUAGE', process.env.APP_DEFAULT_LANGUAGE)
    // 如果本地存储中没有语言设置，则使用环境变量中的默认语言
    if (!globalThis._localStorage.getItem('lang')) {
      try {
        const defaultLang = process.env.APP_DEFAULT_LANGUAGE
          ? process.env.APP_DEFAULT_LANGUAGE
          : 'en'
        // 设置默认语言
        globalThis._localStorage.setItem('lang', defaultLang)
      } catch (error) {
        globalThis._localStorage.setItem('lang', 'zhcn')
        console.error('setLanguagePackage error', error)
      }
    }
    // 根据当前语言设置翻译函数的语言包
    globalThis.$t.locale(globalThis.langMap[lang], 'lang')
    Promise.resolve(syncI18nLanguage(lang)).catch(() => {})
  }
}

export default new Lang()
