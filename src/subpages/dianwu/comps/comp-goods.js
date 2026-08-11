/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import { resolveDianwuGoodsDisplay } from '../utils/dianwu-goods-action'
import CompGoodsPrice from './comp-goods-price'
import './comp-goods.scss'

function CompGoods(props) {
  useTranslation()
  const { children, info, isPlatformStoreBuy = false } = props
  if (!info) {
    return null
  }

  const display = resolveDianwuGoodsDisplay(info, isPlatformStoreBuy)
  const showInventory = display.showStore || display.showCloud

  return (
    <View className='comp-goods'>
      <View className='item-bd'>
        <View className='item-bd-hd'>
          <SpImage src={info.pic} width={140} height={140} />
        </View>
        <View className='item-bd-bd'>
          <View className='title'>
            {info.isPrescription == 1 && info.isMedicine && (
              <Text className='prescription-drug'>{$t('982aa174.e8b7e1')}</Text>
            )}
            {info.name}
          </View>
          {info.itemSpecDesc && <View className='sku'>{info.itemSpecDesc}</View>}
          <CompGoodsPrice info={info} />
          <View className='goods-info'>
            <View className='kc-bn'>
              {showInventory && (
                <View className='kc'>
                  <Text className='label'>{$t('982aa174.b008bd')}</Text>
                  {display.showStore && <Text>{ti('982aa174.285600', [display.storeValue])}</Text>}
                  {display.showStore && display.showCloud && <Text> | </Text>}
                  {display.showCloud && <Text>{ti('982aa174.f36d41', [display.cloudValue])}</Text>}
                </View>
              )}
              {info.barcode && (
                <View className='bn'>
                  <Text className='label'>{$t('982aa174.5b69d5')}</Text>
                  {info.barcode}
                </View>
              )}
            </View>
            <View className='btn-actions'>{children}</View>
          </View>
        </View>
      </View>
      <View className='item-ft'></View>
    </View>
  )
}

CompGoods.options = {
  addGlobalClass: true
}

export default CompGoods
