import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { SpPage, SpPrice, SpCell } from '@/components'
import { showToast } from '@/utils'
import './withdraw.scss'

const initialState = {
  bankName: '',
  bankCardNo: '',
  money: ''
}
function CommunityWitdraw(props) {
  const $instance = getCurrentInstance()
  const { withdraw } = $instance.router.params
  const [state, setState] = useImmer(initialState)
  const { bankName, bankCardNo, money } = state

  useDidShow(() => {
    fetch()
  })

  const fetch = async () => {
    const { bank_name, bankcard_no } = await api.community.getCashWithDrawAccount()
    setState((draft) => {
      draft.bankName = bank_name
      draft.bankCardNo = bankcard_no
    })
  }

  const onWithDraw = async () => {
    if(!money) {
      showToast('请输入提现金额')
      return
    }
    if(money <= 0) {
      showToast('提现金额大于0')
      return
    }
    if(!bankName || !bankCardNo) {
      showToast('请添加银行卡信息')
      return
    }
    if(money > withdraw) {
      showToast('不能超过可提现金额')
      return
    }

    await api.community.chiefCashWithdraw({ 
      money: money * 100,
      pay_type: "bankcard"   //bankcard=银行卡;alipay=支付宝;wechat=微信
    })
    showToast('提现申请成功')
    Taro.navigateBack()
    
  }

  const onInputChange = (value) => {
    setState(draft => {
      draft.money = value
    })
  }

  return (
    <SpPage className='page-community-withdraw' renderFooter={
      <View className='btn-wrap'>
        <AtButton circle type='primary' onClick={onWithDraw}>
          提交
        </AtButton>
      </View>
    }>
      <View className='withdraw-hd'>
        <View className='label'>可提现金额 (元)</View>
        <SpPrice size={52} value={withdraw} />
      </View>
      <View className='withdraw-bd'>
        <View className='label'>提现金额 (元)</View>
        <View className='withdraw-money'>
          <Text className='rmb'>¥</Text>
          <AtInput name="money" value={money} onChange={onInputChange} />
          <AtButton circle className='btn-allwithdraw' onClick={() => {
            setState(draft => {
              draft.money = withdraw
            })
          }}>
            全部提现
          </AtButton>
        </View>
      </View>
      <View className='withdraw-ft'>
        <View className='label'>提现到</View>
        <SpCell
          title='银行卡'
          isLink
          onClick={() => {
            Taro.navigateTo({
              url: '/subpages/community/withdraw-bank'
            })
          }}
        >
          {!bankName && <Text>添加银行卡</Text>}
          {bankName && (
            <View>
              <Text className='iconfont icon-dianpushouye'></Text>
              {`${bankName}（${bankCardNo}）`}
            </View>
          )}
        </SpCell>
      </View>
      <View className='withdraw-tip'>
        <View className='tip-content'>• 提现至银行卡需实名认证</View>
        <View className='tip-content'>• 工作人员会通过线下汇款至填写卡号</View>
      </View>
    </SpPage>
  )
}

CommunityWitdraw.options = {
  addGlobalClass: true
}

export default CommunityWitdraw
