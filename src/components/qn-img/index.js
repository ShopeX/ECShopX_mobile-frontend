import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'

export default class QnImg extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onLoad: () => {},
    onError: () => {}
  }

  static externalClasses = ['img-class']

  render () {
    const { src, mode, qnMode, width, height, onError, onLoad, lazyLoad } = this.props
    if (!src) return null
    let rSrc = src
    if (!qnMode) {
      rSrc += (width || height) ? `?imageView2/2${width ? '/w/' + width : ''}${height ? '/h/' + height : ''}` : ''
    } else {
      rSrc += qnMode
    }

    return (
      <Image
        className='img-class'
        src={rSrc}
        mode={mode}
        onError={onError}
        onLoad={onLoad}
        lazyLoad={lazyLoad}
      />
    )
  }
}
