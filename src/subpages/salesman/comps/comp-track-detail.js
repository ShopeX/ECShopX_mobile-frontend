/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpFloatLayout } from '@/components'
import { SpTimeLineItem } from '@/subpages/components'
import { formatDateTime } from '@/utils'
import { $t, ti, useTranslation } from '@/i18n'
import './comp-track-detail.scss'

function CompTrackDetail(props) {
  useTranslation()
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
        title={$t('250b375e.01fe4f')}
        open={isOpened}
        onClose={onClose}
      >
        <View className='opreator'>
          <View className='opreator-name'>
            {ti('250b375e.da3446', [selfDeliveryOperatorName || '-'])}
          </View>
          <View className='opreator-mobile' onClick={handleCallOpreator}>
            {$t('250b375e.b0ccf0')}
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
