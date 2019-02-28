import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Price } from '@/components'
import { isObject } from '@/utils'

import './index.scss'

export default class GoodsItem extends Component {
  static defaultProps = {
    onClickImg: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { info, onClickImg } = this.props
    if (!info) {
      return null
    }

    const price = isObject(info.price) ? info.price.total_price : info.price
    const img = info.img || info.image_default_id

    return (
      <View className='goods-item'>
        <View className='goods-item__hd'>
          {this.props.children}
        </View>
        <View className='goods-item__bd'>
          <View className='goods-item__img-wrap'>
            <Image className='goods-item__img'
              onClick={onClickImg}
              mode='aspectFill'
              src={img}
            />
          </View>
          <View className='goods-item__cont'>
            <Text className='goods-item__title'>{info.title}</Text>
            <Text className='goods-item__desc'>{info.desc}</Text>
            <View className='goods-item__prices'>
              <Price
                primary
                symbol={info.curSymbol}
                value={price}
              />
              <Price
                symbol={info.curSymbol}
                className='goods-item__price-market'
                value={info.market_price}
              />
            </View>
          </View>
        </View>
        <View className='goods-item__ft'>
          {this.props.renderFooter}
        </View>
      </View>
    )
  }
}
