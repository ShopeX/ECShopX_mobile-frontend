import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpTradeItem } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompTradeItem from './comps/comp-tradeitem'
import CompTrackDetail from './comps/comp-track-detail'
import CompTrackType from './comps/comp-trade-type'
import './list.scss'

const initialState = {
  tradeStatus: [
    { tag_name: '全部订单', value: '0' },
    { tag_name: '待支付', value: '5' },
    { tag_name: '待收货', value: '1' },
    { tag_name: '待评价', value: '7', is_rate: 0 }
  ],
  typeVal:'0',
  status: '0',
  tradeList: [],
  refresherTriggered: false,
  trackDetailList:[],
  openTrackDetail:false,
  info:null
}
function TradeList(props) {
  const [state, setState] = useImmer(initialState)
  const { tradeStatus, status, tradeType, typeVal, tradeList, refresherTriggered,trackDetailList,openTrackDetail,info } = state
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
  }, [status,typeVal])

  const fetch = async ({ pageIndex, pageSize }) => {
    const { is_rate } = tradeStatus.find((item) => item.value == status)
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status,
      is_rate
    }
    params.order_class = typeVal == '1' ? 'employee_purchase' : 'normal'

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
      draft.status = e
    })
  }

  const onChangeTradeType = (e) => {
    setState((draft) => {
      draft.typeVal = e
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
      <CompTrackType value={typeVal} onChange={onChangeTradeType} />
      <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} />
      <ScrollView
        className='list-scroll-container'
        scrollY
        refresherEnabled
        refresherBackground='#f5f5f7'
        refresherTriggered={refresherTriggered}
        onRefresherRefresh={onRefresherRefresh}
      >
        <SpScrollView
          className='trade-list-scroll'
          auto={false}
          ref={tradeRef}
          fetch={fetch}
          emptyMsg='没有查询到订单'
        >
          {tradeList.map((item, index) => (
            <View className='trade-item-wrap' key={index}>
              <CompTradeItem info={item} onClick={async(_info)=>{
                  const { orderId } = _info
                  const res = await api.trade.getTrackerpull({ order_id: orderId })
                  setState((v) => {
                    v.openTrackDetail = true
                    v.trackDetailList = res
                    v.info = _info
                })
              }}
              />
            </View>
          ))}
        </SpScrollView>
      </ScrollView>
      <CompTrackDetail
        selfDeliveryOperatorName={info?.selfDeliveryOperatorName}
        selfDeliveryOperatorMobile={info?.selfDeliveryOperatorMobile}
        trackDetailList={trackDetailList}
        isOpened={openTrackDetail}
        onClose={() => {
          setState((draft) => {
            draft.openTrackDetail = false
          })
        }}
      />
    </SpPage>
  )
}

TradeList.options = {
  addGlobalClass: true
}

export default TradeList
