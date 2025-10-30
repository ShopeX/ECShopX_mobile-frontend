// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SG_SHOW_ADD_TIP } from '@/consts'
import './comp-addtip.scss'

function CompAddTip(props) {
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
