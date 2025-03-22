import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpUpload } from '@/components'
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
    onClick = () => {},
    //默认是营业执照
    mode = 'businessLicense',
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
            <View
              className='comps-img-picker__item'
              key={`image-item__${index}`}
            >
              <SpUpload
                max={1}
                backgroundSrc={IMG_MAP[mode]}
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
