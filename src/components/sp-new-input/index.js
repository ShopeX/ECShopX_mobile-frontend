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
import { View, Input } from '@tarojs/components'
import { classNames, getNavbarHeight } from '@/utils'
import './index.scss'

const SpNewInput = (props) => {
  const { placeholder = '', isStatic = false, onClick = () => {}, onConfirm = () => {} } = props

  const [value, setValue] = useState('')

  const handleInput = ({ detail: { value } }) => {
    setValue(value)
  }

  const handleConfirm = ({ detail: { value } }) => {
    onConfirm && onConfirm(value)
  }

  return (
    <View className={classNames('sp-component-newinput')}>
      <View className={classNames('sp-component-newinput-icon')}>
        <View className='iconfont icon-sousuo-01'></View>
      </View>
      <View className={classNames('sp-component-newinput-placeholder')}>
        <View className='text' onClick={onClick}>
          {isStatic ? (
            placeholder
          ) : (
            <Input
              className='input'
              value={value}
              onInput={handleInput}
              onConfirm={handleConfirm}
              placeholder={placeholder}
              placeholderClass='placeholderClass'
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default memo(SpNewInput)
