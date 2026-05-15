/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import {
  SpPage,
  SpPrice,
  SpCashier,
  SpDeliver,
  SpImage,
  SpPurchaseEnterpriseBar
} from '@/components'
import { View, Text, ScrollView } from '@tarojs/components'
import { changeCoupon, changeZitiAddress } from '@/store/slices/cart'
import { updateChooseAddress } from '@/store/slices/user'
import { changeZitiStore } from '@/store/slices/shop'
import {
  isObjectsValue,
  isWeixin,
  pickBy,
  getDistributorId,
  merchantIsvaild,
  showToast,
  isWeb,
  isAPP,
  isWxWeb,
  classNames,
  log,
  VERSION_STANDARD,
  VERSION_B2C,
  VERSION_PLATFORM
} from '@/utils'
import { useAsyncCallback, useLogin, useLocation, useNavigation, usePayment } from '@/hooks'
import { PAYMENT_TYPE, TRANSFORM_PAYTYPE } from '@/consts'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import S from '@/spx'
import CompPurchaseNav from '@/pages/purchase/comps/comp-purchase-nav'
import { useTranslation, $t, ti } from '@/i18n'
import { initialState } from './const'
import './espier-checkout.scss'

function PurchaseCheckout(props) {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const { updateAddress } = useLocation()
  const { setNavigationBarTitle } = useNavigation()
  const { isLogin, isNewUser, getUserInfoAuth } = useLogin({
    autoLogin: true,
    loginSuccess: () => {
      updateAddress()
    }
  })

  const router = useRouter()

  const { cashierPayment } = usePayment()

  const [enterpriseName, setEnterpriseName] = useState('')
  const [state, setState] = useAsyncCallback(initialState)

  const dispatch = useDispatch()
  const pageRef = useRef()
  const deliverRef = useRef()
  const calc = useRef(false)
  const { userInfo, address } = useSelector((state) => state.user)
  const { colorPrimary, pointName, entryStoreByLBS } = useSelector((state) => state.sys)
  const { coupon, zitiAddress } = useSelector((state) => state.cart)
  const shop = useSelector((state) => state.shop)
  const {
    purchase_share_info = {},
    curEnterpriseId,
    isDiscountDescriptionEnabled,
    discountDescription,
    priceDisplayConfig = {}
  } = useSelector((state) => state.purchase)
  const { checkout_page = {} } = priceDisplayConfig
  const { activity_price: enPurCheckoutActivityPrice } = checkout_page

  const {
    detailInfo,
    payType,
    payChannel,
    submitLoading,
    totalInfo,
    shoppingGuideData,
    receiptType,
    distributorInfo,
    invoiceTitle,
    packInfo,
    disabledPayment,
    paramsInfo,
    couponInfo,
    remark,
    defalutPaytype,
    isPointOpenModal,
    point_use,
    pointInfo,
    streetCommunityList,
    openStreet,
    openBuilding,
    multiValue,
    multiIndex,
    streetCommunityTxt,
    street,
    community,
    isNeedPackage,
    isPackageOpend,
    isPaymentOpend,
    openCashier,
    buildingNumber,
    houseNumber // 房号
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

  useEffect(() => {
    setNavigationBarTitle('确认订单')
  }, [setNavigationBarTitle])

  useEffect(() => {
    const eid =
      curEnterpriseId ||
      router?.params?.enterprise_id ||
      purchase_share_info?.enterprise_id
    if (!eid) {
      setEnterpriseName('')
      return
    }
    const load = async () => {
      try {
        const data = await api.purchase.getUserEnterprises({
          disabled: 0,
          distributor_id: getDistributorId()
        })
        const found = data?.find((x) => x.enterprise_id == eid)
        setEnterpriseName(found?.name || found?.enterprise_name || '')
      } catch (e) {
        setEnterpriseName('')
      }
    }
    load()
  }, [curEnterpriseId, purchase_share_info?.enterprise_id, router?.params?.enterprise_id])

  useEffect(() => {
    if (isLogin) {
      // tode 此处应有埋点
      return () => {
        dispatch(changeCoupon()) // 清空优惠券信息
        dispatch(changeZitiAddress(null)) // 清空自提地址信息
        // dispatch(updateChooseAddress(null)) // 清空地址信息
        dispatch(changeZitiStore()) // 清空编辑自提列表选中的数据
      }
    }
  }, [isLogin])

  useEffect(() => {
    if (isNewUser && !isWeb) {
      Taro.redirectTo({
        url: `/subpages/member/index`
      })
    }
  }, [isNewUser])

  useEffect(() => {
    console.log('use-effect:', receiptType, payType)
    if (receiptType && payType) {
      calcOrder()
    }
  }, [address, payType, zitiAddress, point_use, receiptType])

  useEffect(() => {
    if (isPackageOpend || openCashier || isPointOpenModal) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [isPackageOpend, openCashier, isPointOpenModal])

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
    // // 校验楼号、房号
    // if (openBuilding && !buildingNumber) {
    //   return showToast('请输入楼号')
    // }

    // // 校验楼道，楼号
    // if (openBuilding && !houseNumber) {
    //   return showToast('请输入房号')
    // }

    setState(
      (draft) => {
        draft.submitLoading = true
      },
      async () => {
        if (isWeixin) {
          const templeparams = {
            temp_name: 'yykweishop',
            source_type: receiptType === 'logistics' ? 'logistics_order' : 'ziti_order'
          }
          const { template_id } = await api.user.newWxaMsgTmpl(templeparams)
          Taro.requestSubscribeMessage({
            tmplIds: template_id,
            success: () => {
              handlePay()
            },
            fail: () => {
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

    if ((isWeb || isAPP()) && payType !== 'deposit') {
      try {
        const h5ResInfo = await api.trade.h5create({
          ...params,
          pay_type: isAPP() ? payType : TRANSFORM_PAYTYPE()[payType]
        })
        orderInfo = h5ResInfo
        orderId = h5ResInfo.order_id
      } catch (e) {
        setState((draft) => {
          draft.submitLoading = false
        })
      }
    } else {
      try {
        const { trade_info } = await api.trade.create(params)
        orderInfo = trade_info
        orderId = trade_info.order_id
      } catch (e) {
        setState((draft) => {
          draft.submitLoading = false
        })
        return
      }
    }

    Taro.hideLoading()

    setState((draft) => {
      draft.submitLoading = false
    })

    if ((totalInfo?.prescription_status ?? 0) != 0) {
      Taro.redirectTo({
        url: `/subpages/prescription/prescription-information?order_id=${orderId}`
      })
      console.log('我要跳转到新的页面啦:', payType)
      return
    }

    // 储值支付 或者 积分抵扣
    if (payType === 'deposit' || params.pay_type == 'point') {
      Taro.redirectTo({ url: `/pages/cart/cashier-result?order_id=${orderId}` })
    } else {
      if (
        params.pay_type == 'wxpayjs' ||
        (params.pay_type == 'adapay' && params.pay_channel == 'wx_pub' && isWxWeb)
      ) {
        // 微信客户端code授权
        const loc = window.location
        // const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-result?order_id=${orderId}`
        const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-weapp?order_id=${orderId}`
        let { redirect_url } = await api.wx.getredirecturl({ url })
        window.location.href = redirect_url
      } else {
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
  }

  const handleSwitchExpress = ({ receipt_type, distributor_info, address_info }) => {
    // const _addressInfo = address_info || addressInfo
    // 切换配送模式
    setState((draft) => {
      draft.receiptType = receipt_type
      draft.distributorInfo = distributor_info
      // draft.addressInfo = _addressInfo
    })

    // 收货地址为空时，需要触发calcOrder
    if (receipt_type == 'logistics' && !address_info) {
      calcOrder()
    }
    // if (address_info) {
    dispatch(updateChooseAddress(address_info))
    // }
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

  const handlePaymentShow = () => {
    setState((draft) => {
      // draft.isPaymentOpend = true
      draft.openCashier = true
    })
  }

  const calcOrder = async () => {
    Taro.showLoading({ title: '' })
    // calc.current = true
    const cus_parmas = await getParamsInfo()

    const orderRes = await api.cart.total(cus_parmas)
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
      // 是否开启下单填写街道、社区
      is_require_subdistrict: openStreet,
      // 是否开启楼道、楼号
      is_require_building: openBuilding,
      subdistrict_parent_id,
      subdistrict_id,
      receiver_state,
      receiver_city,
      receiver_district,
      item_fee_new,
      market_fee,
      prescription_status
    } = orderRes

    if (coupon_info) {
      const info = {
        type: 'coupon',
        value: {
          title: coupon_info.info,
          card_id: coupon_info.id,
          code: coupon_info.coupon_code,
          discount: coupon_info.discount_fee
        }
      }
      setState((draft) => {
        draft.couponInfo = info
      })
      if (!coupon) {
        dispatch(changeCoupon(info))
      }
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
      total_fee: cus_parmas.pay_type === 'point' ? 0 : total_fee,
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
      prescription_status
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
      S?.toast(ti('edc703ce.ee9ca4', [pointName]))
    }

    Taro.hideLoading()
    // console.log('xxx', pickBy(items, doc.checkout.CHECKOUT_GOODS_ITEM))
    setState((draft) => {
      draft.detailInfo = pickBy(items, doc.checkout.CHECKOUT_GOODS_ITEM)
      draft.totalInfo = total_info
      draft.paramsInfo = { ...paramsInfo, ...cus_parmas }
      draft.pointInfo = point_info
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
    const { activity_id, enterprise_id } = purchase_share_info
    const { value, activity } = getActivityValue() || {}

    let _activity_id = activity_id
    let _enterprise_id = enterprise_id
    // 订单详情点进来的商品
    if (router?.params.activity_id && router?.params.enterprise_id) {
      _activity_id = router?.params.activity_id
      _enterprise_id = router?.params.enterprise_id
    }

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
      // if (shop.zitiShop) {
      //   const { distributor_id } = shop.zitiShop
      //   ziti_shopid = distributor_id
      //   receiver = pickBy(shop.zitiShop, doc.checkout.ZITI_ADDRESS)
      // }
    }
    let cus_parmas = {
      ...paramsInfo,
      ...activity,
      ...receiver,
      receipt_type: receiptType,
      cart_type,
      order_type: bargain_id ? 'bargain' : value,
      promotion: 'normal',
      isNostores: entryStoreByLBS ? 0 : 1, // 这个传参需要和后端在确定一下
      point_use,
      pay_type: point_use > 0 && totalInfo.total_fee == 0 ? 'point' : payType,
      distributor_id: receiptType === 'ziti' && ziti_shopid ? ziti_shopid : dtid,
      activity_id: _activity_id,
      enterprise_id: _enterprise_id
    }

    if (receiptType === 'ziti') {
      delete cus_parmas.receiver_zip
    }

    // 积分不开票
    if (payType === 'point') {
      delete cus_parmas.invoice_type
      delete cus_parmas.invoice_content
      delete cus_parmas.point_use
    }

    if (VERSION_PLATFORM) {
      delete cus_parmas.isNostores
    }

    const { packName, packDes } = packInfo
    cus_parmas.pack = isNeedPackage ? { packName, packDes } : undefined
    if (bargain_id) {
      cus_parmas.bargain_id = bargain_id
    }
    // if (submitLoading) {
    // 提交时候获取参数 把留言信息传进去
    cus_parmas.remark = remark
    // cus_parmas.pay_type = totalInfo.freight_type === 'point' ? 'point' : payType
    cus_parmas.pay_channel = payChannel
    // }

    return cus_parmas
  }

  const getActivityValue = () => {
    let value = ''
    let activity = {}
    switch (type) {
      case 'group':
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
      case 'normal':
        value = 'normal'
        activity = {}
        break
      default:
        value = 'normal_employee_purchase'
        activity = {}
    }
    return {
      value,
      activity
    }
  }

  const orderSubmitDisabled = () => {
    if (receiptType == 'ziti') {
      return !zitiAddress
    } else {
      return !address
    }
    // receiptType !== 'ziti' && !isObjectsValue(address)
  }

  const renderFooter = () => (
    <View className='page-espier-checkout__toolbar'>
      <View className='page-espier-checkout__toolbar-sum'>
        <Text className='page-espier-checkout__toolbar-count'>
          共{totalInfo.items_count || 0}件商品
        </Text>
        <View className='page-espier-checkout__toolbar-total'>
          <Text className='page-espier-checkout__toolbar-label'>合计：</Text>
          <SpPrice unit='cent' className='page-espier-checkout__toolbar-price' value={totalInfo.total_fee} />
        </View>
      </View>
      <View
        className={classNames('page-espier-checkout__toolbar-btn', {
          'page-espier-checkout__toolbar-btn--disabled': orderSubmitDisabled() || submitLoading
        })}
        onClick={!orderSubmitDisabled() && !submitLoading ? onSubmitPayChange : undefined}
      >
        <Text className='page-espier-checkout__toolbar-btn-txt'>
          {submitLoading ? '提交中…' : '提交订单'}
        </Text>
      </View>
    </View>
  )

  const payMethodLabel = payChannel ? PAYMENT_TYPE()[payChannel] : '请选择支付方式'

  return (
    <SpPage
      ref={pageRef}
      className='page-espier-checkout'
      title='订单结算'
      pageConfig={{ navigateBackgroundColor: '#ffffff' }}
      renderNavigation={(navProps) => <CompPurchaseNav {...navProps} />}
      renderFooter={renderFooter()}
      footerHeight={160}
    >
      <View className='page-espier-checkout__scroll'>
        <SpPurchaseEnterpriseBar
          name={enterpriseName}
          showMore={false}
          showSearch={false}
          rightExtra={
            isDiscountDescriptionEnabled && discountDescription ? (
              <View className='page-espier-checkout__policy'>
                <Text className='iconfont icon-info page-espier-checkout__policy-icon' />
                <Text className='page-espier-checkout__policy-txt'>{discountDescription}</Text>
              </View>
            ) : null
          }
        />

        <View className='page-espier-checkout__deliver-wrap'>
          <SpDeliver
            isPurchase
            ref={deliverRef}
            distributor_id={dtid}
            address={address}
            onChange={handleSwitchExpress}
            onEidtZiti={handleEditZitiClick}
          />
        </View>

        <View className='page-espier-checkout__card page-espier-checkout__goods'>
          <View className='page-espier-checkout__card-head'>
            <Text className='page-espier-checkout__card-title'>商品信息</Text>
            <Text className='page-espier-checkout__card-sub'>共{totalInfo.items_count || 0}件商品</Text>
          </View>
          <View className='page-espier-checkout__goods-list'>
            {detailInfo.map((item, idx) => (
              <View className='page-espier-checkout__goods-row' key={`g-${idx}`}>
                <SpImage
                  className='page-espier-checkout__goods-img'
                  src={item.img}
                  width={92}
                  height={93}
                  mode='aspectFill'
                />
                <View className='page-espier-checkout__goods-meta'>
                  <Text className='page-espier-checkout__goods-name'>{item.itemName}</Text>
                  {item.itemSpecDesc ? (
                    <Text className='page-espier-checkout__goods-spec'>{item.itemSpecDesc}</Text>
                  ) : null}
                  <View className='page-espier-checkout__goods-ft'>
                    <View className='page-espier-checkout__goods-price'>
                      {enPurCheckoutActivityPrice ? (
                        <View className='page-espier-checkout__goods-price-act'>
                          <SpPrice
                            className='page-espier-checkout__goods-price-current'
                            value={item.price}
                            symbol='¥'
                          />
                          {Number(item.salePrice) > 0 ? (
                            <SpPrice
                              className='page-espier-checkout__goods-price-through'
                              value={item.salePrice}
                              size={24}
                              lineThrough
                              symbol='¥'
                            />
                          ) : null}
                        </View>
                      ) : (
                        <SpPrice
                          className='page-espier-checkout__goods-price-current'
                          value={
                            item.salePrice != null && !Number.isNaN(Number(item.salePrice))
                              ? item.salePrice
                              : item.price
                          }
                          symbol='¥'
                        />
                      )}
                    </View>
                    <Text className='page-espier-checkout__goods-num'>x{item.num}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {!bargain_id && (
          <View className='page-espier-checkout__card page-espier-checkout__pay' onClick={handlePaymentShow}>
            <View className='page-espier-checkout__pay-row'>
              <Text className='page-espier-checkout__card-title page-espier-checkout__pay-title'>支付方式</Text>
              <View className='page-espier-checkout__pay-bd'>
                {totalInfo.deduction ? (
                  <Text className='page-espier-checkout__pay-point'>
                    {totalInfo.remainpt}
                    {pointName}可用
                  </Text>
                ) : null}
                <Text className='page-espier-checkout__pay-val'>{payMethodLabel}</Text>
                <Text className='iconfont icon-arrowRight page-espier-checkout__pay-arrow' />
              </View>
            </View>
            {totalInfo.deduction ? (
              <View className='page-espier-checkout__pay-extra'>
                可用{totalInfo.point}
                {pointName}，抵扣
                <SpPrice unit='cent' value={totalInfo.deduction} />
                ，含运费
                <SpPrice unit='cent' value={totalInfo.freight_fee} />
              </View>
            ) : null}
          </View>
        )}

        <View className='page-espier-checkout__card page-espier-checkout__order'>
          <Text className='page-espier-checkout__card-title page-espier-checkout__order-hd'>订单信息</Text>
          <View className='page-espier-checkout__order-row'>
            <Text className='page-espier-checkout__order-k'>商品数量</Text>
            <Text className='page-espier-checkout__order-v'>{totalInfo.items_count || 0}</Text>
          </View>
          <View className='page-espier-checkout__order-row'>
            <Text className='page-espier-checkout__order-k'>商品总价</Text>
            <SpPrice unit='cent' className='page-espier-checkout__order-v' value={totalInfo.item_fee_new} />
          </View>
          <View className='page-espier-checkout__order-row'>
            <Text className='page-espier-checkout__order-k'>优惠金额</Text>
            <SpPrice unit='cent' className='page-espier-checkout__order-v' value={totalInfo.discount_fee} />
          </View>
          <View className='page-espier-checkout__order-row'>
            <Text className='page-espier-checkout__order-k'>运费</Text>
            <SpPrice unit='cent' className='page-espier-checkout__order-v' value={totalInfo.freight_fee} />
          </View>
          {(VERSION_STANDARD || VERSION_B2C || (VERSION_PLATFORM && dtid == 0)) &&
            pointInfo?.is_open_deduct_point && (
              <View className='page-espier-checkout__order-row'>
                <Text className='page-espier-checkout__order-k'>{pointName}抵扣</Text>
                <SpPrice
                  unit='cent'
                  primary
                  className='page-espier-checkout__order-v'
                  value={0 - (totalInfo.point_fee || 0)}
                />
              </View>
            )}
        </View>

        {isObjectsValue(shoppingGuideData) && (
          <View className='page-espier-checkout__guide'>
            此订单商品来自「{shoppingGuideData.store_name}」导购「{shoppingGuideData.name}」的推荐
          </View>
        )}

        {(totalInfo?.prescription_status ?? 0) != 0 && (
          <View className='page-espier-checkout__rx-tip'>订单中包含处方药，提交订单后请补充处方信息</View>
        )}
      </View>

      <SpCashier
        isOpened={openCashier}
        paymentAmount={totalInfo.freight_fee}
        isPurchase
        value={payChannel}
        onClose={() => {
          setState((draft) => {
            draft.openCashier = false
          })
        }}
        onChange={(value) => {
          setState((draft) => {
            draft.payType = value?.paymentCode
            draft.payChannel = value?.paymentChannel
          })
        }}
      />
    </SpPage>
  )
}

PurchaseCheckout.options = {
  addGlobalClass: true
}
export default PurchaseCheckout
