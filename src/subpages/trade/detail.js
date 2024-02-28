import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton, AtCountdown } from 'taro-ui'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpPage, SpCell, SpPrice, SpTradeItem, SpImage, SpCashier } from '@/components'
import { ORDER_STATUS_INFO } from '@/consts'
import { pickBy, copyText, showToast, classNames, isArray, VERSION_STANDARD } from '@/utils'
import { usePayment } from '@/hooks'
import tradeHooks from './hooks'
import CompTradeCancel from './comps/comp-tradecancel'
import './detail.scss'

const initialState = {
  info: null,
  tradeInfo: null,
  cancelData: null,
  loading: true,
  openCashier: false,
  openCancelTrade: false
}
function TradeDetail(props) {
  const [state, setState] = useImmer(initialState)
  const { info, tradeInfo, cancelData, loading, openCashier, openCancelTrade } = state
  const { priceSetting, pointName } = useSelector((state) => state.sys)

  const { order_page: { market_price: enMarketPrice } } = priceSetting
  const { tradeActionBtns, getTradeAction, getItemAction } = tradeHooks()
  const { cashierPayment } = usePayment()
  const router = useRouter()

  useEffect(() => {
    fetch()

    // 提交售后事件
    Taro.eventCenter.on('onEventAfterSalesApply', () => {
      fetch()
    })
    // 撤销售后事件
    Taro.eventCenter.on('onEventAfterSalesCancel', () => {
      fetch()
    })

    return () => {
      Taro.eventCenter.off('onEventAfterSalesApply')
      Taro.eventCenter.off('onEventAfterSalesCancel')
    }
  }, [])

  const fetch = async () => {
    const { order_id } = router.params
    const { orderInfo, tradeInfo, cancelData } = await api.trade.detail(order_id)
    setState((draft) => {
      draft.info = pickBy(orderInfo, doc.trade.TRADE_ITEM)
      draft.tradeInfo = tradeInfo
      draft.cancelData = isArray(cancelData) ? null : cancelData
      draft.loading = false
    })
  }

  const hanldeCopy = async (val) => {
    await copyText(val)
    showToast('复制成功')
  }

  const handleClickItem = async ({ key, action }) => {
    if (key == 'logistics') {
      Taro.navigateTo({
        url: '/subpages/trade/delivery-info?delivery_id=' + info.delivery_id
      })
    }
  }

  const handleClickAction = async ({ key, action }) => {
    if (key == 'pay') {
      setState(draft => {
        draft.openCashier = true
      })
    } else if (key == 'cancel') {
      setState(draft => {
        draft.openCancelTrade = true
      })
    } else if (key == 'confirm') {
      const { confirm } = await Taro.showModal({
        content: '确认收货？',
        cancelText: '取消',
        confirmText: '确定'
      })
      if (confirm) {
        await api.trade.confirm(info.orderId)
        fetch()
        setTimeout(() => {
          Taro.eventCenter.trigger('onEventOrderStatusChange')
        }, 200)
      }
    } else {
      action(info)
    }
  }

  const onClickItem = ({ itemId, distributorId }) => {
    Taro.navigateTo({
      url: `/pages/item/espier-detail?id=${itemId}&dtid=${distributorId}`
    })
  }

  // 订单支付
  const onHandlerPayOrder = ({ paymentCode: payType, paymentChannel }) => {
    const { activityType, orderId, orderType } = info
    const params = {
      activityType: activityType,
      pay_channel: paymentChannel,
      pay_type: payType
    }
    const orderInfo = {
      order_id: orderId,
      order_type: orderType,
      pay_type: payType
    }
    cashierPayment(params, orderInfo, () => {
      fetch()
      setTimeout(() => {
        Taro.eventCenter.trigger('onEventOrderStatusChange')
      }, 200)
    })
  }

  const onCandelTrade = async ({ reason, otherReason }) => {
    setState((draft) => {
      draft.openCancelTrade = false
    })
    const { orderId } = info
    const params = {
      order_id: orderId,
      cancel_reason: reason,
      other_reason: otherReason
    }
    await api.trade.cancel(params)
    fetch()
    setTimeout(() => {
      Taro.eventCenter.trigger('onEventOrderStatusChange')
    }, 200)
  }

  const onCancelTradeTimeUp = () => {
    fetch()
    setTimeout(() => {
      Taro.eventCenter.trigger('onEventOrderStatusChange')
    }, 200)
  }

  const onViewStorePage = () => {
    if (!VERSION_STANDARD) {
      Taro.navigateTo({
        url: `/subpages/store/index?id=${info.distributorId}`
      })
    }
  }

  const getTradeStatusIcon = () => {
    if (info.cancelStatus == 'WAIT_PROCESS') {
      return 'order_dengdai.png'
    }
    return `${ORDER_STATUS_INFO[info.orderStatus]?.icon}.png`
  }

  const getTradeStatusDesc = () => {
    if (info.zitiStatus == 'PENDING') {
      return '等待核销'
    } else if (info.deliveryStatus == 'PARTAIL') {
      return '部分商品已发货'
    } else if (info.cancelStatus == 'WAIT_PROCESS') {
      return '订单取消，退款处理中'
    } else {
      return ORDER_STATUS_INFO[info.orderStatus]?.msg
    }
  }

  const handleCallPhone = () => {
    const { contract_phone } = info.zitiInfo
    if (contract_phone) {
      Taro.makePhoneCall({
        phoneNumber: contract_phone
      })
    }
  }

  const renderActionButton = () => {
    //  info.cancelStatus
    // 【WAIT_PROCESS】订单申请取消中
    // 【SUCCESS】订单申请取消成功
    if (info) {
      const btns = getTradeAction(info)
      // 订单详情页不展示评价入口
      const evaluateIndex = btns.findIndex(item => item.key === 'evaluate')
      if (evaluateIndex > -1) {
        btns.splice(evaluateIndex, 1)
      }

      if (btns.length > 0) {
        return <View className='action-button-wrap'>
          {
            btns.map(btn => <AtButton circle className={`btn-${btn.btnStatus}`} onClick={handleClickAction.bind(this, btn)}>{btn.title}</AtButton>)
          }
        </View>
      } else {
        return null
      }

    } else {
      return null
    }
  }

  return (
    <SpPage className='page-trade-detail' loading={loading} scrollToTopBtn
      renderFooter={renderActionButton()}
    >
      <ScrollView className='trade-detail-scroll' scrollY>
        <View className='trade-status'>
          {
            info && <View className='trade-status-desc'>
              <SpImage src={getTradeStatusIcon()} width={50} height={50} />
              <Text className="status-desc">{getTradeStatusDesc()}</Text>
            </View>
          }
          {
            info?.orderStatus == 'NOTPAY' && <View className='order-cancel-time'>
              该订单将为您保留
              <AtCountdown
                format={{ day: '天', hours: '时', minutes: '分', seconds: '秒' }}
                isShowDay={info.autoCancelSeconds > 86400}
                seconds={info.autoCancelSeconds}
                onTimeUp={onCancelTradeTimeUp}
              />
            </View>
          }
        </View>
        {info?.receiptType != 'ziti' && <View className='block-container address-info'>
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
        }
        {
          info?.receiptType == 'ziti' && <View className='block-container ziti-info'>
            <View><Text className='label'>自提点:</Text><Text className='value'>{info.zitiInfo.name}</Text></View>
            <View><Text className='label'>自提地址:</Text><Text className='value'>{`${info.zitiInfo.province}${info.zitiInfo.city}${info.zitiInfo.area}${info.zitiInfo.address}`}</Text></View>
            <View><Text className='label'>联系电话:</Text><Text className='value'>{info.zitiInfo.contract_phone}</Text><Text
              className='iconfont icon-dianhua'
              onClick={handleCallPhone}
            ></Text></View>
            <View><Text className='label'>提货人:</Text><Text className='value'>{info.receiverName}</Text></View>
            <View><Text className='label'>提货时间:</Text><Text className='value'>{`${info.zitiInfo.pickup_date} ${info.zitiInfo.pickup_time[0]}-${info.zitiInfo.pickup_time[1]}`}</Text></View>
            <View><Text className='label'>提货人:</Text><Text className='value'>{info.receiverMobile}</Text></View>
          </View>
        }
        <View className='block-container'>
          <View className='trade-shop' onClick={onViewStorePage}>
            {info?.distributorName}
            {!VERSION_STANDARD && <Text className='iconfont icon-qianwang-01'></Text>}
          </View>
          {/* <View className='trade-no'>
            <Text className='no'>{`订单编号: ${info?.orderId}`}</Text>
            <View className='btn-copy' onClick={hanldeCopy.bind(this, info?.orderId)}>
              复制
            </View>
          </View> */}
          <View className='trade-goods'>
            {info?.items.map((goods) => (
              <View className='trade-goods-item'>
                <SpTradeItem info={{
                  ...goods,
                  orderClass: info.orderClass
                }} onClick={onClickItem} />
                {/* {renderItemActions(goods)} */}
              </View>
            ))}
          </View>
          <View className='trade-price-info'>
            {enMarketPrice && info?.marketFee > 0 && <SpCell title='原价' value={<SpPrice value={info?.marketFee} size={28} />} />}
            <SpCell title='总价' value={(() => {
              if (info?.orderClass === 'pointsmall') {
                return `${pointName} ${info?.itemPoint}`
              } else {
                return <SpPrice value={info?.itemFee} size={28} />
              }
            })()} />
            <SpCell title='运费' value={<SpPrice value={info?.freightFee} size={28} />} />
            <SpCell title='促销' value={<SpPrice value={info?.promotionDiscount} size={28} />} />
            <SpCell title='优惠券' value={<SpPrice value={info?.couponDiscount} size={28} />} />
            {/* <SpCell title='税费' value={'fe'} /> */}
            {/* <SpCell title='积分支付' value={'fe'} /> */}
            <SpCell title='支付' value={'fe'} />
            <SpCell title='实付' value={(() => {
              if (info?.orderClass === 'pointsmall') {
                return `${pointName} ${info?.point}`
              } else {
                return <SpPrice value={info?.totalFee} size={28} />
              }
            })()} />
          </View>
        </View>
        {/* <View className='block-container'>
        </View> */}
        <View className='block-container order-info'>
          <View className='block-container-label'>订单信息</View>
          <SpCell title='订单编号' value={<View class="flex flex-align-center">
            {info?.orderId}
            <Text className='btn-copy' onClick={hanldeCopy.bind(this, info?.orderId)}>
              复制
            </Text>
          </View>} />
          <SpCell title='下单时间' value={info?.createdTime} />
          <SpCell title='付款时间' value={tradeInfo?.payDate} />
          {cancelData && <SpCell title='取消原因' value={cancelData?.cancel_reason} />}

        </View>
        <View className='padding-view'></View>
      </ScrollView>

      {
        info?.orderStatus === 'NOTPAY' && <SpCashier
          isOpened={openCashier}
          value={info?.payChannel}
          onClose={() => {
            setState((draft) => {
              draft.openCashier = false
            })
          }}
          onChange={(value, confirm) => {
            setState((draft) => {
              console.log(`SpCashier:`, value)
              if (value && confirm) {
                onHandlerPayOrder(value)
              }
            })
          }}
        />
      }

      <CompTradeCancel isOpened={openCancelTrade} onClose={() => {
        setState((draft) => {
          draft.openCancelTrade = false
        })
      }} onConfirm={onCandelTrade} />
    </SpPage>
  )
}

TradeDetail.options = {
  addGlobalClass: true
}

export default TradeDetail
