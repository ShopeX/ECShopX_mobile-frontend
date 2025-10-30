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
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'

import './comp-panel.scss'

function CompPanel(props) {
  const { title, extra, icon = 'icon-qianwang-01', children, className, onLink = () => {} } = props
  // if(!children) {
  //   return null
  // }
  return (
    <View
      className={classNames(
        {
          'comp-panel': true
        },
        className
      )}
    >
      <View className='comp-panel-hd'>
        <View className='panel-title'>{title}</View>
        {extra && (
          <View className='panel-extra' onClick={onLink}>
            <Text className='extra'>{extra}</Text>
            <Text
              className={classNames(
                {
                  iconfont: true
                },
                icon
              )}
            ></Text>
          </View>
        )}
      </View>
      <View className='comp-panel-bd'>{children}</View>
    </View>
  )
}

CompPanel.options = {
  addGlobalClass: true
}

export default CompPanel
