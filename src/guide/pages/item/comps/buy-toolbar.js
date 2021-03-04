import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtBadge } from 'taro-ui'
import { FormIdCollector } from '@/components'

import './buy-toolbar.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class GoodsBuyToolbar extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    type: 'normal',
    onClickAddCart: () => {},
    onClickFastBuy: () => {},
    onFavItem: () => {},
    cartCount: '',
    info: {}
  }

  handleClickCart = (id, type) => {
    Taro.reLaunch({
      url: `/pages/cart/espier-index?type=${type}`
    })
  }

  render () {
    const { onClickAddCart, onClickFastBuy, cartCount, type, info, colors } = this.props

    if (!info) {
      return null
    }

    let special_type = info.special_type

    const isDrug = special_type === 'drug'
    const fastBuyText = (type === 'normal' || type === 'limited_time_sale')
      ? '立即购买'
      : (type === 'seckill')
        ? '立即抢购' : '我要开团'

    return (
      <View className='goods-buy-toolbar'>
        {
                info.approve_status === 'onsale' ?
                  <View className='goods-buy-toolbar__btns'>
                    {(type === 'normal' || type === 'limited_time_sale') && (
                      <FormIdCollector
                        sync
                        onClick={onClickAddCart}
                      >
                        <View className={`goods-buy-toolbar__btn btn-add-cart ${isDrug && 'drug-btn'}`} style={'background: ' + colors.data[0].accent}>
                          {isDrug ? '加入药品清单' : '添加至购物车'}
                        </View>
                      </FormIdCollector>
                    )}
                    {!isDrug && (
                        <FormIdCollector
                          sync
                          onClick={onClickFastBuy}
                        >
                          <View className={`goods-buy-toolbar__btn btn-fast-buy ${type !== 'normal' && type !== 'limited_time_sale' && 'marketing-btn'}`} style={'background: ' + colors.data[0].primary}>分享给顾客</View>
                        </FormIdCollector>
                      )
                    }
                  </View>
                  : <View className='goods-buy-toolbar__btns'><View className="goods-buy-toolbar__btn disabled">暂不可售</View></View>
          }
      </View>
    )
  }
}
