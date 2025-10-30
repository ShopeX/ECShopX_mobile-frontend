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
import { useState, useEffect } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpUpload } from '@/components'
import './comp-img-picker.scss'

const IMG_MAP = {
  'shareholderCertificate': 'share_certify.png',
  'idCard': ['idcard_front.png', 'idcard_reverse.png']
}

const ImgPicker = (props) => {
  const {
    className,
    onClick = () => {},
    mode = 'shareholderCertificate',
    info = [],
    onChange = () => {},
    value
  } = props

  const ismultiple = info.length > 1

  const [imgs, setImgs] = useState([])

  const handleChange = (imgurl, index) => {
    const newImages = [...imgs]
    newImages[index] = imgurl
    setImgs([...newImages])
    onChange(newImages)
  }

  useEffect(() => {
    setImgs(value)
  }, [value])

  const uploadSuccess = (index) => imgs[index]

  return (
    <View className={classNames('comps-img-picker', className)} onClick={onClick}>
      <View className={classNames('comps-img-picker__content', { ismultiple })}>
        {info.map((item, index) => {
          return (
            <View className='comps-img-picker__item' key={`image-item__${index}`}>
              <SpUpload
                max={1}
                backgroundSrc={Array.isArray(IMG_MAP[mode]) ? IMG_MAP[mode][index] : IMG_MAP[mode]}
                value={uploadSuccess(index)}
                onChange={(e) => handleChange(e, index)}
              />
              <View className='comps-img-picker__item-title'>{item}</View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

ImgPicker.options = {
  addGlobalClass: true
}

export default ImgPicker
