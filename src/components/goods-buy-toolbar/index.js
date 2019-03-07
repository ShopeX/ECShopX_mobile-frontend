import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtBadge } from 'taro-ui'

import './index.scss'

export default class GoodsBuyToolbar extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClickAddCart: () => {},
    onClickFastBuy: () => {}
  }

  render () {
    const { onClickAddCart, onClickFastBuy } = this.props

    return (
      <View className='goods-buy-toolbar'>
        <View className='goods-buy-toolbar__menus'>
          <View className='goods-buy-toolbar__menu-item'>
            <View className='sp-icon sp-icon-shop'></View>
            <Text className='goods-buy-toolbar__menu-item-text'>店铺</Text>
          </View>
          <View className='goods-buy-toolbar__menu-item'>
            <AtBadge
              value={2}
            >
              <View className='sp-icon sp-icon-menu'></View>
            </AtBadge>
            <Text className='goods-buy-toolbar__menu-item-text'>购物车</Text>
          </View>
        </View>
        <View className='goods-buy-toolbar__btns'>
          <Button
            className='goods-buy-toolbar__btn btn-add-cart'
            onClick={onClickAddCart}
          >加入购物车</Button>
          <Button
            className='goods-buy-toolbar__btn btn-fast-buy'
            onClick={onClickFastBuy}
          >立即购买</Button>
        </View>
      </View>
    )
  }
}
