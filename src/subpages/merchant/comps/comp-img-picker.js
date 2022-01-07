import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Text, View } from '@tarojs/components'
import SpImagePicker from './comp-imgpicker'
import { classNames } from '@/utils'
import { useDepChange } from '@/hooks'
import './comp-img-picker.scss'

const IMG_MAP = {
  //营业执照
  'businessLicense': 'bussniess_license.png',
  'bankCard': 'bank_card.png',
  'idCard': 'id_card_1.png'
}

const ImgPicker = (props) => {
  const {
    className,
    required = true,
    onClick = () => {},
    title,
    //默认是营业执照
    mode = 'businessLicense',
    info = [],
    onChange = () => {},
    value
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
              >
                <SpImagePicker
                  backgroundSrc={IMG_MAP[mode]}
                  value={uploadSuccess(index)}
                  size='small'
                  onChange={handleChange(index)}
                  uploadSuccess={uploadSuccess(index)}
                >
                  <View className='picker-info'>{uploadSuccess(index) ? '重新上传' : item}</View>
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
            >
              <View className='picker-info'>{uploadSuccess(0) ? '重新上传' : info[0]}</View>
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
