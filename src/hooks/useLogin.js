import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { updateUserInfo, fetchUserFavs, clearUserInfo } from '@/store/slices/user'
import { updateCount, clearCart } from '@/store/slices/cart'
import api from '@/api'
import { isWeixin, showToast, entryLaunch } from '@/utils'
import S from '@/spx'
import { SG_POLICY } from '@/consts/localstorage'

export default (props = {}) => {
  const { autoLogin = false, policyUpdateHook = () => {} } = props
  const [isLogin, setIsLogin] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.user)
  const $instance = getCurrentInstance()
  // const policyTime = useRef(0)

  useEffect(() => {
    const token = S.getAuthToken()
    if (!token) {
      autoLogin && login()
    } else {
      setIsLogin(true)
      getUserInfo()
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      setIsLogin(true)
    }
  }, [userInfo])

  const login = async () => {
    if (isWeixin) {
      // 隐私协议
      const checkResult = await checkPolicyChange()
      if (checkResult) {
        Taro.showLoading()
        const { code } = await Taro.login()
        try {
          const { token } = await api.wx.login({ code, showError: false })
          Taro.hideLoading()
          setToken(token)
        } catch (e) {
          setIsNewUser(true)
          Taro.hideLoading()
          console.error('[hooks useLogin] auto login is failed: ', e)
          throw new Error(e)
        }
      }
    }
  }

  const logout = () => {
    S.clearAuthToken()
    dispatch(clearUserInfo())
    dispatch(clearCart())
  }

  const setToken = async (token) => {
    const { redirect_url } = $instance.router.params
    S.setAuthToken(token)
    setIsLogin(true)
    await getUserInfo()
    // 导购UV统计
    entryLaunch.postGuideUV()
    entryLaunch.postGuideTask()
    dispatch(fetchUserFavs())
    dispatch(updateCount({ shop_type: 'distributor' })) // 获取购物车商品数量
    console.log('useLogin setToken redirect_url:', redirect_url, decodeURIComponent(redirect_url))
    if (redirect_url) {
      Taro.redirectTo({ url: decodeURIComponent(redirect_url) })
    }
  }

  const getUserInfo = async (refresh) => {
    if (!userInfo || refresh) {
      const _userInfo = await api.member.memberInfo()
      // 兼容老版本 后续优化
      const { username, avatar, user_id, mobile, open_id } = _userInfo.memberInfo
      Taro.setStorageSync('userinfo', {
        username: username,
        avatar: avatar,
        userId: user_id,
        isPromoter: _userInfo.is_promoter,
        mobile: mobile,
        openid: open_id,
        vip: _userInfo.vipgrade ? _userInfo.vipgrade.vip_type : ''
      })
      dispatch(updateUserInfo(_userInfo))
    }
  }

  /**
   * @function 检查隐私协议是否变更
   * @return false: 协议已变更
   */
  const checkPolicyChange = async () => {

    const policyInfo = Taro.getStorageSync(SG_POLICY) || {
      policyUpdateTime: null,
      localPolicyUpdateTime: null,
      agreeTime: null,
      lastRequestTime: null
    }
    const { policyUpdateTime, localPolicyUpdateTime, lastRequestTime } = policyInfo
    let diffMilliseconds = 0
    if (lastRequestTime) {
      diffMilliseconds = dayjs().diff(dayjs(lastRequestTime))
    }
    console.log('diffMilliseconds:', diffMilliseconds)
    // 超过3分钟缓存记录，重新拉取隐私协议
    if (!policyUpdateTime || diffMilliseconds > 3 * 60 * 1000) {
      const { update_time } = await api.wx.getPrivacyTime()
      const res = localPolicyUpdateTime === update_time * 1000
      policyUpdateHook(!res)
      Taro.setStorageSync(SG_POLICY, {
        ...policyInfo,
        policyUpdateTime: update_time * 1000,
        lastRequestTime: new Date().getTime()
      })
      return res
    } else {
      const res = localPolicyUpdateTime === policyUpdateTime
      policyUpdateHook(!res)
      return res
    }
  }

  /**
   * @function 更新隐私协议同意时间
   */
  const updatePolicyTime = async () => {
    const policyInfo = Taro.getStorageSync(SG_POLICY)
    Taro.setStorageSync(SG_POLICY, {
      ...policyInfo,
      localPolicyUpdateTime: policyInfo.policyUpdateTime,
      agreeTime: new Date().getTime()
    })
  }

  /**
   * @function 获取用户信息授权（小程序）
   */
  const getUserInfoAuth = (validate = true) => {
    return new Promise((resolve, reject) => {
      console.log('getUserInfoAuth:获取用户信息授权（小程序）')
      const token = S.getAuthToken()
      if (!token && validate) {
        showToast('请先登录')
        return
        // reject()
      }
      if (isWeixin) {
        const { avatar, username } = userInfo
        if (avatar && username) {
          resolve()
        } else {
          wx.getUserProfile({
            desc: '用于完善会员资料',
            success: async (data) => {
              const { userInfo } = data
              await api.member.updateMemberInfo({
                username: userInfo.nickName,
                avatar: userInfo.avatarUrl
              })
              await getUserInfo(true)
              resolve()
            },
            fail: (e) => {
              console.error(e)
            }
          })
        }
      } else {
        resolve()
      }
    })
  }

  return {
    isLogin,
    isNewUser,
    login,
    logout,
    updatePolicyTime,
    setToken,
    getUserInfoAuth,
    getUserInfo,
    checkPolicyChange
  }
}
