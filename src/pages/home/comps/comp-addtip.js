import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SG_SHOW_ADD_TIP } from '@/consts'
import './comp-addtip.scss'

function CompAddTip (props) {
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
      <Text class='tip-text'>点击“•●•”添加到我的小程序，微信首页下拉即可快速访问店铺</Text>
      <Text className='iconfont icon-guanbi' onClick={handleClickCloseAddTip}></Text>
    </View>
  )
}

CompAddTip.options = {
  addGlobalClass: true
}

export default CompAddTip
