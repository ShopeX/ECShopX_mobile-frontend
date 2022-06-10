import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPrice, SpCell } from '@/components'
import './cashier-alipay.scss'

function CashierAlipay(props) {
  const handlePay = () => {
    window.location.href = 'https://wxaurl.cn/M0qyMy2ArXo'
  }
  return (
    <View className='cashier-alipay'>
      <View className='cashier-hd'>
        <Text className='iconfont icon-zhifubao'></Text>
        <Text className='title'>支付宝付款</Text>
      </View>
      <View className="pay-price">
        <SpPrice value={100} size={60}/>
      </View>
      <View className="trade-info">
        <SpCell title='下单时间' value={'2022-06-01 12:00:00'}/>
        <SpCell title='订单号' value={'876545678909876'}/>
      </View>
      <View className='btn-wrap'>
        <AtButton onClick={handlePay}>立即支付</AtButton>
      </View>
    </View>
  )
}

CashierAlipay.options = {
  addGlobalClass: true
}

export default CashierAlipay
