import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtBadge } from 'taro-ui'
import { navigateTo } from '@/utils'
import { getTotalCount } from '@/store/cart'

import './buy-toolbar.scss'

@connect(({ cart }) => ({
  cartTotalCount: getTotalCount(cart)
}))
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
    const { onClickAddCart, onClickFastBuy, cartTotalCount, type } = this.props
    const fastBuyText = type === 'normal'
      ? '立即购买'
      : type === 'seckill'
        ? '立即抢购' : '我要开团'

    return (
      <View className='goods-buy-toolbar'>
        <View className='goods-buy-toolbar__menus'>
          <View
            className='goods-buy-toolbar__menu-item'
          >
            <View className='in-icon in-icon-fav'></View>
          </View>
          {process.env.TARO_ENV === 'weapp' && (
            <Button className='goods-buy-toolbar__menu-item' openType='contact'>
              <View className='in-icon in-icon-kefu2'></View>
            </Button>
          )}
          <View
            className='goods-buy-toolbar__menu-item'
            onClick={this.navigateTo.bind(this, '/pages/cart/espier-index')}
          >
            <AtBadge
              value={cartTotalCount || null}
            >
              <View className='in-icon in-icon-cart'></View>
            </AtBadge>
          </View>
        </View>
        {this.props.customRender
          ? this.props.children
          : (
              <View className='goods-buy-toolbar__btns'>
                {type === 'normal' && (
                  <Button
                    className='goods-buy-toolbar__btn btn-add-cart'
                    onClick={onClickAddCart}
                  >添加至购物车</Button>
                )}
                <Button
                  className='goods-buy-toolbar__btn btn-fast-buy'
                  onClick={onClickFastBuy}
                >{fastBuyText}</Button>
              </View>
            )
        }
      </View>
    )
  }
}
