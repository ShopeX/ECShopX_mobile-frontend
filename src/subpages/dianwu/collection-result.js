import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { formatDateTime } from '@/utils'
import { SpPage, SpImage, SpCell, SpPrice, SpButton } from '@/components'
import './collection-result.scss'

const initialState = {
  distributor: null,
  info: null,
  operatorInfo: null
}
function DianwuCollectionResult(props) {
  const $instance = getCurrentInstance()
  const { member } = useSelector((state) => state.dianwu)
  const { order_id, trade_id, pay_type } = $instance.router.params
  const [state, setState] = useImmer(initialState)
  const { distributor, info, operatorInfo } = state

  useEffect(() => {
    if (pay_type == 'pos') {
      fetchOrderInfo()
    } else {
      getPaymentResultByOrder()
    }
  }, [])

  // 查询支付状态
  const getPaymentResultByOrder = async () => {
    // msg: "支付中，请稍后再查询支付结果"
    // pay_type: "wxpaypos"
    // status: "USERPAYING"
    const { status } = await api.dianwu.getPaymentResultByOrder({
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
    const { distributor, orderInfo, operatorInfo } = await api.dianwu.getTradeDetail(order_id)
    const {
      items,
      pay_type,
      create_time,
      item_fee,
      discount_fee,
      total_fee,
      member_discount,
      coupon_discount,
      promotion_discount,
      remark,
      user_id,
      pay_status
    } = orderInfo
    const { username, mobile } = await api.dianwu.getMemberByUserId({ user_id })

    setState((draft) => {
      draft.distributor = distributor
      draft.info = {
        itemList: items.filter((item) => item.order_item_type == 'normal'),
        giftList: items.filter((item) => item.order_item_type == 'gift'),
        payType: pay_type,
        createTime: create_time,
        itemFee: item_fee / 100,
        discountFee: discount_fee / 100,
        totalFee: total_fee / 100,
        memberDiscount: member_discount ? member_discount / 100 : 0,
        couponDiscount: coupon_discount ? coupon_discount / 100 : 0,
        promotionDiscount: promotion_discount ? promotion_discount / 100 : 0,
        remark: remark,
        username: username,
        mobile: mobile,
        payStatus: pay_status
      }
      draft.operatorInfo = operatorInfo
    })
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
          <AtButton circle>返回工作台</AtButton>
        </View>
      }
    >
      {(!info || (info && info?.payStatus == 'NOTPAY')) && (
        <View className='result-hd'>
          <Text>等待支付中...</Text>
        </View>
      )}

      {info && info?.payStatus == 'PAYED' && (
        <View>
          <View className='result-hd'>
            <View className='checkout-result'>
              <Text className='iconfont icon-correct'></Text>收款成功
            </View>
            <View className='user-info'>
              <Text className='name'>{info.username}</Text>
              <Text className='mobile'>{info.mobile}</Text>
            </View>
            {/* <View className='vip'>
          等级：<Text className='vip-level'>白金会员</Text>
        </View> */}
          </View>
          <View className='block-goods'>
            <View className='label-title'>商品清单</View>
            <View className='goods-list'>
              {info.itemList.map((item, index) => (
                <View className='goods-item-wrapper' key={`goods-item-wrapper__${index}`}>
                  <View className='item-hd'>
                    <View className='goods-name'>{item.item_name}</View>
                    <View className='num'>{`x ${item.num}`}</View>
                  </View>
                  {item.item_spec_desc && <View className='sku'>规格：{item.item_spec_desc}</View>}
                </View>
              ))}
            </View>
            {info.giftList.length > 0 && (
              <View>
                <View className='label-title'>赠品</View>
                <View className='gift-list'>
                  {info.giftList.map((item, index) => (
                    <View className='gift-item-wrapper' key={`gift-item-wrapper__${index}`}>
                      <View className='item-hd'>
                        <View className='goods-name'>{item.item_name}</View>
                        <View className='num'>{`x ${item.num}`}</View>
                      </View>
                      {item.item_spec_desc && (
                        <View className='sku'>规格：{item.item_spec_desc}</View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View className='checkout-info'>
            <SpCell title='商品合计' border>
              <SpPrice value={info.itemFee}></SpPrice>
            </SpCell>
            <SpCell title='促销优惠' border>
              <SpPrice value={`-${info.promotionDiscount}`}></SpPrice>
            </SpCell>
            <SpCell title='会员折扣' border>
              <SpPrice value={`-${info.memberDiscount}`}></SpPrice>
            </SpCell>
            <SpCell title='券优惠' border>
              <SpPrice value={`-${info.couponDiscount}`}></SpPrice>
            </SpCell>
            {/* <SpCell title='积分抵扣' border>
          <SpPrice value={-50}></SpPrice>
        </SpCell> */}
            <SpCell title='实收'>
              <SpPrice value={info.totalFee}></SpPrice>
            </SpCell>
          </View>

          <View className='extr-info'>
            <SpCell border title='收款门店' value={distributor?.name}></SpCell>
            <SpCell border title='操作人' value={operatorInfo?.username}></SpCell>
            <SpCell
              border
              title='支付方式'
              value={
                {
                  'pos': '现金支付',
                  'wxpaypos': '微信支付',
                  'alipaypos': '支付宝支付'
                }[info.payType]
              }
            ></SpCell>
            <SpCell border title='操作时间' value={formatDateTime(info.createTime)}></SpCell>
            <SpCell title='备注' value={info.remark}></SpCell>
          </View>
        </View>
      )}
    </SpPage>
  )
}

DianwuCollectionResult.options = {
  addGlobalClass: true
}

export default DianwuCollectionResult
