/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { useTranslation, $t } from '@/i18n'
import './comp-shopitem.scss'

function CompShopItem(props) {
  useTranslation()
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
          {!!info.distance && <View className='distance'>{info.distance}</View>}
          <View className='name'>{info.store_name}</View>
          {info.isOpenDivided && (
            <View className='shop-tag'>
              <View className='tag'>{$t('17a2cf99.711785')}</View>
            </View>
          )}
        </View>
        <View className='shop-desc'>
          <Text>{$t('17a2cf99.e252ad')}</Text>
          <Text>{info.store_address}</Text>
        </View>
        <View className='shop-desc'>
          {/* <Text className='iconfont icon-clock1' /> */}
          <Text>{$t('17a2cf99.6cd6e3')}</Text>
          <Text>{info.hour}</Text>
        </View>
        <View className='shop-desc'>
          <Text>{$t('17a2cf99.7d33dc')}</Text>
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
