import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { classNames, styleNames, isNumber, isBase64, log } from '@/utils'
import './index.scss'

const initialState = {
  loadSuccess: false
}
function SpImage(props) {
  let {
    src,
    className,
    mode = 'widthFix',
    width = 'auto',
    height,
    onClick = () => {},
    onError = () => {},
    onLoad = () => {},
    lazyLoad = false
  } = props
  const [state, setState] = useImmer(initialState)
  const { loadSuccess } = state
  const { diskDriver } = useSelector((state) => state.sys)

  if (!src) {
    src = 'default.jpg'
  }

  let imgUrl = /^http/.test(src) || isBase64(src) ? src : `${process.env.APP_IMAGE_CDN}/${src}`

  if (diskDriver === 'qiniu') {
    if (width != 'auto') {
      imgUrl = `${imgUrl}?imageView2/1${width ? '/w/' + width : ''}${height ? '/h/' + height : ''}`
    }
  }
  
  const handleOnLoad = (e) => {
    // console.log('handleOnLoad:', e)
    setState(draft => {
      draft.loadSuccess = true
    })

  }
  // console.log('SpImage:', imgUrl)
  return (
    <View
      className={classNames(
        {
          'sp-image': true,
          'sp-image-loading': !loadSuccess && lazyLoad,
          'sp-image-loadsuccess': loadSuccess && lazyLoad,
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
        onLoad={handleOnLoad}
        // lazyLoad={lazyLoad}
      />
    </View>
  )
}

SpImage.options = {
  addGlobalClass: true
}

export default SpImage
