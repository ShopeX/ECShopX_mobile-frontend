/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpLogin } from '@/components'
import { classNames, isWeb } from '@/utils'
import { useLogin } from '@/hooks'
import api from '@/api'
import { AtIcon } from 'taro-ui'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

const initList = [
  {
    content: '待付款',
    imgUrl: 'fv_order_daifukuan.png',
    link: '/subpages/trade/list?status=5',
    key: 'waitPayNum'
  },
  {
    content: '待收货',
    imgUrl: 'fv_order_daifahuo.png',
    link: '/subpages/trade/list?status=1',
    key: 'waitSendNum'
  },
  {
    content: '待评价',
    imgUrl: 'fv_order_daishouhuo.png',
    link: '/subpages/trade/list?status=7',
    key: 'waitRecevieNum'
  },
  {
    content: '售后',
    imgUrl: 'fv_order_shouhou.png',
    link: '/subpages/trade/after-sale-list',
    key: 'afterSalesNum'
  }
]

export default function WgtOrderNavigation(props) {
  const { info, id } = props
  const { isLogin } = useLogin()
  const [orderList, setOrderList] = React.useState([])
  const [counts, setCounts] = React.useState({
    waitPayNum: 0,
    waitSendNum: 0,
    waitRecevieNum: 0,
    afterSalesNum: 0,
    waitEvaluateNum: 0,
    zitiNum: 0
  })

  // 从 params 中获取配置和数据，兼容两种数据结构
  const params = info?.params || info || {}
  const base = params.base || {}
  const data = params.data || []
  const dataLen = (Array.isArray(data) ? data.length : 0) || initList.length

  const outerStyle = useMemo(() => getGlobalBaseStyle(base.outerMargin || {}), [base.outerMargin])

  const handleClickLink = (link) => {
    Taro.navigateTo({ url: link })
  }

  useEffect(() => {
    if (isLogin) {
      getMemberCenterData()
    }
  }, [isLogin])

  const getMemberCenterData = async () => {
    try {
      const res = await api.trade.getCount()
      const {
        aftersales,
        normal_notpay_notdelivery,
        normal_payed_daifahuo,
        normal_payed_daishouhuo,
        normal_payed_daiziti,
        normal_not_rate
      } = res || {}
      setCounts({
        waitPayNum: normal_notpay_notdelivery ?? 0,
        waitSendNum: normal_payed_daifahuo ?? 0,
        waitRecevieNum: normal_payed_daishouhuo ?? 0,
        afterSalesNum: aftersales ?? 0,
        zitiNum: normal_payed_daiziti ?? 0,
        waitEvaluateNum: normal_not_rate ?? 0
      })
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    const rawData = Array.isArray(data) ? data : []
    const list = initList.map((item, index) => {
      const apiItem = rawData[index]
      return {
        ...item,
        ...apiItem,
        content: apiItem?.content ?? item.content,
        imgUrl: apiItem?.imgUrl || item.imgUrl
      }
    })
    setOrderList(list)
  }, [info, data])

  if (!info || dataLen === 0) return null

  return (
    <View
      className={classNames('wgt wgt-order-navigation')}
      style={{ ...outerStyle }}
      id={`wgt-order-navigation-${id || ''}`}
    >
      {base.title && (
        <View className='wgt-order-navigation-head' style={{ color: base.titleColor }}>
          <Text className='wgt-order-navigation-title'>{base.title}</Text>
          <View
            className='wgt-order-navigation-morelink'
            onClick={() => handleClickLink('/subpages/trade/list?status=0')}
          >
            <Text>全部订单</Text>
            <AtIcon value='chevron-right' size={14} color={base.moreBtn?.color} />
          </View>
        </View>
      )}
      <View className='wgt-order-navigation-bd'>
        {orderList.map((item, idx) => (
          <SpLogin onChange={() => handleClickLink(item.link)} key={`wgt-order-item__${idx}`}>
            <View className='wgt-order-navigation-item'>
              <View className='wgt-order-navigation-wrapper'>
                <View className='wgt-order-navigation-bg'>
                  <SpImage
                    src={item.imgUrl || initList[idx]?.imgUrl}
                    className={
                      item.imgUrl ? 'wgt-order-navigation-icon' : 'wgt-order-navigation-icon-mr'
                    }
                  />
                </View>
                {counts[item.key] > 0 && (
                  <View className='wgt-order-navigation-badge'>
                    <Text>{counts[item.key] > 999 ? '999+' : counts[item.key]}</Text>
                  </View>
                )}
              </View>
              <Text className='wgt-order-navigation-label'>{item.content}</Text>
            </View>
          </SpLogin>
        ))}
      </View>
    </View>
  )
}
