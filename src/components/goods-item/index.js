import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpImg, PointLine } from '@/components'
import api from '@/api'
import { connect } from 'react-redux'

import { isObject, classNames, isWeb } from '@/utils'
import { fetchUserFavs, addUserFav, deleteUserFav } from '@/store/slices/user'

import './index.scss'
import configStore from '@/store'

const store = configStore()

@connect(
  ({ colors, user }) => ({
    colors: colors.current,
    favs: user.favs
  }),
  (dispatch) => ({
    onAddFav: ({ item_id, fav_id }) =>
      dispatch({ type: 'member/addFav', payload: { item_id, fav_id } }),
    onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
  })
)
export default class GoodsItem extends Component {
  state = {
    is_fav: false
  }
  static defaultProps = {
    onClick: () => {},
    onStoreClick: () => {},
    showMarketPrice: true,
    showFav: true,
    showSku: false,
    noCurSymbol: false,
    type: 'item',
    isPointitem: false
  }

  static options = {
    addGlobalClass: true
  }

  static externalClasses = ['classes']

  componentWillReceiveProps (nextProps) {
    const { is_fav } = nextProps.info
    this.setState({
      is_fav
    })
  }

  handleFavClick = async () => {
    const { item_id } = this.props.info
    const { is_fav } = this.state
    if (!is_fav) {
      const favRes = await api.member.addFav(item_id)
      this.props.onAddFav(favRes)
    } else {
      await api.member.delFav(item_id)
      this.props.onDelFav(this.props.info)
    }
    this.setState({
      is_fav: !is_fav
    })
    Taro.showToast({
      title: is_fav ? '已移出收藏' : '已加入收藏',
      mask: true
    })
  }

