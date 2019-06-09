import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './item-img.scss'

export default class ItemImg extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    src: null
  }

  render () {
    const { src } = this.props

    return (
      <View className='item-img'>
        <Image
          className='item-img__img'
          mode='aspectFill'
          src={src}
        />
        <View
          className='item-img__blured-wrap'
        >
          <Image
            src={src}
            mode='aspectFill'
            className='item-img__blured'
          />
        </View>
      </View>
    )
  }
}
