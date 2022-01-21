import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton, AtInput } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpPage, SpPrice, SpCell, SpOrderItem } from '@/components'
import { View, Text } from '@tarojs/components'
import { changeCoupon } from '@/store/slices/cart'
import { updateChooseAddress } from '@/store/slices/user'
import { isObjectsValue, isWeixin, pickBy, authSetting } from '@/utils'
import _cloneDeep from 'lodash/cloneDeep'
import api from '@/api'
import doc from '@/doc'

import { initialState } from './const'

import CompDeliver from './comps/comp-deliver'
import CompSelectPackage from './comps/comp-selectpackage'
import CompPaymentPicker from './comps/comp-paymentpicker'

import './espier-checkout.scss'

function CartCheckout (props) {
  const $instance = getCurrentInstance()
  const {
    type,
    order_type = 'normal',
    shop_id: distributor_id,
    cart_type,
    seckill_id = null,
    seckill_ticket = null,
    pay_type,
    source, // 不知道什么情况下会存在值
    bargain_id
  } = $instance.router?.params || {}

  const [state, setState] = useImmer(initialState)

  const dispatch = useDispatch()
  const { address } = useSelector((state) => state.user)
  const { pointName } = useSelector((state) => state.sys)
  const { coupon } = useSelector((state) => state.cart)

  const {
    detailInfo,
    payType,
    submitLoading,
    btnIsDisabled,
    isPointitemGood,
    totalInfo,
    shoppingGuideData,
    receiptType,
    distributorInfo,
    invoiceTitle,
    packInfo,
    isNeedPackage,
    disabledPayment,
    paramsInfo,
    discountInfo,
    couponInfo
  } = state

  useEffect(() => {
    setState((draft) => {
      draft.isPointitemGood = type === 'pointitem'
    })
  }, [isPointitemGood])

  useEffect(() => {
    getTradeSetting()
    return () => {
      dispatch(changeCoupon()) // 清空优惠券信息
      dispatch(updateChooseAddress()) // 清空地址信息
    }
  }, [])

  useEffect(() => {
    calcOrder()
  }, [address, coupon])

  const transformCartList = (list) => {
    return pickBy(list, doc.checkout.CHECKOUT_GOODS_ITEM)
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

  const handleSwitchExpress = ({ receipt_type, distributorInfo }) => {
    // 切换配送模式
    setState((draft) => {
      ;(draft.receiptType = receipt_type), (draft.distributorInfo = distributorInfo)
    })
  }

  const handleInvoiceClick = () => {
    // 开发票
    authSetting('invoiceTitle', async () => {
      const res = await Taro.chooseInvoiceTitle()
      if (res.errMsg === 'chooseInvoiceTitle:ok') {
        const {
          type,
          content,
          company_address,
          bankname,
          bankaccount,
          company_phone,
          registration_number
        } = pickBy(res, doc.checkout.INVOICE_TITLE)

        let params_info = {
          invoice_type: 'normal',
          invoice_content: {
            title: type == 0 ? 'unit' : 'individual',
            content,
            company_address,
            registration_number,
            bankname,
            bankaccount,
            company_phone
          }
        }
        setState((draft) => {
          ;(draft.invoiceTitle = content), (draft.paramsInfo = { ...paramsInfo, ...params_info })
        })
      }
    })
  }

  const resetInvoice = (e) => {
    e.stopPropagation()
    setState((draft) => {
      draft.invoiceTitle = ''
      draft.paramsInfo = { ...paramsInfo, invoice_type: '', invoice_content: {} }
    })
  }

  const handleCouponsClick = async () => {
    let items_filter = discountInfo.filter((item) => item.order_item_type !== 'gift')
    items_filter = items_filter.map((item) => {
      const { item_id, num, total_fee: price } = item
      return {
        item_id,
        num,
        price
      }
    })
    let cus_item = JSON.stringify(items_filter)
    dispatch(changeCoupon(couponInfo))
    Taro.navigateTo({
      url: `/others/pages/cart/coupon-picker?items=${cus_item}&is_checkout=true&cart_type=${cart_type}&distributor_id=${distributor_id}` // &source=${source}不确定要不要传
    })
  }

  const handlePaymentChange = async (payType, channel) => {
    setState((draft) => {
      draft.payType = payType
      draft.channel = channel
    })
  }

  const handleRemarkChange = (val) => {
    setState((draft) => {
      draft.paramsInfo = { ...paramsInfo, remark: val }
    })
  }

  const calcOrder = async () => {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    const cus_parmas = getParamsInfo()
    let data
    try {
      data = await api.cart.total({ ...cus_parmas })
    } catch (e) {
      console.log(e)
      debugger
      if (e.res.data.data.status_code === 422) {
        setTimeout(() => {
          Taro.navigateBack()
        }, 1000)
      }
    }
    Taro.hideLoading()

    if (!data) return

    const {
      items,
      item_fee,
      // item_point,
      totalItemNum: items_count,
      member_discount = 0,
      coupon_discount = 0,
      discount_fee,
      freight_fee = 0,
      coupon_info = {},
      total_fee,
      invoice_status,
      // 额外提示信息
      extraTips = ''
      // freight_type,
      // freight_point = 0,
      // point = 0,
      // remainpt, // 总积分
      // deduction,
      // third_params,
      // taxable_fee,
      // total_tax,
      // point_fee = 0,
      // point_use,
      // user_point = 0,
      // max_point = 0,
      // is_open_deduct_point,
      // deduct_point_rule,
      // real_use_point,
    } = data

    if (isObjectsValue(coupon_info)) {
      setState((draft) => {
        draft.couponInfo = {
          type: 'coupon',
          not_use_coupon: coupon_info.coupon_code ? 0 : 1,
          value: {
            title: coupon_info.info,
            card_id: coupon_info.id,
            code: coupon_info.coupon_code,
            discount: coupon_info.discount_fee
          }
        }
      })
    }

    const total = {
      ...totalInfo,
      item_fee,
      discount_fee,
      member_discount,
      coupon_discount,
      freight_fee,
      total_fee,
      items_count,
      invoice_status // 是否开启开发票
      // taxable_fee,
      // total_tax,
      // point,
      // freight_point,
      // remainpt, // 总积分
      // deduction, // 抵扣
      // point_fee: point_fee, //积分抵扣金额,
      // item_point,
      // freight_type
    }
    let info = detailInfo
    if (items.length > 0) {
      info = [
        {
          list: transformCartList(items)
        }
      ]
      setState((draft) => {
        draft.discountInfo = transformCartList(items)
      })
    }

    Taro.hideLoading()

    setState((draft) => {
      ;(draft.totalInfo = total),
        (draft.detailInfo = info),
        (draft.paramsInfo = { ...paramsInfo, ...cus_parmas })
    })
    if (extraTips) {
      Taro.showModal({
        content: extraTips,
        confirmText: '知道了',
        showCancel: false
      })
    }
  }

  const getParamsInfo = () => {
    let receiver = pickBy(address, doc.checkout.RECEIVER_ADDRESS)
    if (receiptType === 'ziti') {
      receiver = pickBy({}, doc.checkout.RECEIVER_ADDRESS)
    }

    let cus_parmas = {
      ...paramsInfo,
      ...receiver,
      receipt_type: receiptType,
      distributor_id,
      cart_type,
      order_type: bargain_id ? 'bargain' : order_type,
      promotion: 'normal',
      member_discount: 0,
      coupon_discount: 0,
      not_use_coupon: 0
    }

    if (coupon) {
      const { not_use_coupon, type, value } = coupon
      cus_parmas.not_use_coupon = not_use_coupon
      cus_parmas.coupon_discount = type === 'coupon' && value.code ? value.code : undefined
      cus_parmas.member_discount = type === 'member' && value ? 1 : 0
    }

    cus_parmas.pack = packInfo
    cus_parmas.bargain_id = bargain_id || undefined

    return cus_parmas
  }

  const goodsComp = () => {
    return (
      <View className='cart-list'>
        {detailInfo.map((cart) => {
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
                            <SpPrice
                              unit='cent'
                              className='order-item__price'
                              value={item.price || 100}
                            />
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
          <SpPrice unit='cent' className='primary-price' value={totalInfo.total_fee} />
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

  const couponText =
    couponInfo.type === 'member'
      ? '会员折扣'
      : couponInfo?.not_use_coupon == 0
      ? couponInfo?.value?.title
      : ''

  return (
    <SpPage className='page-cart-checkout' renderFooter={renderFooter()}>
      {isObjectsValue(shoppingGuideData) && (
        <View className='shopping-guide__header'>
          此订单商品来自“{shoppingGuideData.store_name}”导购“ {shoppingGuideData.name}”的推荐
        </View>
      )}
      <View className='cart-checkout__address'>
        <CompDeliver
          distributor_id={distributor_id}
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
