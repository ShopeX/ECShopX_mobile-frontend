import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker, Button } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './neigou-order.scss'
import CompBottomTip from './comps/comp-bottomTip'
import { SpPage, SpTabbar } from '@/components'
import CompTabbar from './comps/comp-tabbar'

const tabbarState = [{ title: '全部' }, { title: '待支付' }, { title: '待收货' }]

function SelectComponent(props) {
  const [activeIndex, setActiveIndex] = useState(0)

  const [orders, setOrders] = useState([
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
  const { colorPrimary, pointName, openStore } = useSelector((state) => state.sys)

  const handleTitleClick = (index) => {
    setActiveIndex(index)
    //todo  根据index发送请求
  }

  return (
    <>
      <View className='order-tabbar'>
        {tabbarState.map((item, index) => {
          return (
            <View
              key={index}
              className={classNames('order-item', { 'active': activeIndex === index })}
              onClick={() => handleTitleClick(index)}
            >
              {item.title}
            </View>
          )
        })}
      </View>
      <SpPage className='neigou-order' renderFooter={<CompTabbar />}>
        {orders?.map((item, index) => {
          return (
            <View key={item.id} className='good-item'>
              <View className='item-title'>{item.title}</View>
              <View className='item-content'>
                <View className='content-head'>
                  <View className='head-top'>
                    <View className='head-top-left'>
                      {item.isNeiGou && <Text className='neigou'>内购</Text>}
                      <Text className='order-num'>订单编号：&nbsp;{item.orderNum}</Text>
                    </View>
                    <View className='order-status'>{item.status}</View>
                  </View>
                  <View className='order-time'>下单时间：{item.orderTime}</View>
                </View>
                <View className='content-good'>
                  <View >
                    <Image className='good-img' src={item.goods?.url} />
                  </View>
                  <View className='good-content'>
                    <View className='good-content-top'>
                      <View>{item.goods?.name}</View>
                      <View className='good-price'>¥{item.goods?.price}</View>
                    </View>
                    <View className='good-content-bottom'>
                      <View>{item.goods?.intro}</View>
                      <View >x&nbsp;{item.goods?.count}</View>
                    </View>
                  </View>
                </View>
                <View className='content-pay'>
                  <Text className='all-count'>共{item.goods?.count}件</Text>
                  <Text className='actual-price'>实付金额</Text>
                  <Text className='price'>
                    ¥<Text className='price-account'>{item.goods?.price * item.goods?.count}</Text>.00
                  </Text>
                </View>
                <View className='item-option'>
                  <View className='option-order'>
                    {item.status === '待支付' ? '取消订单' : '查看物流'}
                  </View>
                  <View className='option-pay'>
                    {item.status === '待支付' ? '立即支付' : '确认收货'}
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
