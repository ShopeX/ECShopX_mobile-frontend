// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
const log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null // 手机端点击投诉可以在平台看到日志

const levels = {
  DEBUG: 'debug', // 开发和调试阶段使用
  INFO: 'info', // 记录程序正常运行情况
  WARN: 'warn', // 记录程序运行出现的潜在问题
  ERROR: 'error' // 程序运行过程出现严重错误
}

const prefixes = {
  DEBUG: '[DEBUG]',
  INFO: '[INFO]',
  WARN: '[WARN]',
  ERROR: '[ERROR]'
}

class Logger {
  constructor(level = levels.INFO) {
    this.level = level
  }

  setLevel(level) {
    this.level = level
  }

  log(level, ...args) {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toLocaleString()
      const prefix = prefixes[level.toUpperCase()] || ''
      const logMessage = `[${timestamp}] ${prefix} ${args.join(' ')}`
      console.log(logMessage)
      this.sendToRealtimeLog(level, ...args)
    }
  }

  debug(...args) {
    this.log(levels.DEBUG, ...args)
  }

  info(...args) {
    this.log(levels.INFO, ...args)
  }

  warn(...args) {
    this.log(levels.WARN, ...args)
  }

  error(...args) {
    this.log(levels.ERROR, ...args)
  }

  shouldLog(level) {
    const levelOrder = [levels.DEBUG, levels.INFO, levels.WARN, levels.ERROR]
    return levelOrder.indexOf(level) >= levelOrder.indexOf(this.level)
  }

  sendToRealtimeLog(level, ...args) {
    if (!log) {
      return
    }
    switch (level) {
      case levels.INFO:
        log.info.apply(log, args)
        break
      case levels.WARN:
        log.warn.apply(log, args)
        break
      case levels.ERROR:
        log.error.apply(log, args)
        break
      default:
        log.debug ? log.debug.apply(log, args) : log.info.apply(log, args)
        break
    }
  }

  setFilterMsg(msg) {
    if (!log || !log.setFilterMsg) {
      return
    }
    if (typeof msg !== 'string') {
      return
    }
    log.setFilterMsg(msg)
  }

  addFilterMsg(msg) {
    if (!log || !log.addFilterMsg) {
      return
    }
    if (typeof msg !== 'string') {
      return
    }
    log.addFilterMsg(msg)
  }
}

const logger = new Logger(levels.DEBUG) // 默认日志级别为 DEBUG

export default logger
export { levels }
