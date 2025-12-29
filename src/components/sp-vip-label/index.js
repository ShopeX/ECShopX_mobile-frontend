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
import { classNames } from '@/utils'
import { View } from '@tarojs/components'
import './index.scss'

function SpVipLabel(props) {
  const { content = '', type = 'vip' } = props
  if (!content) {
    return null
  }
  return <View className={classNames('sp-vip-label', type)}>{content}</View>
}

SpVipLabel.options = {
  addGlobalClass: true
}

export default SpVipLabel
