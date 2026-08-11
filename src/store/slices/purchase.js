/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { showToast } from '@/utils'
import { $t } from '@/i18n'
import api from '@/api'

const initialState = {
  isOpen: false,
  tabbar: null,
  purchase_share_info: {},
  invite_code: '',
  validCart: [],
  invalidCart: [],
  cartCount: 0,
  hasValidIdentity: true,
  curEnterpriseId: null,
  curEnterpriseName: '',
  priceDisplayConfig: {},
  isDiscountDescriptionEnabled: false,
  discountDescription: '',
  curDistributorId: null,
  curEnterpriseLogo: '',
  persist_purchase_share_info: {}, //持久化存储最近一次活动，用于内购会员中心额度和分享
  curActivityInfo: {}, //当前活动信息
  isPasscodeLogin: false //是否是口令通道登录
}

export const fetchCartList = createAsyncThunk('purchase/fetchCartList', async (params) => {
  const { valid_cart, invalid_cart } = await api.purchase.getPurchaseCart(params)
  return {
    valid_cart,
    invalid_cart
  }
})

export const addCart = createAsyncThunk('purchase/addCart', async (params) => {
  await api.purchase.addPurchaseCart(params)
  showToast($t('95f75a3d.ab91e4'))
})

export const deleteCartItem = createAsyncThunk('purchase/deleteCartItem', async (params) => {
  await api.purchase.deletePurchaseCart(params)
})

export const updateCartItemNum = createAsyncThunk('purchase/updateCartItemNum', async (params) => {
  await api.purchase.updatePurchaseCart(params)
})

export const updateCount = createAsyncThunk('purchase/updateCount', async (params) => {
  // 获取购物车数量接口
  const { item_count, cart_count } = await api.purchase.updatePurchaseCartcount(params)
  return { item_count, cart_count }
})

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    updatePurchaseShareInfo: (state, { payload = {} }) => {
      state.purchase_share_info = payload
    },
    updatePersistPurchaseShareInfo: (state, { payload = {} }) => {
      state.persist_purchase_share_info = payload
    },
    updateInviteCode: (state, { payload = '' }) => {
      state.invite_code = payload
    },
    purchaseClearCart: (state) => {
      state.cartCount = 0
      state.validCart = []
      state.invalidCart = []
      state.coupon = null
    },
    updateValidIdentity: (state, { payload = '' }) => {
      state.hasValidIdentity = payload
    },
    updateEnterpriseId: (state, { payload = '' }) => {
      state.curEnterpriseId = payload
    },
    updateCurEnterpriseName: (state, { payload = '' }) => {
      state.curEnterpriseName = payload
    },
    updateActivityInfo: (state, { payload }) => {
      const { priceDisplayConfig, isDiscountDescriptionEnabled, discountDescription } = payload
      state.priceDisplayConfig = priceDisplayConfig
      state.isDiscountDescriptionEnabled = isDiscountDescriptionEnabled
      state.discountDescription = discountDescription
    },
    updateCurDistributorId: (state, { payload = '' }) => {
      state.curDistributorId = payload
    },
    updateIsOpenPurchase: (state, { payload = false }) => {
      state.isOpen = payload
    },
    updateEnterpriselogo: (state, { payload = '' }) => {
      state.curEnterpriseLogo = payload
    },
    updateCurActivityInfo: (state, { payload = {} }) => {
      state.curActivityInfo = payload
    },
    updateIsPasscodeLogin: (state, { payload = false }) => {
      state.isPasscodeLogin = payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartList.fulfilled, (state, action) => {
      const { valid_cart, invalid_cart } = action.payload
      state.validCart = valid_cart
      state.invalidCart = invalid_cart
    })

    builder.addCase(updateCount.fulfilled, (state, action) => {
      const { item_count, cart_count } = action.payload
      state.cartCount = item_count
    })
  }
})

export const {
  updatePurchaseShareInfo,
  updateInviteCode,
  purchaseClearCart,
  updateValidIdentity,
  updateEnterpriseId,
  updateActivityInfo,
  updateCurDistributorId,
  updateIsOpenPurchase,
  updatePersistPurchaseShareInfo,
  updateCurEnterpriseName,
  updateEnterpriselogo,
  updateCurActivityInfo,
  updateIsPasscodeLogin
} = purchaseSlice.actions

export default purchaseSlice.reducer
