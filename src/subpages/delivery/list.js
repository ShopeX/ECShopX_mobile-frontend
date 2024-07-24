import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpTradeItem, SpFloatLayout } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { pickBy } from '@/utils'
import CompTradeItem from './comps/comp-tradeitem'
import CompShippingInformation from './comps/comp-shipping-information'
import './list.scss'

const initialState = {
  tradeStatus: [
    { tag_name: '全部订单', value: '0' },
    { tag_name: '待支付', value: '5' },
    { tag_name: '待收货', value: '1' },
    { tag_name: '待评价', value: '7', is_rate: 0 }
  ],
  status: '0',
  tradeList: [],
  refresherTriggered: false,
  statusDelivery: false,
  list: [
    {
      title: '快递公司',
      selector: [{ label: '商家自配送', value: 'all', status: true }],
      extraText: '商家自配送',
      status: 'select'
    },
    {
      title: '配送员',
      selector: [{ label: '张三', value: 'all', status: true }],
      extraText: '张三',
      status: 'select'
    },
    {
      title: '配送员编号',
      selector: [{ label: 'erdh123', value: 'all', status: true }],
      extraText: 'erdh123',
      status: 'select'
    },
    {
      title: '配送员手机号',
      selector: [{ label: '13456789009', value: 'all', status: true }],
      extraText: '13456789009',
      status: 'select'
    },
    {
      title: '配送状态',
      selector: [
        { label: '全部业绩排行1', value: 'all', status: true },
        { label: '直推业绩排行2', value: 'lv1', status: false },
        { label: '间推业绩排行3', value: 'lv2', status: false }
      ],
      extraText: '全部业绩排行1',
      status: 'select'
    },
    {
      title: '配送备注',
      selector: '',
      extraText: '全部业绩排行1',
      status: 'textarea'
    },
    {
      title: '照片上传',
      selector: [],
      extraText: '全部业绩排行1',
      status: 'image'
    }
  ]
}
function TradeList(props) {
  const [state, setState] = useImmer(initialState)
  const { tradeStatus, status, tradeList, refresherTriggered, statusDelivery, list } = state
  const { deliveryPersonnel } = useSelector((state) => state.cart)
  const tradeRef = useRef()
  const router = useRouter()
  const pageRef = useRef()

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
    if (statusDelivery) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [statusDelivery])

  useEffect(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  }, [status])

  const fetch = async ({ pageIndex, pageSize }) => {
    const { is_rate } = tradeStatus.find((item) => item.value == status)
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status,
      is_rate,
      ...deliveryPersonnel
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

  const updateDelivery = (item) => {
    console.log(item, 'lllupdateDelivery')
    setState((draft) => {
      draft.statusDelivery = true
    })
  }

  const deliveryItem = (item) => {
    console.log(item, 'hhhhhhhh')
  }

  return (
    <SpPage scrollToTopBtn className='page-delivery-list' ref={pageRef}>
      <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} /> {statusDelivery}
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
              <CompTradeItem info={item} updateDelivery={updateDelivery} />
            </View>
          ))}
        </SpScrollView>
      </ScrollView>
      <SpFloatLayout
        title='选择地址'
        open={statusDelivery}
        onClose={() => {
          setState((draft) => {
            draft.statusDelivery = false
          })
        }}
        renderFooter={
          <AtButton circle type='primary'>
            确定
          </AtButton>
        }
      >
        <CompShippingInformation selector={list} deliveryItem={deliveryItem} />
      </SpFloatLayout>
    </SpPage>
  )
}

TradeList.options = {
  addGlobalClass: true
}

export default TradeList
