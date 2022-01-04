import { View, Image } from '@tarojs/components'
import Taro, { memo, useState } from '@tarojs/taro'

import './index.scss'

const SpNoShop = (props) => {
  const [tips] = useState(() => {
    return props.tips || '更多商家接入中，敬请期待'
  })

  return (
    <View className='noshop'>
      <View className='noShopContent'>
        <Image
          mode='widthFix'
          className='noShop'
          src={`${process.env.APP_IMAGE_CDN}/empty_data.png`}
        ></Image>
        <View className='tips'>{tips}</View>
      </View>
    </View>
  )
}

export default memo(SpNoShop)
