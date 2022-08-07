import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import api from '@/api'
import S from '@/spx'
import { connect } from 'react-redux'
import { isArray } from '@/utils'
import { linkPage } from './helper'

import './imghot-zone.scss'

@connect(
  ({}) => ({}),
  (dispatch) => ({
    onCloseCart: (item) => dispatch({ type: 'cart/closeCart', payload: item }),
    onSetGoodsSkuInfo: (item) => dispatch({ type: 'cart/setGoodsSkuInfo', payload: item })
  })
)
export default class WgtImgHotZone extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  async handleClickItem(item, index) {
    if (item.linkPage === 'cashcoupon') {
      const toke = S.getAuthToken()
      if (!toke) {
        S.login(this)
      } else {
        api.member.sendCashCoupon({ stock_id: item.id }).then((res) => {
          S.toast(res.msg)
        })
      }
      return
    }
    if (item.linkPage == 'addCart') {
      this.onClickAddCart(item.id)
      return
    }

    linkPage(item.linkPage, item.id, item)
  }
  onClickAddCart = async (id) => {
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请先登录再购买',
        icon: 'none'
      })

      setTimeout(() => {
        S.login(this)
      }, 50)

      return
    }
    const { onSetGoodsSkuInfo, onCloseCart } = this.props
    try {
      const skuinfo = await api.item.detail(id)
      setTimeout(() => {
        onCloseCart(true)
        onSetGoodsSkuInfo(skuinfo)
      }, 10)
    } catch (e) {}
  }
  // handleClick=(e)=>{
  //   e.stopPropagation()
  // }

  render() {
    const { info } = this.props

    if (!info) {
      return null
    }

    const { config, base, data } = info
    return (
      <View className={`wgt  ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgts__header'>
            <View className='wgts__title'>{base.title}</View>
            <View className='wgts__subtitle'>{base.subtitle}</View>
          </View>
        )}
        <View className={`slider-wrap img-hotzone ${config.padded ? 'padded' : ''}`}>
          {config.imgUrl && (
            <Image src={config.imgUrl} mode='widthFix' className='img-hotzone_img' />
          )}

          {isArray(data) && data.map((item, index) => {
            return (
              <View
                key={index}
                className='img-hotzone_zone'
                style={`width: ${item.widthPer * 100}%; height: ${item.heightPer * 100}%; top: ${
                  item.topPer * 100
                }%; left: ${item.leftPer * 100}%`}
                onClick={this.handleClickItem.bind(this, item, index)}
              ></View>
            )
          })}
        </View>
      </View>
    )
  }
}
