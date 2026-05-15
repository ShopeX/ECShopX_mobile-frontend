/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'

class Lang {
  constructor() {
    this.init()
  }

  init() {
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
    this.initStorageBridge()
  }

  initStorageBridge() {
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

    Taro.$changeLang = (lang) => {
      globalThis._localStorage.setItem('lang', lang)
      // 触发语言变化事件，让 i18next/Redux 等新链路同步语言
      if (Taro.eventCenter) {
        Taro.eventCenter.trigger('languageChanged', { lang })
      }
    }
  }
}

export default new Lang()
