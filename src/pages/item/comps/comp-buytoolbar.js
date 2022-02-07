import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpButton, SpLogin } from '@/components'
import { classNames, navigateTo, showToast } from '@/utils'
import { addCart } from '@/store/slices/cart'
import { fetchUserFavs, addUserFav, deleteUserFav } from '@/store/slices/user'
import api from '@/api'
import './comp-buytoolbar.scss'

const BTNS = {
  NOTICE: { title: '到货通知', key: 'notice', btnStatus: 'active' },
  ADD_CART: { title: '添加购物车', key: 'addcart', btnStatus: 'default' },
  FAST_BUY: { title: '立即购买', key: 'fastbuy', btnStatus: 'active' },
  GIFT: { title: '赠品不可购买', key: 'gift', btnStatus: 'disabled' }
}

function CompGoodsBuyToolbar (props) {
  const { onAddCart = () => {}, onFastBuy = () => {}, info, onChange = () => {} } = props
  const { cartCount = 0 } = useSelector((state) => state.cart)
  const { favs = [] } = useSelector((state) => state.user)
  const dispatch = useDispatch()
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
    console.log('onChangeLogin:', key)
    if (key == 'notice') {
      const { subscribe } = info
      if (subscribe) return false
      await api.user.subscribeGoods(info.itemId)
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
    } else {
      onChange(key)
    }
    // if (key == 'addcart') {
    //   await dispatch(
    //     addCart({
    //       item_id: info.itemId,
    //       num: 1,
    //       distributor_id: info.distributorId,
    //       shop_type: 'distributor'
    //     })
    //   )
    // }
    // if (key == 'fastbuy') {
    // }
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
        {btns.map((item) => {
          if (item.btnStatus == 'disabled') {
            return (
              <View className={classNames('btn-item', `btn-${item.btnStatus}`)}>{item.title}</View>
            )
          } else {
            return (
              <SpLogin
                className={classNames('btn-item', `btn-${item.btnStatus}`)}
                onChange={onChangeLogin.bind(this, item)}
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
