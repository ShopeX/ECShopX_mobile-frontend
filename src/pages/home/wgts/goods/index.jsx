/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames, styleNames, linkPage, pickBy, getDistributorId } from '@/utils'
import { getBrowseHistoryList } from '@/utils/browseHistory'
import doc from '@/doc'
import api from '@/api'
import { AtIcon } from 'taro-ui'
import GoodsLayout from '../goods-layout'
import { getGlobalBaseStyle } from '../helper'
import { WgtsContext } from '../wgts-context'
import './index.scss'

export default function WgtGoods(props) {
  const { info, id } = props
  const [goodsList, setGoodsList] = useState([])
  const [goodsLeftList, setGoodsLeftList] = useState([])
  const [goodsRightList, setGoodsRightList] = useState([])
  const [loading, setLoading] = useState(true)

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

  // 从本地存储刷新浏览记录（供 useDidShow 和 useEffect 复用）
  const refreshHistoryGoods = useCallback(() => {
    if (base.dataType !== 'history') return
    const count = Math.min(base.dataCount || 10, 10)
    const list = getBrowseHistoryList(count)
    const goods = list.map((item) => pickBy(item, doc.goods.WGT_SPEEDKILL_GOODS))
    setGoodsList(goods)
    if (base.goodsLayout === 'two') {
      setGoodsLeftList(goods.filter((_, i) => i % 2 === 0))
      setGoodsRightList(goods.filter((_, i) => i % 2 === 1))
    }
  }, [base.dataType, base.dataCount, base.goodsLayout])

  // 页面再次显示时（如从详情返回）重新读取本地浏览记录
  useDidShow(() => {
    refreshHistoryGoods()
  })

  // 获取商品数据
  useEffect(() => {
    const fetchGoods = async () => {
      setLoading(true)
      try {
        const dataType = base.dataType
        const count = Math.min(base.dataCount || 10, 10) // 本地浏览记录最多 10 条

        // 浏览记录：从本地存储读取（进入商品详情页时写入，最多 10 条）
        if (dataType === 'history') {
          refreshHistoryGoods()
          setLoading(false)
          return
        }

        // 其他类型：走挂件商品接口
        const distributorId = getDistributorId()
        let dataValue = data?.id || ''
        if (['items', 'price'].includes(dataType)) {
          dataValue = data?.id?.split(',') || ''
        }
        const _data = await api.seckill.getWidgetItems({
          data_type: dataType,
          data_value: dataValue,
          data_count: count,
          distributor_id: distributorId || ''
        })
        if (_data && Array.isArray(_data) && _data.length > 0) {
          const goods = pickBy(_data, doc.goods.WGT_SPEEDKILL_GOODS)
          let _goods = goods.slice(0, count)
          setGoodsList(_goods)
          if (base.goodsLayout === 'two') {
            const _itemListLeft = _goods.filter((item, index) => index % 2 == 0)
            const _itemListRight = _goods.filter((item, index) => index % 2 == 1)
            setGoodsLeftList(_itemListLeft)
            setGoodsRightList(_itemListRight)
          }
        }
        setLoading(false)
      } catch (error) {
        console.error('获取商品失败:', error)
        setLoading(false)
      }
    }

    fetchGoods()
  }, [data.id, base.dataCount, base.dataType])

  // 处理更多按钮点击
  const handleClickMore = () => {
    if (base.moreLink && base.moreLink.length > 0) {
      linkPage(base.moreLink[0])
    } else if (base.dataType === 'history') {
      Taro.navigateTo({
        url: '/marketing/pages/member/item-history'
      })
    } else {
      Taro.navigateTo({
        url: '/subpages/item/list'
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

  if (!info || loading) {
    return null
  }

  return (
    <View
      className={classNames('wgt wgt-goods')}
      style={styleNames(outerStyle)}
      id={`wgt-goods-${id || ''}`}
    >
      <View className='wgt-goods-body' style={styleNames(innerStyle)}>
        {(base.titleText?.type === 'text' && base.titleText?.text) ||
        (base.titleText?.type === 'image' && base.titleText?.image) ||
        base.moreBtn?.show ? (
          <View className='wgt-goods-head'>
            <View className='wgt-goods-head-hd'>
              {base.titleText?.type === 'text' && base.titleText?.text && (
                <Text
                  className='wgt-goods-head-title'
                  style={styleNames({ color: base.titleColor })}
                >
                  {base.titleText.text}
                </Text>
              )}
              {base.titleText?.type === 'image' && base.titleText?.image && (
                <View className='wgt-goods-head-title-image'>
                  <SpImage src={base.titleText.image} mode='heightFix' />
                </View>
              )}
            </View>
            {base.moreBtn?.show && (
              <View
                className='wgt-goods-head-more'
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
          <View className='wgt-goods__activity-list'>
            {goodsList.map((item, index) => (
              <View
                className='wgt-goods__activity-item'
                key={index}
                onClick={() => handleClickItem(item, index)}
              >
                <View className='wgt-goods__activity-item-img'>
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
                </View>
                <View className='wgt-goods__activity-item-info'>
                  <View className='wgt-goods__activity-item-title'>
                    {item.itemName || item.title}
                  </View>
                  <View className='wgt-goods__activity-item-price'>
                    <Text className='wgt-goods__activity-item-price__unit'>￥</Text>
                    <Text className='wgt-goods__activity-item-price__text'>
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
            classNamePrefix='wgt-goods'
          />
        )}
      </View>
    </View>
  )
}
