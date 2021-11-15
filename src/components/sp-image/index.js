import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import './index.scss'

const Fn = () => {}

function SpImage(props) {
  const {
    src,
    className,
    mode = 'widthFix',
    width = 'auto',
    onError = Fn,
    onLoad = Fn,
    lazyLoad = Fn
  } = this.props
  const imgUrl = `${process.env.APP_IMAGE_CDN}/${src}`
  return (
    <View
      className={classNames(
        {
          'sp-image': true
        },
        className
      )}
      style={styleNames({
        width: `${width}rpx`
      })}
    >
      <Image
        className='sp-image-img'
        src={imgUrl}
        mode={mode}
        onError={onError}
        onLoad={onLoad}
        lazyLoad={lazyLoad}
      />
    </View>
  )
}

SpImage.options = {
  addGlobalClass: true
}

export default SpImage
