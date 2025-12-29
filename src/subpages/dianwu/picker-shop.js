/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View } from '@tarojs/components'
import './picker-shop.scss'

function DianwuPickerShop(props) {
  return <View className='page-dianwu-picker-shop'></View>
}

DianwuPickerShop.options = {
  addGlobalClass: true
}

export default DianwuPickerShop
