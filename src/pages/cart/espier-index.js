import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import qs from 'qs'
import api from '@/api'
import doc from '@/doc'
import { navigateTo, pickBy, classNames } from '@/utils'
import { useLogin, useDepChange } from '@/hooks'
import { fetchCartList, deleteCartItem, updateCartItemNum, updateCount } from '@/store/slices/cart'
import {
  SpPage,
  SpTabbar,
  SpPrice,
  SpRecommend,
  SpLogin,
  SpDefault,
  SpCheckboxNew,
  SpPrivacyModal
} from '@/components'

import CompGoodsItem from './comps/comp-goodsitem'

import './espier-index.scss'

// const tablist = [
//   { title: '普通商品', icon: 'icon-putongshangpin-01', type: 'normal' },
//   { title: '跨境商品', icon: 'icon-kuajingshangpin-01', type: 'cross' }
// ]

const initialState = {
  recommendList: [], // 猜你喜欢
  current: 0, // 0:普通商品  1:跨境商品
  policyModal: false // 隐私弹框
}

function CartIndex() {
  const { isLogin } = useLogin({
    autoLogin: true,
    policyUpdateHook: (isUpdate) => {
      isUpdate && onPolicyChange(true)
    }
  })

  const dispatch = useDispatch()
  const $instance = getCurrentInstance()
  const router = $instance.router

  const [state, setState] = useImmer(initialState)
  const { current, recommendList, policyModal } = state

  const { colorPrimary, openRecommend } = useSelector((state) => state.sys)
  const { validCart = [], invalidCart = [] } = useSelector((state) => state.cart)
  const { tabbar = 1 } = router.params

  useDepChange(() => {
    fetch()
  }, [isLogin])

  useDidShow(() => {
    fetch()
  })

  const fetch = () => {
    if (openRecommend == 1) {
      getRecommendList() // 猜你喜欢
    }
    if (isLogin) {
      getCartList()
    }
  }

  const getCartList = async () => {
    Taro.showLoading()
    const { type = 'distributor' } = router.params
    const params = {
      shop_type: type
    }
    await dispatch(fetchCartList(params))
    await dispatch(updateCount(params))
    Taro.hideLoading()
  }

  const resolveActiveGroup = () => {
    const groupsList = validCart.map((item) => {
      // used_activity：满减  activity_grouping：满减&满折 gift_activity：满赠  plus_buy_activity:加价购
      const {
        list,
        used_activity = [],
        plus_buy_activity = [],
        activity_grouping = [],
        gift_activity = []
      } = item
      // 使用活动商品
      // const tDict = reduceTransform(list, 'cart_id')
      // const activityGrouping = activity_grouping;
      // const cus_activity_list = used_activity.map(act => {
      //   const active = activityGrouping.find(a_item => String(a_item.activity_id) === String(act.activity_id))
      //   const cus_general_goods_list = active.cart_ids.map(id => {
      //     const cartItem = tDict[id]
      //     delete tDict[id]
      //     return cartItem
      //   })
      //   return { list: cus_general_goods_list, active }
      // })
      // console.log(cus_activity_list, 'cus_activity_list')
      // cus_activity_list.push({ list: Object.values(tDict), active: null })
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
        const general_goods = list.filter((k) => activity_item_ids.indexOf(k.item_id) > -1)
        return {
          ...plusitem,
          cus_general_goods_list: general_goods,
          cus_plus_exchange_item_list: exchange_item
        }
      })
      all_plus_itemid_list = all_plus_itemid_list.toString().split(',')
      const goodsMap = reduceTransform(list, 'cart_id')
      for (const key in goodsMap) {
        if (all_plus_itemid_list.indexOf(goodsMap[key].item_id) < 0) {
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

  const reduceTransform = (list, label) => {
    const newList = list.reduce((acc, val) => {
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
    Taro.showLoading()
    let parmas = { is_checked: checked }
    if (type === 'all') {
      const cartIds = item.list.map((item) => item.cart_id)
      parmas['cart_id'] = cartIds
    } else {
      parmas['cart_id'] = item.cart_id
    }
    try {
      await api.cart.select(parmas)
    } catch (e) {
      console.log(e)
    }
    getCartList()
  }

  const onDeleteCartGoodsItem = async ({ cart_id }) => {
    const res = await Taro.showModal({
      title: '提示',
      content: '将当前商品移出购物车?',
      showCancel: true,
      cancel: '取消',
      cancelText: '取消',
      confirmText: '确认',
      confirmColor: colorPrimary
    })
    if (!res.confirm) return
    await dispatch(deleteCartItem({ cart_id }))
    getCartList()
  }

  const onChangeCartGoodsItem = async (item, num) => {
    let { shop_id, cart_id } = item
    const { type = 'distributor' } = router.params
    await dispatch(updateCartItemNum({ shop_id, cart_id, num, type }))
    getCartList()
  }

  const onClickImgAndTitle = async (item) => {
    Taro.navigateTo({
      url: `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.shop_id}`
    })
  }

  const onPolicyChange = (isShow = false) => {
    setState((draft) => {
      draft.policyModal = isShow
    })
  }

  const handleCheckout = (item) => {
    const { type = 'distributor' } = router.params
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
      url: `/pages/cart/espier-checkout?${qs.stringify(query)}`
    })
  }

  const groupsList = resolveActiveGroup()
  console.log(groupsList, 'list')

  return (
    <SpPage
      className={classNames('page-cart-index', {
        'has-tabbar': tabbar == 1
      })}
      renderFooter={tabbar == 1 && <SpTabbar />}
    >
      {!isLogin && (
        <View className='login-header'>
          <View className='login-txt'>授权登录后同步购物车的商品</View>
          <SpLogin onChange={() => {}}>
            <View className='btn-login'>授权登录</View>
          </SpLogin>
        </View>
      )}
      {isLogin && (
        <View>
          {/* <SpTabs current={current} tablist={tablist} onChange={onChangeSpTab} /> */}
          <View className='valid-cart-block'>
            {groupsList.map((all_item, all_index) => {
              const { cus_plus_item_list = [], activityList = [] } = all_item || {}
              const allChecked = all_item.cart_total_count == all_item.list.length
              return (
                <View className='shop-cart-item' key={`shop-cart-item__${all_index}`}>
                  <View className='shop-cart-item-hd'>
                    <Text className='iconfont icon-shop' />
                    {all_item.shop_name || '自营'}
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
                                  <Text className='shop-cart-activity-label'>换购</Text>
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
                                  去选择
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
                          label='全选'
                          onChange={onChangeGoodsIsCheck.bind(this, all_item, 'all')}
                        />
                      </View>
                      <View className='rg'>
                        <View>
                          <View className='total-price-wrap'>
                            合计：
                            <SpPrice className='total-pirce' value={all_item.total_fee / 100} />
                          </View>
                          {all_item.discount_fee > 0 && (
                            <View className='discount-price-wrap'>
                              共优惠：
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
                          结算({all_item.cart_total_num})
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
                <View className='shop-cart-item-hd-disabeld'>已失效商品</View>
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
        <SpDefault type='cart' message='购物车内暂无商品～'>
          <AtButton type='primary' circle onClick={navigateTo.bind(this, '/pages/index', true)}>
            去选购
          </AtButton>
        </SpDefault>
      )}

      {/* 猜你喜欢 */}
      {<SpRecommend className='recommend-block' info={recommendList} />}

      <SpPrivacyModal open={policyModal} onCancel={onPolicyChange} onConfirm={onPolicyChange} />
    </SpPage>
  )
}

export default CartIndex