  render () {
    const {
      info,
      cart,
      showFav,
      noCurSymbol,
      noCurDecimal,
      onClick,
      onStoreClick,
      appendText,
      className,
      isPointDraw,
      colors,
      type,
      isPointitem,
      showNewGift
    } = this.props

    if (!info) {
      return null
    }

    const img = info.img || info.image_default_id

    let promotion_activity = null,
      act_price = null
    // console.log("act_price",act_price)
    // console.log("info.promotion_activity_tag",info.promotion_activity_tag)
    if (info.promotion_activity_tag && info.promotion_activity_tag.length > 1) {
      info.promotion_activity_tag.map((tag_item) => {
        if (
          tag_item.tag_type === 'single_group' ||
          tag_item.tag_type === 'normal' ||
          tag_item.tag_type === 'limited_time_sale'
        ) {
          promotion_activity = tag_item.tag_type
          act_price = tag_item.activity_price
          return
        }
      })
    } else if (info.promotion_activity_tag && info.promotion_activity_tag.length === 1) {
      promotion_activity = info.promotion_activity_tag[0].tag_type
      act_price = info.promotion_activity_tag[0].activity_price
    } else {
      promotion_activity = null
      act_price = null
    }

    act_price = (act_price / 100).toFixed(2)
    let price = '',
      marketPrice = ''
    if (isObject(info.price)) {
      price = info.price.total_price
    } else {
      price = Boolean(+act_price)
        ? act_price
        : Boolean(+info.member_price)
        ? info.member_price
        : info.price
      //marketPrice = Boolean(+act_price) || Boolean(+info.member_price) ? info.price : info.market_price
      marketPrice = info.market_price
    }

    const isShow = info.store && info.store == 0

    return (
      <View className={classNames('goods-item', 'classes', { 'cart': cart && isWeb })}>
        <View className='goods-item__hd'>{this.props.renderCheckbox}</View>
        <View className='goods-item__bd'>
          {/* 库存判断 */}
          {isShow && showNewGift && (
            <View className='goods-item__over'>
              <View className='goods-item__label'>已结束</View>
            </View>
          )}
          <View className='goods-item__img-wrap' onClick={onClick}>
            <SpImg img-class='goods-item__img' src={img} mode='widthFix' width='400' lazyLoad />
          </View>
          <View className='goods-item__cont'>
            {info.type === '1' && (
              <View className='nationalInfo'>
                <Image
                  className='nationalFlag'
                  src={info.origincountry_img_url}
                  mode='aspectFill'
                  lazyLoad
                />
                <Text className='nationalTitle'>{info.origincountry_name}</Text>
              </View>
            )}
            <View className='goods-item__caption'>
              {info.promotion_activity_tag && (
                <View className='goods-item__tag-list'>
                  {info.promotion_activity_tag.map((item) => (
                    <Text
                      key={item.promotion_id}
                      className={`tagitem ${
                        item.tag_type === 'single_group' ||
                        item.tag_type === 'limited_time_sale' ||
                        item.tag_type === 'normal'
                          ? 'goods-item__tag goods-item__group'
                          : 'goods-item__tag'
                      } ${item.tag_type === 'member_preference' && 'member_preference'}`}
                      style={
                        item.tag_type === 'single_group' ||
                        item.tag_type === 'limited_time_sale' ||
                        item.tag_type === 'normal'
                          ? {
                              background: colors.data[0].primary,
                              boxShadow: `0 0 0 1px ${colors.data[0].primary}`
                            }
                          : {
                              color: colors.data[0].primary,
                              boxShadow: `0 0 0 1px ${colors.data[0].primary}`
                            }
                      }
                    >
                      {item.tag_type === 'single_group' ? '团购' : ''}
                      {item.tag_type === 'full_minus' ? '满减' : ''}
                      {item.tag_type === 'full_discount' ? '满折' : ''}
                      {item.tag_type === 'full_gift' ? '满赠' : ''}
                      {item.tag_type === 'normal' ? '秒杀' : ''}
                      {item.tag_type === 'limited_time_sale' ? '限时特惠' : ''}
                      {item.tag_type === 'plus_price_buy' ? '换购' : ''}
                      {item.tag_type === 'member_preference' ? '会员限购' : ''}
                    </Text>
                  ))}
                </View>
              )}
              <View onClick={onClick}>
                <Text
                  className={`goods-item__title ${isShow && showNewGift && 'goods-item__gray'}`}
                >
                  {info.title}
                </Text>
                <Text className={`goods-item__desc ${isShow && showNewGift && 'goods-item__gray'}`}>
                  {info.desc || ''}
                </Text>
                {this.props.renderSpec}
              </View>
            </View>
            <View className='goods-item__extra'>
              {/* {isPointitem && <PointLine point={info.point} />} */}
              {!isPointitem && (
                <View className='goods-item__price'>
                  <View className={`package-price ${isShow && showNewGift && 'goods-item__gray'}`}>
                    <Text
                      className={`goods-item__cur ${isShow && showNewGift && 'goods-item__gray'}`}
                    >
                      ¥
                    </Text>
                    <Text>
                      {price}
                      {info.type === '1' && <Text className='taxText'>（含税）</Text>}
                    </Text>
                  </View>
                  {Boolean(+marketPrice) && (
                    <Text
                      className={`goods-item__price-market ${
                        isShow && showNewGift && 'goods-item__gray'
                      }`}
                    >
                      ¥{marketPrice}
                    </Text>
                  )}
                </View>
              )}
              {this.props.children}
              {showFav && (
                <View className='goods-item__actions'>
                  {type === 'item' && (
                    <View
                      className={classNames(
                        'iconfont',
                        this.state.is_fav ? 'icon-star_on' : 'icon-star'
                      )}
                      onClick={this.handleFavClick}
                      style={this.state.is_fav ? { color: colors.data[0].primary } : {}}
                    />
                  )}
                  {type === 'recommend' && (
                    <View className='iconfont icon-like' onClick={this.handleLikeClick}>
                      <Text>666</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {process.env.APP_PLATFORM !== 'standard' &&
              info.distributor_info &&
              !Array.isArray(info.distributor_info) && (
                <View className='goods-item__store' onClick={onStoreClick}>
                  {info.distributor_info.name}{' '}
                  <Text class='goods-item__store-entry'>
                    进店<Text className='iconfont icon-arrowRight'></Text>
                  </Text>
                </View>
              )}
          </View>
        </View>
        <View className='goods-item__ft'>{this.props.renderFooter}</View>
      </View>
    )
  }
}
