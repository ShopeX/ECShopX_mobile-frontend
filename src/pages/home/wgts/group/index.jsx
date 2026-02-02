/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useEffect, useMemo, useContext } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames, styleNames, linkPage, pickBy, getDistributorId } from '@/utils'
import doc from '@/doc'
import api from '@/api'
import { AtIcon } from 'taro-ui'
import { getGlobalBaseStyle } from '../helper'
import { WgtsContext } from '../wgts-context'
import GoodsLayout from '../goods-layout'
import './index.scss'

export default function WgtGroup(props) {
  const { info, id } = props
  const [goodsList, setGoodsList] = useState([])
  const [goodsLeftList, setGoodsLeftList] = useState([])
  const [goodsRightList, setGoodsRightList] = useState([])
  const [loading, setLoading] = useState(false)

  // 从 params 中获取配置和数据，兼容两种数据结构
  const params = info?.params || info || {}
  const base = params.base || {}
  const data = params.data || {}

  const { onAddToCart } = useContext(WgtsContext)

  // 获取外层样式（包含 outerMargin 和背景配置）
  const outerStyle = useMemo(() => {
    return getGlobalBaseStyle(base.outerMargin)
  }, [base.outerMargin])

  // 获取内层样式（包含 innerPadding）
  const innerStyle = useMemo(() => {
    return getGlobalBaseStyle(base.innerPadding)
  }, [base.innerPadding])

  // 获取拼团商品数据
  useEffect(() => {
    const fetchGroupGoods = async () => {
      if (!data.id) return

      setLoading(true)
      try {
        const distributorId = getDistributorId()
        const _data = await api.seckill.getWidgetItems({
          data_type: 'group',
          data_value: data.id || '',
          data_count: base.dataCount,
          distributor_id: distributorId || ''
        })
        if (_data && Array.isArray(_data) && _data.length > 0) {
          const goods = pickBy(_data, doc.goods.WGT_SPEEDKILL_GOODS)
          setGoodsList(goods.slice(0, base.dataCount))
          if (base.goodsLayout === 'two') {
            const _itemListLeft = goods.filter((item, index) => index % 2 == 0)
            const _itemListRight = goods.filter((item, index) => index % 2 == 1)
            setGoodsLeftList(_itemListLeft)
            setGoodsRightList(_itemListRight)
          }
        }
      } catch (error) {
        console.error('获取拼团商品失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGroupGoods()
  }, [data.id, base.dataCount])

  // 处理更多按钮点击
  const handleClickMore = () => {
    if (base.moreLink && base.moreLink.length > 0) {
      linkPage(base.moreLink[0])
    } else if (data.id) {
      Taro.navigateTo({
        url: `/marketing/pages/item/group-list?group_id=${data.id}`
      })
    }
  }

  // 处理商品点击
  const handleClickItem = (item) => {
    linkPage({
      linkPage: 'goods',
      id: item.goodsId || item.item_id || item.itemId
    })
  }

  // 处理拼团标签
  const renderGroupTag = (tags) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) return null
    return <Text>{tags[0].tag_name || tags[0]}</Text>
  }

  if (!info || !data.id) {
    return null
  }

  return (
    <View
      className={classNames('wgt wgt-group')}
      style={styleNames(outerStyle)}
      id={`wgt-group-${id || ''}`}
    >
      <View className='wgt-group-body' style={styleNames(innerStyle)}>
        {(base.titleText?.type === 'text' && base.titleText?.text) ||
        (base.titleText?.type === 'image' && base.titleText?.image) ||
        base.moreBtn?.show ? (
          <View className='wgt-group-head'>
            <View className='wgt-group-head-hd'>
              {base.titleText?.type === 'text' && base.titleText?.text && (
                <Text
                  className='wgt-group-head-title'
                  style={styleNames({ color: base.titleColor })}
                >
                  {base.titleText.text}
                </Text>
              )}
              {base.titleText?.type === 'image' && base.titleText?.image && (
                <SpImage src={base.titleText.image} className='wgt-group-head-title-image' />
              )}
            </View>
            {base.moreBtn?.show && (
              <View
                className='wgt-group-head-more'
                onClick={handleClickMore}
                style={styleNames({ color: base.moreBtn?.color })}
              >
                <Text>查看更多</Text>
                <AtIcon value='chevron-right' size={14} color={base.moreBtn?.color} />
              </View>
            )}
          </View>
        ) : null}
        {/* default 布局：活动商品列表 */}
        {(!base.goodsLayout || base.goodsLayout === 'default') && (
          <View className='wgt-group__activity-list'>
            {goodsList.map((item, index) => (
              <View
                className='wgt-group__activity-item'
                key={index}
                onClick={() => handleClickItem(item, index)}
              >
                <View className='wgt-group__activity-item-img'>
                  <SpImage
                    src={item.pic || item.imgUrl}
                    width={154}
                    height={154}
                    mode='aspectFill'
                  />
                  {item.store <= 0 && (
                    <View className='soldout-mask'>
                      <View className='soldout-mask-text'>
                        <Text>已售罄</Text>
                      </View>
                    </View>
                  )}
                  {(() => {
                    const tag = renderGroupTag(item.tags)
                    return tag ? (
                      <View className='wgt-group__activity-item-group-tag'>{tag}</View>
                    ) : null
                  })()}
                </View>
                <View className='wgt-group__activity-item-info'>
                  <View className='wgt-group__activity-item-title'>
                    {item.itemName || item.title}
                  </View>
                  <View className='wgt-group__activity-item-price'>
                    <Text className='wgt-group__activity-item-price__activity_name'>拼团价</Text>
                    <Text className='wgt-group__activity-item-price__unit'>￥</Text>
                    <Text className='wgt-group__activity-item-price__text'>
                      {item.mainPrice ||
                        (item.activityPrice
                          ? item.activityPrice.toFixed(2)
                          : item.price?.toFixed(2) || '0.00')}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
        {['one', 'two', 'three'].includes(base.goodsLayout) && (
          <GoodsLayout
            layout={base.goodsLayout}
            goodsList={goodsList}
            goodsLeftList={goodsLeftList}
            goodsRightList={goodsRightList}
            onClickItem={handleClickItem}
            classNamePrefix='wgt-group'
          />
        )}
      </View>
    </View>
  )
}
