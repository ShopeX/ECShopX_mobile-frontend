import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'

import './comp-shopitem.scss'

function CompShopItem(props) {
  const { info } = props
  const { open_divided } = useSelector((state) => state.sys)

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
          {!open_divided && <View className='distance'>{info.distance || '100km'}</View>}
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
