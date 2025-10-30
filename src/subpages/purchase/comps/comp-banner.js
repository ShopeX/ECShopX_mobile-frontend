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
import { classNames, styleNames } from '@/utils'

import './comp-banner.scss'

function CompsBanner(props) {
  const { className, src, info } = props

  const handleClick = () => {
    const { urlOpen, pageUrl, appId } = info
    if (urlOpen) {
      Taro.navigateToMiniProgram({
        appId: appId,
        path: pageUrl
      })
    }
  }
  return (
    <View
      className={classNames(
        {
          'comp-banner': true
        },
        className
      )}
      onClick={handleClick}
    >
      <SpImage src={src} width='auto' />
    </View>
  )
}

CompsBanner.options = {
  addGlobalClass: true
}

export default CompsBanner
