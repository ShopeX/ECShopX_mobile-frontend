import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpButton, SpLogin } from '@/components'
import { classNames } from '@/utils'
import api from '@/api'
import './comp-buytoolbar.scss'

const BTNS = {
  NOTICE: { title: '到货通知', key: 'notice', btnStatus: 'active' },
  ADD_CART: { title: '添加购物车', key: 'addcart', btnStatus: 'default' },
  FAST_BUY: { title: '立即购买', key: 'fastbuy', btnStatus: 'active' },
  GIFT: { title: '赠品不可购买', key: 'gift', btnStatus: 'disabled' }
}

function CompGoodsBuyToolbar (props) {
  const { onAddCart = () => {}, onFastBuy = () => {}, info } = props
  const btns = []

  if (!info) {
    return null
  }

  if (info.store == 0) {
    btns.push(BTNS.NOTICE)
  } else if (info.isGift) {
    btns.push(BTNS.GIFT)
  } else {
    btns.push(BTNS.ADD_CART)
    btns.push(BTNS.FAST_BUY)
  }

  const onChangeLogin = async ({ key }) => {
    if (key == 'notice') {
      const { subscribe } = info
      if (subscribe) return false
      await api.user.subscribeGoods(info.item_id)
      const { template_id } = await api.user.newWxaMsgTmpl({
        temp_name: 'yykweishop',
        source_type: 'goods'
      })
      Taro.requestSubscribeMessage({
        tmplIds: template_id,
        success: () => {
          this.fetchInfo()
        },
        fail: () => {
          this.fetchInfo()
        }
      })
    }
  }

  return (
    <View className='comp-goodsbuytoolbar'>
      <SpLogin className='shoucang-wrap'>
        <View className='toolbar-item'>
          <Text className='iconfont icon-shoucang-01'></Text>
          <Text className='toolbar-item-txt'>收藏</Text>
        </View>
      </SpLogin>
      <View className='toolbar-item'>
        <Text className='iconfont icon-gouwuche'></Text>
        <Text className='toolbar-item-txt'>购物车</Text>
      </View>
      <View
        className={classNames('toolbar-btns', {
          'mutiplte-btn': btns.length > 1
        })}
      >
        {btns.map((item) => {
          if (item.btnStatus == 'disabled') {
            return (
              <View className={classNames('btn-item', `btn-${item.btnStatus}`)}>{item.title}</View>
            )
          } else {
            return (
              <SpLogin className='btn-item' onChange={onChangeLogin.bind(this, item)}>
                <View className={classNames(`btn-${item.btnStatus}`)}>{item.title}</View>
              </SpLogin>
            )
          }
        })}
      </View>
    </View>
  )
}

CompGoodsBuyToolbar.options = {
  addGlobalClass: true
}

export default CompGoodsBuyToolbar
