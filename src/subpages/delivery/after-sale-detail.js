/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { SpPage, SpCell, SpImage, SpChat, SpPrice } from '@/components'
import { View, Text, ScrollView } from '@tarojs/components'
import { pickBy, showToast, copyText } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import { AFTER_SALE_TYPE, REFUND_FEE_TYPE } from '@/consts'
import './after-sale-detail.scss'

const initialState = {
  info: null,
  reasonIndex: '',
  reasons: [],
  refundFee: 0,
  refundPoint: 0,
  refundType: 2,
  description: '',
  pic: '',
  refundStore: '', // 退货门店
  connect: '', // 联系人
  mobile: '', // 联系电话
  openRefundType: false,
  selectRefundValue: 2
}

function TradeAfterSaleDetail(props) {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const pageRef = useRef()
  const {
    info,
    reasonIndex,
    reasons,
    refundFee,
    refundPoint,
    refundType,
    description,
    pic,
    openRefundType,
    selectRefundValue,
    refundStore,
    connect,
    mobile
  } = state
  const { aftersales_bn, item_id, order_id, user_id } = $instance?.router?.params

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('0e6f1f83.70536c') })
  }, [i18n.language])

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (openRefundType) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [openRefundType])

  const fetch = async () => {
    const resInfo = await api.aftersales.info({
      aftersales_bn,
      item_id,
      order_id,
      user_id
    })
    console.log(pickBy(resInfo, doc.trade.TRADE_AFTER_SALES_ITEM))
    setState((draft) => {
      draft.info = pickBy(resInfo, doc.trade.TRADE_AFTER_SALES_ITEM)
      draft.reasons = reasons
    })
  }

  const getRefundType = () => {
    const { title } = REFUND_FEE_TYPE().find((item) => item.value == info?.returnType) || {}
    return title
  }

  const getAfterSalesType = () => {
    const { title } = AFTER_SALE_TYPE().find((item) => item.type == info?.afterSalesType) || {}
    return title
  }

  const onCancelApply = async () => {
    const { confirm } = await Taro.showModal({
      content: $t('0e6f1f83.b20b3f'),
      cancelText: $t('0e6f1f83.625fb2'),
      confirmText: $t('0e6f1f83.38cf16')
    })
    if (confirm) {
      Taro.showLoading()
      await api.aftersales.close({ aftersales_bn, user_id })
      showToast($t('0e6f1f83.272e83'))
      Taro.hideLoading()
      fetch()
      Taro.eventCenter.trigger('onEventAfterSalesCancel')
      setTimeout(() => {
        Taro.navigateBack()
      }, 200)
    }
  }

  const onSubmit = async () => {
    const { id } = $instance?.router?.params
    const checkedItems = info?.items.filter((item) => !!item.checked)
    if (checkedItems.length == 0) {
      return showToast($t('0e6f1f83.d83f4b'))
    }

    if (!reasons?.[reasonIndex]) {
      return showToast($t('0e6f1f83.d030d6'))
    }
    const reason = reasons?.[reasonIndex]
    let params = {
      detail: checkedItems.map(({ id: _id, refundNum }) => {
        return {
          id: _id,
          num: refundNum
        }
      }),
      order_id: id,
      aftersales_type,
      reason,
      description,
      evidence_pic: pic
    }
    if (aftersales_type == 'REFUND_GOODS') {
      params = {
        ...params,
        return_type: refundType == 1 ? 'logistics' : 'offline'
        // aftersales_address_id: '请选择退货门店',
        // contact: '请填写联系人姓名',
        // mobile: '请填写联系人手机号码'
      }
    }
    await api.aftersales.apply(params)
    showToast($t('0e6f1f83.23b62e'))
    setTimeout(() => {
      Taro.redirectTo({
        url: `/subpage/pages/trade/detail?id=${id}`
      })
    }, 200)
  }

  return (
    <SpPage
      ref={pageRef}
      className='page-trade-after-sale-detail'
      renderFooter={
        <View className='btn-wrap'>
          {(info?.progress == 0 || info?.progress == 1) && (
            <AtButton circle onClick={onCancelApply}>
              {$t('0e6f1f83.eaffc1')}
            </AtButton>
          )}
          {/* <AtButton circle onClick={onSubmit}>修改申请</AtButton> */}
          <SpChat>
            <AtButton circle>{$t('0e6f1f83.b66060')}</AtButton>
          </SpChat>
        </View>
      }
    >
      <ScrollView scrollY className='scrollview-container'>
        <View className='scrollview-body'>
          <View className='after-progress'>
            {info?.progressMsg}
            {info?.refuseReason && (
              <View className='distributor-remark'>
                {ti('0e6f1f83.7ae9e8', [info.refuseReason])}
              </View>
            )}
          </View>

          {info?.returnType == 'logistics' && info?.hasAftersalesAddress && (
            <View className='after-address'>
              <SpCell title={$t('0e6f1f83.35b68f')}>
                <>
                  <View className='contact-mobile'>
                    <Text className='contact'>{info?.afterSalesContact}</Text>
                    <Text className='mobile'>{info?.afterSalesMobile}</Text>
                  </View>
                  <View
                    className='btn-copy'
                    circle
                    size='small'
                    onClick={() => {
                      copyText(
                        `${info?.afterSalesContact} ${info?.afterSalesMobile}\n${info?.afterSalesAddress}`
                      )
                    }}
                  >
                    {$t('0e6f1f83.79d3ab')}
                  </View>
                </>
              </SpCell>
              <View className='address-detail'>{info?.afterSalesAddress}</View>
              {info?.progress == 1 && (
                <View className='btn-container'>
                  <View className='btn-logistics'>
                    <AtButton
                      circle
                      type='primary'
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/subpages/trade/logistics-info?aftersales_bn=${aftersales_bn}`
                        })
                      }}
                    >
                      {$t('0e6f1f83.f33f84')}
                    </AtButton>
                  </View>
                </View>
              )}
            </View>
          )}

          <View className='refund-items'>
            <View className='items-container'>
              {info?.items.map((item, index) => (
                <View className='item-wrap' key={`item-wrap__${index}`}>
                  <View className='item-bd'>
                    <SpImage src={item.pic} width={128} height={128} radius={8} circle={8} />
                    <View className='goods-info'>
                      <View className='goods-info-hd'>
                        <Text className='goods-title'>{item.itemName}</Text>
                      </View>
                      <View className='goods-info-bd'>
                        <View>
                          {item.itemSpecDesc && (
                            <Text className='sku-info'>{`${item.itemSpecDesc}`}</Text>
                          )}
                        </View>
                        <View>
                          <SpPrice size={28} value={item.price} /> x{' '}
                          <Text className='num'>{item.num}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className='refund-detail'>
            <View className='refund-amount'>
              <SpCell
                title={$t('0e6f1f83.a0cd4c')}
                value={<SpPrice value={info?.refundFee} />}
              ></SpCell>
            </View>
            <View className='refund-point'>
              <SpCell title={$t('0e6f1f83.401595')} value={info?.refundPoint}></SpCell>
            </View>
          </View>

          <View className='refund-type'>
            <SpCell title={$t('0e6f1f83.b85b43')}>{getRefundType()}</SpCell>
            {info?.returnType == 'offline' && info?.hasAftersalesAddress && (
              <SpCell title={$t('0e6f1f83.611301')}>
                <>
                  <View className='store-name'>{info?.afterSalesName}</View>
                  <View className='store-address'>{info?.afterSalesAddress}</View>
                  <View className='store-connect'>{info?.afterSalesMobile}</View>
                  <View className='store-time'>
                    {ti('0e6f1f83.6b4b35', [info?.aftersalesHours])}
                  </View>
                </>
              </SpCell>
            )}
          </View>

          <View className='after-sales-type'>
            <SpCell title={$t('0e6f1f83.d4e4ff')}>{getAfterSalesType()}</SpCell>
            <SpCell title={$t('0e6f1f83.220bc2')}>{info?.reason}</SpCell>
            <SpCell title={$t('0e6f1f83.6bc7d6')}>
              <>
                <View>{info?.description}</View>
                <View className='evidence-pic'>
                  {info?.evidencePic.map((item, index) => (
                    <SpImage
                      key={`pic-image__${index}`}
                      src={item}
                      width={130}
                      height={130}
                      circle={16}
                    />
                  ))}
                </View>
              </>
            </SpCell>
          </View>

          <View className='after-sales-trade'>
            <SpCell title={$t('0e6f1f83.3e8657')}>{info?.orderId}</SpCell>
            <SpCell title={$t('0e6f1f83.5ba072')}>{info?.createTime}</SpCell>
            <SpCell title={$t('0e6f1f83.5c9115')}>
              {info?.afterSalesBn}
              <View
                className='btn-copy'
                circle
                size='small'
                onClick={() => {
                  copyText(info?.afterSalesBn)
                }}
              >
                {$t('0e6f1f83.79d3ab')}
              </View>
            </SpCell>
          </View>
        </View>
      </ScrollView>
    </SpPage>
  )
}

TradeAfterSaleDetail.options = {
  addGlobalClass: true
}

export default TradeAfterSaleDetail
