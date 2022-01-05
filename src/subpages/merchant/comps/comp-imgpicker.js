import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { classNames, styleNames, isNumber, isBase64 } from '@/utils'
import { SpImage } from '@/components'
import imgUploader from '@/utils/upload'
import './comp-imgpicker.scss'

function SpImagePicker (props) {
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
