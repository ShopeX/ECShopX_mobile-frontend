import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Switch, Text, Button, ScrollView } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpPage, SpAddress, SpInput as AtInput } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import { useNavigation } from '@/hooks'

import './goods-reservate-result.scss'

const initialState = {
  info: {}
}

function GoodReservateResult(props) {
  const [state, setState] = useImmer(initialState)
  const router = useRouter()
  const { setNavigationBarTitle } = useNavigation()

  const { info } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { activity_info } = await api.user.registrationActivity({
      activity_id: router.params.activity_id
    })
    const _info = pickBy(activity_info, {
      joinTips: 'join_tips',
      submitFormTips: 'submit_form_tips',
      activityName: 'activity_name'
    })

    setNavigationBarTitle(_info.activityName)

    setState((draft) => {
      draft.info = _info
    })
  }

  const handleRecord = () => {
    Taro.reLaunch({ url: '/marketing/pages/member/item-activity' })
  }

  return (
    <SpPage className='good-reservate-result'>
      <View className='good-reservate-result__title-box'>
        <View className='good-reservate-result__title'>
          <Text className='icon-wancheng iconfont'> </Text>
          股东您好，报名已填报完成！
        </View>
        <View className='good-reservate-result__subtitle'>{info?.joinTips}</View>
      </View>

      <View className='good-reservate-result__tips'>{info?.submitFormTips}</View>
      <View className='good-reservate-result__btn' onClick={handleRecord}>
        查看报名记录
      </View>
    </SpPage>
  )
}

GoodReservateResult.options = {
  addGlobalClass: true
}

export default GoodReservateResult
