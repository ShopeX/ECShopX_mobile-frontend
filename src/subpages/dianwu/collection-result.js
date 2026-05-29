/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import * as dianwuApi from '@/api/dianwu'
import { dianwuMarkdownAdjustmentYuan } from '@/subpages/doc/dianwu'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { formatDateTime } from '@/utils'
import { SpPage, SpCell, SpPrice } from '@/components'
import { useTranslation, $t, ti, i18n } from '@/i18n'
import './collection-result.scss'

const initialState = {
  distributor: null,
  info: null,
  operatorInfo: null
}
function DianwuCollectionResult(props) {
  useTranslation()

  useEffect(() => {
    const syncNavTitle = () => {
      Taro.setNavigationBarTitle({ title: $t('36c99ee5.2eee29') })
    }
    syncNavTitle()
    i18n.on('languageChanged', syncNavTitle)
    return () => i18n.off('languageChanged', syncNavTitle)
  }, [])

  const $instance = getCurrentInstance() || {}
  const { order_id, trade_id, pay_type } = $instance?.router?.params
  const [state, setState] = useImmer(initialState)
  const { distributor, info, operatorInfo } = state

  useEffect(() => {
    if (pay_type == 'pos' || pay_type == 'offline_pay') {
      fetchOrderInfo()
    } else {
      getPaymentResultByOrder()
    }
  }, [])

  const getPaymentResultByOrder = async () => {
    const { status } = await dianwuApi.getPaymentResultByOrder({
      trade_id
    })
    if (status == 'USERPAYING') {
      setTimeout(() => {
        getPaymentResultByOrder()
      }, 3000)
    } else if (status == 'SUCCESS') {
      fetchOrderInfo()
    }
  }

  const fetchOrderInfo = async () => {
    const raw = (await dianwuApi.getTradeDetail(order_id)) || {}
    const orderInfo = raw.orderInfo ?? raw.order_info ?? raw
    const distributor = raw.distributor ?? orderInfo?.distributor_info
    const operatorInfo = raw.operatorInfo ?? raw.operator_info
    const {
      items,
      pay_type,
      create_time,
      item_fee,
      item_fee_new,
      item_total_fee,
      discount_fee,
      total_fee,
      member_discount,
      coupon_discount,
      promotion_discount,
      offline_pay_name,
      offline_pay_check_status,
      remark,
      user_id,
      pay_status
    } = orderInfo
    let username, mobile
    if (user_id != 0) {
      const { username: _username, mobile: _mobile } = await dianwuApi.getMemberByUserId({
        user_id
      })
      username = _username
      mobile = _mobile
    }

    setState((draft) => {
      draft.distributor = distributor
      draft.info = {
        itemList: items.filter((item) => item.order_item_type == 'normal'),
        giftList: items.filter((item) => item.order_item_type == 'gift'),
        payType: pay_type,
        createTime: create_time,
        itemFee: item_fee_new / 100,
        discountFee: discount_fee / 100,
        totalFee: total_fee / 100,
        memberDiscount: member_discount ? member_discount / 100 : 0,
        couponDiscount: coupon_discount ? coupon_discount / 100 : 0,
        promotionDiscount: promotion_discount ? promotion_discount / 100 : 0,
        priceAdjustment: dianwuMarkdownAdjustmentYuan(orderInfo, raw),
        remark: remark,
        username: username,
        mobile: mobile,
        payStatus: pay_status,
        offlinePayName: offline_pay_name,
        offlinePayCheckStatus: offline_pay_check_status
      }
      draft.operatorInfo = operatorInfo
    })
  }

  const payTypeLabel = () => {
    const payTypeMap = {
      pos: $t('36c99ee5.330ef6'),
      wxpaypos: $t('36c99ee5.bffe28'),
      alipaypos: $t('36c99ee5.e3b206'),
      offline_pay: info?.offlinePayName
    }

    return payTypeMap[info.payType]
  }

  return (
    <SpPage
      className='page-dianwu-collection-result'
      renderFooter={
        <View
          className='btn-wrap'
          onClick={() => {
            Taro.redirectTo({ url: '/subpages/dianwu/index' })
          }}
        >
          <AtButton circle>{$t('36c99ee5.7a611d')}</AtButton>
        </View>
      }
    >
      {!info && (
        <View className='result-hd'>
          <Text>{$t('36c99ee5.c5f45d')}</Text>
        </View>
      )}

      {info && (
        <View>
          {info?.payStatus == 'NOTPAY' && pay_type != 'offline_pay' && (
            <View className='result-hd'>
              <Text>{$t('36c99ee5.c5f45d')}</Text>
            </View>
          )}
          {(info?.payStatus == 'PAYED' || pay_type == 'offline_pay') && (
            <View className='result-hd'>
              <View className='checkout-result'>
                {info?.payStatus == 'PAYED' && (
                  <>
                    <Text className='iconfont icon-correct'></Text>
                    <Text>{$t('36c99ee5.d08ebf')}</Text>
                  </>
                )}
                {pay_type == 'offline_pay' && info.offlinePayCheckStatus == 0 && (
                  <Text>{$t('36c99ee5.e92d29')}</Text>
                )}
              </View>
              {info.username && (
                <View className='user-info'>
                  <Text className='name'>{info.username}</Text>
                  <Text className='mobile'>{info.mobile}</Text>
                </View>
              )}
              {!info.username && (
                <View className='user-info'>
                  <Text className='name'>{$t('36c99ee5.5b47b2')}</Text>
                </View>
              )}
            </View>
          )}
          <View className='block-goods'>
            <View className='label-title'>{$t('edc703ce.08ea4e')}</View>
            <View className='goods-list'>
              {info.itemList.map((item, index) => (
                <View className='goods-item-wrapper' key={`goods-item-wrapper__${index}`}>
                  <View className='item-hd'>
                    <View className='goods-name'>{item.item_name}</View>
                    <View className='num'>{`x ${item.num}`}</View>
                  </View>
                  {item.item_spec_desc && (
                    <View className='sku'>{ti('c3455657.d0c997', [item.item_spec_desc])}</View>
                  )}
                </View>
              ))}
            </View>
            {info.giftList.length > 0 && (
              <View>
                <View className='label-title'>{$t('36c99ee5.d017cc')}</View>
                <View className='gift-list'>
                  {info.giftList.map((item, index) => (
                    <View className='gift-item-wrapper' key={`gift-item-wrapper__${index}`}>
                      <View className='item-hd'>
                        <View className='goods-name'>{item.item_name}</View>
                        <View className='num'>{`x ${item.num}`}</View>
                      </View>
                      {item.item_spec_desc && (
                        <View className='sku'>{ti('c3455657.d0c997', [item.item_spec_desc])}</View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View className='checkout-info'>
            <SpCell title={$t('36c99ee5.f431f7')} border>
              <SpPrice value={info.itemFee}></SpPrice>
            </SpCell>
            <SpCell title={$t('2b4b2b4f.7d9bcd')} border>
              <SpPrice value={`-${info.promotionDiscount}`}></SpPrice>
            </SpCell>
            <SpCell title={$t('2b4b2b4f.eababe')} border>
              <SpPrice value={`-${info.memberDiscount}`}></SpPrice>
            </SpCell>
            <SpCell title={$t('2b4b2b4f.ca66f9')} border>
              <SpPrice value={`-${info.couponDiscount}`}></SpPrice>
            </SpCell>
            {info.priceAdjustment > 0 && (
              <SpCell title={$t('36c99ee5.aa448f')} border>
                <SpPrice value={`-${info.priceAdjustment}`}></SpPrice>
              </SpCell>
            )}
            {/* <SpCell title='积分抵扣' border>
          <SpPrice value={-50}></SpPrice>
        </SpCell> */}
            <SpCell title={$t('36c99ee5.1e4973')}>
              <SpPrice value={info.totalFee}></SpPrice>
            </SpCell>
          </View>

          {(info?.payStatus == 'PAYED' || pay_type == 'offline_pay') && (
            <View className='extr-info'>
              <SpCell border title={$t('36c99ee5.2e8a41')} value={distributor?.name}></SpCell>
              <SpCell border title={$t('36c99ee5.f9ac4b')} value={operatorInfo?.username}></SpCell>
              <SpCell border title={$t('36c99ee5.0c9d2b')} value={payTypeLabel()}></SpCell>
              <SpCell
                border
                title={$t('36c99ee5.7e951d')}
                value={formatDateTime(info.createTime)}
              ></SpCell>
              <SpCell title={$t('36c99ee5.2432b5')} value={info.remark}></SpCell>
            </View>
          )}
        </View>
      )}
    </SpPage>
  )
}

DianwuCollectionResult.options = {
  addGlobalClass: true
}

export default DianwuCollectionResult
