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
import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { classNames, styleNames, isNumber, isBase64 } from '@/utils'
import { SpImage } from '@/components'
import imgUploader from '@/utils/upload'
import './comp-imgpicker.scss'

function SpImagePicker(props) {
  let {
    className,
    backgroundSrc = '',
    onChange = () => {},
    size = 'default',
    children,
    uploadSuccess,
    value
  } = props

  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    setImgUrl(value)
  }, [value])

  const handlePhoto = async () => {
    try {
      const { tempFiles = [] } = await Taro.chooseImage({
        count: 1
      })
      if (tempFiles.length > 0) {
        const imgFiles = tempFiles.slice(0, 1).map((item) => {
          return {
            file: item,
            url: item.path
          }
        })
        const res = await imgUploader.uploadImageFn(imgFiles)
        setImgUrl(res[0].url)
        onChange(res[0].url)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleClickInfo = () => {
    if (!uploadSuccess) return
    handlePhoto()
  }

  return (
    <View
      className={classNames(
        {
          'sp-image-picker': true,
          [`${size}`]: size
        },
        className
      )}
    >
      <View className='sp-image-picker-content'>
        <SpImage
          src={imgUrl ? imgUrl : backgroundSrc}
          className='sp-image-picker-content-img'
          lazyLoad={false}
          mode='aspectFit'
        />
        {!imgUrl && (
          <View className='sp-image-picker-content-icon' onClick={handlePhoto}>
            <Text className='icon-shangchuan-01'></Text>
          </View>
        )}
      </View>

      <View className='sp-image-picker-info' onClick={handleClickInfo}>
        {children}
      </View>
    </View>
  )
}

SpImagePicker.options = {
  addGlobalClass: true
}

export default SpImagePicker
