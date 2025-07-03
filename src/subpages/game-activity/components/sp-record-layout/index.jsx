import React from 'react'
import { View, Text, CoverView } from '@tarojs/components'
import { SpFloatLayout } from '@/components'
import './index.scss'

const SpRecordLayout = ({ isOpened, onClose, records = [] }) => {
  // 格式化日期时间
  const formatDateTime = (dateStr) => {
    if (!dateStr) return ''

    try {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}`
    } catch (e) {
      return dateStr
    }
  }

  return (
    <CoverView>
      <SpFloatLayout title='抽奖记录' open={isOpened} onClose={onClose}>
        <View className='sp-record-layout'>
          {records.length > 0 ? (
            <View className='sp-record-layout__list'>
              {records?.map((record, index) => (
                <View key={record.id || index} className='sp-record-layout__item'>
                  <View className='sp-record-layout__info'>
                    <Text className='sp-record-layout__name'>{record.prizeName}</Text>
                    <Text className='sp-record-layout__time'>
                      {formatDateTime(record.createTime)}
                    </Text>
                  </View>
                  {record.prizeType === 'points' && (
                    <Text className='sp-record-layout__amount sp-record-layout__amount--points'>
                      +{record.prizeAmount}
                    </Text>
                  )}
                  {record.prizeType === 'coupon' && (
                    <Text className='sp-record-layout__amount sp-record-layout__amount--coupon'>
                      ¥{record.prizeAmount}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className='sp-record-layout__empty'>
              <Text className='sp-record-layout__empty-text'>暂无抽奖记录</Text>
            </View>
          )}
        </View>
      </SpFloatLayout>
    </CoverView>
  )
}

export default SpRecordLayout
