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
import { View, Button } from '@tarojs/components'
import S from '@/spx'
import api from '@/api'
import { showToast, classNames, navigateTo } from '@/utils'
import { useLogin, useLocation } from '@/hooks'
import qs from 'qs'
import './index.scss'

function SpLogin(props) {
  console.log('getCurrentInstance:', getCurrentInstance)
  const { className, children, size = 'normal', circle = false, onChange } = props
  const { updateAddress } = useLocation()
  const { isLogin, login, setToken } = useLogin({
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    },
    loginSuccess: () => {
      updateAddress()
    }
  })
  const $instance = getCurrentInstance()
  /**
   *
   */
  const handleOAuthLogin = () => {}

  const handleOnChange = (e) => {
    e.stopPropagation()
    if (isLogin) {
      onChange && onChange(e)
    } else {
      const { path, params } = $instance.router
      const _path = `${path.split('?')[0]}?${qs.stringify(params)}`
      let url = `/subpages/auth/login?redirect=${encodeURIComponent(`${_path}`)}`

      Taro.navigateTo({
        url
      })
    }
  }

  return (
    <View className={classNames('sp-login', className)} onClick={handleOnChange}>
      {children}
    </View>
  )
}

export default SpLogin
