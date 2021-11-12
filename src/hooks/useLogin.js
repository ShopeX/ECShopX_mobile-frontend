import Taro, { useState, useEffect } from '@tarojs/taro'
import { STORAGE_TOKEN, STORAGE_POLICY_UPDATETIME } from '@/consts/localstorage'

export default (props) => {
  const [isLogin, setIsLogin] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)

  useEffect(() => {
    const STORAGE_POLICY_UPDATETIME = Taro.getStorageSync(STORAGE_POLICY_UPDATETIME)
    // 隐私政策没有点击过同意
    if (!STORAGE_POLICY_UPDATETIME) {
      setShowPolicy(true)
    }
    //   const token = Taro.getStorageSync(STORAGE_TOKEN);
    // setIsLogin(!!token)
  }, [])

  return {
    isLogin,
    showPolicy
  }
}
