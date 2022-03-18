import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpButton, SpLogin } from '@/components'
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
      if (info.subscribe) {
        btns.push(BUY_TOOL_BTNS.SUBSCRIBE)
      } else {
        btns.push(BUY_TOOL_BTNS.NOTICE)
      }
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
          btns.push(BUY_TOOL_BTNS.ACTIVITY_FAST_BUY)
        }
      } else if (info.activityType == 'limited_time_sale') {
        if (info.activityInfo.status === 'in_the_notice') {
          btns.push(BUY_TOOL_BTNS.ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS.ACTIVITY_BUY)
        }
      } else if (info.activityType == 'group') {
        if (info.activityInfo.show_status === 'nostart') {
          btns.push(BUY_TOOL_BTNS.ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS.ACTIVITY_GROUP_BUY)
        }
      }
      return
    }

    btns.push(BUY_TOOL_BTNS.ADD_CART)
    btns.push(BUY_TOOL_BTNS.FAST_BUY)
  }

  RenderBtns()

  const onChangeLogin = async ({ key }) => {
    console.log('onChangeLogin:', key)
    if (key == 'notice') {
      const { subscribe } = info
      if (subscribe) return false

      if (isWeb) {
        showToast('请在小程序完成商品到货通知')
        return
      }

      await api.user.subscribeGoods(info.itemId)
      const { template_id } = await api.user.newWxaMsgTmpl({
        temp_name: 'yykweishop',
        source_type: 'goods'
      })
      Taro.requestSubscribeMessage({
        tmplIds: template_id,
        success: () => {
          onSubscribe()
        },
        fail: () => {
          onSubscribe()
        }
      })
    } else {
      onChange(key)
    }
  }

  // 收藏
  const onChangeCollection = async () => {
    const { itemId } = info
    const fav = favs.findIndex((item) => item.item_id == itemId) > -1
    if (!fav) {
      await dispatch(addUserFav(itemId))
    } else {
      await dispatch(deleteUserFav(itemId))
    }
    await dispatch(fetchUserFavs())
    showToast(fav ? '已移出收藏' : '已加入收藏')
  }

  const isFaved = favs.findIndex((item) => item.item_id == info.itemId) > -1
  return (
    <View className='comp-goodsbuytoolbar'>
      <SpLogin className='shoucang-wrap' onChange={onChangeCollection.bind(this)}>
        <View className='toolbar-item'>
          <Text
            className={classNames(
              'iconfont',
              isFaved ? 'icon-shoucanghover-01' : 'icon-shoucang-01'
            )}
          ></Text>
          <Text className='toolbar-item-txt'>收藏</Text>
        </View>
      </SpLogin>
      <View
        className='toolbar-item'
        onClick={navigateTo.bind(this, '/pages/cart/espier-index?tabbar=0')}
      >
        <Text className='iconfont icon-gouwuche'></Text>
        <Text className='toolbar-item-txt'>购物车</Text>
        {cartCount > 0 && <Text className='cart-count'>{cartCount}</Text>}
      </View>
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
              <SpLogin
                className={classNames('btn-item', `btn-${item.btnStatus}`)}
                onChange={onChangeLogin.bind(this, item)}
                key={`btn-item__${index}`}
              >
                <View className='btn-item-txt'>{item.title}</View>
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
