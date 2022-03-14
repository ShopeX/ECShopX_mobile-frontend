import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton, AtInput } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpPage, SpPrice, SpCell, SpOrderItem } from '@/components'
import { View, Text } from '@tarojs/components'
import { changeCoupon } from '@/store/slices/cart'
import { updateChooseAddress } from '@/store/slices/user'
import {
  isObjectsValue,
  isWeixin,
  pickBy,
  authSetting,
  merchantIsvaild,
  showToast,
  isWeb,
  redirectUrl,
  VERSION_STANDARD
} from '@/utils'
import { useAsyncCallback } from '@/hooks'
import { PAYTYPE } from '@/consts'
import _cloneDeep from 'lodash/cloneDeep'
import api from '@/api'
import doc from '@/doc'
import S from '@/spx'

import { initialState } from './const'

import CompDeliver from './comps/comp-deliver'
import CompSelectPackage from './comps/comp-selectpackage'
import CompPaymentPicker from './comps/comp-paymentpicker'
import PointUse from './comps/point-use'

import './espier-checkout.scss'

function CartCheckout(props) {
  const $instance = getCurrentInstance()
  const {
    type,
    order_type = 'normal',
    shop_id: dtid,
    cart_type,
    seckill_id = null,
    ticket: seckill_ticket,
    pay_type,
    bargain_id, // 砍价活动id
    team_id,
    group_id, // 团购id
    source,
    scene // 情景值
  } = $instance.router?.params || {}

  const [state, setState] = useAsyncCallback(initialState)

  const dispatch = useDispatch()
  const { address } = useSelector((state) => state.user)
  const { pointName } = useSelector((state) => state.sys)
  const { coupon } = useSelector((state) => state.cart)
  const shop = useSelector((state) => state.shop)

  const {
    detailInfo,
    payType,
    payChannel,
    submitLoading,
    isPointitemGood,
    totalInfo,
    shoppingGuideData,
    receiptType,
    // distributorInfo,
    invoiceTitle,
    packInfo,
    isNeedPackage,
    disabledPayment,
    paramsInfo,
    couponInfo,
    remark,
    defalutPaytype,
    isPointOpenModal,
    point_use,
    pointInfo
  } = state

  useEffect(() => {
    setState((draft) => {
      draft.isPointitemGood = type === 'pointitem'
    })
  }, [isPointitemGood])

  useEffect(() => {
    getTradeSetting()
    // tode 此处应有埋点
    return () => {
      dispatch(changeCoupon()) // 清空优惠券信息
      dispatch(updateChooseAddress(null)) // 清空地址信息
    }
  }, [])

  useEffect(() => {
    if (!S.getAuthToken()) {
      let source = ''
      if (scene) {
        source = 'other_pay'
      }
      Taro.redirectTo({
        url: `/subpage/pages/auth/wxauth?source=${source}&scene=${scene}`
      })
      return
    }
    calcOrder()
  }, [address, coupon, payType])

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

  const handlePointClick = () => {
    setState((draft) => {
      draft.isPointOpenModal = true
    })
  }

  const resetPoint = (e) => {
    e.stopPropagation()
    setState((draft) => {
      draft.point_use = 0
      ;(draft.pointInfo = { ...pointInfo, point_use: 0 }), (draft.payType = defalutPaytype)
    })
  }

  const handlePointUseChange = (point_use, payType) => {
    setState((draft) => {
      draft.point_use = point_use
      ;(draft.payType = payType), (draft.isPointOpenModal = false)
    })
  }

  const onSubmitPayChange = async () => {
    if (submitLoading) return
    let isValid = await merchantIsvaild({ distributor_id: dtid }) // 判断当前店铺关联商户是否被禁用 isVaild：true有效
    if (!isValid) {
      showToast('该商品已下架')
      return
    }
    setState(
      (draft) => {
        draft.submitLoading = true
      },
      ({ submitLoading }) => {
        console.log('提交按钮', getParamsInfo(submitLoading))
        if (isWeixin) {
          let templeparams = {
            temp_name: 'yykweishop',
            source_type: receiptType === 'logistics' ? 'logistics_order' : 'ziti_order'
          }
          api.user.newWxaMsgTmpl(templeparams).then((tmlres) => {
            if (tmlres.template_id && tmlres.template_id.length > 0) {
              wx.requestSubscribeMessage({
                tmplIds: tmlres.template_id,
                success() {
                  handlePay()
                },
                fail() {
                  handlePay()
                }
              })
            } else {
              handlePay()
            }
          })
        } else {
          handlePay()
        }
      }
    )
  }

  const handlePay = async () => {
    if (payType === 'point' || payType === 'deposit') {
      try {
        const content =
          payType === 'point'
            ? `确认使用${totalInfo.point}${pointName}全额抵扣商品总价吗`
            : '确认使用余额支付吗？'
        const { confirm } = await Taro.showModal({
          title: payType === 'point' ? `${pointName}支付` : '余额支付',
          content,
          confirmColor: '#0b4137',
          confirmText: '确认使用',
          cancelText: '取消'
        })
        if (!confirm) {
          setState((draft) => {
            draft.submitLoading = false
          })
          return
        }
      } catch (e) {
        setState((draft) => {
          draft.submitLoading = false
        })
        return
      }
    }
    Taro.showLoading({
      title: '正在提交',
      mask: true
    })
    let urlLink = ''
    let redirectPath = ''
    let order_id = ''
    let res_info = {}
    let payErr = ''
    try {
      let params = getParamsInfo()
      if (payType === 'point') {
        // 积分不开票
        delete params.invoice_type
        delete params.invoice_content
        delete params.point_use
      }
      if (isWeb && payType !== 'point' && payType !== 'deposit') {
        res_info = await api.trade.h5create({
          ...params,
          pay_type: payType === PAYTYPE.ALIH5 ? PAYTYPE.ALIH5 : 'wxpay'
        })
        redirectPath = `/subpage/pages/cashier/index?order_id=${res_info.order_id}`
        if (payType === PAYTYPE.WXH5 || payType === PAYTYPE.ALIH5) {
          redirectPath += `&pay_type=${payType}`
        }
        redirectUrl(api, redirectPath)
        return
      } else {
        res_info = await api.trade.create(params)
        order_id = res_info.trade_info.order_id
      }
      // tode 应该有埋点
    } catch (e) {
      Taro.showToast({
        title: e.message,
        icon: 'none',
        mask: true
      })
      payErr = e
      resolvePayError(e)
    }

    Taro.hideLoading()
    if (!order_id) return

    setState((draft) => {
      draft.submitLoading = false
    })

    payErr = null
    let payRes
    try {
      if (res_info.package) {
        // tode 埋点
        console.log('我需要支付')
        payRes = await Taro.requestPayment(res_info)
      }
      if (!payRes.result) {
        urlLink = `/subpage/pages/trade/detail?id=${order_id}`
      }
    } catch (e) {
      console.log('我发生错误', e)
    }

    if (!payErr) {
      // 此处调取有数的api
      await Taro.showToast({
        title: '支付成功',
        icon: 'success'
      })
      if (type === 'group') {
        urlLink = `/marketing/pages/item/group-detail?team_id=${res_info.team_id}`
      }
    }

    if (payErr?.errMsg.indexOf('fail cancel') >= 0) {
      // tode 取消埋点
      urlLink = `/subpage/pages/trade/detail?id=${order_id}`
    }

    if (urlLink) {
      Taro.redirectTo({
        url: urlLink
      })
    }
    console.log(res_info, order_id, '支付订单啊啊啊啊')
  }

  const resolvePayError = (e) => {
    if (payType === 'point' || payType === 'deposit') {
      const disabledPaymentMes = {}
      disabledPaymentMes[payType] = e.message
      if (payType === 'deposit' && e.message === '当前余额不足以支付本次订单费用，请充值！') {
        Taro.hideLoading()
        Taro.showModal({
          content: e.message,
          confirmText: '去充值',
          success: (res) => {
            if (res.confirm) {
              Taro.redirectTo({
                url: '/others/pages/recharge/index'
              })
            } else {
              setState((draft) => {
                draft.disabledPayment = { ...disabledPayment, ...disabledPaymentMes }
                draft.payType = defalutPaytype
              })
            }
          }
        })
        return
      }
      setState((draft) => {
        draft.disabledPayment = { ...disabledPayment, ...disabledPaymentMes }
        draft.payType = ''
      })
    }
    if (e.res.data.data.status_code === 422) {
      setTimeout(() => {
        Taro.navigateBack()
      }, 500)
    }
    setState((draft) => {
      draft.submitLoading = false
    })
  }

  const handleSwitchExpress = ({ receipt_type, distributorInfo }) => {
    // 切换配送模式
    setState((draft) => {
      draft.receiptType = receipt_type
      draft.distributorInfo = distributorInfo
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

        let invoice_parmas = {
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
          draft.invoiceTitle = content
          draft.paramsInfo = { ...paramsInfo, ...invoice_parmas }
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
    const { cart_type, shop_id: id } = paramsInfo
    let items_filter = detailInfo.filter((item) => item.order_item_type !== 'gift')
    items_filter = items_filter.map((item) => {
      const { item_id, num, total_fee: price } = item
      return {
        item_id,
        num,
        price
      }
    })
    let cus_item = JSON.stringify(items_filter)
    Taro.navigateTo({
      url: `/others/pages/cart/coupon-picker?items=${cus_item}&is_checkout=true&cart_type=${cart_type}&distributor_id=${
        dtid || id
      }&source=${source}`
    })
    dispatch(changeCoupon(couponInfo))
  }

  const handlePaymentChange = async (payType, payChannel) => {
    console.log(payType, payChannel)
    setState((draft) => {
      draft.payType = payType
      draft.payChannel = payChannel
      draft.point_use = 0
    })
  }

  const handleRemarkChange = (val) => {
    // 商家留言
    setState((draft) => {
      draft.remark = val
    })
  }

  const calcOrder = async () => {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    const cus_parmas = await getParamsInfo()

    // let salesperson_id = Taro.getStorageSync('s_smid')
    // if (salesperson_id) {
    //   cus_parmas.salesperson_id = salesperson_id
    //   cus_parmas.distributor_id = Taro.getStorageSync('s_dtid') || ''
    // }

    let data
    try {
      data = await api.cart.total(cus_parmas)
    } catch (e) {
      resolvePayError(e)
    }
    Taro.hideLoading()

    if (!data) return

    const {
      items,
      item_fee,
      totalItemNum: items_count,
      member_discount = 0,
      coupon_discount = 0,
      discount_fee,
      freight_fee = 0,
      freight_type,
      freight_point = 0,
      coupon_info = {},
      total_fee,
      invoice_status,
      extraTips = '',
      // 积分
      deduction,
      item_point,
      point = 0,
      remainpt,
      point_fee = 0,
      point_use,
      user_point = 0,
      max_point = 0,
      is_open_deduct_point,
      deduct_point_rule,
      real_use_point
    } = data

    if (isObjectsValue(coupon_info)) {
      setState((draft) => {
        draft.couponInfo = {
          type: 'coupon',
          value: {
            title: coupon_info.info,
            card_id: coupon_info.id,
            code: coupon_info.coupon_code,
            discount: coupon_info.discount_fee
          }
        }
      })
    } else {
      setState((draft) => {
        draft.couponInfo = {}
      })
    }

    const total_info = {
      ...totalInfo,
      item_fee,
      discount_fee,
      member_discount,
      coupon_discount,
      freight_fee,
      total_fee: cus_parmas.pay_type === 'point' ? 0 : total_fee,
      items_count,
      invoice_status, // 是否开启开发票
      point,
      freight_point,
      remainpt, // 总积分
      deduction, // 抵扣
      point_fee, //积分抵扣金额,
      item_point,
      freight_type
    }

    const point_info = {
      ...pointInfo,
      deduct_point_rule,
      is_open_deduct_point,
      user_point, //用户现有积分
      max_point, //最大可使用积分
      real_use_point,
      point_use
    }

    if (real_use_point && real_use_point < point_use) {
      S.toast(`${pointName}有调整`)
    }

    Taro.hideLoading()

    setState((draft) => {
      draft.detailInfo = pickBy(items, doc.checkout.CHECKOUT_GOODS_ITEM)
      draft.totalInfo = total_info
      ;(draft.paramsInfo = { ...paramsInfo, ...cus_parmas }), (draft.pointInfo = point_info)
    })
    if (extraTips) {
      Taro.showModal({
        content: extraTips,
        confirmText: '知道了',
        showCancel: false
      })
    }
  }

  const getParamsInfo = async (submitLoading = false) => {
    const { value, activity } = getActivityValue() || {}
    const { distributor_id: shop_id, store_id, openStore } = shop
    let receiver = pickBy(address, doc.checkout.RECEIVER_ADDRESS)
    if (receiptType === 'ziti') {
      receiver = pickBy({}, doc.checkout.RECEIVER_ADDRESS)
    }

    let cus_parmas = {
      ...paramsInfo,
      ...activity,
      ...receiver,
      receipt_type: receiptType,
      distributor_id: dtid,
      cart_type,
      order_type: bargain_id ? 'bargain' : value,
      promotion: 'normal',
      member_discount: 0,
      coupon_discount: 0,
      not_use_coupon: 0,
      isNostores: openStore ? 1 : 0, // 这个传参需要和后端在确定一下
      point_use,
      pay_type,
      pay_type: payType
    }

    if (payType === 'point') {
      delete cus_parmas.point_use
    }

    if (!VERSION_STANDARD) {
      delete cus_parmas.isNostores
    }

    // if (openStore) {
    //   if (receiptType == 'logistics') {

    //   }
    //   cus_parmas.distributor_id = getId || dtid || shop_id
    // }

    if (coupon) {
      const { type, value } = coupon
      cus_parmas.not_use_coupon = value?.code ? 0 : 1
      cus_parmas.coupon_discount = type === 'coupon' && value.code ? value.code : undefined
      cus_parmas.member_discount = type === 'member' && value ? 1 : 0
    }

    const { packName, packDes } = packInfo
    cus_parmas.pack = isNeedPackage ? { packName, packDes } : undefined
    cus_parmas.bargain_id = bargain_id || undefined

    if (submitLoading) {
      // 提交时候获取参数 把留言信息传进去
      cus_parmas.remark = remark
      cus_parmas.pay_type = totalInfo.freight_type === 'point' ? 'point' : payType
      cus_parmas.pay_channel = payChannel
    }

    return cus_parmas
  }

  const getActivityValue = () => {
    let value = ''
    let activity = {}
    switch (type) {
      case 'groups':
        value = 'normal_groups'
        activity = Object.assign(activity, { bargain_id: group_id })
        if (team_id) {
          activity = Object.assign(activity, { team_id })
        }
        break
      case 'seckill':
        value = 'normal_seckill'
        activity = Object.assign(activity, { seckill_id, seckill_ticket })
        break
      default:
        value = 'normal'
        activity = {}
    }
    return {
      value,
      activity
    }
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
              <View class='last_price'>
                <SpPrice
                  className='primary-price'
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
                      className='primary-price'
                      plus
                      value={totalInfo.freight_fee}
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
          disabled={receiptType !== 'ziti' && !isObjectsValue(address)}
          onClick={onSubmitPayChange}
        >
          提交订单
        </AtButton>
      </View>
    )
  }

  const goodsComp = () => {
    return (
      <View className='cart-list'>
        <View className='cart-checkout__group'>
          <View className='cart-group__cont'>
            <View className='sp-order-item__idx'>
              商品清单 <Text style={{ color: '#222' }}>（{totalInfo.items_count}）</Text>
            </View>
            {detailInfo.map((item, idx) => (
              <View className='sp-order-item__wrap' key={idx}>
                <SpOrderItem
                  info={item}
                  showExtra={false}
                  showDesc
                  isPointitemGood={isPointitemGood}
                  renderDesc={
                    <View className='sp-order-item__desc'>
                      {item.discount_info &&
                        item.order_item_type !== 'gift' &&
                        item.discount_info.map((discount) => (
                          <Text className='sp-order-item__discount' key={discount.type}>
                            {discount.info}
                          </Text>
                        ))}
                    </View>
                  }
                  customFooter
                  renderFooter={
                    <View className='sp-order-item__ft'>
                      {isPointitemGood ? (
                        <SpPrice
                          className='sp-order-item__price'
                          appendText={pointName}
                          noSymbol
                          noDecimal
                          value={item.item_point}
                        />
                      ) : (
                        <SpPrice unit='cent' className='sp-order-item__price' value={item.price} />
                      )}
                      <Text className='sp-order-item__num'>x {item.num}</Text>
                    </View>
                  }
                />
              </View>
            ))}
          </View>
          <View className='cart-group__cont cus-input'>
            <SpCell className='trade-remark' border={false}>
              <AtInput
                className='trade-remark__input'
                placeholder='给商家留言：选填（50字以内）'
                onChange={handleRemarkChange}
                value={remark}
                maxLength={50}
              />
            </SpCell>
          </View>
        </View>
      </View>
    )
  }

  console.log(couponInfo, 'couponInfo', coupon)
  const couponText =
    couponInfo.type === 'member'
      ? '会员折扣'
      : couponInfo?.value?.code
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
          distributor_id={dtid}
          address={address}
          onChangReceiptType={handleSwitchExpress}
        />
      </View>
      {goodsComp()}
      {isWeixin && !isPointitemGood && !bargain_id && totalInfo.invoice_status && (
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
      {type !== 'limited_time_sale' &&
        type !== 'group' &&
        type !== 'seckill' &&
        !bargain_id &&
        !isPointitemGood && (
          <SpCell
            isLink
            className='cart-checkout__coupons'
            title='优惠券'
            onClick={handleCouponsClick}
            value={couponText || '请选择'}
          />
        )}
      {packInfo.is_open && ( // 打包
        <View className='cart-checkout__pack'>
          <CompSelectPackage
            isPointitemGood={isPointitemGood}
            isChecked={isNeedPackage}
            onHandleChange={changeNeedPackage}
            packInfo={packInfo}
          />
        </View>
      )}

      {/* { */}
      {/* !isPointitemGood && VERSION_STANDARD && pointInfo.is_open_deduct_point && */}
      <SpCell
        isLink
        className='cart-checkout__invoice'
        title={`${pointName}抵扣`}
        onClick={handlePointClick}
      >
        <View className='invoice-title'>
          {(pointInfo.point_use > 0 || payType === 'point') && (
            <View className='icon-close invoice-close' onClick={(e) => resetPoint(e)}></View>
          )}
          {payType === 'point'
            ? '全额抵扣'
            : pointInfo.point_use > 0
            ? `已使用${pointInfo.real_use_point}${pointName}`
            : `使用${pointName}`}
        </View>
      </SpCell>
      {/* } */}

      <PointUse
        isOpened={isPointOpenModal}
        type={payType}
        defalutPaytype={defalutPaytype}
        info={pointInfo}
        onClose={() => {
          setState((draft) => {
            draft.isPointOpenModal = false
          })
        }}
        onChange={handlePointUseChange}
      />

      <View className='cart-checkout__pay'>
        <CompPaymentPicker
          type={payType}
          title='支付方式'
          isPointitemGood={isPointitemGood}
          distributor_id={dtid}
          disabledPayment={disabledPayment}
          onChange={handlePaymentChange}
          totalInfo={totalInfo}
        />
      </View>

      {!isPointitemGood && (
        <View className='cart-checkout__total'>
          <SpCell className='trade-sub__item' title='商品金额：'>
            <SpPrice unit='cent' value={totalInfo.item_fee} />
          </SpCell>
          <SpCell className='trade-sub__item' title='优惠金额：'>
            <SpPrice unit='cent' primary value={-1 * totalInfo.discount_fee} />
          </SpCell>
          {pointInfo.is_open_deduct_point && VERSION_STANDARD && (
            <SpCell className='trade-sub__item' title={`${pointName}抵扣：`}>
              <SpPrice unit='cent' primary value={-1 * totalInfo.point_fee} />
            </SpCell>
          )}
          <SpCell className='trade-sub__item' title='运费：'>
            <SpPrice unit='cent' value={totalInfo.freight_fee} />
          </SpCell>
        </View>
      )}

      {isPointitemGood && (
        <View className='cart-checkout__total'>
          <SpCell className='trade-sub__item' title={`${pointName}消费：`}>
            <SpPrice
              className='sp-order-item__price'
              appendText={pointName}
              noSymbol
              noDecimal
              value={totalInfo.item_point}
            />
          </SpCell>
          <SpCell className='trade-sub__item' title='运费：'>
            {totalInfo.freight_type === 'point' ? (
              <SpPrice
                className='sp-order-item__price'
                appendText={pointName}
                noSymbol
                noDecimal
                value={totalInfo.freight_fee}
              />
            ) : (
              <SpPrice unit='cent' value={totalInfo.freight_fee} />
            )}
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
