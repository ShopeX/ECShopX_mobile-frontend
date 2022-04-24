import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { classNames } from '@/utils'

import './index.scss'

const CompGroupLogListItem = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [isOpen, setIsOpen] = useState(false)
  const [showNum, setShowNum] = useState(5)

  // 查看更多
  const handleClickMore = () => {
    setIsOpen(!isOpen)
  }
  return (
    <View className='comp-grouploglist'>
      {
        arr.map((item, index) => {
          if (isOpen ? true : index < showNum) {
            return (
              <View className='comp-grouploglist-item' key={index}>
                <View className='comp-grouploglist-item__num'>{index + 1}</View>
                <View className='comp-grouploglist-item__img'>
                  <SpImage className='user-head' />
                </View>
                <View className='comp-grouploglist-item__info'>
                  <View className='user'>
                    <Text className='user__name'>
                      测试买家
                    </Text>
                    <Text className='user__tag'>
                      回头客
                    </Text>
                    <Text className='user__time'>
                      17小时前
                    </Text>
                  </View>

                  <View className='goods'>
                    测试商品
                    <Text className='goods__num'>
                      +2
                    </Text>
                    <Text className='goods__status'>
                      已取消
                    </Text>
                  </View>

                  <View className='order'>
                    <Text className='order__time'>
                      2022-04-01 22:10:10
                    </Text>
                    <Text className='order__status'>
                      核销成功
                    </Text>
                  </View>
                </View>
              </View>
            )
          }
        })
      }
      <View className='more' onClick={handleClickMore.bind(this)}>
        查看更多<Text className={classNames('icon-arrowDown iconfont icon', isOpen ? 'open' : '')}></Text>
      </View>
    </View>
  )
}

export default CompGroupLogListItem
