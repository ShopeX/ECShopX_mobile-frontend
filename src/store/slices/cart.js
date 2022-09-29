import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { showToast } from '@/utils'
import api from '@/api'

const initialState = {
  cartCount: 0,
  validCart: [],
  invalidCart: [],
  coupon: null
}

export const fetchCartList = createAsyncThunk('cart/fetchCartList', async (params) => {
  const { valid_cart, invalid_cart } = await api.cart.get(params)
  return {
    valid_cart,
    invalid_cart
  }
})

export const addCart = createAsyncThunk('cart/addCart', async (params) => {
  await api.cart.add(params)
  showToast('成功加入购物车')
})

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (params) => {
  await api.cart.del(params)
})

export const updateCartItemNum = createAsyncThunk(
  'cart/updateCartItemNum',
  async ({ shop_id, cart_id, num, shop_type }) => {
    await api.cart.updateNum(shop_id, cart_id, num, shop_type)
  }
)

export const updateCount = createAsyncThunk('cart/updateCount', async (params) => {
  // 获取购物车数量接口
  const { item_count, cart_count } = await api.cart.count(params)
  return { item_count, cart_count }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // addCart: (state, { payload }) => {},
    deleteCart: (state, { payload }) => {},
    updateCart: (state, { payload }) => {},
    changeCoupon: (state, { payload }) => {
      state.coupon = payload
    },
    updateCartNum: (state, { payload }) => {
      // 更新购物车数量
      state.cartCount = payload
    },
    clear: (state, { payload }) => {
      state.coupon = null
    },
    changeZitiStore: (state, { payload }) => {
      state.zitiShop = payload
    },
    clearCart: (state ) => {
      state.cartCount = 0
      state.validCart = []
      state.invalidCart = []
      state.coupon = null
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

export const { deleteCart, updateCart, updateCartNum, changeCoupon, clearCart } = cartSlice.actions

export default cartSlice.reducer
