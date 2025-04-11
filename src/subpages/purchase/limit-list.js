import Taro, {
  useDidShow,
  useShareAppMessage,
  getCurrentPages,
  getCurrentInstance,
  useRouter
} from '@tarojs/taro'
import { useState, useEffect, useCallback, useRef } from 'react'
import { View, ScrollView, Text, Image, Button } from '@tarojs/components'
import { SG_ROUTER_PARAMS, SG_APP_CONFIG, MERCHANT_TOKEN, SG_TOKEN } from '@/consts'
import { updateUserInfo } from '@/store/slices/user'
import { updateIsOpenPurchase } from '@/store/slices/purchase'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'

import {
  SpLogin,
  SpImage,
  SpPrice,
  CouponModal,
  SpPrivacyModal,
  SpTabbar,
  SpPage
} from '@/components'
import api from '@/api'
import {
  navigateTo,
  getThemeStyle,
  styleNames,
  classNames,
  showToast,
  showModal,
  isWeixin,
  normalizeQuerys,
  log,
  isEmpty,
  VERSION_IN_PURCHASE
} from '@/utils'


import './limit-list.scss'

const initialState = {
  list:[]
}

function MemberIndex(props) {


  const [state, setState] = useImmer(initialState)
  const router = useRouter()

  const { list } = state



  useEffect(() => {
   fetch()
  }, [])

  const fetch = () => {
    setState(darft=>{
      darft.list = [1,2,3]
    })
  }

  const limitNode = ({},idx) => {
    return (
      <View key={idx}>
        123
      </View>
    )
  }


  return (
    <SpPage className='page-limit-list' >
       <View className='limit-list__hd'></View>
     {
      list.length > 0 && list.map((item,idx)=>(
        limitNode(item,idx)
      ))
     }

    </SpPage>
  )
}

export default MemberIndex
