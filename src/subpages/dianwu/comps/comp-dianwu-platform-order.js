/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpFloatLayout, SpInputNumber } from '@/components'
import * as dianwuApi from '@/api/dianwu'
import { $t, ti } from '@/i18n'

import './comp-dianwu-platform-order.scss'

/**
 * 店务-云仓立即下单：选择数量后调快买加购并跳转结算。
 * @param {boolean} open
 * @param {object|null} item 商品行（含 itemId、name、platformStore）
 * @param {string|number} distributor_id
 * @param {() => void} onClose
 * @param {() => void} [onEventFetchOrder] 结算页返回时刷新购物车等
 */
function CompDianwuPlatformOrder({ open, item, distributor_id, onClose, onEventFetchOrder }) {
  const [num, setNum] = useState(1)

  const maxStock = Math.max(1, Number(item?.platformStore) || 1)

  useEffect(() => {
    if (open && item) {
      setNum(1)
    }
  }, [open, item?.itemId])

  const handleConfirm = async () => {
    if (!item?.itemId || !distributor_id) return
    const n = Math.min(Math.max(1, parseInt(num, 10) || 1), maxStock)
    Taro.showLoading({ title: '' })
    try {
      const res = await dianwuApi.cartFastBuyAdd({
        item_id: item.itemId,
        num: n,
        distributor_id,
        is_accumulate: false
      })
      if (res?.distributor_id) {
        onClose?.()
        Taro.navigateTo({
          url: `/subpages/dianwu/checkout?distributor_id=${res.distributor_id}&cart_type=fastbuy`,
          events: {
            onEventFetchOrder: () => {
              onEventFetchOrder?.()
            }
          }
        })
      }
    } finally {
      Taro.hideLoading()
    }
  }

  const visible = !!(open && item)

  return (
    <SpFloatLayout
      className='layout-dianwu-platform-order'
      title={$t('eac57497.887eb6')}
      open={visible}
      onClose={onClose}
    >
      {item && (
        <View className='comp-dianwu-platform-order'>
          <View className='goods-name'>{item.name}</View>
          {item.itemSpecDesc ? <View className='goods-sku'>{item.itemSpecDesc}</View> : null}
          <View className='row-num'>
            <Text className='label'>{$t('eac57497.0bf60b')}</Text>
            <SpInputNumber
              value={num}
              min={1}
              max={maxStock}
              onChange={(v) => setNum(Number(v) || 1)}
            />
          </View>
          <View className='hint'>{ti('eac57497.5591b7', [maxStock])}</View>
          <AtButton type='primary' className='btn-confirm' onClick={handleConfirm}>
            {$t('eac57497.38cf16')}
          </AtButton>
        </View>
      )}
    </SpFloatLayout>
  )
}

CompDianwuPlatformOrder.options = {
  addGlobalClass: true
}

export default CompDianwuPlatformOrder
