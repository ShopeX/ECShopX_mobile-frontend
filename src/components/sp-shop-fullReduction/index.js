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
import { classNames, JumpStoreIndex, JumpGoodDetail } from '@/utils'
import './index.scss'

function SpShopFullReduction(props) {
  const { info, status, count = 0, handeChange, showMoreIcon } = props
  const { promotion_tag, marketing_name } = info
  return (
    <View className={classNames('sp-shop-fullReduction')}>
      <View className='label-style'>{promotion_tag}</View>
      <Text className='text-style'>{marketing_name}</Text>
      {showMoreIcon && (
        <View className='pick-down' onClick={() => handeChange(!status)}>
          {count}种优惠
          <Image
            src='/assets/imgs/down_icon.png'
            className={status ? 'down_icon translate' : 'down_icon'}
          ></Image>
        </View>
      )}
    </View>
  )
}

export default SpShopFullReduction
