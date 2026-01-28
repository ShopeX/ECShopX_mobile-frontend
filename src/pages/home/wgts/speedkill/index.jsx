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
import GoodsLayout from '../goods-layout'
import { getGlobalBaseStyle } from '../helper'
import { WgtsContext } from '../wgts-context'
import './index.scss'

export default function WgtSpeedkill(props) {
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

  // 获取秒杀商品数据
  useEffect(() => {
    const fetchSeckillGoods = async () => {
      // 否则从 API 获取
      console.log(data.id, 'data-seckillGoodsList')
      if (!data.id) return

      setLoading(true)
      try {
        const distributorId = getDistributorId()
        const _data = await api.seckill.getWidgetItems({
          data_type: 'seckill',
          data_value: data.id || '',
          data_count: base.dataCount,
          distributor_id: distributorId || ''
        })
        console.log(_data, 'data-getWidgetItems')
        // 如果 items 已经有数据，直接使用
        if (_data && Array.isArray(_data) && _data.length > 0) {
          const goods = pickBy(_data, doc.goods.WGT_SPEEDKILL_GOODS)
          setGoodsList(goods.slice(0, base.dataCount))
          if (base.goodsLayout === 'two') {
            const _itemListLeft = goods.filter((item, index) => index % 2 == 0)
            const _itemListRight = goods.filter((item, index) => index % 2 == 1)
            setGoodsLeftList(_itemListLeft)
            setGoodsRightList(_itemListRight)
          }
          return
        }
      } catch (error) {
        console.error('获取秒杀商品失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeckillGoods()
  }, [data.id, base.dataCount])

  // TODO 获取秒杀信息待定
  const getSeckillInfo = (list) => {
    const { promotionSkill } = list?.[0] || {}
    const { start_time, end_time } = promotionSkill || {}
    const now = Math.floor(Date.now() / 1000)
    if (!start_time || !end_time) {
      return
    }

    // 活动未开始
    if (now < start_time) {
      const startDate = new Date(start_time * 1000)
      const today = new Date().setHours(0, 0, 0, 0)
      const tomorrow = new Date(today).setDate(new Date(today).getDate() + 1)
      const startDay = new Date(startDate).setHours(0, 0, 0, 0)

      const timeStr = `${startDate.getHours().toString().padStart(2, '0')}:${startDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`

      if (startDay === today)
        return (
          <View className='-title-limitedTime-text'>
            <Text className='sp-shelves-goods__header-title-limitedTime-text-title'>今日开抢</Text>
            <Text className='sp-shelves-goods__header-title-limitedTime-text-time'>{timeStr}</Text>
          </View>
        )
      if (startDay === tomorrow)
        return (
          <View className='sp-shelves-goods__header-title-limitedTime-text'>
            <Text className='sp-shelves-goods__header-title-limitedTime-text-title'>明日开抢</Text>
            <Text className='sp-shelves-goods__header-title-limitedTime-text-time'>{timeStr}</Text>
          </View>
        )
      return (
        <View className='sp-shelves-goods__header-title-limitedTime-text'>
          <Text className='sp-shelves-goods__header-title-limitedTime-text-title'>
            {startDate.getMonth() + 1}月{startDate.getDate()}日
          </Text>
          <Text className='sp-shelves-goods__header-title-limitedTime-text-time'>{timeStr}</Text>
        </View>
      )
    }

    // 活动已结束
    if (now >= end_time) {
      setShelvesGoods([])
      setShowShelvesGoods(false)
      return
    }

    // 活动进行中
    const diffSeconds = end_time - now
    const timeData = calcTimer(diffSeconds)

    return timeData
  }

  // 处理更多按钮点击
  const handleClickMore = () => {
    if (base.moreLink && base.moreLink.length > 0) {
      linkPage(base.moreLink[0])
    } else if (data.id) {
      Taro.navigateTo({
        url: `/marketing/pages/item/seckill-goods-list?seckill_id=${data.id}`
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

  // 处理加入购物车
  const handleAddToCart = async ({ itemId, distributorId }) => {
    if (onAddToCart) {
      onAddToCart({ itemId, distributorId })
    }
  }

  if (!info || !data.id) {
    return null
  }

  // 过滤左右列商品（用于 grid 布局）

  return (
    <View
      className={classNames('wgt wgt-speedkill', {
        'wgt__padded': base.padded
      })}
      style={styleNames(outerStyle)}
      id={`wgt-speedkill-${id || ''}`}
    >
      {/* 标题区域 */}
      {(base.titleType === 'text' && base.titleText) ||
      (base.titleType === 'image' && base.titleImage) ? (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            {base.titleType === 'text' && base.titleText && (
              <Text
                className='wgt-title'
                style={styleNames({
                  color: base.titleColor || '#000000'
                })}
              >
                {base.titleText}
              </Text>
            )}
            {base.titleType === 'image' && base.titleImage && (
              <SpImage src={base.titleImage} className='wgt-title-image' />
            )}
          </View>
          {base.showMoreBtn && (
            <View
              className='wgt-more'
              onClick={handleClickMore}
              style={styleNames({
                color: base.moreBtnColor || '#000000'
              })}
            >
              <View className='three-dot'></View>
            </View>
          )}
        </View>
      ) : null}

      {/* 商品列表区域 */}
      <View className='wgt-body' style={styleNames(innerStyle)}>
        {loading ? (
          <View className='wgt-loading'>加载中...</View>
        ) : (
          goodsList.length > 0 &&
          goodsList.length >= base.dataCount && (
            <>
              {/* default 布局：活动商品列表 */}
              {base.goodsLayout === 'default' && (
                <View className='wgt-speedkill__activity-list'>
                  {goodsList.map((item, index) => (
                    <View
                      className='wgt-speedkill__activity-item'
                      key={index}
                      onClick={() => {
                        handleClickItem(item, index)
                      }}
                    >
                      <View className='wgt-speedkill__activity-item-img'>
                        <SpImage src={item.pic || item.imgUrl} width={198} height={198} />
                        {item.store <= 0 && (
                          <View className='soldout-mask'>
                            <View className='soldout-mask-text'>
                              <Text>已售罄</Text>
                            </View>
                          </View>
                        )}
                      </View>
                      <View className='wgt-speedkill__activity-item-info'>
                        <View className='wgt-speedkill__activity-item-title'>
                          {item.itemName || item.title}
                        </View>
                        <View className='wgt-speedkill__activity-item-price'>
                          <Text className='wgt-speedkill__activity-item-price__activity_name'>
                            秒杀价
                          </Text>
                          <Text className='wgt-speedkill__activity-item-price__unit'>￥</Text>
                          <Text className='wgt-speedkill__activity-item-price__text'>
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
              {/* grids 布局 */}
              {['one', 'two', 'three'].includes(base.goodsLayout) && (
                <GoodsLayout
                  layout={base.goodsLayout}
                  goodsList={goodsList}
                  goodsLeftList={goodsLeftList}
                  goodsRightList={goodsRightList}
                  onClickItem={handleClickItem}
                  classNamePrefix='wgt-speedkill'
                />
              )}
            </>
          )
        )}
      </View>
    </View>
  )
}
