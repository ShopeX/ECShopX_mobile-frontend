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
import Taro, { useState, memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import './button.scss'

const Button = (props) => {
  const { onConfirm = () => {}, onReset = () => {} } = props

  return (
    <View className={classNames('filter-button')}>
      <View className='reset' onClick={onReset}>
        重置
      </View>
      <View className='confirm' onClick={onConfirm}>
        确定并筛选
      </View>
    </View>
  )
}

export default memo(Button)
