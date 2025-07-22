import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { updateUserInfo, fetchUserFavs, clearUserInfo, updateIsNewUser } from '@/store/slices/user'
import { updateCount, clearCart } from '@/store/slices/cart'
import { purchaseClearCart } from '@/store/slices/purchase'
import api from '@/api'
import {
  isWeixin,
  showToast,
  entryLaunch,
  isAlipay,
  alipayAutoLogin,
  VERSION_SHUYUN
} from '@/utils'
import S from '@/spx'
import { SG_POLICY } from '@/consts/localstorage'
import { INVITE_ACTIVITY_ID } from '@/consts'

export default (props = {}) => {
  const { autoLogin = false, policyUpdateHook = () => {}, loginSuccess = () => {} } = props
  const [isLogin, setIsLogin] = useState(false)
  const dispatch = useDispatch()
  const { userInfo, isNewUser } = useSelector((state) => state.user)
  const { invite_code } = useSelector((state) => state.purchase)
  const $instance = getCurrentInstance()
  // const policyTime = useRef(0)

  useEffect(() => {
    const token = S.getAuthToken()
    if (!token) {
      autoLogin && !VERSION_SHUYUN && login()
    } else {
      setIsLogin(true)
      getUserInfo()
    }
  }, [])

  useEffect(() => {
    const token = S.getAuthToken()
    if (userInfo && token) {
      setIsLogin(true)
    }
  }, [userInfo])

  const login = async (shuyunappid) => {
    if (isWeixin || isAlipay) {
      // 隐私协议
      const checkResult = await checkPolicyChange()
      if (checkResult) {
        Taro.showLoading({ title: '' })
        const { code } = await getCode()

        try {
          const { token } = await getToken(code, shuyunappid)
          Taro.hideLoading()
          setToken(token)
          loginSuccess()
        } catch (e) {
          dispatch(updateIsNewUser(true))
          Taro.hideLoading()
          console.error('[hooks useLogin] auto login is failed: ', e)
          throw new Error(e)
        }
      } else {
        throw new Error('POLICY_NOT_AGREE')
      }
    }
  }

  const getCode = async () => {
    if (isWeixin) {
      return await Taro.login()
    }
    if (isAlipay) {
      return await alipayAutoLogin()
    }
  }

  const getToken = async (code, shuyunappid) => {
    const auth_type = isWeixin ? 'wxapp' : 'aliapp'
    const params = { code, showError: false, auth_type }

    if (shuyunappid) {
      params.shuyunappid = shuyunappid
    }

    return await api.wx.login(params)
  }

  const logout = () => {
    S.clearAuthToken()
    dispatch(clearUserInfo())
    dispatch(clearCart())
    dispatch(purchaseClearCart())
  }

  const setToken = async (token) => {
    const { redirect_url } = $instance.router.params
    console.log('redirect_url', redirect_url)
    S.setAuthToken(token)
    setIsLogin(true)
    await getUserInfo()
    // 导购UV统计
    entryLaunch.postGuideUV()
    entryLaunch.postGuideTask()
    dispatch(updateIsNewUser(false))
    dispatch(fetchUserFavs())
    dispatch(updateCount({ shop_type: 'distributor' })) // 获取购物车商品数量
    console.log('useLogin setToken redirect_url:', redirect_url, decodeURIComponent(redirect_url))
    if (redirect_url) {
      Taro.redirectTo({ url: decodeURIComponent(redirect_url) })
    }
  }

  const getUserInfo = async (refresh) => {
    if (!userInfo || refresh) {
      let params = {}
      const activity_id = S.get(INVITE_ACTIVITY_ID, true)
      if (activity_id) {
        params = { activity_id }
      }
      const _userInfo = await api.member.memberInfo(params)
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

  /**
   * @function 新用户注册
   */
  const registerUser = () => {}

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
