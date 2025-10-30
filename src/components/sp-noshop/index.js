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
