import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { SpImage } from '@/components'

import './comp-shopitem.scss'

function CompShopItem (props) {
  const { info } = props

  const handleClick = () => {}

  if (!info) {
    return null
  }

  return (
    <View className='comp-shopitem' onClick={handleClick}>
      <View className='shopitem-hd'>
        <Image className='shop-image' src={info.logo}></Image>
      </View>
      <View className='shopitem-bd'>
        <View className='shop-info'>
          <View className='name'>{info.name}</View>
          <View className='distance'>{info.distance || '100km'}</View>
        </View>
        <View className='business-hours'>
          <Text className='iconfont icon-clock1' />
          <Text>{info.hour}</Text>
        </View>
        <View className='shop-address'>
          <Text className='iconfont icon-dizhiguanli-01' />
          <Text>{info.address}</Text>
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
