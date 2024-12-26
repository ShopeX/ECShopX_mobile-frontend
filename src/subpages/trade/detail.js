import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton, AtCountdown } from 'taro-ui'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpPage, SpCell, SpPrice, SpTradeItem, SpImage, SpCashier } from '@/components'
import { ORDER_STATUS_INFO, PAYMENT_TYPE, ORDER_DADA_STATUS, SG_ROUTER_PARAMS } from '@/consts'
import {
  pickBy,
  copyText,
  showToast,
  classNames,
  isArray,
  VERSION_STANDARD,
  entryLaunch
} from '@/utils'
import { usePayment } from '@/hooks'
import S from '@/spx'
import tradeHooks from './hooks'
import CompTradeCancel from './comps/comp-tradecancel'
import CompWriteOffCode from './comps/comp-writeoff-code'
import CompTrackDetail from './comps/comp-track-detail'
import './detail.scss'
import { includes } from 'lodash'

const initialState = {
  info: null,
  tradeInfo: null,
  cancelData: null,
  distirbutorInfo: null,
  loading: true,
  openCashier: false,
  openCancelTrade: false,
  openWriteOffCode: false,
  webSocketOpenFlag: false,
  openTrackDetail: false,
  trackDetailList: []
}
function TradeDetail(props) {
  const [state, setState] = useImmer(initialState)
  const {
    info,
    tradeInfo,
    cancelData,
    distirbutorInfo,
    loading,
    openCashier,
    openCancelTrade,
    openWriteOffCode,
    webSocketOpenFlag,
    openTrackDetail,
    trackDetailList
  } = state
  const { priceSetting, pointName } = useSelector((state) => state.sys)

  const {
    order_page: { market_price: enMarketPrice }
  } = priceSetting
  const { tradeActionBtns, getTradeAction, getItemAction } = tradeHooks()
  const { cashierPayment } = usePayment()
  const router = useRouter()
  const websocketRef = useRef(null)

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
    //线下转账
    Taro.eventCenter.on('onEventOfflineApply', () => {
      fetch()
      setTimeout(() => {
        Taro.eventCenter.trigger('onEventOrderStatusChange')
      }, 200)
    })

    return () => {
      Taro.eventCenter.off('onEventAfterSalesApply')
      Taro.eventCenter.off('onEventAfterSalesCancel')
      Taro.eventCenter.off('onEventOfflineApply')
    }
  }, [])

  const fetch = async () => {
    const { order_id } = await parameter()
    const { distributor, orderInfo, tradeInfo, cancelData } = await api.trade.detail(order_id)
    const _orderInfo = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    // 自提订单未核销，开启websocket监听核销状态
    if (_orderInfo.receiptType == 'ziti' && _orderInfo.zitiStatus == 'PENDING') {
      onWebSocket()
    }
    setState((draft) => {
      draft.info = _orderInfo
      draft.tradeInfo = tradeInfo
      draft.cancelData = isArray(cancelData) ? null : cancelData
      draft.distirbutorInfo = distributor
      draft.loading = false
    })
  }

  const onWebSocket = async () => {
    if (!websocketRef.current) {
      websocketRef.current = await Taro.connectSocket({
        url: process.env.APP_WEBSOCKET,
        header: {
          'content-type': 'application/json',
          'authorization': `Bearer ${S.getAuthToken()}`,
          'guard': 'h5api',
          'x-wxapp-sockettype': 'orderzitimsg'
        },
        method: 'GET'
      })
      websocketRef.current.onOpen(() => {
        console.log('websocket start success')
      })
      websocketRef.current.onError((err) => {
        console.log('websocket start err: ', err)
        websocketRef.current = null
        setTimeout(() => {
          onWebSocket()
        }, 200)
      })
      websocketRef.current.onMessage((res) => {
        const { status } = JSON.parse(res.data)
        if (status == 'success') {
          showToast('核销成功')
          setTimeout(() => {
            fetch()
          }, 200)
        }
      })
      websocketRef.current.onOpen(() => {
        console.log('websocket start success')
      })
      websocketRef.current.onClose(() => {
        websocketRef.current = null
      })
    }
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
      setState((draft) => {
        draft.openCashier = true
      })
    } else if (key == 'cancel') {
      setState((draft) => {
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
    } else if (key == 'writeOff') {
      setState((draft) => {
        draft.openWriteOffCode = true
      })
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
    const { activityType, orderId, orderType, offlinePayCheckStatus } = info
    const params = {
      activityType: activityType,
      pay_channel: paymentChannel,
      pay_type: payType
    }
    const orderInfo = {
      order_id: orderId,
      order_type: orderType,
      pay_type: payType,
      has_check: ![null,undefined].includes(offlinePayCheckStatus)
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
    if (info.receiptType == 'dada') {
      // 达达同城配，订单状态单独处理
      return `${ORDER_DADA_STATUS[info.dada?.dadaStatus]?.icon}.png` || ''
    }

    if (info.cancelStatus == 'WAIT_PROCESS') {
      return 'order_dengdai.png'
    }
    return `${ORDER_STATUS_INFO[info.orderStatus]?.icon}.png`
  }

  const getTradeStatusDesc = () => {
    if (info.receiptType == 'dada') {
      // 达达同城配，订单状态单独处理
      return ORDER_DADA_STATUS[info.dada?.dadaStatus]?.msg
    } else if (info.zitiStatus == 'PENDING') {
      return '等待核销'
    } else if (info.deliveryStatus == 'PARTAIL') {
      return '部分商品已发货'
    } else if (info.cancelStatus == 'WAIT_PROCESS') {
      return '订单取消，退款处理中'
    } else if (
      info.orderStatus == 'NOTPAY' &&
      info.payChannel == 'offline_pay' &&
      info.offlinePayCheckStatus == '0'
    ) {
      //展示线下审核的一些状态 0 待处理;1 已审核;2 已拒绝;9 已取消
      return '等待商家确认支付'
    } else {
      return ORDER_STATUS_INFO[info.orderStatus]?.msg
    }
  }

  const handleCallPhone = (phone) => {
    if (phone) {
      Taro.makePhoneCall({
        phoneNumber: phone
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
      const evaluateIndex = btns.findIndex((item) => item.key === 'evaluate')
      if (evaluateIndex > -1) {
        btns.splice(evaluateIndex, 1)
      }

      // 自提订单
      if (info.receiptType == 'ziti') {
        btns.unshift(tradeActionBtns.WRITE_OFF)
      }

      if (btns.length > 0) {
        return (
          <View className='action-button-wrap'>
            {btns.map((btn) => (
              <AtButton
                circle
                className={`btn-${btn.btnStatus}`}
                onClick={handleClickAction.bind(this, btn)}
              >
                {btn.title}
              </AtButton>
            ))}
          </View>
        )
      } else {
        return null
      }
    } else {
      return null
    }
  }

  const parameter = async () => {
    const storedData = Taro.getStorageSync(SG_ROUTER_PARAMS)
    const routeParams = await entryLaunch.getRouteParams()
    return routeParams && routeParams.order_id ? routeParams : storedData
  }

  const handleCallOpreator = () => {
    Taro.makePhoneCall({
      phoneNumber: info.selfDeliveryOperatorMobile
    })
  }

  const handleTrackDetail = async () => {
    const { orderId } = info
    const res = await api.trade.getTrackerpull({ order_id: orderId })
    console.log(res)

    setState((v) => {
      v.openTrackDetail = true
      v.trackDetailList = res
    })
  }

  const handlOfflineDetail = () => {
    Taro.navigateTo({
      url: `/pages/cart/offline-transfer?isDetail=true&order_id=${info?.orderId}&has_check=true&onlyView=true`
    })
  }

  return (
    <SpPage
      className='page-trade-detail'
      loading={loading}
      scrollToTopBtn
      renderFooter={renderActionButton()}
    >
      <ScrollView className='trade-detail-scroll' scrollY>
        <View className='trade-status'>
          {info && (
            <View className='trade-status-desc'>
              <View className='trade-status-desc-box'>
                <SpImage src={getTradeStatusIcon()} width={50} height={50} />
                <Text className='status-desc'>{getTradeStatusDesc()}</Text>
              </View>
              {info?.selfDeliveryOperatorName && info?.selfDeliveryOperatorMobile && (
                <View className='deliver-opreator'>
                  <View className='deliver-opreator-name'>
                    配送员:{info?.selfDeliveryOperatorName}
                  </View>
                  <View>
                    <Text className='deliver-opreator-phone' onClick={handleCallOpreator}>
                      拨打电话
                    </Text>
                  </View>
                  <View>
                    <Text className='deliver-opreator-phone' onClick={handleTrackDetail}>
                      订单跟踪
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          {!!info?.selfDeliveryTime && (
            <View className='self-delivery-time'>
              <SpCell title='预计送达时间' value={info?.selfDeliveryTime} />
            </View>
          )}
          {info?.orderStatus == 'NOTPAY' && (
            <View className='order-cancel-time'>
              该订单将为您保留
              <AtCountdown
                format={{ day: '天', hours: '时', minutes: '分', seconds: '秒' }}
                isShowDay={info.autoCancelSeconds > 86400}
                seconds={info.autoCancelSeconds}
                onTimeUp={onCancelTradeTimeUp}
              />
            </View>
          )}
        </View>
        {
          // 普通快递
          info?.receiptType == 'logistics' && (
            <View className='block-container address-info'>
              <SpImage src='shouhuodizhi.png' width={60} height={60} />
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
          )
        }
        {
          // 门店自提
          info?.receiptType == 'ziti' && (
            <View className='block-container ziti-info'>
              <View>
                <Text className='label'>自提点:</Text>
                <Text className='value'>{info.zitiInfo.name}</Text>
              </View>
              <View>
                <Text className='label'>自提地址:</Text>
                <Text className='value'>{`${info.zitiInfo.province}${info.zitiInfo.city}${info.zitiInfo.area}${info.zitiInfo.address}`}</Text>
              </View>
              <View>
                <Text className='label'>联系电话:</Text>
                <Text className='value'>{info.zitiInfo.contract_phone}</Text>
                <Text
                  className='iconfont icon-dianhua'
                  onClick={() => {
                    const { contract_phone } = info.zitiInfo
                    handleCallPhone(contract_phone)
                  }}
                />
              </View>
              <View>
                <Text className='label'>提货人:</Text>
                <Text className='value'>{info.receiverName}</Text>
              </View>
              <View>
                <Text className='label'>提货时间:</Text>
                <Text className='value'>{`${info.zitiInfo.pickup_date} ${info.zitiInfo.pickup_time[0]}-${info.zitiInfo.pickup_time[1]}`}</Text>
              </View>
              <View>
                <Text className='label'>提货人手机:</Text>
                <Text className='value'>{info.receiverMobile}</Text>
              </View>
            </View>
          )
        }
        {
          // 达达同城配，骑手已接单、配送中
          info?.receiptType == 'dada' && info.dada.dadaStatus > 1 && info.dada.dadaStatus !== 5 && (
            <View className='block-container dada-qishou-info'>
              <View className='qishou'>
                <SpImage src={'qishi.png'} width={80} height={80} />
                <Text className='qishou-name'>骑手：{info.dada.dmName}</Text>
                <Text
                  className='iconfont icon-dianhua'
                  onClick={() => {
                    handleCallPhone(info.dada.dmMobile)
                  }}
                />
              </View>
              <View className='dada-desc'>本单由达达同城为您服务</View>
            </View>
          )
        }
        {
          // 达达同城配
          info?.receiptType == 'dada' && (
            <View className='block-container store-receive-address'>
              <View className='store-address'>
                <Text className='iconfont icon-shouhuodizhi-duoduan' />
                <View className='store-address-detail'>
                  <View className='store-name'>{`${distirbutorInfo?.store_name}`}</View>
                  <View className='store-address-desc'>{`${distirbutorInfo?.store_address}`}</View>
                  <View className='store-hour-phone'>
                    <View className='hour'>
                      <Text className='label'>门店营业时间：</Text>
                      <Text className='value'>{distirbutorInfo?.hour}</Text>
                    </View>
                    <View className='phone'>
                      <Text className='label'>门店电话：</Text>
                      <Text className='value'>{distirbutorInfo?.phone}</Text>
                      <Text
                        className='iconfont icon-dianhua'
                        onClick={() => {
                          handleCallPhone(distirbutorInfo?.phone)
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View className='receive-address'>
                <Text className='iconfont icon-shouhuodizhi-duoduan' />
                <View className='receive-address-detail'>
                  <View className='address-desc'>{`${info.receiverState}${info.receiverCity}${info.receiverDistrict}${info.receiverAddress}`}</View>
                  <View className='receive-name-mobile'>
                    <Text className='name'>{info.receiverName}</Text>
                    <Text className='mobile'>{info.receiverMobile}</Text>
                  </View>
                </View>
              </View>
            </View>
          )
        }
        <View className='block-container'>
          <View className='trade-shop' onClick={onViewStorePage}>
            {info?.distributorName}
            {!VERSION_STANDARD && <Text className='iconfont icon-qianwang-01' />}
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
                <SpTradeItem
                  info={{
                    ...goods,
                    orderClass: info.orderClass
                  }}
                  onClick={onClickItem}
                />
                {/* {renderItemActions(goods)} */}
              </View>
            ))}
          </View>
          <View className='trade-price-info'>
            {enMarketPrice && info?.marketFee > 0 && (
              <SpCell title='原价' value={<SpPrice value={info?.marketFee} size={28} />} />
            )}
            <SpCell
              title='总价'
              value={(() => {
                if (info?.orderClass === 'pointsmall') {
                  return `${pointName} ${info?.itemPoint}`
                } else {
                  return <SpPrice value={info?.itemFee} size={28} />
                }
              })()}
            />
            <SpCell title='运费' value={<SpPrice value={info?.freightFee} size={28} />} />
            <SpCell title='促销' value={<SpPrice value={info?.promotionDiscount} size={28} />} />
            <SpCell title='优惠券' value={<SpPrice value={info?.couponDiscount} size={28} />} />
            <SpCell
              title='支付方式'
              value={(() => {
                return (
                  <View className='pay-way'>
                    {info?.offlinePayCheckStatus == 1 && (
                      <View className='pay-way-detail' onClick={handlOfflineDetail}>
                        查看付款凭证
                      </View>
                    )}
                    {info?.payType == 'offline_pay'
                      ? info?.offlinePayName
                      : PAYMENT_TYPE[info?.payType] || ''}
                  </View>
                )
              })()}
            />
            <SpCell
              title='实付'
              value={(() => {
                if (info?.orderClass === 'pointsmall') {
                  return `${pointName} ${info?.point}`
                } else {
                  return <SpPrice value={info?.totalFee} size={28} />
                }
              })()}
            />
          </View>
        </View>
        {/* <View className='block-container'>
        </View> */}
        <View className='block-container order-info'>
          <View className='block-container-label'>订单信息</View>
          <SpCell
            title='订单编号'
            value={
              <View class='flex flex-align-center'>
                {info?.orderId}
                <Text className='btn-copy' onClick={hanldeCopy.bind(this, info?.orderId)}>
                  复制
                </Text>
              </View>
            }
          />
          <SpCell title='下单时间' value={info?.createdTime} />
          <SpCell title='付款时间' value={tradeInfo?.payDate} />
          {info?.invoice && (
            <SpCell
              title='发票信息'
              value={
                <View>
                  <View>{info?.invoice.content}</View>
                  <View>{info?.invoice.registration_number}</View>
                </View>
              }
            />
          )}
          {cancelData && <SpCell title='取消原因' value={cancelData?.cancel_reason} />}
        </View>
        <View className='padding-view'></View>
      </ScrollView>

      {info?.orderStatus === 'NOTPAY' && (
        <SpCashier
          defaultVal={info?.payChannel}
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
      )}

      <CompTradeCancel
        isOpened={openCancelTrade}
        onClose={() => {
          setState((draft) => {
            draft.openCancelTrade = false
          })
        }}
        onConfirm={onCandelTrade}
      />

      <CompWriteOffCode
        isOpened={openWriteOffCode}
        onClose={() => {
          setState((draft) => {
            draft.openWriteOffCode = false
          })
        }}
      />

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

TradeDetail.options = {
  addGlobalClass: true
}

export default TradeDetail
