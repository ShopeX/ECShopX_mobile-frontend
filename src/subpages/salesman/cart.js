import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { navigateTo, validate, showToast } from '@/utils'
import { useSelector, useDispatch } from 'react-redux'
import { SpPage, SpGoodsInvalidItems, SpGoodsItems, SpDefault } from '@/components'
import { useImmer } from 'use-immer'
import { useLogin, useDepChange, useDebounce } from '@/hooks'
import {
  fetchSalesmanCartList,
  deleteCartItem,
  updateCartItemNum,
  updateSalesmanCount
} from '@/store/slices/cart'
import { AtButton } from 'taro-ui'
import api from '@/api'
import S from '@/spx'
import CompTabbar from './comps/comp-tabbar'

import './cart.scss'

const initialConfigState = {
  allChecked: true
}

function Cart() {
  const [state, setState] = useImmer(initialConfigState)
  const { allChecked } = state
  const dispatch = useDispatch()
  const $instance = getCurrentInstance()
  const router = $instance.router
  const { validSalesmanCart = [], invalidSalesmanCart = [] } = useSelector((state) => state.cart)
  const { colorPrimary, openRecommend } = useSelector((state) => state.sys)

  useEffect(() => {
    getCartList()
  }, [])

  const getCartList = async () => {
    Taro.showLoading({ title: '' })
    const { type = 'distributor' } = router?.params || {}
    const params = {
      shop_type: type,
      isSalesmanPage: 1
    }
    await dispatch(fetchSalesmanCartList(params))
    await dispatch(updateSalesmanCount(params))
    Taro.hideLoading()
  }

  //全选和单选
  const onSelectAll = async (item, type, checked) => {
    Taro.showLoading({ title: '' })
    let parmas = { is_checked: !checked }
    if (type === 'all') {
      const cartIds = item.list.map((items) => items.cart_id)
      parmas['cart_id'] = cartIds
    } else {
      parmas['cart_id'] = item.cart_id
    }
    try {
      await api.cart.select({ ...parmas, isSalesmanPage: 1 })
    } catch (e) {
      console.log(e)
    }
    getCartList()
  }

  // 商品数量变化
  const onChangeInputNumber = useDebounce(async (num, item) => {
    let { shop_id, cart_id } = item
    const { type = 'distributor' } = router.params
    await dispatch(updateCartItemNum({ shop_id, cart_id, num, type, isSalesmanPage: 1 }))
    await dispatch(updateSalesmanCount({ shop_type: 'distributor', isSalesmanPage: 1 }))
    getCartList()
  }, 200)

  //结算
  const balance = () => {
    console.log('结算')
  }

  // 清除无效商品（失效）
  const handleClearInvalidGoods = (val) => {
    console.log(val, '清除无效商品（失效）')
  }

  // 删除商品（失效和可下单）
  const deletesItem = async ({ cart_id }) => {
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
    await dispatch(deleteCartItem({ cart_id, isSalesmanPage: 1 }))
    await dispatch(updateSalesmanCount({ shop_type: 'distributor', isSalesmanPage: 1 }))
    getCartList()
  }

  return (
    <SpPage classNames='page-cart' >
      {/* 有效商品 */}
      {validSalesmanCart.map((item, index) => {
        return (
          <SpGoodsItems
            deletes={deletesItem}
            onSelectAll={onSelectAll}
            onSingleChoice={onSelectAll}
            onChangeInputNumber={onChangeInputNumber}
            balance={balance}
            key={index}
            lists={item}
          />
        )
      })}

      {/* 失效商品 */}
      {invalidSalesmanCart.length > 0 && (
        <SpGoodsInvalidItems
          empty={handleClearInvalidGoods}
          deletes={deletesItem}
          lists={invalidSalesmanCart}
        />
      )}

      {validSalesmanCart.length == 0 && invalidSalesmanCart.length == 0 && (
        <SpDefault type='cart' message='购物车内暂无商品～'>
          <AtButton
            type='primary'
            circle
            onClick={() =>
              Taro.navigateTo({
                url: `/subpages/salesman/purchasing`
              })
            }
          >
            去选购
          </AtButton>
        </SpDefault>
      )}
    </SpPage>
  )
}

export default Cart
