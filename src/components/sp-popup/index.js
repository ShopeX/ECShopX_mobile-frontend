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
import { classNames } from '@/utils'
import { View } from '@tarojs/components'
import './index.scss'

const Popup = (props) => {
  const {
    borderRadius = false,
    height,
    width = '320px',
    visible = false,
    children,
    onClose = () => {},
    right = false,
    className
  } = props

  const handleClose = (e) => {
    onClose(e)
  }

  return (
    <View
      className={classNames('sp-popup', { ['visible']: visible, ['right']: right })}
      catchTouchmove
    >
      <View className='sp-popup-overlay' onClick={handleClose}></View>
      <View
        style={right ? { width } : { height }}
        className={classNames(
          'sp-popup-container',
          {
            'borderradius': borderRadius
          },
          className
        )}
      >
        {children}
      </View>
    </View>
  )
}

export default Popup
