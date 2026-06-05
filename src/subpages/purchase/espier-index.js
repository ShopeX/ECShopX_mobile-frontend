/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import qs from 'qs'
import api from '@/api'
import doc from '@/doc'
import { navigateTo, pickBy, throttle, getDistributorId, showToast } from '@/utils'
import { useLogin, useDepChange } from '@/hooks'
import {
  fetchCartList,
  deleteCartItem,
  updateCartItemNum,
  updateCount
} from '@/store/slices/purchase'
import {
  SpPage,
  SpPrice,
  SpLogin,
  SpDefault,
  SpCheckboxNew,
  SpPrivacyModal,
  SpPurchaseEnterpriseBar,
  SpLoading
} from '@/components'
import CompGoodsItem from '@/pages/cart/comps/comp-goodsitem'
import CompPurchaseNav from '@/pages/purchase/comps/comp-purchase-nav'
import CompPurchaseActionbar from '@/subpages/purchase/comps/comp-purchase-actionbar'
import CompPurchaseQuotaSheet from '@/subpages/purchase/comps/comp-purchase-quota-sheet'
import { useTranslation, $t, ti } from '@/i18n'
import './espier-index.scss'

const initialState = {
  current: 0, // 0:普通商品  1:跨境商品
  policyModal: false, // 隐私弹框
  cartUpdating: false
}

function toPositiveInt(value) {
  const n = parseInt(value, 10)
  return Number.isNaN(n) || n <= 0 ? null : n
}

function toNonNegativeInt(value) {
  const n = parseInt(value, 10)
  return Number.isNaN(n) || n < 0 ? null : n
}

function resolvePurchaseCartItemMax(item = {}) {
  const stock = toNonNegativeInt(item.store)
  const limitNum = toPositiveInt(item.limit_num ?? item.limitNum)
  const currentNum = toNonNegativeInt(item.num) || 0
  if (!limitNum) {
    return stock != null ? Math.max(currentNum, stock) : 999999
  }

  const aggregateNum = toNonNegativeInt(item.aggregate_num ?? item.aggregateNum) || 0
  const limitRemain = Math.max(0, limitNum - aggregateNum)
  const limitMax = Math.max(currentNum, limitRemain)
  const stockMax = stock != null ? Math.min(stock, limitMax) : limitMax
  return Math.max(currentNum, stockMax)
}

