/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpGoodsCell, SpPrice, SpCell, SpPoster } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import { pickBy } from '@/utils'
import doc from '@/doc'
import api from '@/api'
import './espier-checkout.scss'

const initialState = {
  list: [],
  itemFee: 0,
  discountFee: 0,
  cartTotalNum: 0,
  totalFee: 0,
  posterModalOpen: false,
  salesPromotionId: ''
}
function EspierCheckout(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { list, itemFee, discountFee, cartTotalNum, totalFee, posterModalOpen } = state
  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { order_id } = getCurrentInstance()?.router?.params

    // const track = Taro.getStorageSync('trackParams')

    // let source_id = 0,
    //   monitor_id = 0
    // if (track) {
    //   source_id = track.source_id
    //   monitor_id = track.monitor_id
    // }

    const params = {
      order_id
    }
    const { valid_cart } = await api.guide.salesPromotion(params)
    if (valid_cart) {
      const { list, item_fee, discount_fee, cart_total_num, total_fee, sales_promotion_id } =
        valid_cart[0]
      console.log(pickBy(list, doc.checkout.GUIDE_CHECKOUT_GOODSITEM))
      setState((draft) => {
        draft.list = pickBy(list, doc.checkout.GUIDE_CHECKOUT_GOODSITEM)
        draft.itemFee = item_fee / 100
        draft.discountFee = discount_fee / 100
        draft.cartTotalNum = cart_total_num
        draft.totalFee = total_fee / 100
        draft.salesPromotionId = sales_promotion_id
      })
    }
  }

  return (
    <SpPage
      className='page-guide-cart-espiercheckout'
      renderFooter={
        <View className='checkout-toolbar'>
          <View className='toolbar-info'>
            <View className='total-num'>{ti('a0f401f3.59594a', [cartTotalNum])}</View>
            <View className='total-info'>
              <View>
                {$t('a0f401f3.25ff10')}
                <SpPrice value={totalFee} />
              </View>
              <View className='desc-txt'>{$t('a0f401f3.235a66')}</View>
            </View>
          </View>
          <View className='checkout-btn'>
            <AtButton
              circle
              type='primary'
              onClick={() => {
                setState((draft) => {
                  draft.posterModalOpen = true
                })
              }}
            >
              {$t('a0f401f3.91fafb')}
            </AtButton>
          </View>
        </View>
      }
    >
      <View className='list-wrap'>
        {list.map((item, index) => (
          <View className='item-wrap' key={`item-wrap__${index}`}>
            <View className='checkitem-hd'>{ti('a0f401f3.193df8', [index + 1])}</View>
            <View className='checkitem-bd'>
              <SpGoodsCell info={item} />
            </View>
          </View>
        ))}
      </View>

      <View className='checkout-info'>
        <SpCell title={$t('a0f401f3.cbff02')}>
          <SpPrice value={itemFee} />
        </SpCell>
        <SpCell title={$t('a0f401f3.5b921a')}>
          <SpPrice value={0 - discountFee} />
        </SpCell>
        {/* <SpCell title='运费优惠'></SpCell>
        <SpCell title='运费'></SpCell> */}
      </View>

      {/* <SpCell className='trade-sub-total__item' title='商品金额：'>
              <Price unit='cent' value={total.item_fee} />
            </SpCell>

            <SpCell className='trade-sub-total__item' title='优惠金额：'>
              <Price unit='cent' value={total.discount_fee} />
            </SpCell>
            {total.freight_discount && (
              <SpCell className='trade-sub-total__item' title='运费优惠：'>
                <Price unit='cent' value={total.freight_discount} />
              </SpCell>
            )}

            <SpCell className='trade-sub-total__item' title='运费：'>
              <Price unit='cent' value={total.freight_fee} />
            </SpCell> */}

      {/* 海报 */}
      {posterModalOpen && (
        <SpPoster
          info={{
            ...state
          }}
          type='guideCheckout'
          onClose={() => {
            setState((draft) => {
              draft.posterModalOpen = false
            })
          }}
        />
      )}
    </SpPage>
  )
}

EspierCheckout.options = {
  addGlobalClass: true
}

export default EspierCheckout
