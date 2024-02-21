import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { showToast } from '@/utils'
import api from '@/api'

const initialState = {
  tabbar: null,
  purchase_share_info: {},
  invite_code: '',
  validCart: [],
  invalidCart: [],
  cartCount: 0,
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
  showToast('成功加入购物车')
})

export const deleteCartItem = createAsyncThunk('purchase/deleteCartItem', async (params) => {
  await api.purchase.deletePurchaseCart(params)
})

export const updateCartItemNum = createAsyncThunk('purchase/updateCartItemNum',async (params) => {
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
    updatePurchaseTabbar: (state, { payload }) => {
      state.tabbar = payload.tabbar
    },
    updatePurchaseShareInfo: (state, { payload = {} }) => {
      state.purchase_share_info = payload
    },
    updateInviteCode: (state, { payload = '' }) => {
      state.invite_code = payload
    },
    purchaseClearCart: (state ) => {
      state.cartCount = 0
      state.validCart = []
      state.invalidCart = []
      state.coupon = null
    },
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

export const { updatePurchaseTabbar, updatePurchaseShareInfo, updateInviteCode, purchaseClearCart } = purchaseSlice.actions

export default purchaseSlice.reducer
