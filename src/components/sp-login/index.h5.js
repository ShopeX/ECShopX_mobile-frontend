import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import S from '@/spx'
import api from '@/api'
import { showToast, classNames, navigateTo } from '@/utils'
import { useLogin } from '@/hooks'
import qs from 'qs'
import './index.scss'

function SpLogin(props) {
  console.log('getCurrentInstance:', getCurrentInstance)
  const { className, children, size = 'normal', circle = false, onChange } = props
  const { isLogin, login, updatePolicyTime, setToken } = useLogin({
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const $instance = getCurrentInstance()
  /**
   *
   */
  const handleOAuthLogin = () => {}

  const handleOnChange = () => {
    if (isLogin) {
      onChange && onChange()
    } else {
      const { path } = $instance.router
      let url = `/subpages/auth/login?redirect=${encodeURIComponent(`${path}`)}`

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
