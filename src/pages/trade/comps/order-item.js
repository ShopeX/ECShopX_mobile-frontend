import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Price } from '@/components'

import './order-item.scss'

export default class OrderItem extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  render () {
    const { info, onClick } = this.props

    return (
      <View
        className='order-item'
        onClick={onClick}
      >
        <View className='order-item__hd'>
          <Image
            mode='aspectFill'
            className='order-item__img'
            src={info.pic_path}
          />
        </View>
        <View className='order-item__bd'>
          <Text className='order-item__title'>{info.title}</Text>
          <Text className='order-item__desc'>{info.goods_props}</Text>
        </View>
        <View className='order-item__ft'>
          <Price className='order-item__price' value={info.price}></Price>
          <Text className='order-item__num'>x {info.num}</Text>
        </View>
      </View>
    )
  }
}
