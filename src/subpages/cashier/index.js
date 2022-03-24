import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage } from '@/components'
import './index.scss'

function CashierIndex(props) {
  return <SpPage className='page-cashier-index'></SpPage>
}

CashierIndex.options = {
  addGlobalClass: true
}

export default CashierIndex
