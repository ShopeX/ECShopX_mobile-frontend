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
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserInfo, fetchUserFavs } from '@/store/slices/user'
import { updateCount } from '@/store/slices/cart'
import api from '@/api'
import { isWeixin, showToast, entryLaunch } from '@/utils'
import S from '@/spx'
import { SG_DIANWU_TOKEN } from '@/consts/localstorage'

export default (props = {}) => {
  const $instance = getCurrentInstance()

  useEffect(() => {
    const { token } = $instance.router?.params || {}
    if (token) {
      Taro.setStorageSync(SG_DIANWU_TOKEN, token)
    }
  }, [])

  return {}
}
