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
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'
import { classNames } from '@/utils'
import './index.scss'

function SpFloatLayout(props) {
  const {
    title,
    children,
    className,
    hideClose = false,
    renderFooter,
    open = false,
    onClose = () => {}
  } = props

  return (
    <View
      className={classNames('sp-float-layout', className, {
        active: open
      })}
      catchMove
    >
      <View className='sp-float-layout__overlay' onClick={onClose}></View>
      <View className='sp-float-layout__body'>
        {!hideClose && <Text className='iconfont icon-guanbi' onClick={onClose}></Text>}
        {title && (
          <View className='sp-float-layout-hd'>
            <Text className='layout-title'>{title}</Text>
          </View>
        )}
        <ScrollView className='sp-float-layout-bd' scrollY>
          {children}
        </ScrollView>
        {renderFooter && <View className='sp-float-layout-ft'>{renderFooter}</View>}
      </View>
    </View>
  )
}

SpFloatLayout.options = {
  addGlobalClass: true
}

export default SpFloatLayout
