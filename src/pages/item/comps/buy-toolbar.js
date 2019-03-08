import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtBadge } from 'taro-ui'
import { navigateTo } from '@/utils'

import './buy-toolbar.scss'

export default class GoodsBuyToolbar extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    type: 'normal',
    onClickAddCart: () => {},
    onClickFastBuy: () => {}
  }

  navigateTo = navigateTo

  render () {
    const { onClickAddCart, onClickFastBuy, type } = this.props
    const fastBuyText = '立即购买'

    return (
      <View className='goods-buy-toolbar'>
        <View className='goods-buy-toolbar__menus'>
          <View
            className='goods-buy-toolbar__menu-item'
            onClick={this.navigateTo.bind(this, '/pages/home/index')}
          >
            <View className='sp-icon sp-icon-shop'></View>
            <Text className='goods-buy-toolbar__menu-item-text'>店铺</Text>
          </View>
          <View
            className='goods-buy-toolbar__menu-item'
            onClick={this.navigateTo.bind(this, '/pages/cart/espier-index')}
          >
            <AtBadge
              value={2}
            >
              <View className='sp-icon sp-icon-cart'></View>
            </AtBadge>
            <Text className='goods-buy-toolbar__menu-item-text'>购物车</Text>
          </View>
          {process.env.TARO_ENV === 'weapp' && (
            <Button className='goods-buy-toolbar__menu-item' openType='contact'>
              <View className='sp-icon sp-icon-contact'></View>
              <Text className='goods-buy-toolbar__menu-item-text'>客服</Text>
            </Button>
          )}
        </View>
        <View
          className='goods-buy-toolbar__btns'
          style={process.env.TARO_ENV === 'weapp' ? 'width: 59%;': null}
        >
          {type === 'normal' && (
            <Button
              className='goods-buy-toolbar__btn btn-add-cart'
              onClick={onClickAddCart}
            >加入购物车</Button>
          )}
          <Button
            className='goods-buy-toolbar__btn btn-fast-buy'
            onClick={onClickFastBuy}
          >{fastBuyText}</Button>
        </View>
      </View>
    )
  }
}
