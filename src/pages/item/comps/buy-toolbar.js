import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtBadge } from 'taro-ui'
import { navigateTo } from '@/utils'
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
    info: null
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
        <View className='goods-buy-toolbar__menus'>
          <View
            className='goods-buy-toolbar__menu-item'
            onClick={this.props.onFavItem}
          >
            {
              info.is_fav
                ? <View className='icon-star-on' style={`color: ${colors.data[0].primary}`} />
                : <View className='icon-star' />
            }
          </View>
          {/*{process.env.TARO_ENV === 'weapp' && (
            <Button className='goods-buy-toolbar__menu-item' openType='contact'>
              <View className='in-icon in-icon-kefu'></View>
            </Button>
          )}*/}
          <View
            className='goods-buy-toolbar__menu-item'
            onClick={this.handleClickCart.bind(this, info.item_id, isDrug ? 'drug' : 'distributor')}
          >
            <AtBadge
              value={cartCount || null}
            >
              <View className='icon-cart'></View>
            </AtBadge>
          </View>
        </View>
        {this.props.customRender
          ? this.props.children
          : (<View>
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
                          <View className={`goods-buy-toolbar__btn btn-fast-buy ${type !== 'normal' && type !== 'limited_time_sale' && 'marketing-btn'}`} style={'background: ' + colors.data[0].primary}>{fastBuyText}</View>
                        </FormIdCollector>
                      )
                    }
                  </View>
                  : <Text>暂不可售</Text>
              }

            </View>)
        }
      </View>
    )
  }
}
