/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SG_SHOW_ADD_TIP } from '@/consts'
import { useTranslation, $t } from '@/i18n'
import './comp-addtip.scss'

function CompAddTip(props) {
  useTranslation()
  const showed = Taro.getStorageSync(SG_SHOW_ADD_TIP) || false

  const [timer, setTimer] = useState(null)

  useEffect(() => {
    if (!showed) {
      const timeId = setTimeout(() => {
        handleClickCloseAddTip()
      }, 10000)
      setTimer(timeId)
    }
  }, [])

  const handleClickCloseAddTip = () => {
    setTimer(null)
    Taro.setStorageSync(SG_SHOW_ADD_TIP, true)
  }

  if (!timer) {
    return null
  }

  return (
    <View className='comp-addtip'>
      <Text className='tip-text'>{$t('2ef722fa.a0e0f0')}</Text>
      <Text className='iconfont icon-guanbi' onClick={handleClickCloseAddTip}></Text>
    </View>
  )
}

CompAddTip.options = {
  addGlobalClass: true
}

export default CompAddTip
