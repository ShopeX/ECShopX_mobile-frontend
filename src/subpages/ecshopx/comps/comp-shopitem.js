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
import { SpImage } from '@/components'

import './comp-shopitem.scss'

function CompShopItem(props) {
  const { info } = props

  if (!info) {
    return null
  }

  return (
    <View className='comp-shopitem'>
      <View className='shopitem-hd'>
        <Image className='shop-image' src={info.logo}></Image>
      </View>
      <View className='shopitem-bd'>
        <View className='shop-info'>
          <View className='name'>{info.store_name}</View>
          <View className='distance'>{info.distance || ''}</View>
        </View>
        <View className='business-hours'>
          <Text className='iconfont icon-clock1' />
          <Text>{info.hour}</Text>
        </View>
        <View className='shop-address'>
          <Text className='iconfont icon-dizhiguanli-01' />
          <Text>{info.store_address}</Text>
        </View>

        <View className='shop-tag'>
          {info.tagList.map((item) => (
            <View className='tag' key={item.tag_id}>
              {item.tag_name}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

CompShopItem.options = {
  addGlobalClass: true
}

export default CompShopItem
