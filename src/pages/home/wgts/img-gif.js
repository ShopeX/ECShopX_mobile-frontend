import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { SpImg } from '@/components'
import './img-gif.scss'

export default class WgtImgGif extends Component {
  static options = {}

  static defaultProps = {
    info: {}
  }

  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { info } = this.props
    if (!info) {
      return null
    }

    return (
      <View className={`index ${info.base.padded ? 'wgt__padded' : null}`}>
        <View className='imglist' style={`background:url(${info.data && info.data[0].imgUrl})`}>
          <SpImg
            img-class='scale-placeholder gif'
            src={info.data && info.data[1].imgUrl}
            mode='widthFix'
            width='750'
            lazyLoad
          />
        </View>
      </View>
    )
  }
}
