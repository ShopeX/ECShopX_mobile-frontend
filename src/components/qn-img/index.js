import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { classNames } from '@/utils'

// const HOSTS = [process.env.IMG_HOST]
// const isQiniu = (src, hosts = HOSTS) => {
//   return hosts.some(h => (new RegExp(h)).test(src))
// }

const hasImageView = (src) => {
  return src.indexOf('imageView2/') >= 0
}

export default class QnImg extends Component {
  static options = {
    addGlobalClass: true
  }

  static externalClasses = ['img-class']

  render () {
    const { src, mode, qnMode, width, height, onError, onLoad, lazyLoad } = this.props
    let rSrc = src
    if (!hasImageView(src)) {
      if (!qnMode) {
        rSrc += (width || height) ? `?imageView2/0${width ? '/w/' + width : ''}${height ? '/h/' + height : ''}` : ''
      } else {
        rSrc += qnMode
      }
    }

    return (
      <Image
        className="img-class"
        src={rSrc}
        mode={mode}
        onError={onError}
        onLoad={onLoad}
        lazyLoad={lazyLoad}
      />
    )
  }
}
