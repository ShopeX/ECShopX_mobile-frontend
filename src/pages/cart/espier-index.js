import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import { AtButton, AtActionSheet, AtActionSheetItem, AtNoticebar } from 'taro-ui'
import {
  SpNote,
  SpPage,
  SpTabbar,
  Loading,
  SpPrice,
  SpNavBar,
  GoodsItem,
  SpRecommend,
  SpLogin,
  SpDefault,
  SpTabs,
  SpTabsPane,
  SpImage,
  SpCheckboxNew,
  SpPrivacyModal
} from '@/components'
import {
  log,
  navigateTo,
  classNames,
  getThemeStyle,
  styleNames,
  isNavbar,
  entryLaunch,
  pickBy
} from '@/utils'
import api from '@/api'
import S from '@/spx'
// import { Tracker } from '@/service'
import { useLogin } from '@/hooks'
import { fetchCartList, deleteCartItem, updateCartItemNum } from '@/store/slices/cart'
import CompGoodsItem from './comps/comp-goodsitem'
import './espier-index.scss'

// const tablist = [
//   { title: '普通商品', icon: 'icon-putongshangpin-01', type: 'normal' },
//   { title: '跨境商品', icon: 'icon-kuajingshangpin-01', type: 'cross' }
// ]

const initialState = {
  likeList: [],
  current: 0, // 0:普通商品  1:跨境商品
  itemCount: 0,
}

