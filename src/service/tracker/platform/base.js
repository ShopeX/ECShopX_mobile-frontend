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
export default class Base {
  constructor(options = {}) {
    this.options = options
  }

  setVar() {}
  trackEvent() {}

  componentDidMount() {}
  componentDidHide() {}

  dispatch(type, payload) {
    try {
      const actions = this.actions
      if (!actions) {
        console.error('tracker actions not found:')
        return
      }
      if (actions) {
        const fn = actions[type]
        if (fn) {
          if (typeof payload === 'function') {
            payload = payload(this)
          }
          return fn(payload)
        }

        console.error('tracker action not defined: ', type, ' payload: ', payload)
      }
    } catch (e) {
      console.error(e)
    }
  }
}
