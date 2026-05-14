/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import * as communityApi from '@/api/community'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpPrice, SpCell, SpInput as AtInput } from '@/components'
import { showToast } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './withdraw.scss'

const initialState = {
  bankName: '',
  bankCardNo: '',
  money: ''
}
function CommunityWitdraw(props) {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const { withdraw } = $instance?.router?.params
  const [state, setState] = useImmer(initialState)
  const { bankName, bankCardNo, money } = state

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('b14da9c5.db7971') })
  }, [i18n.language])

  useDidShow(() => {
    fetch()
  })

  const fetch = async () => {
    const { bank_name, bankcard_no } = await communityApi.getCashWithDrawAccount()
    setState((draft) => {
      draft.bankName = bank_name
      draft.bankCardNo = bankcard_no
    })
  }

  const onWithDraw = async () => {
    if (!money) {
      showToast($t('ffa0d23c.d7b3e3'))
      return
    }
    if (money <= 0) {
      showToast($t('ffa0d23c.b0625f'))
      return
    }
    if (!bankName || !bankCardNo) {
      showToast($t('ffa0d23c.b32296'))
      return
    }
    if (money > withdraw) {
      showToast($t('ffa0d23c.5723e2'))
      return
    }

    await communityApi.chiefCashWithdraw({
      money: money * 100,
      pay_type: 'bankcard' //bankcard=银行卡;alipay=支付宝;wechat=微信
    })
    showToast($t('ffa0d23c.efeb59'))
    Taro.navigateBack()
  }

  const onInputChange = (value) => {
    setState((draft) => {
      draft.money = value
    })
  }

  return (
    <SpPage
      className='page-community-withdraw'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={onWithDraw}>
            {$t('ffa0d23c.939d53')}
          </AtButton>
        </View>
      }
    >
      <View className='withdraw-hd'>
        <View className='label'>{$t('ffa0d23c.7b37f0')}</View>
        <SpPrice size={52} value={withdraw} />
      </View>
      <View className='withdraw-bd'>
        <View className='label'>{$t('ffa0d23c.3e701d')}</View>
        <View className='withdraw-money'>
          <Text className='rmb'>¥</Text>
          <AtInput name='money' value={money} onChange={onInputChange} />
          <AtButton
            circle
            className='btn-allwithdraw'
            onClick={() => {
              setState((draft) => {
                draft.money = withdraw
              })
            }}
          >
            {$t('ffa0d23c.5eb161')}
          </AtButton>
        </View>
      </View>
      <View className='withdraw-ft'>
        <View className='label'>{$t('ffa0d23c.ef3bf8')}</View>
        <SpCell
          title={$t('ffa0d23c.774267')}
          isLink
          onClick={() => {
            Taro.navigateTo({
              url: '/subpages/community/withdraw-bank'
            })
          }}
        >
          {!bankName && <Text>{$t('ffa0d23c.d2cb3c')}</Text>}
          {bankName && (
            <View>
              <Text className='iconfont icon-dianpushouye'></Text>
              {`${bankName}（${bankCardNo}）`}
            </View>
          )}
        </SpCell>
      </View>
      <View className='withdraw-tip'>
        <View className='tip-content'>{$t('ffa0d23c.17ee5d')}</View>
        <View className='tip-content'>{$t('ffa0d23c.bd1c55')}</View>
      </View>
    </SpPage>
  )
}

CommunityWitdraw.options = {
  addGlobalClass: true
}

export default CommunityWitdraw
