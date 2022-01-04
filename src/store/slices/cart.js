import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
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

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (params) => {
  await api.cart.del(params)
})

export const updateCartItemNum = createAsyncThunk(
  'cart/updateCartItemNum',
  async ({ shop_id, cart_id, num, shop_type }) => {
    await api.cart.updateNum(shop_id, cart_id, num, shop_type)
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state, { payload }) => {},
    deleteCart: (state, { payload }) => {},
    updateCart: (state, { payload }) => {},
    changeCoupon: (state, { payload }) => {
      state.coupon = payload
    },
    changeZitiStore: (state, { payload }) => {
      const zitiShop = payload
      return {
        ...state,
        zitiShop
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartList.fulfilled, (state, action) => {
      const { valid_cart, invalid_cart } = action.payload
      state.validCart = valid_cart
      state.invalidCart = invalid_cart
    })
  }
})

export const { addCart, deleteCart, updateCart } = cartSlice.actions

export default cartSlice.reducer
