import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton, AtCountdown } from 'taro-ui'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpPage, SpCell, SpPrice, SpTradeItem, SpImage } from '@/components'
import { ORDER_STATUS_ICON } from '@/consts'
import { pickBy, copyText, showToast, classNames } from '@/utils'
import tradeHooks from './hooks'
import './detail.scss'

const initialState = {
  info: null,
  tradeInfo: null,
  loading: true
}
function TradeDetail(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { info, tradeInfo, loading } = state
  const { tradeActionBtns, getTradeAction } = tradeHooks()

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { order_id } = $instance.router.params
    const { orderInfo, tradeInfo } = await api.trade.detail(order_id)
    setState((draft) => {
      draft.info = pickBy(orderInfo, doc.trade.TRADE_ITEM)
      draft.tradeInfo = tradeInfo
      draft.loading = false
    })
  }

  const hanldeCopy = async (val) => {
    await copyText(val)
    showToast('复制成功')
  }

  const handleClickItem = () => {
    debugger
  }

  const renderActionButton = () => {
    if (info) {
      const btns = getTradeAction(info)
      return <View className='action-button-wrap'>
        {
          btns.map(btn => <AtButton circle className={`btn-${btn.btnStatus}`} onClick={handleClickItem.bind(this, btn)}>{btn.title}</AtButton>)
        }
      </View>
    } else {
      return null
    }
  }

  return (
    <SpPage className='page-trade-detail' loading={loading} scrollToTopBtn
      renderFooter={renderActionButton()}
    >
      <ScrollView className='trade-detail-scroll' scrollY>
        <View className='block-container trade-status'>
          {
            info && <View className='trade-status-desc'>
              <Text className={classNames("iconfont", ORDER_STATUS_ICON[info.orderStatus])} />
              <Text className="status-desc">{info.orderStatusMsg}</Text>
            </View>
          }
          {
            info?.orderStatus == 'NOTPAY' && <View className='order-cancel-time'>
              该订单将为您保留
              <AtCountdown
                format={{ day: '天', hours: '时', minutes: '分', seconds: '秒' }}
                isShowDay={info.autoCancelSeconds > 86400}
                seconds={info.autoCancelSeconds}
              // onTimeUp={onTimeUp}
              />
            </View>
          }
        </View>
        <View className='block-container address-info'>
          <SpImage src="shouhuodizhi.png" width={60} height={60} />
          <View className='receiver-address'>
            <View className='name-mobile'>
              <Text className='name'>{info?.receiverName}</Text>
              <Text className='mobile'>{info?.receiverMobile}</Text>
            </View>
            <View className='detail-address'>
              {`${info?.receiverState}${info?.receiverCity}${info?.receiverDistrict}${info?.receiverAddress}`}
            </View>
          </View>
        </View>
        <View className='block-container'>
          <View className='trade-shop'>
            {info?.distributorName}
            <Text className='iconfont icon-qianwang-01'></Text>
          </View>
          <View className='trade-no'>
            <Text className='no'>{`订单编号: ${info?.orderId}`}</Text>
            <View className='btn-copy' onClick={hanldeCopy.bind(this, info?.orderId)}>
              复制
            </View>
          </View>
          <View className='trade-goods'>
            {info?.items.map((good) => (
              <SpTradeItem info={good} />
            ))}
          </View>
          <View className='trade-'></View>
        </View>
        <View className='block-container'>
          <SpCell title='下单时间' value={info?.createdTime}></SpCell>
          <SpCell title='支付时间' value={tradeInfo?.payDate}></SpCell>
          <SpCell title='取消时间' value={'fe'}></SpCell>
          <SpCell title='取货时间' value={'fe'}></SpCell>
          <SpCell title='送达时间' value={'fe'}></SpCell>
          <SpCell title='配送时长' value={'fe'}></SpCell>
          <SpCell title='发票信息' value={'fe'}></SpCell>
        </View>
        <View className='block-container'>
          <SpCell title='原价' value={<SpPrice value={info?.marketFee} size={28} />}></SpCell>
          <SpCell title='总价' value={<SpPrice value={info?.itemFee} size={28} />}></SpCell>
          <SpCell title='运费' value={<SpPrice value={info?.freightFee} size={28} />}></SpCell>
          <SpCell title='促销' value={'fe'}></SpCell>
          <SpCell title='优惠券' value={'fe'}></SpCell>
          <SpCell title='税费' value={'fe'}></SpCell>
          <SpCell title='积分支付' value={'fe'}></SpCell>
          <SpCell title='支付' value={'fe'}></SpCell>
          <SpCell title='实付' value={'fe'}></SpCell>
          <SpCell title='物流单号' value={'fe'}></SpCell>
          <SpCell title='取消理由' value={'fe'}></SpCell>
        </View>
      </ScrollView>
    </SpPage>
  )
}

TradeDetail.options = {
  addGlobalClass: true
}

export default TradeDetail
