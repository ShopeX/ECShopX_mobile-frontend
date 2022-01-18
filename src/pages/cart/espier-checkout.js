import React, { useEffect } from 'react'
import { AtButton, AtInput } from 'taro-ui'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { updateChooseAddress } from '@/store/slices/user'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import api from '@/api'
import doc from '@/doc'
import { isObjectsValue, isWeixin, pickBy } from '@/utils'
import { SpPage, SpPrice, SpCell, SpOrderItem } from '@/components'

import { initialState } from './const'

import CompDeliver from './comps/comp-deliver'
import CompSelectPackage from './comps/comp-selectpackage'
import CompPaymentPicker from './comps/comp-paymentpicker'

import './espier-checkout.scss'

function CartCheckout (props) {
  const {
    type,
    goodType,
    order_type,
    shop_id: distributor_id,
    cart_type,
    seckill_id = null,
    ticket = null,
    pay_type
  } = getCurrentInstance().router.params

  const [state, setState] = useImmer(initialState)
  const dispatch = useDispatch()
  // dispatch(changeZitiStore())

  const { location = {}, address } = useSelector((state) => state.user)
  const { rgb, pointName } = useSelector((state) => state.sys)
  const { coupon, zitiShop } = useSelector((state) => state.cart)

  const {
    detailInfo = {},
    payType,
    submitLoading,
    btnIsDisabled,
    isPointitemGood,
    totalInfo = {},
    shoppingGuideData,
    receiptType,
    currentStoreInfo = {},
    headquartersStoreInfo = {},
    invoiceTitle,
    packInfo = {},
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
    fetchZiTiShop()
    fetchAddress()
    fetchHeaderShop()
  }, [])

  const fetchHeaderShop = async () => {
    const headquartersStoreInfo = await api.shop.getHeadquarters({ distributor_id })
    setState((draft) => {
      draft.headquartersStoreInfo = { ...headquartersStoreInfo, is_current: distributor_id == 0 }
    })
  }

  const fetchZiTiShop = async () => {
    const shopInfo = await api.shop.getShop({ distributor_id })
    setState((draft) => {
      ;(draft.currentStoreInfo = shopInfo),
        (draft.receiptType = shopInfo.is_delivery || distributor_id == 0 ? 'logistics' : 'ziti')
      // express: shopInfo.is_delivery
    })
  }

  const fetchAddress = async (type) => {
    let query = {
      receipt_type: type
    }
    if (type === 'dada') {
      query.city = headquartersStoreInfo.is_current ? headquartersStoreInfo.city : currentStore.city
    }
    const { list: address_list } = await api.member.addressList(query)
    if (address_list.length == 0) {
      await dispatch(updateChooseAddress({}))
      calcOrder()
      return
    }

    let update_address = null
    let addressFilterList = address_list.filter((item) => item.is_def)
    update_address = addressFilterList[0] || address_list[0] || {}
    await dispatch(updateChooseAddress(update_address))

    if (update_address) {
      calcOrder()
    }
  }

  const transformCartList = (list) => {
    return pickBy(list, doc.checkout)
  }

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
    console.log('提交按钮', isObjectsValue(shoppingGuideData), shoppingGuideData)
  }

  const handleSwitchExpress = (receiptType) => {
    // 切换配送模式
    // Taro.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    setState((draft) => {
      draft.receiptType = receiptType
      // draft.express = receiptType !== 'ziti'
    })
    if (receiptType !== 'ziti') {
      dispatch(updateChooseAddress(null))
      fetchAddress(receiptType)
    } else {
      calcOrder()
    }
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
      draft.channel = channel
    })
  }

  const handleRemarkChange = (val) => {
    console.log(val, '---')
  }

  const calcOrder = () => {
    console.log('结算啦')
    Taro.hideLoading()
  }

  const goodsComp = () => {
    return (
      <View className='cart-list'>
        {detailInfo.cart &&
          detailInfo.cart.map((cart) => {
            return (
              <View className='cart-checkout__group' key={cart.shop_id}>
                <View className='cart-group__cont'>
                  {/* <View className='order-item__idx'>商品清单（{cart.list.length}）</View> */}
                  {cart.list.map((item, idx) => {
                    return (
                      <View className='order-item__wrap' key={item.item_id}>
                        {item.order_item_type === 'gift' ? (
                          <View className='order-item__idx'>
                            <Text>赠品</Text>
                          </View>
                        ) : (
                          <View className='order-item__idx national'>
                            <Text>第{idx + 1}件商品</Text>
                          </View>
                        )}
                        <SpOrderItem
                          info={item}
                          showExtra={false}
                          showDesc
                          isPointitemGood={isPointitemGood}
                          renderDesc={
                            <View className='order-item__desc'>
                              {item.discount_info &&
                                item.order_item_type !== 'gift' &&
                                item.discount_info.map((discount) => (
                                  <Text className='order-item__discount' key={discount.type}>
                                    {discount.info}
                                  </Text>
                                ))}
                            </View>
                          }
                          customFooter
                          renderFooter={
                            <View className='order-item__ft'>
                              {isPointitemGood ? (
                                <SpPrice
                                  className='order-item__price'
                                  appendText={pointName}
                                  noSymbol
                                  noDecimal
                                  value={item.item_point}
                                />
                              ) : (
                                <SpPrice className='order-item__price' value={item.price || 1000} />
                              )}
                              <Text className='order-item__num'>x {item.num || 1}</Text>
                            </View>
                          }
                        />
                      </View>
                    )
                  })}
                </View>
                <View className='cart-group__cont cus-input'>
                  <SpCell className='trade-remark' border={false}>
                    <AtInput
                      className='trade-remark__input'
                      placeholder='给商家留言：选填（50字以内）'
                      onChange={handleRemarkChange.bind(this)}
                      maxLength={50}
                    />
                  </SpCell>
                </View>
              </View>
            )
          })}
      </View>
    )
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
                {totalInfo.freight_fee != 0 &&
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
          disabled={!isObjectsValue(address)}
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

  // console.log(headquartersStoreInfo, currentStoreInfo)

  return (
    <SpPage className='page-cart-checkout' renderFooter={renderFooter()}>
      {isObjectsValue(shoppingGuideData) && (
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
      {goodsComp()}
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

      {!isPointitemGood && (
        <View className='cart-checkout__total'>
          <SpCell className='trade-sub__item' title='商品金额：'>
            <SpPrice unit='cent' value={totalInfo.item_fee} />
          </SpCell>
          <SpCell className='trade-sub__item' title='优惠金额：'>
            <SpPrice unit='cent' primary value={totalInfo.discount_fee} />
          </SpCell>
          <SpCell className='trade-sub__item' title='运费：'>
            <SpPrice unit='cent' value={totalInfo.freight_fee} />
          </SpCell>
        </View>
      )}
    </SpPage>
  )
}

CartCheckout.options = {
  addGlobalClass: true
}
export default CartCheckout
