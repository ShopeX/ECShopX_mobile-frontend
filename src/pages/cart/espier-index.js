import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { useImmer } from 'use-immer'
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
  entryLaunch
} from '@/utils'
import api from '@/api'
import S from '@/spx'
// import { Tracker } from '@/service'
import entry from '@/utils/entry'
import { useLogin } from '@/hooks'
import { fetchCartList, deleteCartItem } from '@/store/slices/cart'
import CompGoodsItem from './comps/comp-goodsitem'
import './espier-index.scss'

const tablist = [
  { title: '普通商品', icon: 'icon-putongshangpin-01', type: 'normal' },
  { title: '跨境商品', icon: 'icon-kuajingshangpin-01', type: 'cross' }
]



function CartIndex( props ) {
  const dispatch = useDispatch()
  const { isLogin, updatePolicyTime, getUserInfoAuth } = useLogin({
    autoLogin: true,
    policyUpdateHook: () => {
      setPolicyModal(true)
    }
  } )

  const $instance = useMemo( getCurrentInstance, [] );
  const { validCart, invalidCart } = useSelector( ( state ) => state.cart )
  const { colorPrimary } = useSelector( ( state ) => state.sys )
  const { userInfo, vipInfo } = useSelector((state) => state.user)
  
  const [policyModal, setPolicyModal] = useState( false )

  const [state, setState] = useState({
    current: 0,
    itemCount: 0
  } )
  
  const [likeList, setLikeList] = useImmer( [] )
  
  const router = $instance.router
  const { current } = state

  useEffect(() => {
    console.log('useEffect...')
    if (isLogin) {
      getCartList()
    }
  }, [isLogin])

  useEffect(() => {
    getLikeList()
  }, [])

  const getCartList = async () => {
    const { type = 'distributor' } = router.params
    const isOpenStore = entryLaunch.isOpenStore()
    let params = {
      // shop_type: type,
      // isNostores: isOpenStore ? 0 : 1
    }
    // 跨境
    if (current == 1) {
      params = {
        ...params,
        iscrossborder: 1
      }
    }
    Taro.showLoading()
    dispatch(fetchCartList(params))
    Taro.hideLoading()
  }

  const getLikeList = async () => {
    const { list, total_count: total } = await api.cart.likeList({
      page: 1,
      pageSize: 10
    })
    setLikeList(list)
  }

  const onChangeSpTab = (current) => {
    setState({
      ...state,
      current
    })
  }

  const onChangeGoodsItemCheck = async (item, e) => {
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
    await dispatch( deleteCartItem( { cart_id } ) )
    getCartList()
  }

  const onChangeCartGoodsItem = async ( {}) => {
    
  }

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
            {validCart.map((item, index) => {
              const allChecked = !item.list.find((item) => !item.is_checked)
              return (
                <View className='shop-cart-item' key={`shop-cart-item__${index}`}>
                  <View className='shop-cart-item-hd'>{item.shop_name}</View>
                  <View className='shop-cart-item-bd'>
                    <View className='shop-activity'></View>
                    {item.list.map((sitem, index) => (
                      <View className='cart-item-wrap' key={`cart-item-wrap__${index}`}>
                        <SpCheckboxNew
                          isChecked={sitem.is_checked}
                          onChange={onChangeGoodsItemCheck.bind(this, sitem)}
                        />
                        <CompGoodsItem
                          info={sitem}
                          onDelete={onDeleteCartGoodsItem.bind( this, sitem )}
                          onChange={onChangeCartGoodsItem}
                        />
                      </View>
                    ))}
                  </View>
                  <View className='shop-cart-item-ft'>
                    <View className='lf'>
                      <SpCheckboxNew
                        isChecked={allChecked}
                        label='全选'
                        onChange={onChangeAllCheck.bind(this, item)}
                      />
                    </View>
                    <View className='rg'>
                      <View className='total-price-wrap'>
                        合计：
                        <SpPrice className='total-pirce' value={item.total_fee / 1000} />
                      </View>
                      <AtButton
                        className='btn-calc'
                        type='primary'
                        circle
                        disabled={item.cart_total_num == 0}
                      >
                        结算({item.cart_total_num})
                      </AtButton>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
          <View className='invalid-cart-block'>
            <View className='shop-cart-item'>
              <View className='shop-cart-item-hd-disabeld'>已失效商品</View>
              <View className='shop-cart-item-bd'>
                <View className='shop-activity'></View>
                {invalidCart.map((sitem, index) => (
                  <View className='cart-item-warp-disabled' key={`cart-item-warp-disabled__${index}`}>
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
      {<SpRecommend className='recommend-block' info={likeList} />}

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
