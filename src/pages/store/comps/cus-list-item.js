import Taro, { memo } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import './cus-list-item.scss'

const StoreListItem = (props) => {
  const { info, onClick = () => {} } = props

  const handleClick = () => {
    onClick && onClick()
  }

  if (!info) return null
  const distance =
    info.distance < 1
      ? Math.round(info.distance * Math.pow(10, 3))
      : Number(info.distance).toFixed(2)

  return (
    <View className='cus-list-item' onClick={handleClick}>
      <View className='list-left'>
        <Image className='list-imgs' src={info.logo}></Image>
      </View>
      <View className='list-center'>
        <View className='list-title'>
          <View className='list-title-left'>{info.name}</View>
          {distance && (
            <View className='list-title-right'>
              {distance}
              {info.distance_unit}
            </View>
          )}
        </View>
        <View className='list-time'>
          <Text className='iconfont icon-clock1 clockicons' />
          <Text>{info.hour}</Text>
        </View>
        <View className='list-adress'>
          <Text className='iconfont icon-dizhiguanli-01 adressicons' />
          <Text>{info.store_address}</Text>
        </View>

        <View className='list-tag'>
          {info.tagList.map((item) => (
            <View className='cus-tag' key={item.tag_id}>
              {item.tag_name}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
StoreListItem.options = {
  addGlobalClass: true
}

export default memo(StoreListItem)
