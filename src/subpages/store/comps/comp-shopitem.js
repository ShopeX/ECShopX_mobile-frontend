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
import { useSelector } from 'react-redux'

import './comp-shopitem.scss'

function CompShopItem(props) {
  const { info } = props

  if (!info) {
    return null
  }

  return (
    <View className='comp-shopitem'>
      {/* <View className='shopitem-hd'>
        <Image className='shop-image' src={info.logo}></Image>
      </View> */}
      <View className='shopitem-bd'>
        <View className='shop-info'>
          <View className='distance'>{info.distance || '100km'}</View>
          <View className='name'>{info.store_name}</View>
          {info.isOpenDivided && (
            <View className='shop-tag'>
              <View className='tag'>已加入</View>
            </View>
          )}
        </View>
        <View className='shop-desc'>
          <Text>店铺地址：</Text>
          <Text>{info.store_address}</Text>
        </View>
        <View className='shop-desc'>
          {/* <Text className='iconfont icon-clock1' /> */}
          <Text>营业时间：</Text>
          <Text>{info.hour}</Text>
        </View>
        <View className='shop-desc'>
          <Text>联系电话：</Text>
          <Text>{info.mobile}</Text>
        </View>
      </View>
    </View>
  )
}

CompShopItem.options = {
  addGlobalClass: true
}

export default CompShopItem
