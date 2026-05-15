/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { useImmer } from 'use-immer'
import { View, Text } from '@tarojs/components'
import { SpImage, SpCheckboxNew } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './index.scss'

const initialState = {
  allChecked: true
}
function CompGoodsInvalidItems(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { allChecked } = state

  const { empty = () => {}, deletes = () => {}, lists } = props
  return (
    <View>
      <View className='comp-goodsinvaliditems-invalid'>
        <View className='comp-goodsinvaliditems-invalid-title'>
          <View>已失效商品</View>
          <View onClick={() => empty(lists)}>清空失效商品</View>
        </View>
        <View className='comp-goodsinvaliditems-item'>
          {lists.map((item, index) => {
            return (
              <View className='comp-goodsinvaliditems-item-del' key={index}>
                <Text className='iconfont icon-shanchu1'></Text>
                {/* <SpCheckboxNew checked={allChecked} onChange={onChangeGoodsIsCheck()} /> */}
                <SpImage
                  className='comp-goodsitem-item-del-image'
                  mode='aspectFill'
                  circle={16}
                  src={item.pics}
                  width={130}
                  height={130}
                />
                {/* <SpImage
              className='pimage'
              circle={16}
              src='buhuozhong.png'
              width={130}
              height={130}
            /> */}
                <SpImage
                  className='pimage'
                  circle={16}
                  src='bukeshou.png'
                  width={130}
                  height={130}
                />
                <View className='comp-goodsinvaliditems-item-del-info'>
                  <View className='name'>
                    <Text className='names'>{item.item_name}</Text>
                    <Text className='iconfont icon-shanchu-01' onClick={() => deletes(item)} />
                  </View>
                  <View className='reason'>{$t('1dc7bf5c.cea8ba')}</View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default CompGoodsInvalidItems
