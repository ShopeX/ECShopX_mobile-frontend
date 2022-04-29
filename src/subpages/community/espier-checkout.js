import React, { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage, SpPrice, AddressChoose, SpCell } from '@/components'
import { AtButton, AtInput } from 'taro-ui'
import { usePayment } from '@/hooks'
import qs from 'qs'
import { log, pickBy, showToast } from '@/utils'
import api from '@/api'
import doc from '@/doc'
import CompGoodsItemBuy from './comps/comp-goodsitembuy'

import './espier-checkout.scss'
import { useImmer } from 'use-immer'

const initialState = {
  info: null,
  activityInfo: null,
  extraFields: [],
  submitLoading: false
}

const EspierCheckout = () => {
  const $instance = getCurrentInstance()
  const { activity_id, items } = $instance.router.params
  const { address, chiefInfo, checkIsChief } = useSelector((state) => state.user)
  const { cashierPayment } = usePayment()
  const [state, setState] = useImmer(initialState)
  const { info, activityInfo, extraFields, submitLoading } = state
  console.log('chiefInfo:', chiefInfo)
  console.log('address:', address)
  log.debug(`activity_id: ${activity_id}`)
  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const goodsItems = JSON.parse(decodeURIComponent(items))
    const activityInfo = await api.community.getActiveDetail(activity_id)
    const { distributor_id, extra_data } = activityInfo
    const params = {
      order_type: 'normal_community',
      community_activity_id: activity_id,
      items: goodsItems,
      distributor_id,
      receipt_type: 'ziti'
    }
    const res = await api.cart.total(params)

    setState((draft) => {
      draft.info = pickBy(res, doc.community.COMMUNITY_CHECKOUT_RES)
      draft.activityInfo = activityInfo
      draft.extraFields = extra_data.map((item) => {
        return {
          ...item,
          field_value: ''
        }
      })
    })
  }

  const onInputChange = useCallback((index, value) => {
    const _extraFields = JSON.parse(JSON.stringify(extraFields))
    _extraFields[index].field_value = value
    console.log(JSON.stringify(_extraFields))
    setState((draft) => {
      draft.extraFields = _extraFields
    })
  })

  const handlePay = async () => {
    if (submitLoading) return
    const { address_id, username, telephone, province, city, county, adrdetail } = address || {}
    const goodsItems = items && JSON.parse(decodeURIComponent(items))
    const { ziti, distributor_id } = activityInfo
    if (!adrdetail) {
      showToast('请选择地址')
      return
    }
    const communityExtraData = {}
    extraFields.forEach((item) => {
      communityExtraData[item.field_name] = item.field_value
    })

    for (let key in communityExtraData) {
      if (!communityExtraData[key]) {
        showToast(`请输入${key}`)
        return
      }
    }
    setState((draft) => {
      draft.submitLoading = true
    })

    const params = {
      receipt_type: 'ziti',
      order_type: 'normal_community',
      distributor_id,
      community_ziti_id: ziti[0].ziti_id,
      community_activity_id: activity_id,
      receiver_name: username,
      receiver_mobile: telephone,
      receiver_state: province,
      receiver_city: city,
      receiver_district: county,
      receiver_address: adrdetail,
      pay_type: 'wxpay',
      items: goodsItems,
      community_extra_data: JSON.stringify(communityExtraData)
    }
    await api.trade
      .create(params)
      .then((orderInfo) => {
        cashierPayment(params, orderInfo)
      })
      .catch(() => {
        setState((draft) => {
          draft.submitLoading = false
        })
      })
  }

  const renderFooter = () => {
    return (
      <View className='espierCheckout-toolbar'>
        <View className='espierCheckout-toolbar__price'>
          实际支付：
          <SpPrice size={46} value={info?.totalFee} />
        </View>

        <AtButton
          circle
          type='primary'
          loading={submitLoading}
          className='espierCheckout-toolbar__button'
          onClick={handlePay}
        >
          立即支付
        </AtButton>
      </View>
    )
  }

  return (
    <SpPage className='page-community-checkout' renderFooter={renderFooter()}>
      <View className='espierCheckout'>
        <View className='espierCheckout-header'>
          <View className='espierCheckout-header__explain'>配送说明</View>
          <View>限制指定配送区域</View>
        </View>

        <View className='espierCheckout-address'>
          <View className='espierCheckout-address__title'>
            团长还希望你完成以下信息
            <Text className='espierCheckout-address__title-text'>（必填）</Text>
          </View>

          <View className='espierCheckout-address__info'>
            <AddressChoose isAddress={address} />
          </View>
        </View>

        {extraFields.length > 0 && (
          <View className='extra-block'>
            {extraFields.map((item, index) => (
              <SpCell border title={item.field_name} key={index}>
                {item.field_type == 'text' && (
                  <AtInput
                    name={item.field_name}
                    value={item.field_value}
                    placeholder={`请填写${item.field_name}`}
                    onChange={onInputChange.bind(this, index)}
                  >
                    {item.unit}
                  </AtInput>
                )}
              </SpCell>
            ))}
          </View>
        )}

        <View className='espierCheckout-goods'>
          {info?.items.map((item) => (
            <CompGoodsItemBuy info={item} hideInputNumber />
          ))}
        </View>

        <View className='espierCheckout-total'>
          <View className='espierCheckout-total__price'>
            <View className='espierCheckout-total__title'>商品总价</View>

            <SpPrice value={info?.totalFee} />
          </View>

          <View className='espierCheckout-total__payPrice'>
            <Text className='espierCheckout-total__payPrice-num'>共{info?.totalItemNum}件</Text>
            实际支付 <SpPrice value={info?.totalFee} />
          </View>
        </View>

        <View className='espierCheckout-remarks'>
          <AtInput
            name='value'
            title='备注'
            type='text'
            placeholder='请输入您需要备注的内容'
            border={false}
          />
        </View>
      </View>
    </SpPage>
  )
}

export default EspierCheckout
