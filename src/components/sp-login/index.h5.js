/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
