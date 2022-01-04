import { useSelector } from 'react-redux'
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { classNames, styleNames, isNumber } from '@/utils'
import './index.scss'

function SpImage (props) {
  let {
    src,
    className,
    mode = 'widthFix',
    width = 'auto',
    height,
    onClick = () => {},
    onError = () => {},
    onLoad = () => {},
    lazyLoad = true
  } = props
  const { diskDriver } = useSelector((state) => state.sys)

  if (!src) {
    src = 'default_img.png'
  }

  let imgUrl = /^http/.test(src) ? src : `${process.env.APP_IMAGE_CDN}/${src}`

  if (diskDriver === 'qiniu') {
    if (width != 'auto') {
      imgUrl = `${imgUrl}?imageView2/1${width ? '/w/' + width : ''}${height ? '/h/' + height : ''}`
    }
  }
  console.log('SpImage:', imgUrl)
  return (
    <View
      className={classNames(
        {
          'sp-image': true
        },
        className
      )}
      style={styleNames({
        width: isNumber(width) ? `${width / 2}px` : '',
        height: isNumber(height) ? `${height / 2}px` : ''
      })}
      onClick={onClick}
    >
      <Image
        className='sp-image-img'
        src={imgUrl}
        mode={mode}
        // onError={onError}
        // onLoad={onLoad}
        lazyLoad={lazyLoad}
      />
    </View>
  )
}

SpImage.options = {
  addGlobalClass: true
}

export default SpImage
