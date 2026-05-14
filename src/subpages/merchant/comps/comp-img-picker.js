/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useState, useEffect } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import SpImagePicker from './comp-imgpicker'
import './comp-img-picker.scss'

const IMG_MAP = {
  //营业执照
  'businessLicense': 'bussniess_license.png',
  'bankCard': 'bank_card.png',
  'idCard': 'id_card_1.png'
}

const ImgPicker = (props) => {
  useTranslation()
  const {
    className,
    required = true,
    onClick = () => {},
    title,
    //默认是营业执照
    mode = 'businessLicense',
    info = [],
    onChange = () => {},
    value,
    /** 默认 true：入驻证照等场景用商城 SG_TOKEN；若接口要求商户身份上传则传 false */
    useMallToken = true
  } = props

  const ismultiple = info.length > 1

  const [imgs, setImgs] = useState([])

  const handleChange = (index) => (imgurl) => {
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
      <View className='comps-img-picker-title'>
        {required ? <Text className='required'>*</Text> : null}
        {title}
      </View>
      <View className={classNames('mt-16', 'comps-img-picker-content', 'border', { ismultiple })}>
        {ismultiple ? (
          info.map((item, index) => {
            return (
              <View
                className={classNames('view-flex view-flex-vertical view-flex-middle', {
                  'is-hasimg': uploadSuccess(index)
                })}
                key={`image-item__${index}`}
              >
                <SpImagePicker
                  backgroundSrc={IMG_MAP[mode]}
                  value={uploadSuccess(index)}
                  size='small'
                  onChange={handleChange(index)}
                  uploadSuccess={uploadSuccess(index)}
                  useMallToken={useMallToken}
                >
                  <View className='picker-info'>
                    {uploadSuccess(index) ? $t('4a9686ce.bc8851') : item}
                  </View>
                </SpImagePicker>
              </View>
            )
          })
        ) : (
          <View
            className={classNames('view-flex view-flex-vertical view-flex-middle', {
              'is-hasimg': uploadSuccess(0)
            })}
          >
            <SpImagePicker
              backgroundSrc={IMG_MAP[mode]}
              value={uploadSuccess(0)}
              onChange={handleChange(0)}
              uploadSuccess={uploadSuccess(0)}
              useMallToken={useMallToken}
            >
              <View className='picker-info'>
                {uploadSuccess(0) ? $t('4a9686ce.bc8851') : info[0]}
              </View>
            </SpImagePicker>
          </View>
        )}
      </View>
    </View>
  )
}

ImgPicker.options = {
  addGlobalClass: true
}

export default ImgPicker
