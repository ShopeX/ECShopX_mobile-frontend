// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
        {/* <View className='good-reservate-result__title'>
          <Text className='icon-wancheng iconfont'> </Text>
          股东您好，报名已填报完成！
        </View> */}
        {info?.joinTips && <View className='good-reservate-result__subtitle'>{info.joinTips}</View>}
      </View>

      {info?.submitFormTips && (
        <View className='good-reservate-result__tips'>{info.submitFormTips}</View>
      )}
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
