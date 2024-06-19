import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { navigateTo, validate, showToast } from '@/utils'
import { useSelector, useDispatch } from 'react-redux'
import { SpPage, SpGoodsInvalidItems, SpGoodsItems, SpDefault } from '@/components'
import { useImmer } from 'use-immer'
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

  //全选
  const onSelectAll = (val, value) => {
    console.log(val, value, 'onSelectAll')
  }

  //单选
  const onSingleChoice = (value) => {
    console.log(value, '单选')
  }

  // 商品数量变化
  const onChangeInputNumber = (ele, value) => {
    console.log(ele, value, '商品数量变化1')
  }

  //结算
  const balance = () => {
    console.log('结算')
  }

  // 清除无效商品（失效）
  const handleClearInvalidGoods = (val) => {
    console.log(val, '清除无效商品（失效）')
  }

  // 删除商品（失效和可下单）
  const deletesItem = (val) => {
    console.log(val, '删除商品（失效和可下单）')
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    Taro.hideLoading()
    S.toast('删除成功')
  }

  return (
    <SpPage classNames='page-cart' renderFooter={<CompTabbar />}>
      {/* 有效商品 */}
      {validSalesmanCart.map((item, index) => {
        return (
          <SpGoodsItems
            deletes={deletesItem}
            onSelectAll={onSelectAll}
            onSingleChoice={onSingleChoice}
            onChangeInputNumber={onChangeInputNumber}
            balance={balance}
            key={index}
            items={item}
          />
        )
      })}

      {/* 失效商品 */}
      {invalidSalesmanCart.map((item, index) => {
        return (
          <SpGoodsInvalidItems
            empty={handleClearInvalidGoods}
            deletes={deletesItem}
            key={index}
            items={item}
          />
        )
      })}

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
