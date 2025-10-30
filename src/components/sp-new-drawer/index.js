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
import Taro, { useState, memo, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpPopup } from '@/components'
import './index.scss'

const SpNewDrawer = (props) => {
  const { className, visible, width = '84%', children, onClose = () => {} } = props

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return loaded ? (
    <SpPopup visible={visible} right width={width} borderRadius onClose={onClose}>
      <View className={classNames('sp-component-newdrawer', className)}>{children}</View>
    </SpPopup>
  ) : null
}

export default memo(SpNewDrawer)
