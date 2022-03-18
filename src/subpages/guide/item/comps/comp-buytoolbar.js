import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpButton } from '@/components'
import { classNames, navigateTo, showToast, isWeb } from '@/utils'
import { addCart } from '@/store/slices/cart'
import { BUY_TOOL_BTNS, ACTIVITY_LIST } from '@/consts'
import { fetchUserFavs, addUserFav, deleteUserFav } from '@/store/slices/user'
import api from '@/api'
import './comp-buytoolbar.scss'

function CompGoodsBuyToolbar(props) {
  const {
    onAddCart = () => {},
    onFastBuy = () => {},
    info,
    onChange = () => {},
    onSubscribe = () => {}
  } = props
  const { cartCount = 0 } = useSelector((state) => state.cart)
  const { favs = [] } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const btns = []

  if (!info) {
    return null
  }

  const RenderBtns = () => {
    if (info.store == 0) {
      btn.push(BUY_TOOL_BTNS.NO_STORE)
      return
    }

    if (info.isGift) {
      btns.push(BUY_TOOL_BTNS.GIFT)
      return
    }

    // 秒杀、拼团、限时特惠
    if (ACTIVITY_LIST[info.activityType]) {
      if (info.activityType == 'seckill') {
        // 活动即将开始
        if (info.activityInfo.status === 'in_the_notice') {
          btns.push(BUY_TOOL_BTNS.ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS.SHARE)
        }
      } else if (info.activityType == 'limited_time_sale') {
        if (info.activityInfo.status === 'in_the_notice') {
          btns.push(BUY_TOOL_BTNS.ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS.SHARE)
        }
      } else if (info.activityType == 'group') {
        if (info.activityInfo.show_status === 'nostart') {
          btns.push(BUY_TOOL_BTNS.ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS.SHARE)
        }
      }
      return
    }

    btns.push(BUY_TOOL_BTNS.ADD_CART)
    btns.push(BUY_TOOL_BTNS.SHARE)
  }

  RenderBtns()

  const handleClickBtn = async ({ key }) => {
    console.log('handleClickBtn:', key)
    onChange(key)
  }

  const isFaved = favs.findIndex((item) => item.item_id == info.itemId) > -1
  return (
    <View className='comp-goodsbuytoolbar'>
      {/* <View
        className='toolbar-item'
        onClick={navigateTo.bind(this, '/pages/cart/espier-index?tabbar=0')}
      >
        <Text className='iconfont icon-gouwuche'></Text>
        <Text className='toolbar-item-txt'>购物车</Text>
        {cartCount > 0 && <Text className='cart-count'>{cartCount}</Text>}
      </View> */}
      <View
        className={classNames('toolbar-btns', {
          'mutiplte-btn': btns.length > 1
        })}
      >
        {btns.map((item, index) => {
          if (item.btnStatus == 'disabled') {
            return (
              <View
                className={classNames('btn-item', `btn-${item.btnStatus}`)}
                key={`btn-item__${index}`}
              >
                {item.title}
              </View>
            )
          } else {
            return (
              <View
                className={classNames('btn-item', `btn-${item.btnStatus}`)}
                onClick={handleClickBtn.bind(this, item)}
                key={`btn-item__${index}`}
              >
                <View className='btn-item-txt'>{item.title}</View>
              </View>
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
