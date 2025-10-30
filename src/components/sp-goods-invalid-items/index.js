// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { View, Text, Image } from '@tarojs/components'
import { SpPrice, SpInputNumber, SpImage, SpCheckboxNew } from '@/components'
import { VERSION_IN_PURCHASE } from '@/utils'
import { AtButton } from 'taro-ui'

import './index.scss'

const initialState = {
  allChecked: true
}
function CompGoodsInvalidItems(props) {
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
                  <View className='reason'>所在地区该商品无法配送</View>
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
