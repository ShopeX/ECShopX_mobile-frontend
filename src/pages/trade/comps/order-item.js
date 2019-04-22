import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Price } from '@/components'

import './order-item.scss'

export default class OrderItem extends Component {
  static defaultProps = {
    onClick: () => {},
    payType: '',
    showExtra: true
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { info, onClick, payType, showExtra, customFooter } = this.props
    const img = info.pic_path
      ? info.pic_path
      : Array.isArray(info.pics)
        ? info.pics[0]
        : info.pics

    return (
      <View
        className='order-item'
        onClick={onClick}
      >
        <View className='order-item__hd'>
          <Image
            mode='aspectFill'
            className='order-item__img'
            src={img}
          />
        </View>
        <View className='order-item__bd'>
          <Text className='order-item__title'>{info.title}</Text>
          {showExtra && (
            <View className='order-item__extra'>
              <Text className='order-item__desc'>{info.goods_props}</Text>
              {info.num && <Text className='order-item__num'>数量：{info.num}</Text>}
            </View>
          )}
        </View>
        {customFooter
          ? this.props.renderFooter
          : (
            <View className='order-item__ft'>
              {payType === 'point'
                ? <Price className='order-item__price' appendText='积分' noSymbol noDecimal value={info.point}></Price>
                : <Price className='order-item__price' value={info.price}></Price>
              }
              <Text className='order-item__pay-type'>[在线支付]</Text>
            </View>
          )
        }
      </View>
    )
  }
}
