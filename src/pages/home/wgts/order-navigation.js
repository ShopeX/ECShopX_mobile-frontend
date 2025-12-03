/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpLogin } from '@/components'
import { useImmer } from 'use-immer'
import { linkPage, classNames, isWeb } from '@/utils'
import { useLogin } from '@/hooks'
import api from '@/api'

import './order-navigation.scss'

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

const initialState = {
  waitPayNum: 0,
  waitSendNum: 0,
  waitRecevieNum: 0,
  waitEvaluateNum: 0,
  afterSalesNum: 0,
  orderList: []
}

function WgtOrderNavigation(props) {
  const { info } = props
  const [state, setState] = useImmer(initialState)
  const { isLogin } = useLogin()
  const { base, data, distributor_id } = info || {}

  const { windowWidth } = isWeb
    ? {
        windowWidth: window.innerWidth
      }
    : Taro.getSystemInfoSync()
  const itemWidth = Math.floor((windowWidth * 2 - (data.length + 1) * 16) / data.length)

  const handleClickLink = async (link) => {
    // await getUserInfoAuth()
    Taro.navigateTo({ url: link })
  }

  useEffect(() => {
    if (isLogin) {
      getMemberCenterData()
    }
  }, [isLogin])

  useEffect(() => {
    const orderList = initList.map((item, index) => {
      return {
        ...item,
        ...info.data[index],
        content: info.data[index]?.content || item.content
      }
    })
    console.log(orderList, 'orderList')
    setState((draft) => {
      draft.orderList = orderList
    })
  }, [info])

  const getMemberCenterData = async () => {
    const resTrade = await api.trade.getCount()
    const {
      aftersales, // 待处理售后
      normal_notpay_notdelivery, // 未付款未发货
      normal_payed_daifahuo, // 待发货
      normal_payed_daishouhuo, // 待收货
      normal_payed_daiziti, // 待自提订单
      normal_not_rate // 待评论
    } = resTrade

    setState((draft) => {
      draft.waitPayNum = normal_notpay_notdelivery
      draft.waitSendNum = normal_payed_daifahuo
      draft.waitRecevieNum = normal_payed_daishouhuo
      draft.afterSalesNum = aftersales
      draft.zitiNum = normal_payed_daiziti
      draft.waitEvaluateNum = normal_not_rate
    })
  }

  if (!info || itemWidth == 0) return null

  return (
    <View
      className={classNames('wgt wgt-order-navigation', {
        // wgt__padded: base.padded
      })}
      style={{ backgroundColor: base?.backgroundColor }}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd' style={{ color: base?.titleColor }}>
            <Text className='wgt-title'>{base.title}</Text>
            <View
              className='wgt-morelink'
              onClick={() => handleClickLink('/subpages/trade/list?status=0')}
            >
              <Text>全部订单</Text>
              <SpImage src='fv_chevron_right.png' width={40} className='icon-arrowRight-img' />
            </View>
          </View>
        </View>
      )}
      <View className='wgt-bd'>
        {state.orderList.map((item, idx) => (
          <SpLogin
            onChange={() => {
              handleClickLink(item.link)
            }}
            key={`wgt-order-item__${idx}`}
          >
            <View className='wgt-order-item'>
              <View className='wgt-order-wrapper'>
                <View className='wgt-order-bg' style={{ backgroundColor: base?.iconBgColor }}>
                  <SpImage
                    src={item.imgUrl || initList[idx].imgUrl}
                    className={item.imgUrl ? 'wgt-order-icon' : 'wgt-order-icon-mr'}
                  />
                </View>
                {state[item.key] > 0 && (
                  <View className='wgt-order-badge'>
                    <Text>{state[item.key] > 999 ? '999+' : state[item.key]}</Text>
                  </View>
                )}
              </View>
              <Text className='wgt-order-label'>{item.content}</Text>
            </View>
          </SpLogin>
        ))}
      </View>
    </View>
  )
}

WgtOrderNavigation.defaultProps = {
  info: null
}

WgtOrderNavigation.options = {
  addGlobalClass: true
}

export default WgtOrderNavigation
