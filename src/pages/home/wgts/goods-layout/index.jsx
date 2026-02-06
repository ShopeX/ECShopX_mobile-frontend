/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpGoodsHeroCard, SpGoodsCompactCard } from '@/components/sp-render-goods'
import './index.scss'

/**
 * 商品列表布局组件
 * @param {Object} props
 * @param {string} props.layout - 布局类型：'one' | 'two' | 'three'
 * @param {Array} props.goodsList - 商品列表
 * @param {Array} props.goodsLeftList - 左列商品列表（two布局时使用）
 * @param {Array} props.goodsRightList - 右列商品列表（two布局时使用）
 * @param {Function} props.onClickItem - 商品点击回调函数
 * @param {string} props.classNamePrefix - CSS类名前缀，如 'wgt-goods', 'wgt-group' 等
 */
export default function GoodsLayout(props) {
  const {
    layout,
    goodsList = [],
    goodsLeftList = [],
    goodsRightList = [],
    onClickItem,
    classNamePrefix = 'wgt-goods'
  } = props

  // 一列网格布局
  if (layout === 'one') {
    return (
      <View className={`${classNamePrefix}__one-list`}>
        {goodsList?.map((item, index) => (
          <SpGoodsCompactCard
            className={classNames({
              'mb-18': index != goodsList.length - 1
            })}
            key={item.item_id}
            info={item}
            onClick={() => onClickItem(item, index + 1)}
          />
        ))}
      </View>
    )
  }

  // 二列网格布局
  if (layout === 'two') {
    return (
      <View className={`${classNamePrefix}__two-list`}>
        <View className={`${classNamePrefix}__two-list-left`}>
          {goodsLeftList?.map((item, index) => (
            <SpGoodsHeroCard
              key={item.item_id}
              info={item}
              onClick={() => onClickItem(item, index + 1)}
            />
          ))}
        </View>
        <View className={`${classNamePrefix}__two-list-right`}>
          {goodsRightList?.map((item, index) => (
            <SpGoodsHeroCard
              key={item.item_id}
              info={item}
              onClick={() => onClickItem(item, index + 1)}
            />
          ))}
        </View>
      </View>
    )
  }

  // 三列网格布局
  if (layout === 'three') {
    return (
      <View className={`${classNamePrefix}__three-list`}>
        {goodsList?.map((item, index) => (
          <SpGoodsHeroCard
            key={item.item_id}
            info={item}
            onClick={() => onClickItem(item, index + 1)}
          />
        ))}
      </View>
    )
  }

  return null
}
