import Taro from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserInfo, fetchUserFavs } from '@/store/slices/guide'
import { updateCount } from '@/store/slices/cart'
import api from '@/api'
import { isWeixin, showToast } from '@/utils'
import S from '@/spx'
import { SG_POLICY_UPDATETIME, SG_USER_INFO } from '@/consts/localstorage'

export default (props = {}) => {
  const { autoLogin = false } = props
  const [isLogin, setIsLogin] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.guide)
  // const policyTime = useRef(0)

  useEffect(() => {
    const token = S.getAuthToken()
    if (!token) {
      autoLogin && login()
    } else {
      setIsLogin(true)
      // getUserInfo()
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      setIsLogin(true)
    }
  }, [userInfo])

  //获取企业微信code
  const getQwLoginCode = () => {
    return new Promise((reslove, reject) => {
      wx.qy.login({
        success: (res) => {
          reslove(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  const login = async () => {
    const { code } = await getQwLoginCode()
    try {
      const guildeInfo = await api.user.getQwUserInfo({
        appname: `ecshopx`,
        code
      })
      const { salesperson_id, distributor_id, session3rd } = guildeInfo
      setToken(session3rd)
      //查询当前导购门店信息是否有效
      const { status } = await api.guide.is_valid({
        salesperson_id,
        distributor_id
      })
      dispatch(
        updateUserInfo({
          ...guildeInfo,
          store_isValid: status
        })
      )
      setIsLogin(true)
    } catch (e) {
      setIsNewUser(true)
      console.error('[hooks useQwLogin] guide login is failed: ', e)
      throw new Error(e)
    }
  }

  const setToken = async (token) => {
    S.setAuthToken(token)
  }

  return {
    isLogin,
    isNewUser,
    login,
    setToken
  }
}
