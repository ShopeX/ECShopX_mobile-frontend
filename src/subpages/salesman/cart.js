/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { navigateTo, validate, showToast } from '@/utils'
import { useSelector, useDispatch } from 'react-redux'
import { SpPage, SpDefault } from '@/components'
import { SpGoodsInvalidItems, SpGoodsItems } from '@/subpages/components'
import { useImmer } from 'use-immer'
import { useLogin, useDepChange, useDebounce } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import {
  fetchSalesmanCartList,
  deleteCartItem,
  updateCartItemNum,
  updateSalesmanCount
} from '@/store/slices/cart'
import { AtButton } from 'taro-ui'
import api from '@/api'
import * as deliveryApi from '@/api/delivery'
import qs from 'qs'
import S from '@/spx'
import CompTabbar from './comps/comp-tabbar'
import './cart.scss'

const initialConfigState = {
  allChecked: true,
  current: 0 // 0:普通商品  1:跨境商品
}

function Cart() {
  useTranslation()
  const [state, setState] = useImmer(initialConfigState)
  const { allChecked, current } = state
  const dispatch = useDispatch()
  const $instance = getCurrentInstance() || {}
  const router = $instance?.router
  const {
    validSalesmanCart = [],
    invalidSalesmanCart = [],
    customerLnformation
  } = useSelector((state) => state.cart)
  const { colorPrimary, openRecommend } = useSelector((state) => state.sys)

  useDidShow(() => {
    Taro.setNavigationBarTitle({
      title: $t('a2d3a891.c017be')
    })
  })

  useEffect(() => {
    getCartList()
  }, [])

  const getCartList = async () => {
    Taro.showLoading({ title: '' })
    const { type = 'distributor', distributor_id = '' } = router?.params || {}
    const params = {
      shop_type: type,
      isSalesmanPage: 1,
      distributor_id,
      ...customerLnformation
    }
    await dispatch(fetchSalesmanCartList(params))
    await dispatch(updateSalesmanCount(params))
    Taro.hideLoading()
  }

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
      await api.cart.select({ ...parmas, isSalesmanPage: 1, ...customerLnformation })
    } catch (e) {
      console.log(e)
    }
    await getCartList()
  }

  const onChangeInputNumber = useDebounce(async (num, item) => {
    let { shop_id, cart_id } = item
    const { type = 'distributor' } = router?.params
    await dispatch(
      updateCartItemNum({ shop_id, cart_id, num, type, isSalesmanPage: 1, ...customerLnformation })
    )
    await getCartList()
  }, 200)

  const balance = (item) => {
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
      url: `/subpages/salesman/espier-checkout?${qs.stringify(query)}`
    })
  }

  const handleClearInvalidGoods = async (val) => {
    let cart_id_list = val.map((item) => item.cart_id).join(',')
    let params = {
      cart_id_list,
      isSalesmanPage: 1,
      ...customerLnformation
    }
    await deliveryApi.cartdelbat(params)
    await getCartList()
  }

  const deletesItem = async ({ cart_id }) => {
    const res = await Taro.showModal({
      title: $t('61e2d21a.02d981'),
      content: $t('61e2d21a.a4936e'),
      showCancel: true,
      cancelText: $t('61e2d21a.625fb2'),
      confirmText: $t('61e2d21a.e83a25'),
      confirmColor: colorPrimary
    })
    if (!res.confirm) return
    await dispatch(deleteCartItem({ cart_id, isSalesmanPage: 1, ...customerLnformation }))
    await getCartList()
  }

  return (
    <SpPage classNames='page-cart'>
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

      {invalidSalesmanCart.length > 0 && (
        <SpGoodsInvalidItems
          empty={handleClearInvalidGoods}
          deletes={deletesItem}
          lists={invalidSalesmanCart}
        />
      )}

      {validSalesmanCart.length == 0 && invalidSalesmanCart.length == 0 && (
        <SpDefault type='cart' message={$t('61e2d21a.8bdc0a')}>
          <AtButton
            type='primary'
            circle
            onClick={() =>
              Taro.navigateTo({
                url: `/subpages/salesman/purchasing`
              })
            }
          >
            {$t('61e2d21a.aed876')}
          </AtButton>
        </SpDefault>
      )}
    </SpPage>
  )
}

export default Cart
