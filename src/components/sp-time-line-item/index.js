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
import React, { useEffect, useImperativeHandle } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

const initState = {}
function SpTimeLineItem(props) {
  const [state, setState] = useImmer(initState)

  const {} = state

  const { item, children } = props

  const handlePreviewPics = (idx) => {
    Taro.previewImage({
      urls: item.pics,
      current: item.pics[idx]
    })
  }

  return (
    <View className='time-line-item'>
      <View className='left-dot'></View>
      <View className='content'>
        <View className='content-title'>{item.title}</View>
        {item.delivery_remark && (
          <View className='content-remark'>订单备注：{item.delivery_remark}</View>
        )}
        {item.pics.length > 0 && (
          <View>
            照片上传：
            <View className='content-pic'>
              {item.pics.map((pic, idx) => (
                <Image
                  src={pic}
                  className='content-pic-item'
                  key={idx}
                  onClick={() => handlePreviewPics(idx)}
                ></Image>
              ))}
            </View>
          </View>
        )}
        {/* {children} */}
      </View>
    </View>
  )
}

export default SpTimeLineItem
