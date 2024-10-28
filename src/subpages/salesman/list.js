import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter} from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpTradeItem } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompTradeItem from './comps/comp-tradeitem'
import './list.scss'

const initialState = {
  tradeStatus: [
    { tag_name: '全部订单', value: '0' },
    { tag_name: '待支付', value: '5' },
    { tag_name: '待收货', value: '1' },
    { tag_name: '已完成', value: '7', is_rate: 0 }
  ],
  status: '0',
  tradeList: [],
  refresherTriggered: false,
}
function TradeList(props) {
  const [state, setState] = useImmer(initialState)
  const { tradeStatus, status, tradeList, refresherTriggered } = state
  const tradeRef = useRef()
  const router = useRouter()

  useEffect(() => {
    const { status = 0 } = router.params
    setState((draft) => {
      draft.status = status
    })

    Taro.eventCenter.on('onEventOrderStatusChange', () => {
      setState((draft) => {
        draft.tradeList = []
      })
      tradeRef.current.reset()
    })

    return () => {
      Taro.eventCenter.off('onEventOrderStatusChange')
    }
  }, [])

  useEffect(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  }, [status])

  const fetch = async ({ pageIndex, pageSize }) => {
    const { is_rate } = tradeStatus.find(item => item.value == status)
    const { userId } = Taro.getStorageSync('userinfo')
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status,
      is_rate,
      isSalesmanPage:1,
      promoter_user_id:userId
    }
    const {
      list,
      pager: { count: total },
      rate_status
    } = await api.trade.list(params)
    const tempList = pickBy(list, doc.trade.TRADE_ITEM)
    // console.log('tempList:', tempList)
    setState((draft) => {
      draft.tradeList = [...tradeList, ...tempList]
      draft.refresherTriggered = false
    })
    return { total }
  }

  const onChangeTradeState = (e) => {
    setState((draft) => {
      draft.status = tradeStatus[e].value
    })
  }

  const onRefresherRefresh = () => {
    setState((draft) => {
      draft.refresherTriggered = true
      draft.tradeList = []
    })

    tradeRef.current.reset()
  }


  return (
    <SpPage scrollToTopBtn className='page-trade-list'>
      <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} />
      <ScrollView className='list-scroll-container' scrollY refresherEnabled
        refresherBackground='#f5f5f7'
        refresherTriggered={refresherTriggered}
        onRefresherRefresh={onRefresherRefresh}
      >
        <SpScrollView className='trade-list-scroll' auto={false} ref={tradeRef} fetch={fetch} emptyMsg='没有查询到订单'>
          {tradeList.map((item,index) => (
            <View className='trade-item-wrap' key={index}>
              <CompTradeItem info={item} />
            </View>
          ))}
        </SpScrollView>
      </ScrollView>
    </SpPage>
  )
}

TradeList.options = {
  addGlobalClass: true
}

export default TradeList
