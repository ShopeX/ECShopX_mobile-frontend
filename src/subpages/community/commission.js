/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow } from '@tarojs/taro'
import api from '@/api'
import * as communityApi from '@/api/community'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpPage, SpPrice, SpImage } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './commission.scss'

const initialState = {
  total_fee: 0,
  rebate_total: 0,
  cash_withdrawal_rebate: 0,
  payed_rebate: 0
}
function CommunityCommission(props) {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { total_fee, rebate_total, cash_withdrawal_rebate, payed_rebate } = state

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('603b57d2.42f819') })
  }, [i18n.language])

  useDidShow(() => {
    fetch()
  })

  const fetch = async () => {
    const { cash_withdrawal_rebate, payed_rebate, rebate_total, total_fee } =
      await communityApi.getChiefCashWithdraw()

    setState((draft) => {
      draft.total_fee = total_fee / 100
      draft.rebate_total = rebate_total / 100
      draft.cash_withdrawal_rebate = cash_withdrawal_rebate / 100
      draft.payed_rebate = payed_rebate / 100
    })
  }

  return (
    <SpPage className='page-community-commission'>
      <View className='commission-hd'>
        <View className='total-amount'>
          <Text className='label'>{$t('ac195c85.4b131f')}</Text>
          <SpPrice value={total_fee} size={40} />
        </View>
        <View className='comminssion-price'>
          <Text className='label'>{$t('ac195c85.944012')}</Text>
          <SpPrice value={rebate_total} size={40} />
        </View>
      </View>
      <View className='commission-bd'>
        <View className='label'>{$t('ac195c85.7e1a7b')}</View>
        <SpPrice value={cash_withdrawal_rebate} size={52} />
        <AtButton
          circle
          className='applay-withdraw'
          type='primary'
          onClick={() => {
            Taro.navigateTo({
              url: `/subpages/community/withdraw?withdraw=${cash_withdrawal_rebate}`
            })
          }}
        >
          {$t('ac195c85.37fec4')}
        </AtButton>
        <View className='withdraw-recode'>
          <SpImage src='withdraw.png' width={70} height={70} />
          <View className='recode-info'>
            <View className='title'>{$t('ac195c85.a839df')}</View>
            <SpPrice className='recode-money' value={payed_rebate}></SpPrice>
          </View>
          <View
            className='btn-recode'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpages/community/withdraw-list'
              })
            }}
          >
            {$t('ac195c85.103053')}
            <Text className='iconfont icon-qianwang-01'></Text>
          </View>
        </View>
      </View>
    </SpPage>
  )
}

CommunityCommission.options = {
  addGlobalClass: true
}

export default CommunityCommission
