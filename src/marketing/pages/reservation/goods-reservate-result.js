/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { SpPage } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import { useNavigation } from '@/hooks'
import './goods-reservate-result.scss'

const initialState = {
  info: {}
}

function GoodReservateResult(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const router = useRouter()
  const { setNavigationBarTitle } = useNavigation()

  const { info } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { activity_info } = await api.user.registrationActivity({
      activity_id: router?.params.activity_id
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
        {$t('c2a4242b.b38ce3')}
      </View>
    </SpPage>
  )
}

GoodReservateResult.options = {
  addGlobalClass: true
}

export default GoodReservateResult