function CartIndex() {
  const { i18n } = useTranslation()
  const { isLogin } = useLogin({
    autoLogin: true,
    policyUpdateHook: (isUpdate) => {
      isUpdate && onPolicyChange(true)
    }
  })

  const dispatch = useDispatch()
  const $instance = getCurrentInstance() || {}
  const router = $instance?.router

  const [state, setState] = useImmer(initialState)
  const { current, policyModal, cartUpdating } = state
  const cartUpdatingRef = useRef(false)

  const { colorPrimary } = useSelector((state) => state.sys)
  const {
    validCart = [],
    invalidCart = [],
    purchase_share_info = {},
    persist_purchase_share_info = {},
    curDistributorId,
    curEnterpriseId,
    cartCount = 0,
    isDiscountDescriptionEnabled,
    discountDescription
  } = useSelector((state) => state.purchase)

  const [activityInfo, setActivityInfo] = useState({})
  const [quotaSheetOpen, setQuotaSheetOpen] = useState(false)
  const [enterpriseName, setEnterpriseName] = useState('')
  const activityId = purchase_share_info?.activity_id
  const enterpriseId = purchase_share_info?.enterprise_id

  const loadActivityInfo = useCallback(async () => {
    if (!activityId || !enterpriseId) {
      setActivityInfo({})
      return
    }
    try {
      const data = await api.purchase.getEmployeeActivitydata({
        activity_id: activityId,
        enterprise_id: enterpriseId
      })
      setActivityInfo(data || {})
    } catch (e) {
      setActivityInfo({})
    }
  }, [activityId, enterpriseId])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!activityId || !enterpriseId) {
        if (!cancelled) setActivityInfo({})
        return
      }
      try {
        const data = await api.purchase.getEmployeeActivitydata({
          activity_id: activityId,
          enterprise_id: enterpriseId
        })
        if (!cancelled) setActivityInfo(data || {})
      } catch (e) {
        if (!cancelled) setActivityInfo({})
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activityId, enterpriseId])

  useEffect(() => {
    const eid =
      curEnterpriseId ||
      router?.params?.enterprise_id ||
      purchase_share_info?.enterprise_id ||
      persist_purchase_share_info?.enterprise_id
    if (!eid) {
      setEnterpriseName('')
      return
    }
    const load = async () => {
      try {
        const data = await api.purchase.getUserEnterprises({
          disabled: 0,
        })
        const found = data?.find((x) => x.enterprise_id == eid)
        setEnterpriseName(found?.name || found?.enterprise_name || '')
      } catch (e) {
        setEnterpriseName('')
      }
    }
    load()
  }, [
    curEnterpriseId,
    purchase_share_info?.enterprise_id,
    persist_purchase_share_info?.enterprise_id,
    router?.params?.enterprise_id
  ])

  const remainingAmountText = useMemo(() => {
    const cents =
      activityInfo?.surplus_limitfee ?? activityInfo?.left_fee ?? activityInfo?.fee?.left_fee
    if (cents == null || cents === '') return '¥0.00'
    const n = Number(cents) / 100
    if (Number.isNaN(n)) return '¥0.00'
    return `¥${n.toFixed(2)}`
  }, [activityInfo])

  const quotaFeeCents = useMemo(
    () => ({
      total: activityInfo?.total_limitfee ?? activityInfo?.limit_fee,
      used: activityInfo?.used_limitfee ?? activityInfo?.aggregate_fee,
      remaining:
        activityInfo?.surplus_limitfee ?? activityInfo?.left_fee ?? activityInfo?.fee?.left_fee
    }),
    [activityInfo]
  )

  const isPurchaseShare = useMemo(
    () => !!(activityInfo?.is_employee && activityInfo?.if_relative_join),
    [activityInfo]
  )

  const onActionBarShare = useCallback(() => {
    if (!isPurchaseShare) {
      showToast($t('61144037.63023a'))
      return
    }
    if (purchase_share_info.surplus_share_limitnum == '0') {
      Taro.showToast({ title: $t('63b11dbe.ce0559'), icon: 'none' })
      return
    }
    navigateTo('/subpages/purchase/share')
  }, [isPurchaseShare, purchase_share_info])

  const onActionBarQuota = useCallback(() => {
    setQuotaSheetOpen(true)
  }, [])
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('a2d3a891.c017be') })
  }, [i18n.language])

  useEffect(() => {
    if (isLogin) fetch()
  }, [isLogin])

  useDidShow(() => {
    if (isLogin) fetch()
    loadActivityInfo()
  })

  const fetch = () => {
    if (isLogin) {
      getCartList()
    }
  }

  const getCartList = async () => {
    const { activity_id, enterprise_id } = purchase_share_info
    const { type = 'distributor' } = router?.params || {}
    const params = {
      shop_type: type,
      enterprise_id,
      activity_id
    }
    await dispatch(
      fetchCartList({ ...params, distributor_id: curDistributorId ?? getDistributorId() })
    )
    await dispatch(updateCount(params))
  }

  const resolveActiveGroup = () => {
    const groupsList = validCart.map((item) => {
      // used_activity：满减  activity_grouping：满减&满折 gift_activity：满赠  plus_buy_activity:加价购
      const { list, plus_buy_activity = [] } = item
      // 加购价
      let all_plus_itemid_list = [] // 加价购商品id
      let no_active_item = [] // 没有活动的商品
      let cus_plus_item_list = plus_buy_activity.map((plusitem) => {
        const { plus_item, activity_item_ids, activity_id } = plusitem
        // 加购价换购的商品
        let exchange_item = null
        if (plus_item) {
          exchange_item = pickBy(plus_item, { ...doc.cart.PLUS_BUY_ITEM, activity_id })
        }
        all_plus_itemid_list.push(activity_item_ids)
        const general_goods = list.filter((k) =>
          (activity_item_ids || []).some((id) => String(id) === String(k.item_id))
        )
        return {
          ...plusitem,
          cus_general_goods_list: general_goods,
          cus_plus_exchange_item_list: exchange_item
        }
      })
      all_plus_itemid_list = all_plus_itemid_list.toString().split(',')
      const goodsMap = reduceTransform(list, 'cart_id')
      for (const key in goodsMap) {
        if (!all_plus_itemid_list.includes(String(goodsMap[key].item_id))) {
          no_active_item.push(goodsMap[key])
        }
      }
      cus_plus_item_list.push({
        discount_desc: null,
        cus_general_goods_list: no_active_item.reverse(),
        cus_plus_exchange_item_list: null
      })
      return {
        ...item,
        cus_plus_item_list
        // cus_activity_list
      }
    })
    return groupsList || []
  }

  const reduceTransform = (list, label) => {
    const newList = list.reduce((acc, val) => {
      acc[val[label]] = val
      return acc
    }, {})
    return newList
  }

  // const onChangeSpTab = (current) => {
  //   setState(draft => {
  //     draft.current = current
  //   })
  //   // setState({
  //   //   ...state,
  //   //   current
  //   // })
  // }

  const onChangeGoodsIsCheck = async (item, type, checked) => {
    const { activity_id, enterprise_id } = purchase_share_info
    let parmas = { is_checked: checked, activity_id, enterprise_id }
    if (type === 'all') {
      const cartIds = item.list.map((item) => item.cart_id)
      parmas['cart_id'] = cartIds
    } else {
      parmas['cart_id'] = item.cart_id
    }
    try {
      await api.purchase.purchaseSelect(parmas)
    } catch (e) {
      console.log(e)
    }
    getCartList()
  }

  const onDeleteCartGoodsItem = async ({ cart_id }) => {
    const { activity_id, enterprise_id } = purchase_share_info
    const res = await Taro.showModal({
      title: $t('61e2d21a.02d981'),
      content: $t('61e2d21a.a4936e'),
      showCancel: true,
      cancel: $t('61e2d21a.625fb2'),
      cancelText: $t('61e2d21a.625fb2'),
      confirmText: $t('61e2d21a.e83a25'),
      confirmColor: colorPrimary
    })
    if (!res.confirm) return
    await dispatch(deleteCartItem({ cart_id, activity_id, enterprise_id }))
    getCartList()
  }

  const onChangeCartGoodsItem = async (item, num) => {
    const { activity_id, enterprise_id } = purchase_share_info
    console.log(`onChangeCartGoodsItem:`, num)
    const { shop_id, cart_id } = item
    if (cartUpdatingRef.current) {
      return false
    }
    const nextNum = parseInt(num, 10)
    const max = resolvePurchaseCartItemMax(item)
    if (Number.isNaN(nextNum) || nextNum == item.num) return true
    if (nextNum > max) {
      const limitNum = toPositiveInt(item.limit_num ?? item.limitNum)
      Taro.showToast({
        title: limitNum ? ti('61144037.953aca', [limitNum]) : $t('61144037.d10bff'),
        icon: 'none',
        duration: 3000
      })
      return false
    }
    const { type = 'distributor' } = router?.params
    cartUpdatingRef.current = true
    setState((draft) => {
      draft.cartUpdating = true
    })
    try {
      await dispatch(
        updateCartItemNum({ shop_id, cart_id, num, type, activity_id, enterprise_id })
      ).unwrap()
      await getCartList()
      return true
    } catch (e) {
      Taro.showToast({
        title: e?.message || $t('61144037.871989'),
        icon: 'none',
        duration: 3000
      })
      return false
    } finally {
      cartUpdatingRef.current = false
      setState((draft) => {
        draft.cartUpdating = false
      })
    }
  }

  const onClickImgAndTitle = async (item) => {
    Taro.navigateTo({
      url: `/subpages/item/espier-detail?id=${item.item_id}&dtid=${item.shop_id}`
    })
  }

  const onPolicyChange = (isShow = false) => {
    setState((draft) => {
      draft.policyModal = isShow
    })
  }

  const handleCheckout = (item) => {
    const { type = 'distributor' } = router?.params
    const { shop_id, is_delivery, is_ziti, shop_name, address, lat, lng, hour, mobile } = item
    const query = {
      cart_type: 'cart',
      type,
      shop_id,
      is_delivery,
      is_ziti,
      name: shop_name,
      store_address: address,
      lat,
      lng,
      hour,
      phone: mobile,
      goodType: current == 0 ? 'normal' : 'cross'
    }
    Taro.navigateTo({
      url: `/subpages/purchase/espier-checkout?${qs.stringify(query)}`
    })
  }

  const groupsList = resolveActiveGroup()
  console.log(groupsList, 'list')

  return (
    <SpPage
      className='page-cart-index'
      title={$t('21544271.c017be')}
      pageConfig={{ navigateBackgroundColor: '#ffffff' }}
      renderNavigation={(navProps) => <CompPurchaseNav {...navProps} />}
    >
      <SpPurchaseEnterpriseBar
        name={enterpriseName}
        showMore={false}
        showSearch={false}
        rightExtra={
          isDiscountDescriptionEnabled && discountDescription ? (
            <View className='page-cart-index__policy'>
              <Text className='iconfont icon-info page-cart-index__policy-icon' />
              <Text className='page-cart-index__policy-txt'>{discountDescription}</Text>
            </View>
          ) : null
        }
      />
      {!isLogin && (
        <View className='login-header'>
          <View className='login-txt'>{$t('f9ef9536.29b36a')}</View>
          <SpLogin onChange={() => {}}>
            <View className='btn-login'>{$t('f9ef9536.d72d86')}</View>
          </SpLogin>
        </View>
      )}
      {isLogin && (
        <View>
          <View className='valid-cart-block'>
            {groupsList.map((all_item, all_index) => {
              const { cus_plus_item_list = [] } = all_item || {}
              const allChecked = all_item.cart_total_count == all_item.list.length
              return (
                <View className='shop-cart-item' key={`shop-cart-item__${all_index}`}>
                  <View className='shop-cart-item-shadow'>
                    {/** 店铺商品开始 */}
                    {cus_plus_item_list.map((cus_item, cus_index) => {
                      const {
                        discount_desc,
                        activity_id,
                        cus_general_goods_list,
                        cus_plus_exchange_item_list
                      } = cus_item
                      return (
                        <View key={cus_index}>
                          {/** 换购开始 */}
                          {discount_desc && (
                            <View className='shop-cart-activity' key={activity_id}>
                              <View className='shop-cart-activity-item'>
                                <View
                                  className='shop-cart-activity-item-left'
                                  onClick={() =>
                                    Taro.navigateTo({
                                      url: `/marketing/pages/plusprice/detail-plusprice-list?marketing_id=${activity_id}`
                                    })
                                  }
                                >
                                  <Text className='shop-cart-activity-label'>
                                    {$t('f9ef9536.1687b1')}
                                  </Text>
                                  <Text>{discount_desc.info}</Text>
                                </View>
                                <View
                                  className='shop-cart-activity-item-right'
                                  onClick={() =>
                                    Taro.navigateTo({
                                      url: `/marketing/pages/plusprice/cart-plusprice-list?marketing_id=${activity_id}`
                                    })
                                  }
                                >
                                  {$t('f9ef9536.5ba3e7')}
                                  <Text className='at-icon at-icon-chevron-right'></Text>
                                </View>
                              </View>
                            </View>
                          )}
                          {/** 换购结束 */}
                          {/**普通商品开始 */}
                          {cus_general_goods_list.map((c_sitem, c_index) => (
                            <View className='shop-cart-item-bd' key={c_index}>
                              <View className='shop-activity'></View>
                              <View className='cart-item-wrap'>
                                <SpCheckboxNew
                                  checked={c_sitem.is_checked}
                                  onChange={onChangeGoodsIsCheck.bind(this, c_sitem, 'single')}
                                />
                                <CompGoodsItem
                                  info={c_sitem}
                                  isPurchase
                                  inputMax={resolvePurchaseCartItemMax(c_sitem)}
                                  onDelete={onDeleteCartGoodsItem.bind(this, c_sitem)}
                                  onChange={onChangeCartGoodsItem.bind(this, c_sitem)}
                                  onClickImgAndTitle={onClickImgAndTitle.bind(this, c_sitem)}
                                />
                              </View>
                              {/**组合商品开始 */}
                              {c_sitem.packages &&
                                c_sitem.packages.map((pack_sitem, pack_index) => (
                                  <View className='cart-item-wrap plus_items_bck' key={pack_index}>
                                    <CompGoodsItem
                                      disabled
                                      info={pack_sitem}
                                      goodType='packages'
                                      isShowAddInput={false}
                                      isShowDeleteIcon={false}
                                    />
                                  </View>
                                ))}
                              {/**组合商品开始 */}
                            </View>
                          ))}
                          {/**普通商品开始 */}
                          {/**换购商品开始 */}
                          {cus_plus_exchange_item_list && (
                            <View className='cart-item-wrap plus_items_bck'>
                              <CompGoodsItem
                                disabled
                                info={cus_plus_exchange_item_list}
                                isShowAddInput={false}
                                isShowDeleteIcon={false}
                              />
                            </View>
                          )}
                          {/**换购商品开始 */}
                        </View>
                      )
                    })}
                    {/** 店铺商品结束 */}
                    {/** 结算/全选操作开始 */}
                    <View className='shop-cart-item-ft'>
                      <View className='lf'>
                        <SpCheckboxNew
                          checked={allChecked}
                          label={$t('f9ef9536.66eeac')}
                          onChange={onChangeGoodsIsCheck.bind(this, all_item, 'all')}
                        />
                      </View>
                      <View className='rg'>
                        <View>
                          <View className='total-price-wrap'>
                            {$t('f9ef9536.7b2864')}
                            <SpPrice className='total-pirce' value={all_item.total_fee / 100} />
                          </View>
                          {all_item.discount_fee > 0 && (
                            <View className='discount-price-wrap'>
                              {$t('f9ef9536.1784cf')}
                              <SpPrice
                                className='total-pirce'
                                value={all_item.discount_fee / 100}
                              />
                            </View>
                          )}
                        </View>
                        <AtButton
                          className='btn-calc'
                          type='primary'
                          circle
                          disabled={all_item.cart_total_num <= 0}
                          onClick={() => handleCheckout(all_item)}
                        >
                          {ti('f9ef9536.605bad', [all_item.cart_total_num])}
                        </AtButton>
                      </View>
                    </View>
                    {/** 结算/全选操作开始 */}
                  </View>
                </View>
              )
            })}
          </View>
          {invalidCart.length > 0 && (
            <View className='invalid-cart-block'>
              <View className='shop-cart-item'>
                <View className='shop-cart-item-hd-disabeld'>{$t('f9ef9536.31a812')}</View>
                <View className='shop-cart-item-bd'>
                  <View className='shop-activity'></View>
                  {invalidCart.map((sitem, sindex) => (
                    <View
                      className='cart-item-warp-disabled'
                      key={`cart-item-warp-disabled__${sindex}`}
                    >
                      <SpCheckboxNew disabled />
                      <CompGoodsItem
                        info={sitem}
                        isShowAddInput={false}
                        onDelete={onDeleteCartGoodsItem.bind(this, sitem)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {validCart.length == 0 && invalidCart.length == 0 && (
        <SpDefault type='cart' message={$t('61e2d21a.8bdc0a')}>
          <AtButton
            type='primary'
            circle
            onClick={navigateTo.bind(this, '/subpages/purchase/index', true)}
          >
            {$t('61e2d21a.aed876')}
          </AtButton>
        </SpDefault>
      )}

      <SpPrivacyModal open={policyModal} onCancel={onPolicyChange} onConfirm={onPolicyChange} />

      <CompPurchaseQuotaSheet
        open={quotaSheetOpen}
        onClose={() => setQuotaSheetOpen(false)}
        totalFeeCents={quotaFeeCents.total}
        usedFeeCents={quotaFeeCents.used}
        remainingFeeCents={quotaFeeCents.remaining}
      />

      <CompPurchaseActionbar
        fixed
        hideCart
        cartCount={cartCount}
        remainingAmount={remainingAmountText}
        onShare={onActionBarShare}
        onQuota={onActionBarQuota}
      />

      {cartUpdating && (
        <View className='page-cart-index__loading-mask'>
          <SpLoading />
        </View>
      )}
    </SpPage>
  )
}

export default CartIndex
