/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import {
  SpPage,
  SpPrice,
  SpPoint,
  SpCell,
  SpGoodsCell,
  SpCashier,
  SpInput as AtInput
} from '@/components'
import { View, Text, Picker } from '@tarojs/components'
import { changeCoupon, changeZitiAddress } from '@/store/slices/cart'
import { updateChooseAddress } from '@/store/slices/user'
import { changeZitiStore } from '@/store/slices/shop'
import {
  isObjectsValue,
  isWeixin,
  pickBy,
  authSetting,
  showToast,
  isAPP,
  isWxWeb,
  log,
  isEmpty,
  VERSION_PLATFORM,
  VERSION_STANDARD
} from '@/utils'
import { useAsyncCallback, useLogin, usePayment, useLocation } from '@/hooks'
import { PAYMENT_TYPE, TRANSFORM_PAYTYPE } from '@/consts'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import S from '@/spx'
import { useTranslation, $t, ti } from '@/i18n'
import { initialState } from './const'
import CompDeliver from './comps/comp-deliver'
import './espier-checkout.scss'

function PointShopEspierCheckout() {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const { updateAddress } = useLocation()
  const { isLogin } = useLogin({
    autoLogin: true,
    loginSuccess: () => {
      updateAddress()
    }
  })

  const { cashierPayment, payError } = usePayment()

  const [state, setState] = useAsyncCallback(initialState)

  const dispatch = useDispatch()
  const pageRef = useRef()
  const deliverRef = useRef()

  const { userInfo, address } = useSelector((state) => state.user)
  const { colorPrimary, pointName, entryStoreByLBS } = useSelector((state) => state.sys)
  const { coupon, zitiAddress } = useSelector((state) => state.cart)
  const { shopInfo } = useSelector((state) => state.shop)

  const {
    detailInfo,
    payType,
    payChannel,
    submitLoading,
    totalInfo,
    receiptType,
    distributorInfo,
    packInfo,
    paramsInfo,
    couponInfo,
    remark,
    isPointOpenModal,
    point_use,
    isNeedPackage,
    isPackageOpend,
    openCashier,
    pointInfo,
    invoiceTitle
  } = state

  const {
    type,
    order_type = 'normal',
    shop_id: dtid = paramsInfo.distributor_id,
    cart_type = paramsInfo.cart_type,
    seckill_id = null,
    ticket: seckill_ticket,
    pay_type,
    bargain_id, // 砍价活动id
    team_id,
    group_id, // 团购id
    source,
    scene, // 情景值
    goodType,
    ticket = null
  } = $instance?.router?.params || {}
  console.log('$instance?.router?.params:', $instance)

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('edc703ce.337fd5') })
  }, [i18n.language])

  useEffect(() => {
    if (isLogin) {
      getTradeSetting()
      // tode 此处应有埋点
      return () => {
        dispatch(changeCoupon()) // 清空优惠券信息
        dispatch(changeZitiAddress(null)) // 清空自提地址信息
        dispatch(updateChooseAddress(null)) // 清空地址信息
        dispatch(changeZitiStore()) // 清空编辑自提列表选中的数据
      }
    }
  }, [isLogin])

  useEffect(() => {
    const token = S?.getAuthToken()
    if (!token) {
      Taro.redirectTo({
        url: `/subpages/member/index`
      })
    }
  }, [])

  useEffect(() => {
    console.log(
      `useEffect: payType: ${payType}, address: ${address}, zitiAddress: ${zitiAddress}, receiptType: ${receiptType}`
    )
    if (receiptType && payType) {
      calcOrder()
    }
  }, [payType, point_use, address, zitiAddress, receiptType, paramsInfo.invoice_content])

  useEffect(() => {
    if (isPackageOpend || isPointOpenModal) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [isPackageOpend, isPointOpenModal])

  useEffect(() => {
    Taro.eventCenter.on('onEventCheckoutInvoiceChange', (params) => {
      console.log('onEventCheckoutInvoiceChange:', params)
      let invoice_parmas = {
        invoice_content: {
          ...params
        }
      }
      let invoice_title = ''
      if (params.company_title) {
        invoice_title = `${
          params.invoice_type_code == '02' ? $t('71426282.56b771') : $t('71426282.96d7f2')
        }(${params.company_title})`
      }
      setState((draft) => {
        draft.invoiceTitle = invoice_title
        draft.paramsInfo = { ...paramsInfo, ...invoice_parmas }
      })
    })
    return () => {
      Taro.eventCenter.off('onEventCheckoutInvoiceChange')
    }
  }, [paramsInfo])

  // 是否需要包装
  const getTradeSetting = async () => {
    let data = await api.trade.tradeSetting()
    setState((draft) => {
      draft.packInfo = data
    })
  }

  const onSubmitPayChange = async () => {
    if (submitLoading) return

    if (receiptType == 'ziti') {
      if (zitiAddress) {
        await deliverRef.current.validateZitiInfo()
      } else {
        showToast($t('edc703ce.cb8251'))
      }
    }

    // 判断当前店铺关联商户是否被禁用 isVaild：true有效
    const { status: isValid } = await api.distribution.merchantIsvaild({ distributor_id: dtid })
    if (!isValid) {
      showToast($t('edc703ce.f0010a'))
      return
    }

    if (isWeixin) {
      const templeparams = {
        temp_name: 'yykweishop',
        source_type: receiptType === 'logistics' ? 'logistics_order' : 'ziti_order'
      }
      const { template_id } = await api.user.newWxaMsgTmpl(templeparams)
      try {
        await Taro.requestSubscribeMessage({ tmplIds: template_id })
        handlePay()
      } catch (e) {
        console.error(e)
        handlePay()
      }
    } else {
      handlePay()
    }
  }

  const handlePay = async () => {
    setState((draft) => {
      draft.submitLoading = true
    })
    const params = await getParamsInfo()
    console.log('trade params:', params)
    if (payType === 'deposit') {
      // 验证余额额度是否可用
      if (userInfo.deposit < totalInfo.total_fee / 100) {
        const { confirm } = await Taro.showModal({
          content: $t('edc703ce.de4d2f'),
          cancelText: $t('61e2d21a.625fb2'),
          confirmColor: colorPrimary,
          confirmText: $t('edc703ce.e4ff95')
        })
        if (confirm) {
          Taro.navigateTo({
            url: '/others/pages/recharge/index'
          })
        }
        setState((draft) => {
          draft.submitLoading = false
        })
        return
      }

      const { confirm } = await Taro.showModal({
        title: $t('edc703ce.89ac23'),
        content: $t('edc703ce.d9e16c'),
        cancelText: $t('61e2d21a.625fb2'),
        confirmColor: colorPrimary,
        confirmText: $t('61e2d21a.e83a25')
      })
      if (!confirm) {
        setState((draft) => {
          draft.submitLoading = false
        })
        return
      }
    }

    Taro.showLoading({
      title: $t('edc703ce.415038'),
      mask: true
    })

    let orderInfo
    let orderId
    try {
      // 积分商城默认下单积分支付
      const resOrderInfo = await api.trade.h5create({
        ...params,
        pay_type: 'point',
        pay_channel: 'point'
      })
      orderInfo = resOrderInfo
      orderId = resOrderInfo.order_id
    } catch (e) {
      setState((draft) => {
        draft.submitLoading = false
      })
      Taro.hideLoading()
      setTimeout(() => {
        Taro.navigateBack()
      }, 100)
      return
    }
    Taro.hideLoading()

    setState((draft) => {
      draft.submitLoading = false
    })

    if (
      params.pay_type == 'wxpayjs' ||
      (params.pay_type == 'adapay' && params.pay_channel == 'wx_pub' && isWxWeb)
    ) {
      // 微信客户端code授权
      const loc = window.location
      const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-weapp?order_id=${orderId}`
      let { redirect_url } = await api.wx.getredirecturl({ url })
      window.location.href = redirect_url
    } else {
      if (orderInfo?.order_type == 'normal_pointsmall' && orderInfo?.total_fee == 0) {
        payError(orderInfo)
        return
      }
      cashierPayment(
        {
          ...params,
          // 活动类型：拼团
          activityType: type
        },
        orderInfo
      )
    }
  }

  const handleSwitchExpress = ({ receipt_type, distributor_info, address_info }) => {
    // 切换配送模式
    setState((draft) => {
      draft.receiptType = receipt_type
      draft.distributorInfo = distributor_info
    })

    dispatch(updateChooseAddress(address_info))
  }

  const handleEditZitiClick = async (id) => {
    const params = await getParamsInfo()
    let query = {
      shop_id: id,
      cart_type,
      order_type: params.order_type,
      seckill_id,
      ticket,
      goodType,
      bargain_id: params.bargain_id
    }
    Taro.navigateTo({
      url: `/subpages/store/ziti-list?${qs.stringify(query)}`
    })
  }

  // 商家留言
  const handleRemarkChange = (val) => {
    if (val.length > 50) val = val.slice(0, 50)
    console.log('handleRemarkChange:remark', remark)
    setState((draft) => {
      draft.remark = val
    })
  }

  const calcOrder = async () => {
    Taro.showLoading({ title: '' })
    // calc.current = true
    const cus_parmas = await getParamsInfo()
    let orderRes = {}
    try {
      orderRes = await api.cart.total({
        ...cus_parmas,
        showError: false
      })
    } catch (e) {
      Taro.hideLoading()
      const { confirm } = await Taro.showModal({
        content: e.message,
        confirmText: $t('596fa34a.5f4112'),
        showCancel: false
      })
      if (confirm) {
        Taro.navigateBack()
      }
    }
    Taro.hideLoading()
    const {
      items,
      item_fee,
      totalItemNum: items_count,
      member_discount = 0,
      coupon_discount = 0,
      discount_fee = 0,
      freight_fee = 0,
      promotion_discount = 0,
      freight_type,
      freight_point = 0,
      coupon_info,
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
      real_use_point,
      item_fee_new,
      market_fee,
      order_class
    } = orderRes

    // console.log('subdistrictRes:', subdistrictRes)

    if (coupon_info) {
      const { coupon_code, id, info } = coupon_info
      const _info = {
        // type: 'coupon',
        // value: {
        //   title: coupon_info.info,
        //   card_id: coupon_info.id,
        //   code: coupon_info.coupon_code,
        //   discount: coupon_info.discount_fee
        // }
        coupon_id: id,
        coupon_code: coupon_code,
        title: info
      }
      setState((draft) => {
        draft.couponInfo = _info
      })
      // if (!coupon) {
      //   dispatch(changeCoupon(_info))
      // }
    } else {
      setState((draft) => {
        draft.couponInfo = {}
      })
    }

    const total_info = {
      ...totalInfo,
      item_fee_new,
      market_fee,
      item_fee,
      discount_fee,
      member_discount,
      coupon_discount,
      freight_fee,
      total_fee,
      items_count,
      invoice_status, // 是否开启开发票
      point,
      freight_point,
      remainpt, // 总积分
      deduction, // 抵扣
      point_fee, //积分抵扣金额,
      item_point,
      freight_type,
      promotion_discount,
      order_class
    }

    const point_info = {
      deduct_point_rule,
      is_open_deduct_point,
      user_point, //用户现有积分
      max_point, //最大可使用积分
      real_use_point,
      point_use
    }

    if (real_use_point && real_use_point < point_use) {
      showToast(ti('edc703ce.ee9ca4', [pointName]))
    }

    Taro.hideLoading()
    // console.log('xxx', pickBy(items, doc.checkout.CHECKOUT_GOODS_ITEM))
    items.forEach((item) => (item['is_point'] = true))
    setState((draft) => {
      draft.detailInfo = pickBy(items, doc.checkout.CHECKOUT_GOODS_ITEM)
      draft.totalInfo = total_info
      draft.paramsInfo = { ...paramsInfo, ...cus_parmas }
      draft.pointInfo = point_info
      draft.point_use = point_use
    })
    // calc.current = false
    if (extraTips) {
      Taro.showModal({
        content: extraTips,
        confirmText: $t('edc703ce.ce2695'),
        showCancel: false
      })
    }
  }

  const getParamsInfo = async (submitLoading = false) => {
    let ziti_shopid
    let receiver = pickBy(address, doc.checkout.RECEIVER_ADDRESS)
    if (receiptType === 'ziti') {
      // receiver = pickBy(distributorInfo, doc.checkout.ZITI_ADDRESS)
      const { pickerTime, pickerName, pickerPhone } = await deliverRef.current.getZitiInfo()

      receiver = {
        receiver_name: pickerName,
        receiver_mobile: pickerPhone,
        pickup_date: pickerTime.date,
        pickup_time: pickerTime.time,
        pickup_location: zitiAddress?.id
      }
    }
    let cus_parmas = {
      ...paramsInfo,
      ...receiver,
      receipt_type: receiptType,
      cart_type,
      order_type: 'normal_pointsmall',
      promotion: 'normal',
      isNostores: entryStoreByLBS ? 0 : 1, // 这个传参需要和后端在确定一下
      point_use: totalInfo.point,
      pay_type: payType
    }

    if (receiptType === 'ziti') {
      delete cus_parmas.receiver_zip
    }

    // // 积分不开票
    // if (payType === 'point') {
    //   delete cus_parmas.invoice_type
    //   delete cus_parmas.invoice_content
    //   delete cus_parmas.point_use
    // }

    if (VERSION_PLATFORM) {
      delete cus_parmas.isNostores
    }
    console.log(couponInfo)
    const _coupon = coupon || couponInfo
    if (!isEmpty(_coupon)) {
      const { coupon_id, coupon_code, title } = _coupon
      cus_parmas.not_use_coupon = coupon_code ? 0 : 1
      if (coupon_code) {
        cus_parmas.coupon_discount = coupon_code
      }
    }

    const { packName, packDes } = packInfo
    cus_parmas.pack = isNeedPackage ? { packName, packDes } : undefined
    if (bargain_id) {
      cus_parmas.bargain_id = bargain_id
    }

    cus_parmas.remark = remark
    cus_parmas.pay_channel = payChannel

    return cus_parmas
  }

  const handlePaymentShow = () => {
    setState((draft) => {
      draft.openCashier = true
    })
  }
  // 开发票
  const handleInvoiceClick = () => {
    Taro.setStorageSync('invoice_params', paramsInfo?.invoice_content)
    Taro.navigateTo({
      url: `/subpages/trade/invoice?page_type=checkout`
    })
  }

  const resetInvoice = (e) => {
    e.stopPropagation()
    setState((draft) => {
      draft.invoiceTitle = ''
      // draft.paramsInfo = { ...paramsInfo, invoice_type: '', invoice_content: {} }
      draft.paramsInfo = { ...paramsInfo, invoice_content: {} }
    })
  }

  const renderFooter = () => {
    return (
      <View className='checkout-toolbar'>
        <View className='checkout-toolbar__total'>
          {ti('596fa34a.65bff2', [totalInfo.items_count])}
          <View className='checkout-total'>
            <View>
              {$t('596fa34a.b8fdb3')}
              <SpPoint value={totalInfo.point} />
            </View>
            <View>
              {$t('596fa34a.9bee27')}
              <SpPrice value={totalInfo.total_fee / 100} />
            </View>
          </View>
        </View>
        <AtButton
          circle
          type='primary'
          loading={submitLoading}
          disabled={receiptType !== 'ziti' && !isObjectsValue(address)}
          onClick={onSubmitPayChange}
        >
          {$t('edc703ce.c3898c')}
        </AtButton>
      </View>
    )
  }

  const renderGoodsComp = () => {
    return (
      <View className='cart-list'>
        <View className='cart-checkout__group'>
          <View className='cart-group__cont'>
            <View className='sp-order-item__idx'>
              {$t('edc703ce.08ea4e')}{' '}
              <Text style={{ color: '#222' }}>
                {ti('edc703ce.a20466', [totalInfo.items_count])}
              </Text>
            </View>
            <View className='goods-list'>
              {detailInfo.map((item, idx) => (
                <View className='sp-order-item__wrap' key={idx}>
                  <SpGoodsCell info={item} />
                </View>
              ))}
            </View>
          </View>
          <View className='cart-group__cont cus-input'>
            <SpCell className='trade-remark' border={false}>
              <AtInput
                className='trade-remark__input'
                placeholder={$t('edc703ce.0e9ca2')}
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

  return (
    <SpPage
      ref={pageRef}
      className='page-pointshop-espiercheckout'
      footerHeight={140}
      renderFooter={renderFooter()}
    >
      <View className='cart-checkout__address'>
        <CompDeliver
          ref={deliverRef}
          distributor_id={dtid}
          address={address}
          onChange={handleSwitchExpress}
          onEidtZiti={handleEditZitiClick}
        />
      </View>

      {renderGoodsComp()}

      {(totalInfo.freight_fee > 0 || totalInfo.total_fee > 0) && (
        <View>
          <SpCell
            isLink
            className='cart-checkout__pay'
            title={$t('250b375e.0c9d2b')}
            onClick={handlePaymentShow}
          >
            {totalInfo.deduction && (
              <Text>
                {totalInfo.remainpt}
                {ti('edc703ce.dfb3e1', [pointName])}
              </Text>
            )}
            <Text className='invoice-title'>
              {payChannel ? PAYMENT_TYPE()[payChannel] : $t('edc703ce.708c9d')}
            </Text>
          </SpCell>
          {totalInfo.deduction && (
            <View>
              {ti('9c730348.c72db2', [totalInfo.point, pointName])}
              <SpPrice unit='cent' value={totalInfo.deduction} />
              {$t('9c730348.5e162f')}
              <SpPrice unit='cent' value={totalInfo.freight_fee} />
            </View>
          )}
        </View>
      )}

      {totalInfo.invoice_status ? (
        <SpCell
          isLink
          title={$t('edc703ce.63dd82')}
          className='cart-checkout__invoice'
          onClick={handleInvoiceClick}
          value={
            <View className='invoice-title'>
              {invoiceTitle && (
                <View
                  onClick={(e) => resetInvoice(e)}
                  className='iconfont icon-close invoice-close'
                />
              )}
              {invoiceTitle || $t('edc703ce.c9744f')}
            </View>
          }
        />
      ) : null}

      <View className='cart-checkout__total'>
        <SpCell className='trade-sub__item' title={$t('596fa34a.3c4670')}>
          <SpPoint value={totalInfo.item_point} />
        </SpCell>
        <SpCell className='trade-sub__item' title={$t('596fa34a.080942')}>
          <SpPrice value={totalInfo.item_fee / 100} />
        </SpCell>
        <SpCell className='trade-sub__item' title={$t('edc703ce.94a6a5')}>
          {totalInfo.freight_type == 'point' && <SpPoint value={totalInfo.freight_fee} />}
          {totalInfo.freight_type == 'cash' && <SpPrice value={totalInfo.freight_fee / 100} />}
        </SpCell>
      </View>

      <SpCashier
        isOpened={openCashier}
        // paymentAmount={totalInfo.freight_fee}
        userPoint={pointInfo?.point_use}
        value={payChannel}
        onClose={() => {
          setState((draft) => {
            draft.openCashier = false
          })
        }}
        onChange={(value) => {
          setState((draft) => {
            console.log(`SpCashier:`, value)
            draft.payType = value.paymentCode
            draft.payChannel = value.paymentChannel
          })
        }}
      />
    </SpPage>
  )
}

PointShopEspierCheckout.options = {
  addGlobalClass: true
}
export default PointShopEspierCheckout
