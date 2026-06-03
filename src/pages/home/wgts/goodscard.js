/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { connect } from 'react-redux'
// import { Tracker } from '@/service'
import S from '@/spx'
import { classNames, styleNames, showToast, pxToUnitRpx } from '@/utils'
import api from '@/api'
import { $t, ti } from '@/i18n'

import { getGlobalBaseStyle } from './helper'
import './goodscard.scss'

@connect(
  ({ cart, member, shop }) => ({
    cart,
    favs: member.favs,
    shop
  }),
  (dispatch) => ({
    onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
    onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } }),
    onAddFav: ({ item_id }) => dispatch({ type: 'member/addFav', payload: { item_id } }),
    onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } }),
    onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCartNum', payload: count })
  })
)
export default class WgtGoodsCard extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  handleClickItem = (item) => {
    // const { info } = this.props

    /*if(info.data) {
      let onsale = true
      info.data.map(item => {
        if(id === item.item_id){
          if(!item.isOnsale){
            onsale = false
          }
        }
      })
      if(!onsale){
        return false
      }
    }*/
    // try {
    if (item.itemStatus === false) {
      showToast({
        title: $t('edc703ce.f0010a'),
        icon: 'none'
      })
      return
    }

    const { distributor_id, item_id } = item
    // const dtid = distributor_id ? distributor_id : getDistributorId()
    Taro.navigateTo({
      url: `/subpages/item/espier-detail?id=${item_id}&dtid=${distributor_id || 0}`
    })
    // }
    // catch (error) {
    //   console.log(error)
    //   Taro.navigateTo({
    //     url: `/pages/iwp/item-detail?id=${id}`
    //   })
    // }
  }

  handleClickOperate = async (item_data, type, e) => {
    e.stopPropagation()

    if (!S.getAuthToken()) {
      Taro.showToast({
        icon: 'none',
        title: $t('ab76db66.7d1eb0')
      })
      return
    }

    if (item_data.itemStatus === false) {
      showToast({
        title: $t('edc703ce.f0010a'),
        icon: 'none'
      })
      return
    }

    if (type === 'collect') {
      const isFav = Boolean(item_data.favStatus ?? this.props.favs?.[item_data.item_id])

      if (!isFav) {
        await api.member.addFav(item_data.item_id)

        this.props.onAddFav(item_data)
        Taro.showToast({
          title: $t('21544271.151286'),
          icon: 'none'
        })
      } else {
        await api.member.delFav(item_data.item_id)
        this.props.onDelFav(item_data)
        Taro.showToast({
          title: $t('21544271.b46077'),
          icon: 'none'
        })
      }
      if (typeof this.props.onClick === 'function') {
        this.props.onClick()
      }
    }

    if (type === 'buy') {
      try {
        await api.cart.add({
          item_id: item_data.item_id,
          distributor_id: this.props?.shop?.shopInfo?.distributor_id,
          num: 1,
          shop_type: 'distributor'
        })
        Taro.showToast({
          title: $t('ab76db66.ab91e4'),
          icon: 'success'
        })
        this.fetchCartcount()
      } catch (error) {
        console.log(error)
      }
    }
  }
  async fetchCartcount() {
    try {
      const { item_count } = await api.cart.count({ shop_type: 'distributor' })
      this.props.onUpdateCartCount(item_count)
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    const { info, favs } = this.props
    if (!info) {
      return null
    }

    const { base, data: dataList = [] } = info

    const outerStyle = getGlobalBaseStyle(base.outerMargin)
    const innerPaddingStyle = getGlobalBaseStyle(base.innerPadding)
    const useOuterLayout = Boolean(base.outerMargin && typeof base.outerMargin === 'object')

    const goodsCardInnerStyle = (() => {
      const style = {
        ...innerPaddingStyle,
        // 与后台 Vue 一致：borderRadius 8px；小程序端用 pxToUnitRpx 做 ×2 适配
        'border-radius': pxToUnitRpx(8)
      }

      const hasBgColor = Boolean(style['background-color'])
      const hasBgImage = Boolean(style['background-image'])

      if (!hasBgColor && !hasBgImage) {
        style['background-color'] = '#fff'
      }

      return style
    })()

    return (
      <View
        className={classNames('wgt wgt-goods-card', {
          padded: base.padded && !useOuterLayout
        })}
        style={styleNames(outerStyle)}
      >
        <View className='wgt-bd'>
          {dataList.map((item, index) => {
            const key = item.item_id != null ? String(item.item_id) : `goods-card__${index}`
            const onSale = item.itemStatus !== false
            const isFav = Boolean(item.favStatus ?? favs?.[item.item_id])
            return (
              <View key={key} className='goods-card' style={styleNames(goodsCardInnerStyle)}>
                <View
                  className='goods-card__header'
                  onClick={this.handleClickItem.bind(this, item)}
                >
                  <SpImage src={item.img_url} width={160} height={160} isOss />
                  <View className='goods-card__info'>
                    <View className='goods-card__info-title'>{item.item_name}</View>
                    <View className='goods-card__info-price'>
                      <SpPrice unit='cent' value={item.price} size={28} primary noDecimal />
                    </View>
                    {item.sales > 0 && (
                      <View className='goods-card__info-sales'>
                        {ti('a8427e1f.47df99', [item.sales])}
                      </View>
                    )}
                  </View>
                </View>
                <View className='goods-card__footer'>
                  <View
                    className={classNames('goods-card__btn', {
                      'goods-card__btn--disabled': !onSale
                    })}
                    onClick={this.handleClickOperate.bind(this, item, 'collect')}
                  >
                    {isFav ? $t('ab76db66.e2acff') : $t('ab76db66.56d0b8')}
                  </View>
                  <View className='gap-line' />
                  <View
                    className={classNames('goods-card__btn', {
                      'goods-card__btn--disabled': !onSale
                    })}
                    onClick={this.handleClickOperate.bind(this, item, 'buy')}
                  >
                    {$t('ab76db66.2971f7')}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
