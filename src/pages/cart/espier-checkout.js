import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton, AtInput } from 'taro-ui'
import { SpPage, SpPrice, SpCell, SpOrderItem, SpCashier, SpGoodsCell } from '@/components'
import { View, Text } from '@tarojs/components'
import { changeCoupon } from '@/store/slices/cart'
import { updateChooseAddress } from '@/store/slices/user'
import { changeZitiStore } from '@/store/slices/shop'
import {
  isObjectsValue,
  isWeixin,
  pickBy,
  authSetting,
  merchantIsvaild,
  showToast,
  isWeb,
  redirectUrl,
  isAPP,
  log,
  VERSION_STANDARD,
  VERSION_PLATFORM
} from '@/utils'
import { useAsyncCallback, useLogin, usePayment } from '@/hooks'
import { PAYMENT_TYPE, TRANSFORM_PAYTYPE } from '@/consts'
import _cloneDeep from 'lodash/cloneDeep'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import S from '@/spx'

import { initialState } from './const'

import CompDeliver from './comps/comp-deliver'
import CompSelectPackage from './comps/comp-selectpackage'
import CompPaymentPicker from './comps/comp-paymentpicker'
import CompPointUse from './comps/comp-pointuse'

import './espier-checkout.scss'

function CartCheckout(props) {
  const $instance = getCurrentInstance()
  const { isLogin, isNewUser, updatePolicyTime, getUserInfoAuth } = useLogin({
    autoLogin: true
  })

  const { cashierPayment } = usePayment()

  const [state, setState] = useAsyncCallback(initialState)

  const dispatch = useDispatch()
  const pageRef = useRef()
  const { userInfo, address } = useSelector((state) => state.user)
  const { colorPrimary, pointName, openStore } = useSelector((state) => state.sys)
  const { coupon } = useSelector((state) => state.cart)
  const shop = useSelector((state) => state.shop)

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
    isNeedPackage,
    isPackageOpend,
    isPaymentOpend,
    openCashier
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
  } = $instance.router?.params || {}

  useEffect(() => {
    if (isLogin) {
      getTradeSetting()
      // tode 此处应有埋点
      return () => {
        dispatch(changeCoupon()) // 清空优惠券信息
        dispatch(updateChooseAddress(null)) // 清空地址信息
        dispatch(changeZitiStore()) // 清空编辑自提列表选中的数据
      }
    }
  }, [isLogin])

  useEffect(() => {
    if (isNewUser) {
      Taro.redirectTo({
        url: `/subpages/member/index`
      })
    }
  }, [isNewUser])

  useEffect(() => {
    calcOrder()
  }, [address, coupon, payType, shop.zitiShop, point_use])

  useEffect(() => {
    if (isPackageOpend || openCashier) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [isPackageOpend, openCashier])

  // 是否需要包装
  const getTradeSetting = async () => {
    let data = await api.trade.tradeSetting()
    setState((draft) => {
      draft.packInfo = data
    })
  }

  // 选择是否需要包装
  const changeNeedPackage = (isNeedPackage) => {
    setState((draft) => {
      draft.isNeedPackage = isNeedPackage
      draft.isPackageOpend = false
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
      draft.pointInfo = { ...pointInfo, point_use: 0 }
      draft.payType = defalutPaytype
    })
  }

  const handlePointUseChange = (point_use, payType) => {
    setState((draft) => {
      draft.point_use = point_use
      draft.payType = payType
      draft.isPointOpenModal = false
    })
  }

  const onSubmitPayChange = async () => {
    if (submitLoading) return
    // 判断当前店铺关联商户是否被禁用 isVaild：true有效
    const { status: isValid } = await api.distribution.merchantIsvaild({ distributor_id: dtid })
    if (!isValid) {
      showToast('该商品已下架')
      return
    }

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
      if (userInfo.deposit < totalInfo.total_fee) {
        const { confirm } = await Taro.showModal({
          content: '余额额度不足，请充值',
          cancelText: '取消',
          confirmColor: colorPrimary,
          confirmText: '去充值'
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
        title: '余额支付',
        content: `确认使用余额支付吗？`,
        cancelText: '取消',
        confirmColor: colorPrimary,
        confirmText: '确认'
      })
      if (!confirm) {
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

    let orderInfo
    let orderId

    if ((isWeb || isAPP()) && payType !== 'deposit') {
      try {
        const h5ResInfo = await api.trade.h5create({
          ...params,
          pay_type: isAPP() ? payType : TRANSFORM_PAYTYPE[payType]
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
        const resInfo = await api.trade.create(params)
        orderInfo = resInfo
        orderId = resInfo.trade_info.order_id
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

    // 储值支付
    if (payType === 'deposit') {
      Taro.redirectTo({ url: `/pages/cart/cashier-result?order_id=${orderId}` })
    } else {
      if (params.pay_type == 'wxpayjs') {
        // 微信客户端code授权
        const loc = window.location
        const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-result?order_id=${orderId}`
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

  const handleSwitchExpress = ({ receipt_type, distributorInfo }) => {
    // 切换配送模式
    setState((draft) => {
      draft.receiptType = receipt_type
      draft.distributorInfo = distributorInfo
    })
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
      url: `/pages/store/ziti-list?${qs.stringify(query)}`
    })
  }

  // 开发票
  const handleInvoiceClick = () => {
    authSetting('invoiceTitle', async () => {
      const res = await Taro.chooseInvoiceTitle()
      if (res.errMsg === 'chooseInvoiceTitle:ok') {
        log.debug('[invoice] info:', res)
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
    const { cart_type, distributor_id: id } = paramsInfo
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

  const handlePaymentShow = () => {
    setState((draft) => {
      // draft.isPaymentOpend = true
      draft.openCashier = true
    })
  }

  // 商家留言
  const handleRemarkChange = (val) => {
    setState((draft) => {
      draft.remark = val
    })
  }

  const calcOrder = async () => {
    Taro.showLoading()
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
      real_use_point
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
    console.log('xxx', pickBy(items, doc.checkout.CHECKOUT_GOODS_ITEM))
    setState((draft) => {
      draft.detailInfo = pickBy(items, doc.checkout.CHECKOUT_GOODS_ITEM)
      draft.totalInfo = total_info
      draft.paramsInfo = { ...paramsInfo, ...cus_parmas }
      draft.pointInfo = point_info
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

    let ziti_shopid
    let receiver = pickBy(address, doc.checkout.RECEIVER_ADDRESS)
    if (receiptType === 'ziti') {
      receiver = pickBy(distributorInfo, doc.checkout.ZITI_ADDRESS)
      if (shop.zitiShop) {
        const { distributor_id } = shop.zitiShop
        ziti_shopid = distributor_id
        receiver = pickBy(shop.zitiShop, doc.checkout.ZITI_ADDRESS)
      }
    }

    let cus_parmas = {
      ...paramsInfo,
      ...activity,
      ...receiver,
      receipt_type: receiptType,
      cart_type,
      order_type: bargain_id ? 'bargain' : value,
      promotion: 'normal',
      // member_discount: 0,
      // coupon_discount: 0,
      // not_use_coupon: 0,
      isNostores: openStore ? 0 : 1, // 这个传参需要和后端在确定一下
      point_use,
      pay_type: payType,
      distributor_id: receiptType === 'ziti' && ziti_shopid ? ziti_shopid : dtid
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

    if (coupon) {
      const { type, value } = coupon
      cus_parmas.not_use_coupon = value?.code ? 0 : 1
      cus_parmas.coupon_discount = type === 'coupon' && value.code ? value.code : undefined
      cus_parmas.member_discount = type === 'member' && value ? 1 : 0
    }

    const { packName, packDes } = packInfo
    cus_parmas.pack = isNeedPackage ? { packName, packDes } : undefined
    if (bargain_id) {
      cus_parmas.bargain_id = bargain_id
    }
    // if (submitLoading) {
    // 提交时候获取参数 把留言信息传进去
    cus_parmas.remark = remark
    cus_parmas.pay_type = totalInfo.freight_type === 'point' ? 'point' : payType
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
          {`共${totalInfo.items_count}件商品　总计:`}
          <SpPrice unit='cent' className='primary-price' value={totalInfo.total_fee} />
        </View>
        <AtButton
          circle
          type='primary'
          loading={submitLoading}
          disabled={receiptType !== 'ziti' && !isObjectsValue(address)}
          onClick={onSubmitPayChange}
        >
          提交订单
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
              商品清单 <Text style={{ color: '#222' }}>（{totalInfo.items_count}）</Text>
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
    <SpPage ref={pageRef} className='page-cart-checkout' renderFooter={renderFooter()}>
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
          onEidtZiti={handleEditZitiClick}
        />
      </View>

      {renderGoodsComp()}

      {type !== 'limited_time_sale' && type !== 'group' && type !== 'seckill' && !bargain_id && (
        <SpCell
          isLink
          className='cart-checkout__coupons'
          title='优惠券'
          onClick={handleCouponsClick}
          value={couponText || '请选择'}
        />
      )}

      {isWeixin && !bargain_id && totalInfo.invoice_status && (
        <SpCell
          isLink
          title='开发票'
          className='cart-checkout__invoice'
          onClick={handleInvoiceClick}
        >
          <View className='invoice-title'>
            {invoiceTitle && (
              <View
                onClick={(e) => resetInvoice(e)}
                className='iconfont icon-close invoice-close'
              />
            )}
            {invoiceTitle || '否'}
          </View>
        </SpCell>
      )}

      {packInfo.is_open && (
        <SpCell
          isLink
          className='cart-checkout__pack'
          title={packInfo.packName}
          onClick={() => {
            setState((draft) => {
              draft.isPackageOpend = true
            })
          }}
        >
          <View className='invoice-title'>{isNeedPackage ? '需要' : '不需要'}</View>
        </SpCell>
      )}

      {VERSION_STANDARD && pointInfo.is_open_deduct_point && (
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
      )}

      {!bargain_id && (
        <View>
          <SpCell
            isLink
            className='cart-checkout__pay'
            title='支付方式'
            onClick={handlePaymentShow}
          >
            {totalInfo.deduction && (
              <Text>
                {totalInfo.remainpt}
                {`${pointName}可用`}
              </Text>
            )}
            <Text className='invoice-title'>{payType ? PAYMENT_TYPE[payType] : '请选择'}</Text>
          </SpCell>
          {totalInfo.deduction && (
            <View>
              可用{totalInfo.point}
              {pointName}，抵扣 <SpPrice unit='cent' value={totalInfo.deduction} />
              包含运费 <SpPrice unit='cent' value={totalInfo.freight_fee} />
            </View>
          )}
        </View>
      )}

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

      <CompPointUse
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

      <CompSelectPackage
        isOpened={isPackageOpend}
        value={isNeedPackage}
        info={packInfo}
        onClose={() => {
          setState((draft) => {
            draft.isPackageOpend = false
          })
        }}
        onChange={(value) => {
          setState((draft) => {
            draft.isNeedPackage = value
          })
        }}
      />

      <SpCashier
        isOpened={openCashier}
        paymentAmount={totalInfo.freight_fee}
        value={payType}
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

CartCheckout.options = {
  addGlobalClass: true
}
export default CartCheckout
