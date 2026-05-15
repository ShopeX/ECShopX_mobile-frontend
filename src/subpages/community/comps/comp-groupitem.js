/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { ScrollView, View, Text, Button } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { classNames } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-groupitem.scss'

function CompGroupItem(props) {
  useTranslation()
  const { info = {}, onClick = () => {} } = props

  return (
    <View className='comp-group-item'>
      <View className='group-item-hd' onClick={() => onClick(info)}>
        <View className='item-info'>
          <View className='info-hd'>
            <View className='name'>{info.activityName}</View>
            <View className='days'>{info.saveTime}</View>
          </View>
          <View className='goods-price'>{info.priceRange}</View>
          {/* <SpPrice size={36} value={100} /> */}
        </View>
        <View></View>
      </View>
      <View className='group-item-bd'>
        <ScrollView scrollX className='img_list' onClick={() => onClick(info)}>
          {info?.items.map((item, idx) => (
            <View className='goods-item' key={`goods-item__${idx}`}>
              <SpImage src={item.pics} width={200} height={200} />
            </View>
          ))}
        </ScrollView>
        <View className='item-status'>
          <Text className={classNames('status', info.activityStatus)}>
            {info.activityStatusMsg}
          </Text>
          <Button className='right-item' openType='share'>
            <Text className='iconfont icon-fenxiang-01' />
            <Text className='right-item-txt'>{$t('934ffec2.c31f48')}</Text>
          </Button>
        </View>
      </View>
      <View className='group-item-ft'>
        <View style={{ marginBottom: 5 }} className='cus-font'>
          <Text style={{ marginRight: 10 }}>{$t('2a15be9d.5b39df')}</Text>
          <SpPrice value={info.totalFee} size={26} unit='cent' primary />
        </View>
        <View className='cus-font'>
          <Text style={{ marginRight: 15 }}>{ti('2a15be9d.dd7354', [info.userNum || 0])}</Text>
          <Text>{ti('2a15be9d.ccff04', [info.orderNum || 0])}</Text>
          {/* <Text>查看 5人</Text> */}
        </View>
      </View>
    </View>
  )
}

CompGroupItem.options = {
  addGlobalClass: true
}

export default CompGroupItem
