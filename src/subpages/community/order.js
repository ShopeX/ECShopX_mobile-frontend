import React, { useEffect, useCallback, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import {
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalContent,
  AtModalAction,
  AtModalHeader,
  AtInput,
  AtTag
} from 'taro-ui'
import { SpPage, SpScrollView, SpSearchBar } from '@/components'
import { pickBy, isWeb, isAPP, payPlatform, log, getCurrentRoute } from '@/utils'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import api from '@/api'
import CompOrderItem from './comps/comp-orderitem'
import CompTabbar from './comps/comp-tabbar'
import CompTradeItem from './comps/comp-tradeitem'

import './order.scss'

const initialState = {
  keywords: undefined,
  orderList: [],
  curTabIdx: 0,
  // curDeliverTagIdx: 0,
  // curAfterTagIdx: 0,
  isOpened: false,
  remark: '',
  payLoading: false
}
const tabList = [
  { title: '全部', type: 0 },
  { title: '待支付', type: 5 },
  { title: '待收货', type: 4 },
  { title: '售后', type: 10 }
]

// const deliverTagList = [
//   { title: '待收货', type: '0' },
//   { title: '部分发货', type: '1' },
//   { title: '已发货', type: '2' },
//   { title: '已收货', type: '3' }
// ]

// const afterTagList = [
//   { title: '待处理', status: '0' },
//   { title: '处理中', status: '1' },
//   { title: '已处理', status: '2' },
//   { title: '已驳回', status: '3' },
//   { title: '已关闭', status: '4' }
// ]

function CommunityOrder(props) {
  const [state, setState] = useImmer(initialState)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const { colorPrimary } = useSelector((state) => state.sys)
  const orderRef = useRef()
  const $instance = getCurrentInstance()
  const { activity_id } = $instance.router?.params

  const { keywords, orderList, curTabIdx, isOpened, remark, payLoading } = state
  const fetch = async ({ pageIndex, pageSize }) => {
    let total_count = 0
    if (curTabIdx == 3) {
      let params = {
        page: pageIndex,
        pageSize
      }
      const { list, total_count: total } = await api.aftersales.list(params)
      const n_list = pickBy(list, doc.community.COMMUNITY_AFTER_SALE_ITEM)
      setState((draft) => {
        draft.orderList = [...orderList, ...n_list]
      })
      total_count = total
    } else {
      let params = {
        page: pageIndex,
        pageSize,
        mobile: keywords,
        status: (curTabIdx == 1 && 5) || (curTabIdx == 2 && 4) || '',
        activity_id
      }
      const { list, total_count: total } = await api.community.getCommunityList(params)
      const n_list = pickBy(list, doc.community.COMMUNITY_ORDER_LIST)
      setState((draft) => {
        draft.orderList = [...orderList, ...n_list]
      })
      total_count = total
    }

    return { total: total_count }
  }

  const handleOnFocus = () => {
    setIsShowSearch(true)
  }

  const handleOnChange = (val) => {
    setState((draft) => {
      draft.keywords = val
    })
  }

  const handleOnClear = async () => {
    await setState((draft) => {
      draft.keywords = ''
      draft.orderList = []
    })
    setIsShowSearch(false)
    orderRef.current.reset()
  }

  const handleSearchCancel = () => {
    setState((draft) => {
      draft.keywords = ''
    })
    setIsShowSearch(false)
  }

  const handleConfirm = async (val) => {
    await setState((draft) => {
      draft.orderList = []
      draft.keywords = val
    })
    setIsShowSearch(false)
    orderRef.current.reset()
  }

  const handleClickTab = async (curTabIdx) => {
    await setState((draft) => {
      draft.curTabIdx = curTabIdx
      // draft.curAfterTagIdx = '0'
      // draft.curDeliverTagIdx = 0
      draft.orderList = []
    })
    orderRef.current.reset()
  }

  const renderFooter = (info) => {
    const {
      orderStatusDes,
      canApplyCancel,
      receiver_type,
      status,
      communityInfo,
      canApplyAftersales
    } = info || {}
    let isShowCacel =
      (orderStatusDes == 'PAYED' || orderStatusDes == 'NOTPAY') &&
      canApplyCancel != 0 &&
      communityInfo.activity_status != 'success'
    return (
      <>
        {isShowCacel && (
          <View
            onClick={() => handleClickBtn(info, 'cancel')}
            className='page-order-manage-btn'
            style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
          >
            取消订单
          </View>
        )}
        {status === 'WAIT_BUYER_PAY' && (
          <View
            onClick={() => handleClickBtn(info, 'pay')}
            className='page-order-manage-btn'
            style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
          >
            立即支付
          </View>
        )}
        {canApplyAftersales && (
          <View
            onClick={() => handleClickBtn(info, 'detail')}
            className='page-community-order-btn'
            style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
          >
            申请售后
          </View>
        )}
      </>
    )
  }

  const handleClickBtn = (info, type) => {
    if (type == 'cancel') {
      Taro.navigateTo({
        url: `/subpages/community/trade/cancel?order_id=${info.orderId}` // 待支付
      })
      return
    }
    if (type == 'detail') {
      Taro.navigateTo({
        url: `/subpages/community/trade/after-sale-detail?id=${info.orderId}`
      })
      return
    }
    if (type == 'pay') {
      handlePay(info)
    }
  }

  const handlePay = async (info) => {
    const { orderId, orderType, payType } = info
    const paymentParams = {
      payType,
      orderId,
      orderType
    }
    setState((draft) => {
      draft.payLoading = true
    })
    if (isWeb && !isAPP()) {
      redirectUrl(api, `/subpage/pages/cashier/index?order_id=${orderId}&pay_type=${payType}`)
      return
    }

    const config = await api.cashier.getPayment(paymentParams)
    setState((draft) => {
      draft.payLoading = false
    })
    let payErr
    try {
      if (isAPP()) {
        const AppPayType = {
          alipayapp: 'alipay',
          wxpayapp: 'wxpay'
        }
        try {
          await Taro.SAPPPay.payment({
            id: AppPayType[payType],
            order_params: config.config
          })
        } catch (e) {
          console.error(e)
          payErr = e
        }
      } else {
        const resObj = await payPlatform(config)
        payErr = resObj.payErr
        // 支付上报
        log.debug(`[order pay]: `, resObj.payRes)
      }
    } catch (e) {
      payErr = e
      Taro.showToast({
        title: e.err_desc || e.errMsg || '支付失败',
        icon: 'none'
      })
    }
    if (!payErr) {
      await Taro.showToast({
        title: '支付成功',
        icon: 'success'
      })
      const { fullPath } = getCurrentRoute($instance.router?.params || {})
      Taro.redirectTo({
        url: fullPath
      })
    }
  }

  const onEditClick = (isOpened) => {
    setState((draft) => {
      draft.isOpened = isOpened
    })
  }

  const onCountDownEnd = async () => {
    await setState((draft) => {
      draft.remark = ''
      draft.orderList = []
      draft.curTabIdx = 0
      draft.curAfterTagIdx = 0
      // draft.curDeliverTagIdx = 0
    })
    orderRef.current.reset()
  }

  const actionChange = async (isOpened, type) => {
    console.log(type)
    if (type == 'confirm') {
      console.log(remark, '---')
      await setState((draft) => {
        draft.remark = ''
        draft.orderList = []
        draft.curTabIdx = 0
        draft.curAfterTagIdx = 0
        // draft.curDeliverTagIdx = 0
      })
      orderRef.current.reset()
    } else {
      setState((draft) => {
        draft.remark = ''
      })
    }
    setState((draft) => {
      draft.isOpened = isOpened
    })
  }

  const handleChange = (value) => {
    setState((draft) => {
      draft.remark = value
    })
  }

  // const deliverTagClick = async ({ name }) => {
  //   const idx = deliverTagList.findIndex((el) => el.type == name.type)
  //   console.log(idx)
  //   await setState((draft) => {
  //     draft.curDeliverTagIdx = idx
  //     draft.curAfterTagIdx = 0
  //     draft.orderList = []
  //   })
  //   orderRef.current.reset()
  // }

  // const afterTagClick = async ({ name }) => {
  //   const idx = afterTagList.findIndex((el) => el.type == name.type)
  //   console.log(idx)
  //   await setState((draft) => {
  //     draft.curAfterTagIdx = idx
  //     // draft.curDeliverTagIdx = 0
  //     draft.orderList = []
  //   })
  //   orderRef.current.reset()
  // }

  const handleClickItem = (trade) => {
    const { id } = trade

    Taro.navigateTo({
      url: `/subpages/community/trade/refund-detail?aftersales_bn=${id}`
    })
  }

  return (
    <SpPage className='page-community-order'>
      <SpScrollView className='page-community-order-scroll' ref={orderRef} fetch={fetch}>
        <View className='page-community-order-search'>
          <SpSearchBar
            showDailog={false}
            keyword={keywords}
            placeholder='搜索商品名'
            onFocus={handleOnFocus}
            onChange={handleOnChange}
            onClear={handleOnClear}
            onCancel={handleSearchCancel}
            onConfirm={handleConfirm}
          />
        </View>
        <View className='page-community-order-tabs'>
          <AtTabs
            current={curTabIdx}
            tabList={tabList}
            onClick={handleClickTab}
            customStyle={{ color: colorPrimary }}
          >
            {tabList.map((panes, pIdx) => (
              <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
            ))}
          </AtTabs>
        </View>
        {curTabIdx == 3 &&
          orderList.map((item, idx) => (
            <CompTradeItem
              key={`${idx}1`}
              payType={item.pay_type}
              customHeader
              renderHeader={
                <View className='trade-item__hd-cont trade-cont'>
                  <Text className='trade-item__shop'>退款单号：{item.id}&#12288;</Text>
                  <Text className='more'>{item.status_desc}</Text>
                </View>
              }
              customFooter
              renderFooter={<View></View>}
              info={item}
              onClick={() => handleClickItem(item)}
            />
          ))}
        {curTabIdx !== 3 &&
          orderList.map((item) => (
            <CompOrderItem
              key={item.tid}
              info={item}
              checkIsChief={false}
              renderFooter={renderFooter(item)}
              onEditClick={onEditClick}
              onCountDownEnd={onCountDownEnd}
            />
          ))}
      </SpScrollView>
      <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
        <AtModalHeader>添加备注</AtModalHeader>
        <AtModalContent>
          <AtInput
            name='remark'
            title='备注'
            type='text'
            placeholder='最多100个字哦'
            value={remark}
            onChange={handleChange}
          />
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => actionChange(false, 'cancel')}>取消</Button>
          <Button onClick={() => actionChange(false, 'confirm')}>确定</Button>
        </AtModalAction>
      </AtModal>
    </SpPage>
  )
}

export default CommunityOrder
