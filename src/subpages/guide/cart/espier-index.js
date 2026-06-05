/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import qs from 'qs'
import api from '@/api'
import doc from '@/doc'
import { navigateTo, pickBy, classNames } from '@/utils'
import { fetchCartList, deleteCartItem, updateCartItemNum, updateCount } from '@/store/slices/guide'
import { SpPage, SpPrice, SpRecommend, SpDefault, SpCheckboxNew } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import { BaTabBar } from '@/subpages/guide/components'
import CompGoodsItem from './comps/comp-goodsitem'
import './espier-index.scss'

// const tablist = [
//   { title: '普通商品', icon: 'icon-putongshangpin-01', type: 'normal' },
//   { title: '跨境商品', icon: 'icon-kuajingshangpin-01', type: 'cross' }
// ]

const initialState = {
  current: 0, // 0:普通商品  1:跨境商品
  policyModal: false, // 隐私弹框
  footerHeight: 0
}

function CartIndex() {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const $instance = getCurrentInstance() || {}
  const router = $instance?.router

  const [state, setState] = useImmer(initialState)
  const { current, policyModal } = state

  const { colorPrimary } = useSelector((state) => state.sys)
  const { validCart = [], invalidCart = [] } = useSelector((state) => state.cart)
  const { tabbar = 1 } = router?.params

  useDidShow(() => {
    fetch()
  })

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('d886af7d.c017be') })
  }, [i18n.language])

  const fetch = () => {
    getCartList()
  }

  const getCartList = async () => {
    Taro.showLoading({ title: '' })
    const { type = 'distributor' } = router?.params
    const params = {
      shop_type: type
    }
    await dispatch(fetchCartList(params))
    await dispatch(updateCount(params))
    Taro.hideLoading()
  }

  const resolveActiveGroup = () => {
    const groupsList = validCart?.map((item) => {
      // used_activity：满减  activity_grouping：满减&满折 gift_activity：满赠  plus_buy_activity:加价购
      const {
        list = [],
        used_activity = [],
        plus_buy_activity = [],
        activity_grouping = [],
        gift_activity = []
      } = item
      // 加购价
      let all_plus_itemid_list = [] // 加价购商品id
      let no_active_item = [] // 没有活动的商品
      let cus_plus_item_list = plus_buy_activity.map((plusitem, index) => {
        const { plus_item, activity_item_ids, activity_id } = plusitem
        // 加购价换购的商品
        let exchange_item = null
        if (plus_item) {
          exchange_item = pickBy(plus_item, { ...doc.cart.CART_GOODS_ITEM, activity_id })
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
        cus_general_goods_list: no_active_item,
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

  const reduceTransform = (list = [], label) => {
    const newList = list?.reduce((acc, val) => {
      acc[val[label]] = val
      return acc
    }, {})
    return newList
  }

  const getRecommendList = async () => {
    const { list } = await api.cart.likeList({
      page: 1,
      pageSize: 1000
    })
    setState((draft) => {
      draft.recommendList = list
    })
  }

  const onChangeGoodsIsCheck = async (item, type, checked) => {
    Taro.showLoading({ title: '' })
    let parmas = { is_checked: checked }
    if (type === 'all') {
      const cartIds = item.list.map((item) => item.cart_id)
      parmas['cart_id'] = cartIds
    } else {
      parmas['cart_id'] = item.cart_id
    }

    try {
      await api.guide.checkstatus(parmas)
    } catch (e) {
      console.log(e)
    }
    getCartList()
  }

  const onDeleteCartGoodsItem = async ({ cart_id, item_id }) => {
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

    await dispatch(
      updateCartItemNum({
        cart_id,
        num: 0,
        item_id: item_id,
        is_accumulate: false
      })
    )
    getCartList()
  }

  const onChangeCartGoodsItem = async (item, num) => {
    let { shop_id, cart_id } = item
    const { type = 'distributor' } = router?.params
    await dispatch(
      updateCartItemNum({
        shop_id,
        item_id: item.item_id,
        num,
        type,
        is_accumulate: false
      })
    )
    getCartList()
  }

  const onClickImgAndTitle = async (item) => {
    Taro.navigateTo({
      url: `/subpages/guide/item/espier-detail?id=${item.item_id}&dtid=${item.shop_id}`
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
      url: `/subpages/guide/cart/espier-checkout?${qs.stringify(query)}`
    })
  }

  const groupsList = resolveActiveGroup()
  console.log(groupsList, 'list')

  return (
    <SpPage
      className={classNames('page-guide-cart-index', {
        'has-tabbar': tabbar == 1
      })}
      onReady={({ footerHeight }) => {
        setState((draft) => {
          draft.footerHeight = footerHeight
        })
      }}
      renderFooter={tabbar == 1 && <BaTabBar height={state.footerHeight} />}
    >
      <View>
        {/* <SpTabs current={current} tablist={tablist} onChange={onChangeSpTab} /> */}
        <View className='valid-cart-block'>
          {groupsList.map((all_item, all_index) => {
            const { cus_plus_item_list = [], activityList = [] } = all_item || {}
            const allChecked = all_item?.cart_total_count == all_item?.list?.length
            return (
              <View className='shop-cart-item' key={`shop-cart-item__${all_index}`}>
                <View className='shop-cart-item-hd'>
                  <Text className='iconfont icon-shop' />
                  {all_item.shop_name || $t('f9ef9536.491c0c')}
                </View>
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
                                checked={c_sitem.is_checked == '1'}
                                onChange={onChangeGoodsIsCheck.bind(this, c_sitem, 'single')}
                              />
                              <CompGoodsItem
                                info={c_sitem}
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
                            <SpPrice className='total-pirce' value={all_item.discount_fee / 100} />
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
                        {ti('d886af7d.568ef4', [all_item.cart_total_num])}
                      </AtButton>
                    </View>
                  </View>
                  {/** 结算/全选操作开始 */}
                </View>
              </View>
            )
          })}
        </View>
        {invalidCart?.length > 0 && (
          <View className='invalid-cart-block'>
            <View className='shop-cart-item'>
              <View className='shop-cart-item-hd-disabeld'>{$t('f9ef9536.31a812')}</View>
              <View className='shop-cart-item-bd'>
                <View className='shop-activity'></View>
                {invalidCart?.map((sitem, sindex) => (
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

      {validCart?.length == 0 && invalidCart?.length == 0 && (
        <SpDefault type='cart' message={$t('61e2d21a.8bdc0a')}>
          <AtButton type='primary' circle onClick={navigateTo.bind(this, '../item/list', true)}>
            {$t('d886af7d.915686')}
          </AtButton>
        </SpDefault>
      )}
    </SpPage>
  )
}

export default CartIndex
