/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { getDrawRecords } from '@/api/game'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import './records.scss'

const SpRecordLayout = () => {
  const [records, setRecords] = useState([])
  const $instance = Taro.getCurrentInstance()

  const { path, params } = $instance.router
  const id = params.id
  useEffect(() => {
    initData()
  }, [id])

  const initData = async () => {
    if (!id) {
      console.error('加载抽奖记录失败:', err)
      return
    }
    try {
      const response = await getDrawRecords(id)
      if (response?.length) {
        setRecords(response || [])
      }
    } catch (err) {
      console.error('加载抽奖记录失败:', err)
    }
  }

  return (
    <View className='sp-record-layout'>
      {records.length > 0 ? (
        <View className='sp-record-layout__list'>
          {records?.map((record, index) => (
            <View key={record.id || index} className='sp-record-layout__item'>
              <View className='sp-record-layout__info'>
                <Text className='sp-record-layout__name'>{record.prize_title}</Text>
                <Text className='sp-record-layout__time'>
                  {dayjs(record.created * 1000).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </View>
              {record.prize_type === 'points' && (
                <Text className='sp-record-layout__amount sp-record-layout__amount--points'>
                  +{record.prize_value}
                </Text>
              )}
              {/* {record.prize_type === 'coupon' && (
                <Text className='sp-record-layout__amount sp-record-layout__amount--coupon'>
                  ¥{record.prize_value}
                </Text>
              )} */}
            </View>
          ))}
        </View>
      ) : (
        <View className='sp-record-layout__empty'>
          <Text className='sp-record-layout__empty-text'>暂无抽奖记录</Text>
        </View>
      )}
    </View>
  )
}

export default SpRecordLayout
