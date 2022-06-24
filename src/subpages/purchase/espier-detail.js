import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View } from '@tarojs/components'
import './espier-detail.scss'

function PurchaseEspierDetail(props) {
  return <View className='page-purchase-espierdetail'>page-purchase-detail</View>
}

PurchaseEspierDetail.options = {
  addGlobalClass: true
}

export default PurchaseEspierDetail
