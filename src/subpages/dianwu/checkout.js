/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import * as dianwuApi from '@/api/dianwu'
import doc from '@/subpages/doc'
import { View, Text } from '@tarojs/components'
import { AtTextarea, AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import {
  SpPage,
  SpImage,
  SpPrice,
  SpVipLabel,
  SpCell,
  SpButton,
  SpFloatLayout,
  SpCheckbox,
  SpPoster,
  SpAddress,
  SpInput as AtInput
} from '@/components'
import qs from 'qs'
import { PROMOTION_TAG } from '@/consts'
import { selectMember } from '@/store/slices/dianwu'
import { useTranslation, $t, ti, i18n } from '@/i18n'
import { pickBy, showToast, emitOpenerEvent, authSetting, validate } from '@/utils'
import imgUploader from '@/utils/upload'
import CompGoodsPrice from './comps/comp-goods-price'
import CompGift from './comps/comp-gift'
import CompCoupon from './comps/comp-coupon'
import CompDianwuSelectMember, {
  CompDianwuSelectMemberCheckoutTrigger
} from './comps/comp-dianwu-select-member'
import './checkout.scss'

const initialState = {
  itemList: [],
  itemsPromotion: [],
  totalItemNum: 0,
  itemFee: 0,
  discountFee: 0,
  totalFee: 0,
  memberDiscount: 0,
  couponDiscount: 0,
  promotionDiscount: 0,
  couponInfo: null,
  selectCoupon: null,
  couponList: [],
  remark: '',
  isOpened: false,
  couponLayout: false,
  markdown: null,
  distributor_id: null,
  prescriptionStatus: 0,
  codeStatus: false,
  checkout_order_id: null,
  priceAdjustment: 0,
  /** 现金收款确认侧拉 */
  cashSheetOpen: false,
  /** 已上传凭证图 URL，提交支付时可选传入 pos_payment_voucher_url */
  cashVoucherUrl: '',
  memberPickerOpen: false,
  deliveryAddress: null,
  deliverySheetOpen: false,
  addressPickerOpen: false,
  addrDraft: {
    receiver_name: '',
    receiver_mobile: '',
    receiver_state: '',
    receiver_city: '',
    receiver_district: '',
    receiver_address: ''
  },
  cart_type: '', // fastbuy 立即下单
}

/**
 * 现金 / POS 收款：支付接口固定 pay_type=pos；凭证图选填，有值才传 pos_payment_voucher_url。
 * @param {string} order_id
 * @param {string} [voucherUrl]
 */
function buildPosCashPaymentPayload(order_id, voucherUrl) {
  return {
    order_id,
    pay_type: 'pos',
    ...(voucherUrl ? { pos_payment_voucher_url: voucherUrl } : {})
  }
}

/** 微信小程序 chooseMedia → uploadImageFn 入参格式 */
function mapWeappMediaForUpload(tempFiles = []) {
  return tempFiles.map(({ tempFilePath, fileType, thumbTempFilePath }) => ({
    url: tempFilePath,
    file: tempFilePath,
    fileType,
    thumb: thumbTempFilePath
  }))
}

/** H5 等环境 chooseImage → uploadImageFn 入参格式 */
function mapH5ImagesForUpload(tempFiles = []) {
  return tempFiles.map((item) => ({ url: item.path, file: item }))
}

function maskTelDisplay(mobile) {
  if (!mobile || String(mobile).length < 7) return mobile || ''
  const s = String(mobile)
  if (s.length >= 11) return `${s.slice(0, 3)}****${s.slice(-4)}`
  return s
}
function DianwuCheckout(props) {
  useTranslation()

  useEffect(() => {
    const syncNavTitle = () => {
      Taro.setNavigationBarTitle({ title: $t('2b4b2b4f.89159f') })
    }
    syncNavTitle()
    i18n.on('languageChanged', syncNavTitle)
    return () => i18n.off('languageChanged', syncNavTitle)
  }, [])

  const [state, setState] = useImmer(initialState)
  const {
    itemList,
    itemsPromotion,
    totalItemNum,
    itemFee,
    discountFee,
    totalFee,
    memberDiscount,
    couponDiscount,
    promotionDiscount,
    remark,
    isOpened,
    couponLayout,
    couponList,
    couponInfo,
    selectCoupon,
    markdown,
    distributor_id,
    prescriptionStatus,
    codeStatus,
    checkout_order_id,
    priceAdjustment,
    cashSheetOpen,
    cashVoucherUrl,
    memberPickerOpen,
    deliveryAddress,
    deliverySheetOpen,
    addressPickerOpen,
    addrDraft,
    cart_type
  } = state
  const pageRef = useRef()
  const resloveResWrapRef = useRef(() => {})
  const $instance = getCurrentInstance() || {}

  const { member } = useSelector((state) => state.dianwu)
  const dispatch = useDispatch()

  // 挂单
  const onPendingOrder = async () => {
    const { confirm } = await Taro.showModal({
      title: $t('2b4b2b4f.d36db0'),
      content: $t('2b4b2b4f.a13882')
    })
    if (confirm) {
      try {
        await dianwuApi.orderPendding({
          user_id: member?.userId,
          distributor_id,
          showError: false
        })
        dispatch(selectMember(null))
        onEventCreateOrder()
        setTimeout(() => {
          Taro.navigateBack()
        }, 200)
      } catch (e) {
        if (e.res.data.data?.code == '42201') {
          const pendingModal = await Taro.showModal({
            title: $t('2b4b2b4f.6edb46'),
            content: e.res.data.data.message,
            confirmText: $t('2b4b2b4f.6dcf61')
          })
          if (pendingModal.confirm) {
            Taro.redirectTo({
              url: `/subpages/dianwu/pending-checkout?distributor_id=${distributor_id}&from=checkout`
            })
          }
        } else {
          showToast(e.res.data.data.message)
        }
      }
    }
  }

  // 收款
  const onCollection = async () => {
    if (!prescriptionStatus == 0) {
      console.log('我要跳转到新的页面啦dianwu:')
      if (!checkout_order_id) {
        const oid = await createOrder()
        if (!oid) return
        dispatch(selectMember(null))
      }
      setState((draft) => {
        draft.codeStatus = true
      })
      return
    }
    if (!isFastbuyDeliveryComplete()) return
    setState((draft) => {
      draft.isOpened = true
      // draft.orderId = order_id
    })
  }

  useEffect(() => {
    const { distributor_id, cart_type } = $instance?.router?.params
    setState((draft) => {
      draft.distributor_id = distributor_id
      draft.cart_type = cart_type
    })
  }, [])

  useEffect(() => {
    if (distributor_id) {
      getCheckout()
      getUserCardList()
    }
  }, [distributor_id])

  useEffect(() => {
    if (
      isOpened ||
      couponLayout ||
      cashSheetOpen ||
      memberPickerOpen ||
      deliverySheetOpen ||
      addressPickerOpen
    ) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [
    isOpened,
    couponLayout,
    cashSheetOpen,
    memberPickerOpen,
    deliverySheetOpen,
    addressPickerOpen
  ])

  /** EventChannel.emit 在部分运行时不可用时，改价页会通过 eventCenter 回传 */
  useEffect(() => {
    const fn = (payload) => {
      if (payload?.res) {
        resloveResWrapRef.current(payload.res, payload.markdown)
      }
    }
    Taro.eventCenter.on('onEventChangePrice', fn)
    return () => {
      Taro.eventCenter.off('onEventChangePrice', fn)
    }
  }, [])

  const getUserCardList = async () => {
    const { list } = await dianwuApi.getUserCardList({
      user_id: member?.userId,
      distributor_id
    })
    setState((draft) => {
      draft.couponList = pickBy(list, doc.dianwu.COUPON_ITEM)
    })
  }

  const getCheckout = async (deliveryOverride) => {
    let params = {
      user_id: member?.userId,
      not_use_coupon: 1,
      distributor_id
    }
    const addr = deliveryOverride ?? deliveryAddress
    if (cart_type === 'fastbuy') {
      params.cart_type = cart_type
      if (addr) {
        params.receiver_name = addr.receiver_name
        params.receiver_mobile = addr.receiver_mobile
        params.receiver_state = addr.receiver_state
        params.receiver_city = addr.receiver_city
        params.receiver_district = addr.receiver_district
        params.receiver_address = addr.receiver_address
      }
    }
    if (selectCoupon) {
      params = {
        ...params,
        not_use_coupon: 0,
        coupon_discount: selectCoupon
      }
    }
    Taro.showLoading({ title: '' })
    const res = await dianwuApi.checkout(params)
    if (res.extraTips) {
      Taro.hideLoading()
      await Taro.showModal({
        content: res.extraTips,
        confirmText: $t('edc703ce.ce2695')
      })
      Taro.navigateBack()
      return
    }
    resloveResWrap(res)
    Taro.hideLoading()
  }

  const resloveResWrap = (res, markdown) => {
    const {
      items,
      itemsPromotion: _itemsPromotion,
      totalItemNum: _totalItemNum,
      itemFee: _itemFee,
      discountFee: _discountFee,
      totalFee: _totalFee,
      memberDiscount: _memberDiscount,
      couponDiscount: _couponDiscount,
      promotionDiscount: _promotionDiscount,
      couponInfo: _couponInfo,
      prescriptionStatus: _prescriptionStatus,
      priceAdjustment: _priceAdjustment
    } = pickBy(res, doc.dianwu.CHECKOUT_GOODS_ITEM)
    setState((draft) => {
      draft.itemList = items.filter((item) => item.orderItemType != 'gift')
      draft.itemsPromotion = _itemsPromotion
      draft.totalItemNum = _totalItemNum
      draft.itemFee = _itemFee
      draft.discountFee = _discountFee
      draft.totalFee = _totalFee
      draft.memberDiscount = _memberDiscount
      draft.couponDiscount = _couponDiscount
      draft.promotionDiscount = _promotionDiscount
      draft.couponInfo = _couponInfo
      draft.selectCoupon = _couponInfo ? _couponInfo.coupon_code : null
      draft.markdown = markdown
      draft.prescriptionStatus = _prescriptionStatus
      draft.priceAdjustment = _priceAdjustment || 0
    })
  }
  resloveResWrapRef.current = resloveResWrap

  const handleChangePrice = () => {
    let params = {
      user_id: member?.userId,
      not_use_coupon: 1,
      distributor_id
    }
    if (selectCoupon) {
      params = {
        ...params,
        not_use_coupon: 0,
        coupon_discount: selectCoupon
      }
    }
    if (markdown) {
      params = {
        ...params,
        markdown
      }
    }
    console.log('handleChangePrice:', params)
    Taro.navigateTo({
      url: `/subpages/dianwu/change-price?checkout=${encodeURIComponent(qs.stringify(params))}`,
      events: {
        onEventChangePrice: ({ res, markdown }) => {
          console.log('onEventChangePrice:', markdown)
          resloveResWrap(res, markdown)
        }
      }
    })
  }

  const onChangeRemark = (e) => {
    setState((draft) => {
      draft.remark = e
    })
  }

  /** 立即下单（fastbuy）须填齐收货信息 */
  const isFastbuyDeliveryComplete = () => {
    if (cart_type !== 'fastbuy') return true
    const a = deliveryAddress
    if (!a?.receiver_name?.trim()) {
      showToast('请输入收货人姓名')
      return false
    }
    if (!validate.isMobileNum(a.receiver_mobile)) {
      showToast('请输入正确的手机号码')
      return false
    }
    if (!a.receiver_state || !a.receiver_city || !a.receiver_district) {
      showToast('请选择省市区')
      return false
    }
    if (!a?.receiver_address?.trim()) {
      showToast('请输入详细地址')
      return false
    }
    return true
  }

  const createOrder = async () => {
    if (!isFastbuyDeliveryComplete()) {
      return null
    }
    let params = {
      user_id: member?.userId,
      remark,
      not_use_coupon: 1,
      distributor_id
    }
    if (couponInfo) {
      params = {
        ...params,
        not_use_coupon: 0,
        coupon_discount: couponInfo.coupon_code
      }
    }
    if (markdown) {
      params = {
        ...params,
        markdown
      }
    }
    if (cart_type === 'fastbuy') {
      params = {
        ...params,
        cart_type: cart_type,
        receiver_name: deliveryAddress.receiver_name,
        receiver_mobile: deliveryAddress.receiver_mobile,
        receiver_state: deliveryAddress.receiver_state,
        receiver_city: deliveryAddress.receiver_city,
        receiver_district: deliveryAddress.receiver_district,
        receiver_address: deliveryAddress.receiver_address
      }
    }
    const { order_id } = await dianwuApi.createOrder(params)

    //存在处方药要把order_id存起来
    if (!prescriptionStatus == 0) {
      setState((draft) => {
        draft.checkout_order_id = order_id
      })
    }
    return order_id
  }

  // 扫码收款
  const handleClickScanCode = async () => {
    const { errMsg, result } = await Taro.scanCode()
    if (errMsg == 'scanCode:ok') {
      console.log(`handleClickScanCode:`, result)
      const order_id = await createOrder()
      if (!order_id) return
      const { trade_info } = await dianwuApi.orderPayment({
        order_id,
        auth_code: result
      })
      dispatch(selectMember(null))
      onEventCreateOrder()
      Taro.redirectTo({
        url: `/subpages/dianwu/collection-result?order_id=${order_id}&trade_id=${trade_info.trade_id}`
      })
    } else {
      showToast(errMsg)
    }
  }

  /** 关闭现金确认浮层并清空已选凭证（避免下次打开仍显示旧图） */
  const closeCashSheet = () => {
    setState((draft) => {
      draft.cashSheetOpen = false
      draft.cashVoucherUrl = ''
    })
  }

  /** 选图上传为收款凭证，仅保留首张图 URL */
  const pickCashVoucher = async () => {
    const uploadVoucherImage = async (resultFiles) => {
      if (!resultFiles?.length) return
      Taro.showLoading({ title: '' })
      try {
        const res = await imgUploader.uploadImageFn(resultFiles, 'image')
        const url = res[0]?.url
        if (url) {
          setState((draft) => {
            draft.cashVoucherUrl = url
          })
        }
      } finally {
        Taro.hideLoading()
      }
    }

    if (process.env.TARO_ENV === 'weapp') {
      authSetting('camera', async () => {
        const { tempFiles = [] } = await Taro.chooseMedia({
          count: 1,
          mediaType: ['image'],
          sourceType: ['camera', 'album'],
          camera: 'back'
        })
        if (!tempFiles[0]) return
        await uploadVoucherImage(mapWeappMediaForUpload(tempFiles))
      })
      return
    }

    const { tempFiles = [] } = await Taro.chooseImage({
      count: 1,
      sourceType: ['camera', 'album']
    })
    if (!tempFiles[0]) return
    await uploadVoucherImage(mapH5ImagesForUpload(tempFiles))
  }

  /** 现金收款：下单 → POS 支付 → 跳转收款结果（凭证 URL 选填） */
  const confirmCashReceipt = async () => {
    try {
      const order_id = await createOrder()
      if (!order_id) return
      await dianwuApi.orderPayment(buildPosCashPaymentPayload(order_id, cashVoucherUrl))
      dispatch(selectMember(null))
      onEventCreateOrder()
      closeCashSheet()
      Taro.redirectTo({ url: `/subpages/dianwu/collection-result?order_id=${order_id}&pay_type=pos` })
    } catch (e) {
      showToast(e?.res?.data?.data?.message || e?.message || '操作失败')
    }
  }

  /** 从收款弹窗进入现金流程：关弹窗、开侧拉、重置凭证 */
  const handleClickCash = () => {
    setState((draft) => {
      draft.isOpened = false
      draft.cashSheetOpen = true
      draft.cashVoucherUrl = ''
    })
  }

  //线下转账
  const handleClickOfflinePay = async () => {
    Taro.showLoading({ title: $t('2b4b2b4f.30ade0'), mask: true })
    const order_id = await createOrder()
    await dianwuApi.orderPayment({
      order_id,
      pay_type: 'offline_pay',
      pay_channel: 'offline_pay'
    })
    Taro.hideLoading()
    Taro.showToast({
      icon: 'none',
      title: $t('2b4b2b4f.f4cb7f')
    })

    setTimeout(() => {
      Taro.redirectTo({
        url: `/pages/cart/offline-transfer?has_check=false&isDianwu=true&order_id=${order_id}`
      })
      dispatch(selectMember(null))
      onEventCreateOrder()
    }, 400)
  }

  const onEventCreateOrder = () => {
    emitOpenerEvent('onEventFetchOrder')
  }

  // 使用优惠券
  const handleUseCoupon = async () => {
    getCheckout()
    setState((draft) => {
      draft.couponLayout = false
    })
  }

  const couponIsChecked = ({ couponCode }) => {
    if (selectCoupon == couponCode) {
      return true
    } else {
      return false
    }
  }

  const onChangeCoupon = ({ couponCode }, e) => {
    setState((draft) => {
      draft.selectCoupon = e ? couponCode : null
    })
  }

  const openDeliverySheet = () => {
    setState((draft) => {
      draft.deliverySheetOpen = true
      const d = draft.deliveryAddress
      draft.addrDraft = d
        ? {
            receiver_name: d.receiver_name,
            receiver_mobile: d.receiver_mobile,
            receiver_state: d.receiver_state,
            receiver_city: d.receiver_city,
            receiver_district: d.receiver_district,
            receiver_address: d.receiver_address
          }
        : {
            receiver_name: '',
            receiver_mobile: '',
            receiver_state: '',
            receiver_city: '',
            receiver_district: '',
            receiver_address: ''
          }
    })
  }

  const closeDeliverySheet = () => {
    setState((draft) => {
      draft.deliverySheetOpen = false
      draft.addressPickerOpen = false
    })
  }

  const onAddressRegionPick = (selectValue) => {
    setState((draft) => {
      draft.addrDraft.receiver_state = selectValue[0]?.label || ''
      draft.addrDraft.receiver_city = selectValue[1]?.label || ''
      draft.addrDraft.receiver_district = selectValue[2]?.label || ''
    })
  }

  const confirmDeliveryAddress = () => {
    const {
      receiver_name,
      receiver_mobile,
      receiver_state,
      receiver_city,
      receiver_district,
      receiver_address
    } = addrDraft
    if (!receiver_name?.trim()) return showToast('请输入收货人姓名')
    if (!validate.isMobileNum(receiver_mobile)) return showToast('请输入正确的手机号码')
    if (!receiver_state || !receiver_city || !receiver_district) return showToast('请选择省市区')
    if (!receiver_address?.trim()) return showToast('请输入详细地址')
    const saved = {
      receiver_name: receiver_name.trim(),
      receiver_mobile,
      receiver_state,
      receiver_city,
      receiver_district,
      receiver_address: receiver_address.trim()
    }
    setState((draft) => {
      draft.deliveryAddress = saved
      draft.deliverySheetOpen = false
      draft.addressPickerOpen = false
    })
    if (cart_type === 'fastbuy') {
      getCheckout(saved)
    }
  }

  const regionLineText =
    addrDraft.receiver_state && addrDraft.receiver_city && addrDraft.receiver_district
      ? `${addrDraft.receiver_state} | ${addrDraft.receiver_city} | ${addrDraft.receiver_district}`
      : ''

  return (
    <SpPage
      className='page-dianwu-checkout'
      ref={pageRef}
      renderFooter={
        <View className='btn-wrap'>
          <SpButton
            resetText={$t('2b4b2b4f.ee5b0a')}
            confirmText={$t('2b4b2b4f.2eee29')}
            onConfirm={onCollection}
            onReset={onPendingOrder}
          ></SpButton>
        </View>
      }
    >
      {!member && (
        <CompDianwuSelectMemberCheckoutTrigger
          onOpen={() => {
            setState((draft) => {
              draft.memberPickerOpen = true
            })
          }}
        />
      )}

      {cart_type === 'fastbuy' && (
        <View className='checkout-delivery-row' onClick={openDeliverySheet}>
          {!deliveryAddress ? (
            <>
              <Text className='checkout-delivery-row__placeholder'>填写顾客收货地址</Text>
              <Text className='iconfont icon-qianwang-01 checkout-delivery-row__arrow' />
            </>
          ) : (
            <>
              <View className='checkout-delivery-row__main'>
                <View className='checkout-delivery-row__line1'>
                  <Text className='checkout-delivery-row__name'>{deliveryAddress.receiver_name}</Text>
                  <Text className='checkout-delivery-row__tel'>
                    {maskTelDisplay(deliveryAddress.receiver_mobile)}
                  </Text>
                </View>
                <Text className='checkout-delivery-row__addr'>
                  {`${deliveryAddress.receiver_state}${deliveryAddress.receiver_city}${deliveryAddress.receiver_district}${deliveryAddress.receiver_address}`}
                </Text>
              </View>
              <Text className='iconfont icon-qianwang-01 checkout-delivery-row__arrow' />
            </>
          )}
        </View>
      )}

      <View className='block-user'>
        <SpImage src={member?.avatar || 'user_icon.png'} width={80} height={80} />
        <View className='user-info'>
          <View className='info-hd'>
            <Text className='name'>{member?.username || $t('2b4b2b4f.1a75c1')}</Text>
            <Text className='mobile'>{member?.mobile}</Text>
          </View>
          <View className='info-bd'>
            <View className='filed-item'>
              <Text className='label'>{$t('2b4b2b4f.5498d6')}</Text>
              <Text className='value'>{member?.point || 0}</Text>
            </View>
            <View className='filed-item'>
              <Text className='label'>{$t('2b4b2b4f.0c9cbf')}</Text>
              <Text className='value'>{member?.couponNum || 0}</Text>
            </View>
            {member?.vipDiscount < 10 && (
              <View className='filed-item'>
                <Text className='label'>{$t('2b4b2b4f.287fa3')}</Text>
                <Text className='value'>{member?.vipDiscount || 0}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View className='block-goods'>
        {itemList.map((item, index) => (
          <View className='item-wrap' key={`item-wrap__${index}`}>
            <View className='item-hd'>
              <SpImage src={item.pic} width={110} height={110} />
            </View>
            <View className='item-bd'>
              <View className='title'>
                {item?.isMedicine == 1 && item?.isPrescription == 1 && (
                  <Text className='prescription-drug'>{$t('7d82f6d2.e8b7e1')}</Text>
                )}
                {item.name}
              </View>
              {item.itemSpecDesc && <View className='sku'>{item.itemSpecDesc}</View>}
              <View className='ft-info'>
                <CompGoodsPrice info={item} />
                <View className='num'>{ti('2b4b2b4f.43ebc8', [item.num])}</View>
              </View>
            </View>
          </View>
        ))}
      </View>
      {itemsPromotion.map((item, idx) => (
        <View className='promotion-item' key={`promotion-item__${idx}`}>
          {/* {item.activity_type == 'full_gift' && (
            <View className='gift-item'>
              <View className='activity-tag'>{PROMOTION_TAG()[item.activity_type]}</View>
              <View className='activity-content'>
                {item.activity_desc?.gifts?.map((gift, index) => (
                  <View className='gift-item' key={`gift-item__${idx}__${index}`}>
                    <View className='gift-item__head'>
                      <View className='gift-name'>{gift.itemName}</View>
                      <View className='num'>x {gift.gift_num}</View>
                    </View>
                    <View className='gift-item__body'>
                      <Text className='sku'>{gift?.item_spec_desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )} */}

          {/* {item.activity_type != 'full_gift' && (
            <View className='activity-item'>
              <View className='activity-tag'>{PROMOTION_TAG()[item.activity_type]}</View>
              <View className='activity-content'>{item.activity_name}</View>
            </View>
          )} */}
          {item.activity_type == 'full_gift' && (
            <View className='activity-item'>
              <View className='activity-tag'>{PROMOTION_TAG()[item.activity_type]}</View>
              <View className='activity-content'>{item.item_name}</View>
            </View>
          )}
        </View>
      ))}
      {/* {itemsPromotion && (
        <View className='block-gift'>
          <View className='gift-tag'>赠品</View>
          {itemsPromotion.map((item, idx) => {
            return item.activity_desc?.gifts?.map((gift, index) => (
              <CompGift info={gift} key={`gift-item__${idx}_${index}`} />
            ))
          })}
        </View>
      )} */}

      <View className='block-coupon'>
        {couponList.length > 0 && (
          <SpCell
            title={$t('2b4b2b4f.dd244b')}
            border
            isLink
            onClick={() => {
              setState((draft) => {
                draft.couponLayout = true
              })
            }}
          >
            <Text>{couponInfo ? couponInfo.rule : $t('edc703ce.708c9d')}</Text>
          </SpCell>
        )}

        {/* <SpCell title='使用积分' isLink>
          暂无可用
        </SpCell> */}
      </View>

      <View className='block-checkout-info'>
        <SpCell title={ti('2b4b2b4f.631d07', [totalItemNum])} border>
          <SpPrice value={itemFee} />
        </SpCell>
        <SpCell title={$t('2b4b2b4f.7d9bcd')} border>
          <SpPrice value={`-${promotionDiscount}`} />
        </SpCell>
        <SpCell title={$t('2b4b2b4f.eababe')} border>
          <SpPrice value={`-${memberDiscount}`} />
        </SpCell>
        <SpCell title={$t('2b4b2b4f.ca66f9')} border>
          <SpPrice value={`-${couponDiscount}`} />
        </SpCell>
        {priceAdjustment > 0 && (
          <SpCell title='改价优惠' border>
            <SpPrice value={`-${priceAdjustment}`} />
          </SpCell>
        )}
        {/* <SpCell title='积分抵扣' border>
          <SpPrice value={-50} />
        </SpCell> */}
        <SpCell title={$t('2b4b2b4f.ba5d3e')}>
          <SpPrice value={totalFee} />
        </SpCell>
      </View>

      <View className='block-remark'>
        <View className='title'>{$t('2b4b2b4f.bb84d6')}</View>
        <AtTextarea
          count
          value={remark}
          onChange={onChangeRemark}
          maxLength={150}
          placeholder={$t('2b4b2b4f.4f2387')}
        ></AtTextarea>
      </View>

      {!prescriptionStatus == 0 && (
        <View className='cart-checkout__title'>{$t('71426282.417975')}</View>
      )}

      <AtModal
        className='collection-modal'
        isOpened={isOpened}
        onClose={() => {
          setState((draft) => {
            draft.isOpened = false
          })
        }}
      >
        <AtModalHeader>{$t('2b4b2b4f.ba5d3e')}</AtModalHeader>
        <AtModalContent>
          <View className='total-mount'>
            <View className='total-mount__row'>
              <SpPrice size={48} value={totalFee} />
              <View className='change-price-btn' onClick={handleChangePrice}>
                <Text className='iconfont icon-edit' />
                <Text className='change-price-btn__txt'>改价</Text>
              </View>
            </View>
          </View>
          {/* <SpCell isLink border>
            <Text className='iconfont icon-weixinzhifu'></Text>
            <Text>微信收款</Text>
          </SpCell> */}
          <SpCell isLink border onClick={handleClickScanCode}>
            <Text className='iconfont icon-saoma'></Text>
            <Text>{$t('2b4b2b4f.1bcb84')}</Text>
          </SpCell>
          <SpCell isLink onClick={handleClickCash}>
            <Text className='iconfont icon-money1'></Text>
            <Text>{$t('2b4b2b4f.6187a0')}</Text>
          </SpCell>
          {/* <SpCell isLink onClick={handleClickOfflinePay}>
            <Text className='iconfont icon-money1'></Text>
            <Text>线下银行转账</Text>
          </SpCell> */}
        </AtModalContent>
      </AtModal>

      <CompDianwuSelectMember
        open={memberPickerOpen}
        distributor_id={distributor_id}
        onClose={() => {
          setState((draft) => {
            draft.memberPickerOpen = false
          })
        }}
        onAfterSelect={() => {
          getCheckout()
          getUserCardList()
        }}
      />

      {cart_type === 'fastbuy' && (
        <>
          <SpFloatLayout
            title='填写收货信息'
            className='checkout-delivery-sheet'
            open={deliverySheetOpen}
            onClose={closeDeliverySheet}
            renderFooter={
              <View className='checkout-delivery-sheet__confirm' onClick={confirmDeliveryAddress}>
                确认
              </View>
            }
          >
            <View className='checkout-delivery-sheet__field'>
              <AtInput
                placeholder='收货人姓名'
                value={addrDraft.receiver_name}
                onChange={(v) => {
                  setState((draft) => {
                    draft.addrDraft.receiver_name = v
                  })
                }}
              />
            </View>
            <View className='checkout-delivery-sheet__field'>
              <AtInput
                placeholder='收货人手机号码'
                type='number'
                maxLength={11}
                value={addrDraft.receiver_mobile}
                onChange={(v) => {
                  setState((draft) => {
                    draft.addrDraft.receiver_mobile = v
                  })
                }}
              />
            </View>
            <View
              className='checkout-delivery-sheet__field checkout-delivery-sheet__field--region'
              onClick={() => {
                setState((draft) => {
                  draft.addressPickerOpen = true
                })
              }}
            >
              <Text
                className={
                  regionLineText ? 'checkout-delivery-sheet__region-txt' : 'checkout-delivery-sheet__region-ph'
                }
              >
                {regionLineText || '省 | 市 | 区'}
              </Text>
              <Text className='iconfont icon-arrowDown checkout-delivery-sheet__region-icon' />
            </View>
            <View className='checkout-delivery-sheet__field checkout-delivery-sheet__field--detail'>
              <AtTextarea
                count={false}
                value={addrDraft.receiver_address}
                maxLength={120}
                placeholder='详细地址'
                onChange={(v) => {
                  setState((draft) => {
                    draft.addrDraft.receiver_address = v
                  })
                }}
              />
            </View>
          </SpFloatLayout>

          <SpAddress
            isOpened={addressPickerOpen}
            onClose={() => {
              setState((draft) => {
                draft.addressPickerOpen = false
              })
            }}
            onChange={onAddressRegionPick}
          />
        </>
      )}

      <SpFloatLayout
        title='现金收款确认'
        className='cash-confirm-sheet'
        open={cashSheetOpen}
        onClose={closeCashSheet}
        renderFooter={
          <View className='cash-confirm-sheet__btn' onClick={confirmCashReceipt}>
            确认已收到
          </View>
        }
      >
        <View className='cash-confirm-sheet__desc'>请确认是否收到商品款，可上传收款凭证（选填）</View>
        <View className='cash-confirm-sheet__field-label'>上传凭证（选填）</View>
        <View className='cash-confirm-sheet__upload' onClick={pickCashVoucher}>
          {cashVoucherUrl ? (
            <SpImage src={cashVoucherUrl} width={200} height={200} mode='aspectFill' />
          ) : (
            <>
              <Text className='iconfont icon-xiangji cash-confirm-sheet__upload-icon' />
              <Text className='cash-confirm-sheet__upload-txt'>上传凭证</Text>
            </>
          )}
        </View>
      </SpFloatLayout>

      <SpFloatLayout
        title={$t('2b4b2b4f.2f3635')}
        className='coupon-layout'
        open={couponLayout}
        onClose={() => {
          setState((draft) => {
            draft.couponLayout = false
          })
        }}
        renderFooter={
          <SpButton
            resetText={$t('61e2d21a.625fb2')}
            confirmText={$t('61e2d21a.e83a25')}
            onConfirm={handleUseCoupon}
            onReset={() => {
              setState((draft) => {
                draft.couponLayout = false
              })
            }}
          ></SpButton>
        }
      >
        <View className='coupon-list'>
          {couponList.map((item, index) => (
            <CompCoupon info={item} key={`coupon-item__${index}`}>
              <SpCheckbox
                checked={couponIsChecked(item)}
                onChange={onChangeCoupon.bind(this, item)}
              />
            </CompCoupon>
          ))}
        </View>
      </SpFloatLayout>

      {codeStatus && (
        <SpPoster
          info={checkout_order_id}
          type='prescriptionCode'
          onClose={() => {
            setState((draft) => {
              draft.codeStatus = false
            })
          }}
        />
      )}
    </SpPage>
  )
}

DianwuCheckout.options = {
  addGlobalClass: true
}

export default DianwuCheckout