function CartIndex( props ) {
  const dispatch = useDispatch()
  const { isLogin, updatePolicyTime, getUserInfoAuth } = useLogin({
    autoLogin: true,
    policyUpdateHook: () => {
      setPolicyModal(true)
    }
  })

  const $instance = useMemo( getCurrentInstance, [] );
  const { validCart = [], invalidCart = [] } = useSelector( ( state ) => state.cart )
  const { colorPrimary } = useSelector( ( state ) => state.sys )
  const { userInfo, vipInfo } = useSelector((state) => state.user)

  const [ state, setState ] = useImmer(initialState)
  
  const [policyModal, setPolicyModal] = useState(false)
  
  const router = $instance.router
  const { current } = state

  useEffect(() => {
    if (isLogin) {
      getCartList()
    }
  }, [isLogin])

  useEffect(() => {
    getLikeList()
  }, [])

  const getCartList = async () => {
    Taro.showLoading()
    const { type = 'distributor' } = router.params
    const params = {
      shop_type: type,
    }
    await dispatch(fetchCartList(params))
    Taro.hideLoading()
  }

  const resolveActiveGroup =  () => {
    const groupsList = validCart.map(item => {
      const { list, used_activity = [], plus_buy_activity = [], activity_grouping = [] } = item
      // 使用活动商品
      const tDict = reduceTransform(list, 'cart_id')
      const activityGrouping = activity_grouping;
      const cus_activity_list = used_activity.map(act => {
        const active = activityGrouping.find(a_item => String(a_item.activity_id) === String(act.activity_id))
        const itemList = active.cart_ids.map(id => {
          const cartItem = tDict[id]
          delete tDict[id]
          return cartItem
        })
        return { list: itemList, active }
      })
      cus_activity_list.push({ list: Object.values(tDict), active: null })
      // 加购价
      let all_plus_active_items = []
      let no_active_item = []
      let cus_plus_item_list = plus_buy_activity.map((plusitem, index) => {
        const { plus_item, activity_item_ids, activity_id } = plusitem;
        // 加购价选中的商品
        let plus_goods = null
        if (plus_item) {
          plus_goods = pickBy(plus_item, {...doc.cart.CART_GOODS_ITEM, activity_id, })
        }
        all_plus_active_items.push(activity_item_ids)
        const result = list.filter(k => activity_item_ids.indexOf(k.item_id) > -1)
        return {
          ...plusitem,
          itemList: result,
          cus_plus_buy_goods_list: plus_goods
        }
      })
      all_plus_active_items = all_plus_active_items.toString().split(',')
      const goodsMap = reduceTransform(list, 'item_id')
      for (const key in goodsMap) {
        if (all_plus_active_items.indexOf(key) < 0) {
          no_active_item.push(goodsMap[key])
        }
      }
      cus_plus_item_list.push({
        discount_desc: null,
        itemList: no_active_item,
        cus_plus_buy_goods_list: null
      })
      return {
        ...item,
        cus_plus_item_list,
        cus_activity_list
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

  const getLikeList = async () => {
    const { list, total_count: total } = await api.cart.likeList({
      page: 1,
      pageSize: 10
    })
    setState(v => {
      v.likeList = list
    })
  }

  // const onChangeSpTab = (current) => {
  //   setState(v => {
  //     v.current = current
  //   })
  //   // setState({
  //   //   ...state,
  //   //   current
  //   // })
  // }

  const onChangeGoodsItemCheck = async (item, e) => {
    console.log(item, e)
    await api.cart.select({
      cart_id: item.cart_id,
      is_checked: e
    })
    getCartList()
  }

  const onChangeAllCheck = async (item, e) => {
    const cartIds = item.list.map((item) => item.cart_id)
    await api.cart.select({
      cart_id: cartIds,
      is_checked: e
    })
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

  const handleCheckout = (item) => {
    const { type } = router.params
    const { shop_id, is_delivery, is_ziti, shop_name, address, lat, lng, hour, mobile } = item
    const cartType = current == 0 ? 'normal' : 'cross'
    Taro.navigateTo({
      url: `/pages/cart/espier-checkout?cart_type=cart&type=${type}&shop_id=${shop_id}&is_delivery=${is_delivery}&is_ziti=${is_ziti}&name=${shop_name}&store_address=${address}&lat=${lat}&lng=${lng}&hour=${hour}&phone=${mobile}&goodType=${cartType}`
    })
  }

  const groupsList = resolveActiveGroup()
  console.log(groupsList, 'list')

  return (
    <SpPage className='page-cart-index'>
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
                    <Text className="iconfont icon-shop"/>
                    {all_item.shop_name || '自营'}
                  </View>
                  {cus_plus_item_list.map((cus_item, cus_index) => {
                    const { discount_desc, activity_id, itemList, cus_plus_buy_goods_list } = cus_item
                    return (
                      <View key={cus_index}>
                        {/** 换购开始 */}
                        {discount_desc && 
                          <View
                            className="shop-cart-activity"
                            key={activity_id}
                          >
                            <View className="shop-cart-activity-item">
                              <View
                                className="shop-cart-activity-item-left"
                                onClick={() => Taro.navigateTo({ url: `/marketing/pages/plusprice/detail-plusprice-list?marketing_id=${activity_id}` })}
                              >
                                <Text className="shop-cart-activity-label">
                                  换购
                                </Text>
                                <Text>{discount_desc.info}</Text>
                              </View>
                              <View
                                className="shop-cart-activity-item-right"
                                onClick={() => Taro.navigateTo({ url: `/marketing/pages/plusprice/cart-plusprice-list?marketing_id=${activity_id}` })}
                              >
                                去选择
                                <Text className="at-icon at-icon-chevron-right"></Text>
                              </View>
                            </View>
                          </View>
                        }
                        {/** 换购结束 */}
                        {/**普通商品开始 */}
                        <View className='shop-cart-item-bd'>
                          <View className='shop-activity'></View>
                          {itemList.map((c_sitem, c_index) => (
                            <View className='cart-item-wrap' key={`cart-item-wrap__${c_index}`}>
                              <SpCheckboxNew
                                checked={c_sitem.is_checked}
                                onChange={onChangeGoodsItemCheck.bind(this, c_sitem)}
                              />
                              <CompGoodsItem
                                info={c_sitem}
                                onDelete={onDeleteCartGoodsItem.bind(this, c_sitem)}
                                onChange={onChangeCartGoodsItem.bind(this, c_sitem)}
                                onClickImgAndTitle={onClickImgAndTitle.bind(this, c_sitem)}
                              />
                            </View>
                          ))}
                        </View>
                        {/**普通商品开始 */}
                        {/**换购商品开始 */}
                        {cus_plus_buy_goods_list &&
                          <View className='cart-item-wrap plus_items_bck'>
                            <SpCheckboxNew disabled />
                            <CompGoodsItem
                              disabled
                              info={cus_plus_buy_goods_list}
                              isShowAddInput={false}
                              isShowDeleteIcon={false}
                            />
                          </View>
                        }
                        {/**换购商品开始 */}
                      </View>
                    )
                  })}
                  {/** 结算/全选操作开始 */}
                  <View className='shop-cart-item-ft'>
                    <View className='lf'>
                      <SpCheckboxNew
                        checked={allChecked}
                        label='全选'
                        onChange={onChangeAllCheck.bind(this, all_item)}
                      />
                    </View>
                    <View className='rg'>
                      <View>
                        <View className='total-price-wrap'>
                          合计：
                          <SpPrice className='total-pirce' value={all_item.total_fee / 100} />
                        </View>
                        {
                          all_item.discount_fee > 0 &&
                          <View className='discount-price-wrap'>
                            共优惠：
                            <SpPrice className='total-pirce' value={all_item.discount_fee / 100} />
                          </View>
                        }
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
              )
            })}
          </View>
          <View className='invalid-cart-block'>
            <View className='shop-cart-item'>
              <View className='shop-cart-item-hd-disabeld'>已失效商品</View>
              <View className='shop-cart-item-bd'>
                <View className='shop-activity'></View>
                {invalidCart.map((sitem, sindex) => (
                  <View className='cart-item-warp-disabled' key={`cart-item-warp-disabled__${sindex}`}>
                    <SpCheckboxNew disabled />
                    <CompGoodsItem
                      info={sitem}
                      isShowAddInput={false}
                      onDelete={onDeleteCartGoodsItem.bind( this, sitem )}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      )}

      {validCart.length == 0 && invalidCart.length == 0 && (
        <SpDefault type='cart' message='购物车内暂无商品～'>
          <AtButton type='primary' circle onClick={navigateTo.bind(this, '/pages/index')}>
            去选购
          </AtButton>
        </SpDefault>
      )}

      {/* 猜你喜欢 */}
      {<SpRecommend className='recommend-block' info={state.likeList} />}

      <SpPrivacyModal
        open={policyModal}
        onCancel={() => {
          setPolicyModal(false)
        }}
        onConfirm={() => {
          setPolicyModal(false)
        }}
      />

      <SpTabbar />

    </SpPage>
  )
}

export default CartIndex
