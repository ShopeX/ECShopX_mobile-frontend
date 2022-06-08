import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpPage, SpPrice, SpImage } from '@/components'
import './commission.scss'

const initialState = {
  total_fee: 0,
  rebate_total: 0,
  cash_withdrawal_rebate: 0,
  payed_rebate: 0
}
function CommunityCommission(props) {
  const [state, setState] = useImmer(initialState)
  const { total_fee, rebate_total, cash_withdrawal_rebate, payed_rebate } = state
  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { cash_withdrawal_rebate, payed_rebate, rebate_total, total_fee } =
      await api.community.getChiefCashWithdraw()

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
          <Text className='label'>活动总额(元)</Text>
          <SpPrice value={total_fee} size={40} />
        </View>
        <View className='comminssion-price'>
          <Text className='label'>活动佣金(元)</Text>
          <SpPrice value={rebate_total} size={40} />
        </View>
      </View>
      <View className='commission-bd'>
        <View className='label'>可提现金额(元)</View>
        <SpPrice value={cash_withdrawal_rebate} size={52} />
        <AtButton circle className='applay-withdraw' type='primary' onClick={() => {
          Taro.navigateTo({
            url: `/subpages/community/withdraw?withdraw=${cash_withdrawal_rebate}`
          })
        }}>
          申请提现
        </AtButton>
        <View className='withdraw-recode'>
          <SpImage src='withdraw.png' width={70} height={70} />
          <View className='recode-info'>
            <View className='title'>累计提取金额(元)</View>
            <SpPrice className='recode-money' value={payed_rebate}></SpPrice>
          </View>
          <View className='btn-recode' onClick={() => {
            Taro.navigateTo({
              url: '/subpages/community/withdraw-list'
            })
          }}>
            提现记录<Text className='iconfont icon-qianwang-01'></Text>
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
