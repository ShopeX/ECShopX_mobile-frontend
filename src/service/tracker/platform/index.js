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
const providers = {}

if (
  process.env.TARO_ENV == 'weapp' ||
  (process.env.TARO_ENV === 'alipay' && process.env.APP_TRACK)
) {
  Object.assign(providers, {
    [process.env.APP_TRACK]: require(`./` + process.env.APP_TRACK).default
  })
}

class Trackers {
  constructor() {
    this.providers = providers
  }

  get(name, options) {
    const Tracker = this.providers[name]
    return new Tracker(options)
  }
}

export default new Trackers()
