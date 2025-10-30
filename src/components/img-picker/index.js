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
import { AtImagePicker } from 'taro-ui'
import { isAlipay } from '@/utils'
import { View } from '@tarojs/components'
import React, { useCallback } from 'react'
import imgUploader from '@/utils/upload'
import './index.scss'

const ImgPicker = (props) => {
  const { onChange } = props

  const handleClickImg = useCallback(() => {
    my.chooseImage({
      sourceType: ['camera', 'album'],
      count: 2,
      success: (res) => {
        const resultFiles = res.apFilePaths.map((item) => ({
          url: item,
          file: item
        }))
        imgUploader.uploadImageFn(resultFiles).then((res) => {
          console.log('---uploadImageFn res---', res)
        })
      },
      fail: () => {}
    })
  }, [])

  return (
    <View className='sp-img-picker'>
      <View className='sp-img-picker__flexbox'>
        <View className='sp-img-picker__flexbox-item' onClick={handleClickImg}>
          <View className='sp-img-picker-item choose-btn'>
            <View className='add-bar'></View>
            <View className='add-bar'></View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default isAlipay ? ImgPicker : <View></View>
