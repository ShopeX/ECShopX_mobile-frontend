/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import { VERSION_STANDARD } from '@/utils'
import { useTranslation } from 'react-i18next'
import { $t, ti } from '@/i18n'
import tradeHooks from '../hooks'
import './comp-tradeitem.scss'

function CompTradeItem(props) {
  useTranslation()
  const { info } = props
  if (!info) {
    return null
  }
  const { tradeActionBtns, getTradeAction } = tradeHooks()
  const {
    distributorInfo,
    orderId,
    createDate,
    orderStatusMsg,
    items,
    orderStatus,
    totalFee,
    orderClass,
    point,
    distributorId
  } = info
  const { pointName } = useSelector((state) => state.sys)

  const btns = getTradeAction(info)

  const handleClickItem = ({ key, action }) => {
    if (key == 'evaluate' || key == 'logistics' || key == 'changeOffline') {
      action(info)
    } else {
      Taro.navigateTo({
        url: `/subpages/salesman/detail?order_id=${orderId}`
      })
    }
  }

  const onViewTradeDetail = () => {
    Taro.navigateTo({
      url: `/subpages/salesman/detail?order_id=${orderId}`
    })
  }

  const onViewStorePage = (e) => {
    if (!VERSION_STANDARD) {
      e.stopPropagation()
      Taro.navigateTo({
        url: `/subpages/store/index?id=${distributorId}`
      })
    }
  }

  const totalNum = items.reduce((preVal, item) => preVal + item.num, 0)

  return (
    <View className='comp-tradeitem'>
      <View className='trade-item-hd' onClick={onViewTradeDetail}>
        <View>
          <View className='shop-info' onClick={onViewStorePage}>
            <SpImage src={distributorInfo?.logo} width={100} height={100} />
            <View className='shop-name'>
              {distributorInfo?.name}
              {!VERSION_STANDARD && <Text className='iconfont icon-qianwang-01'></Text>}
            </View>
          </View>
          <View className='trade-no'>{ti('12f07f54.78f59a', [orderId])}</View>
          <View className='trade-time'>{ti('12f07f54.8bf28c', [createDate])}</View>
        </View>
        <View className='trade-state'>{orderStatusMsg}</View>
      </View>
      <View className='trade-item-bd' onClick={onViewTradeDetail}>
        {items.map((good, ids) => (
          <SpTradeItem
            key={ids}
            info={{
              ...good,
              orderClass
            }}
          />
        ))}

        <View className='trade-total'>
          <View className='delivery'></View>
          {orderClass == 'pointsmall' && (
            <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text className='num'>{ti('12f07f54.17d01f', [totalNum])}</Text>
              <Text className='label'>{pointName}</Text>
              <Text className='point-value' style='font-size: 20px;'>
                {point}
              </Text>
            </View>
          )}
          {orderClass == 'normal' && (
            <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text className='num'>{ti('12f07f54.17d01f', [totalNum])}</Text>
              <Text className='label'>{$t('12f07f54.94a7de')}</Text>
              <SpPrice value={totalFee} size={38} />
            </View>
          )}
        </View>
      </View>

      <View className='trade-item-ft'>
        {console.log('CompTradeItems', btns)}
        {btns.map((item, index) => (
          <AtButton
            key={index}
            circle
            className={`btn-${item.btnStatus}`}
            onClick={handleClickItem.bind(this, item)}
          >
            {item.title}
          </AtButton>
        ))}
      </View>
    </View>
  )
}

CompTradeItem.options = {
  addGlobalClass: true
}

export default CompTradeItem
