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
    const { token } = $instance.router.params
    if(token) {
      Taro.setStorageSync(SG_DIANWU_TOKEN, token)
    }
  }, [])


  return {

  }
}
