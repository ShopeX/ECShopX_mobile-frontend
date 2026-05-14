/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { BUY_TOOL_BTNS, ACTIVITY_LIST } from '@/consts'
import { useTranslation } from '@/i18n'
import { guideBuyBtnLabel } from '@/subpages/guide/utils/guide-buy-btn-label'
import './comp-buytoolbar.scss'

function CompGoodsBuyToolbar(props) {
  useTranslation()
  const {
    onAddCart = () => {},
    onFastBuy = () => {},
    info,
    onChange = () => {},
    onSubscribe = () => {}
  } = props
  const btns = []

  if (!info) {
    return null
  }

  const RenderBtns = () => {
    if (info.store == 0) {
      btns.push(BUY_TOOL_BTNS().NO_STORE)
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
          btns.push(BUY_TOOL_BTNS().SHARE)
        }
      } else if (info.activityType == 'limited_time_sale') {
        if (info.activityInfo.status === 'in_the_notice') {
          btns.push(BUY_TOOL_BTNS().ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS().SHARE)
        }
      } else if (info.activityType == 'group') {
        if (info.activityInfo.show_status === 'nostart') {
          btns.push(BUY_TOOL_BTNS().ACTIVITY_WILL_START)
        } else {
          btns.push(BUY_TOOL_BTNS().SHARE)
        }
      }
      return
    }

    btns.push(BUY_TOOL_BTNS().ADD_CART)
    btns.push(BUY_TOOL_BTNS().SHARE)
  }

  RenderBtns()

  const handleClickBtn = async ({ key }) => {
    console.log('handleClickBtn:', key)
    onChange(key)
  }

  return (
    <View className='comp-goodsbuytoolbar'>
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
                {guideBuyBtnLabel(item)}
              </View>
            )
          } else {
            return (
              <View
                className={classNames('btn-item', `btn-${item.btnStatus}`)}
                onClick={handleClickBtn.bind(this, item)}
                key={`btn-item__${index}`}
              >
                <View className='btn-item-txt'>{guideBuyBtnLabel(item)}</View>
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
