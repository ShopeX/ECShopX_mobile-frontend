/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton, AtTextarea } from 'taro-ui'
import {
  SpPage,
  SpCell,
  SpCheckbox,
  SpImage,
  SpChat,
  SpFloatLayout,
  SpUpload,
  SpPrice,
  SpHtml,
  SpPoint
} from '@/components'
import { View, Text, Picker, ScrollView } from '@tarojs/components'
import { pickBy, showToast, isNumber, copyText } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import { useNavigation } from '@/hooks'
import { AFTER_SALE_TYPE, REFUND_FEE_TYPE, AFTER_SALE_STATUS_TEXT } from '@/consts'
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
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const pageRef = useRef()
  const {
    info,
    tabList,
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
  const { aftersales_bn, item_id, order_id } = $instance?.router?.params
  const refundTypeList = useMemo(
    () => [
      {
        title: $t('96d58ce6.ed91f2'),
        desc: $t('96d58ce6.64435c'),
        value: 1
      },
      {
        title: $t('96d58ce6.11b600'),
        desc: $t('96d58ce6.6bd56e'),
        value: 2
      }
    ],
    [i18n.language]
  )

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('81e613d5.70536c'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

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
      order_id
    })
    console.log(pickBy(resInfo, doc.trade.TRADE_AFTER_SALES_ITEM))
    resInfo?.detail?.forEach((item) => {
      item.orderItem.refundNum = item.num
      item.orderItem.refundFee = item.refund_fee / 100
    })
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
      content: $t('96d58ce6.b20b3f'),
      cancelText: $t('96d58ce6.625fb2'),
      confirmText: $t('96d58ce6.38cf16')
    })
    if (confirm) {
      Taro.showLoading()
      await api.aftersales.close({ aftersales_bn })
      showToast($t('96d58ce6.272e83'))
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
      return showToast($t('96d58ce6.d83f4b'))
    }

    if (!reasons?.[reasonIndex]) {
      return showToast($t('96d58ce6.d030d6'))
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
    showToast($t('96d58ce6.23b62e'))
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
              {$t('96d58ce6.eaffc1')}
            </AtButton>
          )}
          {/* <AtButton circle onClick={onSubmit}>修改申请</AtButton> */}
          <SpChat>
            <AtButton circle>{$t('96d58ce6.b66060')}</AtButton>
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
                {$t('96d58ce6.9d9b19')}
                {info.refuseReason}
              </View>
            )}
          </View>

          {info?.returnType == 'logistics' && info?.hasAftersalesAddress && (
            <View className='after-address'>
              <SpCell title={$t('96d58ce6.35b68f')}>
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
                    {$t('96d58ce6.79d3ab')}
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
                      {$t('96d58ce6.f33f84')}
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
                    <SpImage
                      mode='aspectFit'
                      src={item.pic}
                      width={128}
                      height={128}
                      radius={8}
                      circle={8}
                    />
                    <View className='goods-info'>
                      <View className='goods-info-hd'>
                        <Text className='goods-title'>
                          {item?.isPrescription == 1 && (
                            <Text className='prescription-drug'>{$t('96d58ce6.e8b7e1')}</Text>
                          )}

                          {item.itemName}
                        </Text>
                      </View>
                      <View className='goods-info-bd'>
                        <View>
                          {item.itemSpecDesc && (
                            <Text className='sku-info'>{`${item.itemSpecDesc}`}</Text>
                          )}
                        </View>
                        <View>
                          <SpPrice size={28} value={item.price / item.num} /> x{' '}
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
            {/* <View className='refund-amount'>
              <SpCell
                title='退款金额'
                value={<SpPrice value={info?.refund_info?.refundFee || info?.refundFee} />}
              ></SpCell>
            </View>
            <View className='refund-point'>
              <SpCell
                title='退积分'
                value={info?.refund_info?.refundPoint || info?.refundPoint}
              ></SpCell>
            </View>
         */}

            <View className='refund-detail'>
              <View className='refund-amount'>
                <SpCell
                  title={$t('96d58ce6.a0cd4c')}
                  value={<SpPrice value={info?.refundFee} />}
                ></SpCell>
              </View>
              <View className='refund-point'>
                <SpCell title={$t('96d58ce6.401595')} value={info?.refundPoint}></SpCell>
              </View>
              <View className='refund-point'>
                {info?.freightType == 'point' && (
                  <SpCell
                    title={$t('96d58ce6.662229')}
                    value={<SpPoint value={info?.freight * 100} />}
                  />
                )}
                {info?.freightType == 'cash' && (
                  <SpCell title={$t('96d58ce6.662229')} value={<SpPrice value={info?.freight} />} />
                )}
              </View>
            </View>

            <View className='refund-type'>
              <SpCell title={$t('96d58ce6.b85b43')}>{getRefundType()}</SpCell>
              {info?.returnType == 'offline' && info?.hasAftersalesAddress && (
                <SpCell title={$t('96d58ce6.611301')}>
                  <>
                    <View className='store-name'>{info?.afterSalesName}</View>
                    <View className='store-address'>{info?.afterSalesAddress}</View>
                    <View className='store-connect'>{info?.afterSalesMobile}</View>
                    <View className='store-time'>
                      {ti('96d58ce6.6b4b35', [info?.aftersalesHours])}
                    </View>
                  </>
                </SpCell>
              )}
            </View>

            <View className='after-sales-type'>
              <SpCell title={$t('96d58ce6.d4e4ff')}>{getAfterSalesType()}</SpCell>
              <SpCell title={$t('96d58ce6.220bc2')}>{info?.reason}</SpCell>
              <SpCell title={$t('96d58ce6.6bc7d6')}>
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
              <SpCell title={$t('96d58ce6.3e8657')}>{info?.orderId}</SpCell>
              <SpCell title={$t('96d58ce6.5ba072')}>{info?.createTime}</SpCell>
              <SpCell title={$t('96d58ce6.5c9115')}>
                {info?.afterSalesBn}
                <View
                  className='btn-copy'
                  circle
                  size='small'
                  onClick={() => {
                    copyText(info?.afterSalesBn)
                  }}
                >
                  {$t('96d58ce6.79d3ab')}
                </View>
              </SpCell>
            </View>
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
