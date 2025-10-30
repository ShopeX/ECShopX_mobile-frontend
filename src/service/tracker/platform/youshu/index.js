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
import Taro from '@tarojs/taro'
import sr from 'sr-sdk-wxapp'
import S from '@/spx'
import { tokenParse, getExtConfigData } from '@/utils'
import Base from '../base'
import actions from './actions'
import config from './config'

export default class Youshu extends Base {
  name = 'youshu'

  constructor(options = {}) {
    super(options)
    const extConfig = getExtConfigData()
    config.token = extConfig.youshutoken
    config.appid = extConfig.appid
    console.log('extConfig', config)

    sr.init(config)

    this.actions = actions
    this.sr = sr

    const token = S.getAuthToken()

    if (token) {
      const userInfo = tokenParse(token)
      this.setVar({
        user_id: userInfo.user_id,
        open_id: userInfo.openid,
        union_id: userInfo.unionid
      })
    }
  }

  trackEvent({ category, action, label, value }) {
    action = category

    // const name = typeof label === "string" ? label : "";
    const data = typeof label === 'string' ? { ...value } : { ...label, ...value }

    sr.track(action, data)
  }

  setVar(params) {
    sr.setUser({
      user_id: params.user_id,
      open_id: params.open_id,
      union_id: params.union_id
    })
  }

  componentDidShow() {
    sr.track('browse_wxapp_page')
  }

  componentDidMount() {
    // sr.track("browse_wxapp_page");
  }

  componentDidHide() {
    sr.track('leave_wxapp_page')
  }

  componentWillUnmount() {
    sr.track('leave_wxapp_page')
  }
}
