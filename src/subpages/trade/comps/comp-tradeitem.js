/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import { VERSION_STANDARD } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import tradeHooks from '../hooks'
import './comp-tradeitem.scss'

function CompTradeItem(props) {
  useTranslation()
  const { info, onClick = () => {} } = props
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
    if (
      key == 'evaluate' ||
      key == 'logistics' ||
      key == 'changeOffline' ||
      key == 'invoice_apply' ||
      key == 'invoice_detail'
    ) {
      action(info)
    } else if (key == 'track') {
      onClick(info)
    } else {
      Taro.navigateTo({
        url: `/subpages/trade/detail?order_id=${orderId}`
      })
    }
  }

  const onViewTradeDetail = () => {
    Taro.navigateTo({
      url: `/subpages/trade/detail?order_id=${orderId}`
    })
  }

  const onViewStorePage = (e) => {
    if (!VERSION_STANDARD) {
      e.stopPropagation()
      if (distributorId == 0) {
        Taro.redirectTo({
          url: '/pages/index'
        })
      } else {
        Taro.navigateTo({
          url: `/subpages/store/index?id=${distributorId}`
        })
      }
    }
  }

  const totalNum = items.reduce((preVal, item) => Number(preVal) + Number(item.num), 0)

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
          <View className='trade-no'>{ti('351d8689.78f59a', [orderId])}</View>
          <View className='trade-time'>{ti('351d8689.8bf28c', [createDate])}</View>
        </View>
        <View className='trade-state'>{orderStatusMsg}</View>
      </View>
      <View className='trade-item-bd' onClick={onViewTradeDetail}>
        {items.map((good, goodlIns) => (
          <SpTradeItem
            key={goodlIns}
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
              <Text className='num'>{ti('351d8689.17d01f', [totalNum])}</Text>
              <Text>
                <Text className='label'>{pointName}</Text>
                <Text className='point-value' style='font-size: 20px;'>
                  {point}
                </Text>{' '}
                {totalFee > 0 && (
                  <Text>
                    +<SpPrice value={totalFee} size={38} />
                  </Text>
                )}
              </Text>
            </View>
          )}
          {orderClass != 'pointsmall' && (
            <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text className='num'>{ti('351d8689.17d01f', [totalNum])}</Text>
              <Text className='label'>{$t('351d8689.94a7de')}</Text>
              <SpPrice value={totalFee} size={38} />
            </View>
          )}
        </View>
      </View>

      <View className='trade-item-ft'>
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
