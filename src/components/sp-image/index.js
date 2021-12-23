import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { classNames, styleNames, isNumber } from "@/utils";
import './index.scss'

function SpImage(props) {
  let {
    src,
    className,
    mode = 'widthFix',
    width = 'auto',
    onClick = () => {},
    onError = () => {},
    onLoad = () => {},
    lazyLoad = () => {}
  } = props
  if ( !src ) {
    src = "default_img.png";
  }

  const imgUrl = /^http/.test(src) ? src : `${process.env.APP_IMAGE_CDN}/${src}`
  return (
    <View
      className={classNames(
        {
          "sp-image": true,
        },
        className
      )}
      style={styleNames({
        width: isNumber(width) ? `${width / 2}px` : '',
      } )}
      onClick = { onClick }
    >
      <Image
        className="sp-image-img"
        src={imgUrl}
        mode={mode}
        // onError={onError}
        // onLoad={onLoad}
        // lazyLoad={lazyLoad}
      />
    </View>
  );
}

SpImage.options = {
  addGlobalClass: true
}

export default SpImage
