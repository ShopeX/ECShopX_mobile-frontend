import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Price } from '@/components'

import './order-item.scss'

export default class OrderItem extends Component {
  static defaultProps = {
    onClick: () => {},
    payType: ''
  }

  render () {
    const { info, onClick, payType } = this.props

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
          {payType === 'point'
            ? <Price className='order-item__price' appendText='积分' noSymbol noDecimal value={info.point}></Price>
            : <Price className='order-item__price' value={info.price}></Price>
          }
          <Text className='order-item__num'>x {info.num}</Text>
        </View>
      </View>
    )
  }
}
