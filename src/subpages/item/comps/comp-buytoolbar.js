/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpButton, SpLogin } from '@/components'
import { classNames, navigateTo, showToast, isWeb } from '@/utils'
import { addCart } from '@/store/slices/cart'
import { ACTIVITY_LIST, BUY_TOOL_BTNS } from '@/consts'
import { fetchUserFavs, addUserFav, deleteUserFav } from '@/store/slices/user'
import api from '@/api'
import { useTranslation, $t } from '@/i18n'
import './comp-buytoolbar.scss'

/** BUY_TOOL_BTNS 的 `key` → i18n 文案键（与 consts 中文一致） */
const BUY_TOOLBAR_TITLE_I18N = {
  notice: '91cdd6e0.46a6b2',
  subscribe: '91cdd6e0.6a26cf',
  addcart: '91cdd6e0.62d369',
  fastbuy: '4d1e9bfe.5fd2f9',
  gift: '91cdd6e0.235979',
  activity_will_start: '91cdd6e0.689272',
  activity_fast_buy: '4d1e9bfe.d8a40b',
  activity_buy: '4d1e9bfe.5fd2f9',
  activity_group_buy: '4d1e9bfe.ccb0dd',
  exchange: '4d1e9bfe.525bb2',
  exchange_point: '4d1e9bfe.525bb2',
  only_show: '91cdd6e0.820df2',
  nostore: '91cdd6e0.7cfe76',
  share: '91cdd6e0.e2829e'
}

function buyToolbarBtnTitle(item) {
  const k = BUY_TOOLBAR_TITLE_I18N[item.key]
  return k ? $t(k) : item.title
}

function CompGoodsBuyToolbar(props) {
  useTranslation()
  console.log('BUY_TOOL_BTNS', BUY_TOOL_BTNS)
  const {
    onAddCart = () => {},
    onFastBuy = () => {},
    info,
    onChange = () => {},
    onSubscribe = () => {}
  } = props
  const { cartCount = 0 } = useSelector((state) => state.cart)
  const { favs = [] } = useSelector((state) => state.user)
  const $instance = getCurrentInstance() || {}
  const dispatch = useDispatch()
  const btns = []

  if (!info) {
    return null
  }

  const RenderBtns = () => {
    // 兑换券
    const { card_id } = $instance?.router?.params || {}
    if (card_id) {
      btns.push(BUY_TOOL_BTNS().EX_CHANGE)
      return
    }

    if (info.approveStatus == 'only_show') {
      btns.push(BUY_TOOL_BTNS().ONLY_SHOW)
      return
    }
    if (info.store == 0) {
      if (info.subscribe) {
        btns.push(BUY_TOOL_BTNS().SUBSCRIBE)
      } else {
        btns.push(BUY_TOOL_BTNS().NOTICE)
      }
      return
    }

    if (info.isGift) {
      btns.push(BUY_TOOL_BTNS().GIFT)
      return
    }

    // 秒杀、拼团、限时特惠
    if (ACTIVITY_LIST()[info.activityType]) {
      if (info.activityType == 'seckill') {
        // 活动即将开始
        if (info.activityInfo.status === 'in_the_notice') {
          btns.push(BUY_TOOL_BTNS().ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS().ACTIVITY_FAST_BUY)
        }
      } else if (info.activityType == 'limited_time_sale') {
        if (info.activityInfo.status === 'in_the_notice') {
          btns.push(BUY_TOOL_BTNS().ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS().ADD_CART, BUY_TOOL_BTNS().ACTIVITY_BUY)
        }
      } else if (info.activityType == 'group') {
        if (info.activityInfo.show_status === 'nostart') {
          btns.push(BUY_TOOL_BTNS().ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS().ACTIVITY_GROUP_BUY)
        }
      }
      return
    }

    btns.push(BUY_TOOL_BTNS().ADD_CART)
    btns.push(BUY_TOOL_BTNS().FAST_BUY)
  }

  RenderBtns()

  const onChangeLogin = async ({ key }) => {
    const { dtid, card_id, user_card_id } = $instance?.router?.params
    console.log('onChangeLogin:', key)
    if (key == 'notice') {
      const { subscribe } = info
      if (subscribe) return false

      if (isWeb) {
        showToast($t('21544271.a793a0'))
        return
      }

      await api.user.subscribeGoods(info.itemId, { distributor_id: dtid })
      const { template_id } = await api.user.newWxaMsgTmpl({
        temp_name: 'yykweishop',
        source_type: 'goods'
      })
      Taro.requestSubscribeMessage({
        tmplIds: template_id,
        success: () => {
          onSubscribe()
          showToast($t('21544271.9f91d7'))
        },
        fail: () => {
          onSubscribe()
        }
      })
    } else if (key == 'exchange') {
      const { itemId } = info
      const { status } = await api.cart.exchangeGood({
        item_id: itemId,
        distributor_id: dtid,
        user_card_id
      })
      if (status) {
        Taro.navigateTo({
          url: `/subpages/marketing/exchange-code?user_card_id=${user_card_id}&card_id=${card_id}`
        })
        return
      }
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
    showToast(fav ? $t('4d1e9bfe.b46077') : $t('4d1e9bfe.151286'))
  }

  const isFaved = favs.findIndex((item) => item.item_id == info.itemId) > -1
  return (
    <View className='comp-goodsbuytoolbar'>
      <SpLogin className='shoucang-wrap' onChange={onChangeCollection.bind(this)}>
        <View className='toolbar-item'>
          <Text className={classNames('iconfont', isFaved ? 'icon-star_on' : 'icon-star')}></Text>
          <Text className='toolbar-item-txt'>{$t('21544271.ae336c')}</Text>
        </View>
      </SpLogin>
      <View
        className='toolbar-item'
        onClick={navigateTo.bind(this, '/pages/cart/espier-index?showBack=1')}
      >
        <Text className='iconfont icon-cart'></Text>
        <Text className='toolbar-item-txt'>{$t('21544271.c017be')}</Text>
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
                {buyToolbarBtnTitle(item)}
              </View>
            )
          } else {
            return (
              <SpLogin
                className={classNames('btn-item', `btn-${item.btnStatus}`)}
                onChange={onChangeLogin.bind(this, item)}
                key={`btn-item__${index}`}
              >
                <View className='btn-item-txt'>{buyToolbarBtnTitle(item)}</View>
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
