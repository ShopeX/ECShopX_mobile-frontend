/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 内购详情底部栏：仅 Figma 稿布局（左价 · 中购物车 · 右主操作）
 */
import React from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpLogin, SpGoodsPrice } from '@/components'
import { classNames, navigateTo, showToast, isWeb } from '@/utils'
import { BUY_TOOL_BTNS, ACTIVITY_LIST } from '@/consts'
import api from '@/api'
import { useTranslation, $t } from '@/i18n'
import './comp-buytoolbar.scss'

function CompGoodsBuyToolbar(props) {
  useTranslation()
  const { info, onChange = () => {}, onSubscribe = () => {}, curItem = null } = props
  const { cartCount = 0 } = useSelector((state) => state.purchase)
  const btns = []

  if (!info) {
    return null
  }

  const fillToolbarBtns = () => {
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

    if (ACTIVITY_LIST()[info.activityType]) {
      if (info.activityType == 'seckill') {
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

  fillToolbarBtns()

  if (!ACTIVITY_LIST()[info.activityType]) {
    const fi = btns.findIndex((b) => b.key === 'fastbuy')
    if (fi > -1) {
      btns.splice(fi, 1)
    }
  }

  const onChangeLogin = async ({ key }) => {
    if (key == 'notice') {
      const { subscribe } = info
      if (subscribe) return false

      if (isWeb) {
        showToast($t('21544271.a793a0'))
        return
      }

      await api.user.subscribeGoods(info.itemId, info.distributorId)
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
    } else {
      onChange(key)
    }
  }

  const renderToolbarBtns = () =>
    btns.map((item, index) => {
      if (item.btnStatus == 'disabled') {
        return (
          <View
            className='comp-goodsbuytoolbar-espier__btn comp-goodsbuytoolbar-espier__btn--disabled'
            key={`btn-item__${index}`}
          >
            <Text className='comp-goodsbuytoolbar-espier__btn-text'>{item.title}</Text>
          </View>
        )
      }
      return (
        <SpLogin
          className={classNames(
            'comp-goodsbuytoolbar-espier__btn',
            item.btnStatus === 'active'
              ? 'comp-goodsbuytoolbar-espier__btn--accent'
              : 'comp-goodsbuytoolbar-espier__btn--solid'
          )}
          onChange={onChangeLogin.bind(null, item)}
          key={`btn-item__${index}`}
        >
          <Text className='comp-goodsbuytoolbar-espier__btn-text'>{item.title}</Text>
        </SpLogin>
      )
    })

  const priceInfo = curItem || info

  return (
    <View className='comp-goodsbuytoolbar-espier'>
      <View className='comp-goodsbuytoolbar-espier__inner'>
        <View className='comp-goodsbuytoolbar-espier__price'>
          <SpGoodsPrice isPurchase info={priceInfo} />
        </View>

        <View
          className='comp-goodsbuytoolbar-espier__cart'
          onClick={navigateTo.bind(null, '/subpages/purchase/espier-index?tabbar=0')}
        >
          <View className='comp-goodsbuytoolbar-espier__cart-icon-wrap'>
            <Text className='iconfont icon-gouwuche comp-goodsbuytoolbar-espier__cart-icon' />
            {cartCount > 0 && (
              <Text className='comp-goodsbuytoolbar-espier__cart-badge'>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            )}
          </View>
          <Text className='comp-goodsbuytoolbar-espier__cart-label'>{$t('21544271.c017be')}</Text>
        </View>

        <View
          className={classNames('comp-goodsbuytoolbar-espier__actions', {
            'comp-goodsbuytoolbar-espier__actions--multi': btns.length > 1
          })}
        >
          {renderToolbarBtns()}
        </View>
      </View>
    </View>
  )
}

CompGoodsBuyToolbar.options = {
  addGlobalClass: true
}

export default CompGoodsBuyToolbar
