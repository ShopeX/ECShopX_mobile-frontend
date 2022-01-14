import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { SpPage, SpPrice, SpCell, AddressChoose } from '@/components'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import api from '@/api'
import { isObjEmpty, isWeixin } from '@/utils'

import CompDeliver from './comps/comp-deliver'
import CompSelectPackage from './comps/comp-selectpackage'
import CompPaymentPicker from './comps/comp-paymentpicker'

import './espier-checkout.scss'

const initialState = {
  detailInfo: {},
  submitLoading: false,
  btnIsDisabled: false,
  addressList: [],
  receiptType: 'logistics', // 收货方式：ziti自提  logistics快递
  payType: '', // wxpay 微信支付 point 积分支付 deposit 储值支付
  isPointitemGood: false, // 是否为积分商城的商品
  shoppingGuideData: {}, //代客下单导购信息
  totalInfo: {
    items_count: '', // 商品总件数
    total_fee: '0.00', // 商品总计
    item_fee: '', // 商品金额
    freight_fee: '', // 运费
    member_discount: '', // 会员折扣
    coupon_discount: '', // 优惠券折扣
    point: '', // 积分
    point_fee: '', // 积分抵扣
    freight_type: '', // 运费
    invoice_status: true // 是否需要开发票
  },
  currentStoreInfo: {}, // 当前店铺信息
  headquartersStoreInfo: {}, // 总店自提门店信息
  invoiceTitle: '', // 发票抬头
  isNeedPackage: false, // 是否需要打包
  packInfo: {}, // 打包信息
  disabledPayment: {} // 是否禁用支付
}

function CartCheckout (props) {
  const { type, goodType } = getCurrentInstance().router.params

  const [state, setState] = useImmer(initialState)

  const { location = {}, address } = useSelector((state) => state.user)
  const { rgb, pointName } = useSelector((state) => state.sys)
  const { coupon } = useSelector((state) => state.cart)

  const {
    payType,
    submitLoading,
    btnIsDisabled,
    isPointitemGood,
    totalInfo,
    shoppingGuideData,
    receiptType,
    currentStoreInfo,
    headquartersStoreInfo,
    invoiceTitle,
    packInfo,
    isNeedPackage,
    disabledPayment
  } = state

  useEffect(() => {
    setState((draft) => {
      draft.isPointitemGood = type === 'pointitem'
    })
  }, [isPointitemGood])

  useEffect(() => {
    getTradeSetting()
  }, [])

  const getTradeSetting = async () => {
    let data = await api.trade.tradeSetting()
    setState((draft) => {
      draft.packInfo = data
    })
  }

  // 选择是否需要包装
  const changeNeedPackage = (isChecked) => {
    setState((draft) => {
      draft.isNeedPackage = isChecked
    })
  }

  const onSubmitPayChange = () => {
    // 提交订单按钮
    console.log('提交按钮', isObjEmpty(shoppingGuideData))
  }

  const handleSwitchExpress = (receiptType) => {
    // 切换配送模式
    // Taro.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    setState((draft) => {
      draft.receiptType = receiptType
    })
  }

  const handleInvoiceClick = () => {
    console.log('开发票')
  }

  const resetInvoice = (e) => {
    console.log(e, 'e')
  }

  const handleCouponsClick = () => {
    console.log('优惠券')
  }

  const handlePaymentChange = async (payType, channel) => {
    setState((draft) => {
      draft.payType = payType
    })
  }

  const renderFooter = () => {
    return (
      <View className='checkout-toolbar'>
        <View className='checkout-toolbar__total'>
          共<Text>{totalInfo.items_count}</Text>
          件商品　总计:
          {payType !== 'point' && !isPointitemGood ? (
            <SpPrice unit='cent' className='primary-price' value={totalInfo.total_fee} />
          ) : (
            totalInfo.point && (
              <View class='checkout-toolbar__price'>
                <SpPrice
                  className='order-item__price'
                  appendText={pointName}
                  noSymbol
                  noDecimal
                  value={totalInfo.point}
                />
                {!totalInfo.freight_fee == 0 &&
                  totalInfo.freight_type === 'cash' &&
                  isPointitemGood && (
                    <SpPrice
                      unit='cent'
                      plus
                      value={totalInfo.freight_fee}
                      className='order-item__plus'
                    />
                  )}
              </View>
            )
          )}
        </View>
        <AtButton
          type='primary'
          className='checkout-toolbar__btn'
          customStyle='background: var(--color-primary); border-color: var(--color-primary)'
          loading={submitLoading}
          disabled={btnIsDisabled}
          onClick={onSubmitPayChange}
        >
          提交订单
        </AtButton>
      </View>
    )
  }

  const couponText = !coupon
    ? ''
    : coupon.type === 'member'
    ? '会员折扣'
    : (coupon.value && coupon.value.title) || ''

  return (
    <SpPage className='page-cart-checkout' renderFooter={renderFooter()}>
      {isObjEmpty(shoppingGuideData) && (
        <View className='shopping-guide__header'>
          此订单商品来自“{shoppingGuideData.store_name}”导购“ {shoppingGuideData.name}”的推荐
        </View>
      )}
      <View className='cart-checkout__address'>
        <CompDeliver
          receiptType={receiptType}
          currentStore={currentStoreInfo}
          headquartersStore={headquartersStoreInfo}
          address={address}
          onChangReceiptType={handleSwitchExpress}
        />
      </View>
      {isWeixin && !isPointitemGood && totalInfo.invoice_status && (
        <SpCell
          isLink
          title='开发票'
          className='cart-checkout__invoice'
          onClick={handleInvoiceClick}
        >
          <View className='invoice-title'>
            {invoiceTitle && (
              <View onClick={(e) => resetInvoice(e)} className='icon-close invoice-close' />
            )}
            {invoiceTitle || '否'}
          </View>
        </SpCell>
      )}
      {type !== 'group' && type !== 'seckill' && !isPointitemGood && (
        <SpCell
          isLink
          className='cart-checkout__coupons'
          title='优惠券'
          onClick={handleCouponsClick}
          value={couponText || '请选择'}
        />
      )}
      {packInfo.is_open && (
        <View className='cart-checkout__pack'>
          <CompSelectPackage
            isPointitemGood={isPointitemGood}
            isChecked={isNeedPackage}
            onHanleChange={changeNeedPackage}
            packInfo={packInfo}
          />
        </View>
      )}

      <View className='cart-checkout__pay'>
        <CompPaymentPicker
          isPointitemGood={isPointitemGood}
          type={payType}
          disabledPayment={disabledPayment}
          onChange={handlePaymentChange}
        />
      </View>
    </SpPage>
  )
}

CartCheckout.options = {
  addGlobalClass: true
}
export default CartCheckout
