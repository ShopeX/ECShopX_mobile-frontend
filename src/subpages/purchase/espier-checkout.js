import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View } from '@tarojs/components'
import './espier-checkout.scss'

function PurchaseCheckout(props) {
  return <View className='page-purchase-espiercheckout'>page-purchase-espiercheckout</View>
}

PurchaseCheckout.options = {
  addGlobalClass: true
}

export default PurchaseCheckout
