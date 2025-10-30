// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
