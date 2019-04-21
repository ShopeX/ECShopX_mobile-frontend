import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import './index.scss'

export default class Loading extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    type: '',
    img: null,
    size: null
  }

  render () {
    const { className, type, img, size } = this.props

    return (
      <View className={classNames('loading', type && `loading__${type}` , className)}>
        {img
          ? <Image src={img} className='loading-img' />
          : <View
            className='spiner'
            style={styleNames(size ? { width: size, height: size } : null)}
          />
        }
        <Text className='loading-text'>{this.props.children}</Text>
      </View>
    )
  }
}
