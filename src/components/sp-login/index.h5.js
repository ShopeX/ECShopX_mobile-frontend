import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import S from '@/spx'
import api from '@/api'
import { showToast, classNames, navigateTo } from '@/utils'
import { useLogin } from '@/hooks'
import qs from 'qs'
import './index.scss'

function SpLogin (props) {
  console.log('getCurrentInstance:', getCurrentInstance)
  const { className, children, size = 'normal', circle = false, onChange } = props
  const { isLogin, login, updatePolicyTime, setToken } = useLogin({
    policyUpdateHook: () => {
      setPolicyModal(true)
    }
  })
  /**
   *
   */

  const handleOnChange = () => {
    onChange && onChange()
  }

  /**
   *
   */
  const handleOAuthLogin = () => {
    const $instance = getCurrentInstance()
    const { path } = $instance.router
    let url = `/subpage/pages/auth/login?redirect=${encodeURIComponent(`${path}`)}`

    Taro.navigateTo({
      url
    })
  }

  return (
    <View className={classNames('sp-login', className)}>
      {isLogin && children}
      {!isLogin && (
        <Button
          className='login-btn'
          type='primary'
          size={size}
          circle={circle}
          onClick={handleOAuthLogin}
        >
          {children}
        </Button>
      )}
    </View>
  )
}

export default SpLogin
