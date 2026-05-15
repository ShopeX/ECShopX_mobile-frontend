/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtBadge } from 'taro-ui'
import { FormIdCollector } from '@/components'
import { $t } from '@/i18n'
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

  render() {
    const { onClickAddCart, onClickFastBuy, cartCount, type, info, colors } = this.props

    if (!info) {
      return null
    }

    let special_type = info.special_type

    const isDrug = special_type === 'drug'
    const fastBuyText =
      type === 'normal' || type === 'limited_time_sale'
        ? $t('5f4e23d1.5fd2f9')
        : type === 'seckill'
        ? $t('5f4e23d1.d8a40b')
        : $t('5f4e23d1.ccb0dd')

    return (
      <View className='goods-buy-toolbar'>
        {info.approve_status === 'onsale' && info.distributor_sale_status ? (
          <View className='goods-buy-toolbar__btns'>
            {(type === 'normal' || type === 'limited_time_sale') && (
              <FormIdCollector sync onClick={onClickAddCart}>
                <View
                  className={`goods-buy-toolbar__btn btn-add-cart ${isDrug && 'drug-btn'}`}
                  style={'background: ' + colors.data[0].accent}
                >
                  {isDrug ? $t('5f4e23d1.568f80') : $t('5f4e23d1.94d929')}
                </View>
              </FormIdCollector>
            )}
            <FormIdCollector sync onClick={onClickFastBuy}>
              <View
                className={`goods-buy-toolbar__btn btn-fast-buy ${
                  type !== 'normal' && type !== 'limited_time_sale' && 'marketing-btn'
                }`}
                style={'background: ' + colors.data[0].primary}
              >
                {$t('5f4e23d1.e6bd60')}
              </View>
            </FormIdCollector>
          </View>
        ) : (
          <View className='goods-buy-toolbar__btns'>
            <View className='goods-buy-toolbar__btn disabled'>{$t('5f4e23d1.0c48ed')}</View>
          </View>
        )}
      </View>
    )
  }
}
