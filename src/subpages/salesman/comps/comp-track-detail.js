import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpFloatLayout, SpTimeLineItem } from '@/components'
import { formatDateTime } from '@/utils'

import './comp-track-detail.scss'

function CompTrackDetail(props) {
  const {
    isOpened = false,
    selfDeliveryOperatorName,
    trackDetailList = [],
    selfDeliveryOperatorMobile,
    onClose = () => {}
  } = props

  const formatLogs = (logs) => {
    let arr = []
    logs.map((item) => {
      return arr.push({
        title: formatDateTime(item.time) + ' ' + item.msg,
        delivery_remark: item.delivery_remark,
        pics: item.pics
      })
    })
    return arr.reverse()
  }

  const handleCallOpreator = () => {
    if (!selfDeliveryOperatorMobile) return
    Taro.makePhoneCall({
      phoneNumber: selfDeliveryOperatorMobile
    })
  }

  return (
    <View className='comp-tradedetail'>
      <SpFloatLayout
        className='tradedetail-floatlayout'
        title='订单跟踪'
        open={isOpened}
        onClose={onClose}
      >
        <View className='opreator'>
          <View className='opreator-name'>配送员：{selfDeliveryOperatorName || '-'}</View>
          <View className='opreator-mobile' onClick={handleCallOpreator}>
            拨打电话
          </View>
        </View>
        <ScrollView scrollY>
          <View className='tradedetail-container'>
            {trackDetailList.length > 0 &&
              formatLogs(trackDetailList).map((item, idx) => (
                <SpTimeLineItem key={idx} item={item} />
              ))}
          </View>
        </ScrollView>
      </SpFloatLayout>
    </View>
  )
}

CompTrackDetail.options = {
  addGlobalClass: true
}

export default CompTrackDetail
