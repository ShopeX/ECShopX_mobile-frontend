import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtBadge } from 'taro-ui'
import api from '@/api'
import { FormIdCollector, SpLogin } from '@/components'
import { classNames,isWeb,isWeixin } from '@/utils'
import './buy-toolbar.scss'

@connect(({ colors }) => ({
  colors: colors.current
  }),
  (dispatch) => ({
    onAddFav: ({ item_id, fav_id }) =>
      dispatch({ type: 'member/addFav', payload: { item_id, fav_id } }),
    onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
  })
)
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
    info: {},
    isPointitem: false
  }

  handleClickCart = (id, type) => {
    if(isWeb){
      Taro.redirectTo({
        url: `/pages/cart/espier-index?type=${type}`
      })
    }else{
      Taro.reLaunch({
        url: `/pages/cart/espier-index?type=${type}`
      })
    }
  }

  handleNaviationToHome = () => {
    const url = `/pages/index`
    Taro.navigateTo({
      url
    })
  }

  handleFavClick = async () => {
    const { item_id, is_fav } = this.props.info
    if (!is_fav) {
      const favRes = await api.member.addFav(item_id)
      this.props.onAddFav(favRes)
    } else {
      await api.member.delFav(item_id)
      this.props.onDelFav(this.props.info)
    }
    Taro.showToast({
      title: is_fav ? '已移出收藏' : '已加入收藏',
      mask: true
    })
  }

  render() {
    const {
      onClickAddCart,
      onClickFastBuy,
      cartCount,
      type,
      info,
      colors,
      isPointitem
    } = this.props
    if (!info) {
      return null
    }

    let special_type = info.special_type

    const isDrug = special_type === 'drug'
    const fastBuyText = isPointitem
      ? '立即兑换'
      : type === 'normal' || type === 'limited_time_sale'
      ? '立即购买'
      : type === 'seckill'
      ? '立即抢购'
      : '我要开团'

    return (
      <View className={classNames(isPointitem ? 'goods-isPointitem' : null, 'goods-buy-toolbar')}>
        <View className='goods-buy-toolbar__menus'>
          <SpLogin>
            <View className='goods-buy-toolbar__menu-item' onClick={this.handleFavClick}>
              <View
                className={classNames('iconfont', info.is_fav ? 'icon-star_on' : 'icon-star')}
                style={info.is_fav ? { color: colors.data[0].primary } : {}}
              />
            </View>
          </SpLogin> 
          {!isPointitem ? (
            <View
              className='goods-buy-toolbar__menu-item'
              onClick={this.handleClickCart.bind(
                this,
                info.item_id,
                isDrug ? 'drug' : 'distributor'
              )}
            >
              <AtBadge value={cartCount || null}>
                <View className='iconfont icon-cart'></View>
              </AtBadge>
            </View>
          ) : (
            <View className='goods-buy-toolbar__menu-item' onClick={this.handleNaviationToHome}>
              <View className='iconfont icon-home'></View>
            </View>
          )}
        </View>
        {this.props.customRender ? (
          this.props.children
        ) : (
          <SpLogin>
            {info.approve_status === 'onsale' ? (
              <View className='goods-buy-toolbar__btns'>
                {(type === 'normal' || type === 'limited_time_sale') && !isPointitem && (
                  <View sync onClick={onClickAddCart}>
                    <View
                      className={`goods-buy-toolbar__btn btn-add-cart ${isDrug && 'drug-btn'}`}
                      style={'background: ' + colors.data[0].accent}
                    >
                      {isDrug ? '加入药品清单' : '添加至购物车'}
                    </View>
                  </View>
                )}
                {!isDrug && (
                  <View sync onClick={onClickFastBuy}>
                    <View
                      className={`goods-buy-toolbar__btn btn-fast-buy ${type !== 'normal' &&
                        type !== 'limited_time_sale' &&
                        'marketing-btn'}`}
                      style={'background: ' + colors.data[0].primary}
                    >
                      {fastBuyText}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className='goods-buy-toolbar__btns'>
                <View className='goods-buy-toolbar__btn disabled'>暂不可售</View>
              </View>
            )}
          </SpLogin>
        )}
      </View>
    )
  }
}
