/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpPage, SpTabbar } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import CompBottomTip from './comps/comp-bottomTip'
import './neigou-order.scss'

function SelectComponent(props) {
  const { i18n } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)

  const [orders] = useState([
    {
      id: 1,
      title: '上海商派员工亲友购',
      isNeiGou: true,
      orderNum: '338341400246090',
      orderTime: '2021.4.30 12:00:00',
      status: '待支付',
      goods: {
        url: '',
        name: '水晶石无火香薰昆仑煮雪',
        intro: '昆仑煮雪',
        price: '402.00',
        count: 10
      }
    },
    {
      id: 2,
      title: '上海商派员工亲友购',
      isNeiGou: true,
      orderNum: '338341400246090',
      orderTime: '2021.4.30 12:00:00',
      status: '待收货',
      goods: {
        url: '',
        name: '水晶石无火香薰昆仑煮雪',
        intro: '昆仑煮雪',
        price: '402.00',
        count: 10
      }
    }
  ])

  const tabbarState = useMemo(
    () => [
      { title: $t('f1d3181c.a8b0c2') },
      { title: $t('16726e8e.9246fe') },
      { title: $t('16726e8e.4933ca') }
    ],
    [i18n.language]
  )

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('d753bc5e.22fa05') })
  }, [i18n.language])

  const handleTitleClick = (index) => {
    setActiveIndex(index)
  }

  const statusLabel = (status) => {
    if (status === '待支付') return $t('16726e8e.9246fe')
    if (status === '待收货') return $t('16726e8e.4933ca')
    return status
  }

  const mockText = (text) => {
    if (text === '上海商派员工亲友购') return $t('023f641f.6651a4')
    if (text === '水晶石无火香薰昆仑煮雪') return $t('c34a58f0.d47adb')
    if (text === '昆仑煮雪') return $t('5f8810a1.a20bf1')
    return text
  }

  return (
    <>
      <View className='order-tabbar'>
        {tabbarState.map((item, index) => {
          return (
            <View
              key={index}
              className={classNames('order-item', { active: activeIndex === index })}
              onClick={() => handleTitleClick(index)}
            >
              {item.title}
            </View>
          )
        })}
      </View>
      <SpPage className='neigou-order'>
        {orders?.map((item, index) => {
          return (
            <View key={item.id} className='good-item'>
              <View className='item-title'>{mockText(item.title)}</View>
              <View className='item-content'>
                <View className='content-head'>
                  <View className='head-top'>
                    <View className='head-top-left'>
                      {item.isNeiGou && <Text className='neigou'>{$t('d0465c10.36d204')}</Text>}
                      <Text className='order-num'>{ti('12f07f54.78f59a', [item.orderNum])}</Text>
                    </View>
                    <View className='order-status'>{statusLabel(item.status)}</View>
                  </View>
                  <View className='order-time'>
                    {$t('30644393.2240cc')}：{item.orderTime}
                  </View>
                </View>
                <View className='content-good'>
                  <View>
                    <Image className='good-img' src={item.goods?.url} />
                  </View>
                  <View className='good-content'>
                    <View className='good-content-top'>
                      <View>{mockText(item.goods?.name)}</View>
                      <View className='good-price'>¥{item.goods?.price}</View>
                    </View>
                    <View className='good-content-bottom'>
                      <View>{mockText(item.goods?.intro)}</View>
                      <View>x&nbsp;{item.goods?.count}</View>
                    </View>
                  </View>
                </View>
                <View className='content-pay'>
                  <Text className='all-count'>{ti('12f07f54.17d01f', [item.goods?.count])}</Text>
                  <Text className='actual-price'>{$t('12f07f54.94a7de')}</Text>
                  <Text className='price'>
                    ¥<Text className='price-account'>{item.goods?.price * item.goods?.count}</Text>
                    .00
                  </Text>
                </View>
                <View className='item-option'>
                  <View className='option-order'>
                    {item.status === '待支付' ? $t('16726e8e.b21b5e') : $t('64c107ec.edf4b2')}
                  </View>
                  <View className='option-pay'>
                    {item.status === '待支付' ? $t('16726e8e.747349') : $t('2715dbf7.775b01')}
                  </View>
                </View>
              </View>
            </View>
          )
        })}
      </SpPage>
    </>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent
