/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton, AtCountdown } from 'taro-ui'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpPage, SpCell, SpPrice, SpTradeItem, SpImage, SpCashier } from '@/components'
import { ORDER_STATUS_INFO, PAYMENT_TYPE, ORDER_DADA_STATUS } from '@/consts'
import { pickBy, copyText, showToast, classNames, isArray, VERSION_STANDARD } from '@/utils'
import { useTranslation, withTranslation } from 'react-i18next'
import { $t, ti } from '@/i18n'
import { usePayment } from '@/hooks'
import S from '@/spx'
import tradeHooks from './hooks'
import CompTradeCancel from './comps/comp-tradecancel'
import CompWriteOffCode from './comps/comp-writeoff-code'
import CompTrackDetail from './comps/comp-track-detail'
import './detail.scss'

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
  const { i18n } = useTranslation()
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

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('2715dbf7.8054f7') })
  }, [i18n.language])

  const fetch = async () => {
    const { order_id } = router?.params
    const { userId } = Taro.getStorageSync('userinfo')
    let params = {
      isSalesmanPage: 1,
      promoter_user_id: userId
    }
    const { distributor, orderInfo, tradeInfo, cancelData } = await api.trade.detail(
      order_id,
      params
    )
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
          showToast($t('250b375e.065407'))
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
    showToast($t('64c107ec.20a495'))
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
        content: $t('250b375e.c4c6f2'),
        cancelText: $t('61e2d21a.625fb2'),
        confirmText: $t('250b375e.38cf16')
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
      url: `/subpages/item/espier-detail?id=${itemId}&dtid=${distributorId}`
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
    if (info.receiptType == 'dada') {
      // 达达同城配，订单状态单独处理
      return `${ORDER_DADA_STATUS()[info.dada?.dadaStatus]?.icon}.png` || ''
    }

    if (info.cancelStatus == 'WAIT_PROCESS') {
      return 'order_dengdai.png'
    }
    return `${ORDER_STATUS_INFO()[info.orderStatus]?.icon}.png`
  }

  const getTradeStatusDesc = () => {
    if (info.receiptType == 'dada') {
      // 达达同城配，订单状态单独处理
      return ORDER_DADA_STATUS()[info.dada?.dadaStatus]?.msg
    } else if (info.zitiStatus == 'PENDING') {
      return $t('250b375e.06ec9f')
    } else if (info.deliveryStatus == 'PARTAIL') {
      return $t('250b375e.ebbce2')
    } else if (info.cancelStatus == 'WAIT_PROCESS') {
      return $t('250b375e.b4814f')
    } else if (
      info.orderStatus == 'NOTPAY' &&
      info.payType == 'offline_pay' &&
      info.offlinePayCheckStatus == '0'
    ) {
      //展示线下审核的一些状态 0 待处理;1 已审核;2 已拒绝;9 已取消
      return $t('250b375e.e92d29')
    } else {
      return ORDER_STATUS_INFO()[info.orderStatus]?.msg
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
                    {ti('250b375e.da3446', [info?.selfDeliveryOperatorName])}
                  </View>
                  <View>
                    <Text className='deliver-opreator-phone' onClick={handleCallOpreator}>
                      {$t('250b375e.b0ccf0')}
                    </Text>
                  </View>
                  <View>
                    <Text className='deliver-opreator-phone' onClick={handleTrackDetail}>
                      {$t('250b375e.01fe4f')}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          {info?.orderStatus == 'NOTPAY' && (
            <View className='order-cancel-time'>
              {$t('250b375e.cd4607')}
              <AtCountdown
                format={{
                  day: $t('250b375e.249aba'),
                  hours: $t('250b375e.609b5f'),
                  minutes: $t('250b375e.daf783'),
                  seconds: $t('250b375e.0c1fec')
                }}
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
                <Text className='label'>{$t('250b375e.73c4b2')}</Text>
                <Text className='value'>{info.zitiInfo.name}</Text>
              </View>
              <View>
                <Text className='label'>{$t('250b375e.047df3')}</Text>
                <Text className='value'>{`${info.zitiInfo.province}${info.zitiInfo.city}${info.zitiInfo.area}${info.zitiInfo.address}`}</Text>
              </View>
              <View>
                <Text className='label'>{$t('250b375e.733e3f')}</Text>
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
                <Text className='label'>{$t('250b375e.6f1246')}</Text>
                <Text className='value'>{info.receiverName}</Text>
              </View>
              <View>
                <Text className='label'>{$t('250b375e.a7e362')}</Text>
                <Text className='value'>{`${info.zitiInfo.pickup_date} ${info.zitiInfo.pickup_time[0]}-${info.zitiInfo.pickup_time[1]}`}</Text>
              </View>
              <View>
                <Text className='label'>{$t('250b375e.2f0256')}</Text>
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
                <SpImage src='qishi.png' width={80} height={80} />
                <Text className='qishou-name'>{ti('250b375e.635684', [info.dada.dmName])}</Text>
                <Text
                  className='iconfont icon-dianhua'
                  onClick={() => {
                    handleCallPhone(info.dada.dmMobile)
                  }}
                />
              </View>
              <View className='dada-desc'>{$t('250b375e.2c785f')}</View>
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
                      <Text className='label'>{$t('250b375e.1d6d33')}</Text>
                      <Text className='value'>{distirbutorInfo?.hour}</Text>
                    </View>
                    <View className='phone'>
                      <Text className='label'>{$t('250b375e.4e69c9')}</Text>
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
              <SpCell
                title={$t('250b375e.1afdfe')}
                value={<SpPrice value={info?.marketFee} size={28} />}
              />
            )}
            <SpCell
              title={$t('250b375e.4df53f')}
              value={(() => {
                if (info?.orderClass === 'pointsmall') {
                  return `${pointName} ${info?.itemPoint}`
                } else {
                  return <SpPrice value={info?.itemFee} size={28} />
                }
              })()}
            />
            <SpCell
              title={$t('250b375e.9a935b')}
              value={<SpPrice value={info?.freightFee} size={28} />}
            />
            <SpCell
              title={$t('250b375e.252caa')}
              value={<SpPrice value={info?.promotionDiscount} size={28} />}
            />
            <SpCell
              title={$t('250b375e.2f3635')}
              value={<SpPrice value={info?.couponDiscount} size={28} />}
            />
            <SpCell
              title={$t('250b375e.0c9d2b')}
              value={(() => {
                return info?.payType == 'offline_pay'
                  ? info?.offlinePayName
                  : PAYMENT_TYPE()[info?.payType] || ''
              })()}
            />
            <SpCell
              title={$t('250b375e.c8b8ba')}
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
          <View className='block-container-label'>{$t('250b375e.a6d10d')}</View>
          <SpCell
            title={$t('250b375e.3e8657')}
            value={
              <View class='flex flex-align-center'>
                {info?.orderId}
                <Text className='btn-copy' onClick={hanldeCopy.bind(this, info?.orderId)}>
                  {$t('64c107ec.79d3ab')}
                </Text>
              </View>
            }
          />
          <SpCell title={$t('250b375e.2240cc')} value={info?.createdTime} />
          <SpCell title={$t('250b375e.590c95')} value={tradeInfo?.payDate} />
          {info?.invoice && (
            <SpCell
              title={$t('250b375e.714483')}
              value={
                <View>
                  <View>{info?.invoice.content}</View>
                  <View>{info?.invoice.registration_number}</View>
                </View>
              }
            />
          )}
          {cancelData && <SpCell title={$t('250b375e.4a3df6')} value={cancelData?.cancel_reason} />}
        </View>
        <View className='padding-view'></View>
      </ScrollView>

      {info?.orderStatus === 'NOTPAY' && (
        <SpCashier
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

export default withTranslation()(TradeDetail)
