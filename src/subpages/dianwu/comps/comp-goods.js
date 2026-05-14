/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { useTranslation, $t } from '@/i18n'
import CompGoodsPrice from './comp-goods-price'
import './comp-goods.scss'

function CompGoods(props) {
  useTranslation()
  const { children, info } = props
  if (!info) {
    return null
  }

  const showStore = info.isTotalStore === true
  const showPlatformStore = info.platformStore != null
  const showInventory = showStore || showPlatformStore

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
          {/* <View className='price-list'>
            <SpPrice className='sale-price' value={999.99}></SpPrice>
            <View className='price-wrap'>
              <SpPrice className='vip-price' value={888.99}></SpPrice>
              <SpVipLabel content='VIP' type='vip' />
            </View>
            <View className='price-wrap'>
              <SpPrice className='svip-price' value={666.99}></SpPrice>
              <SpVipLabel content='SVIP' type='svip' />
            </View>
          </View> */}
          <CompGoodsPrice info={info} />
          <View className='goods-info'>
            <View className='kc-bn'>
              {showInventory && (
                <View className='kc'>
                  <Text className='label'>{$t('982aa174.b008bd')}</Text>
                  {showStore && <Text>门店 {info.store}</Text>}
                  {showStore && showPlatformStore && <Text> | </Text>}
                  {showPlatformStore && <Text>云仓 {info.platformStore}</Text>}
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
            {/* <AtButton circle className={classNames({ 'active': true })}>
              <Text className='iconfont icon-plus'></Text>
            </AtButton> */}
            {/* <AtButton circle disabled>
            缺货
          </AtButton> */}
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
