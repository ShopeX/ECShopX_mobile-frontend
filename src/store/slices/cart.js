import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { showToast } from '@/utils'
import api from '@/api'

const initialState = {
  cartCount: 0,
  cartSalesman: 0,
  validCart: [],
  invalidCart: [],
  validSalesmanCart: [],
  invalidSalesmanCart: [],
  customerLnformation:{},
  coupon: null,
  zitiAddress: null,
  shopCartCount:{},
  shopSalesmanCartCount:{}
}

export const fetchCartList = createAsyncThunk('cart/fetchCartList', async (params) => {
  const { valid_cart, invalid_cart } = await api.cart.get(params)
  return {
    valid_cart,
    invalid_cart
  }
})

export const fetchSalesmanCartList = createAsyncThunk('cart/fetchSalesmanCartList', async (params) => {
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
  async ({ shop_id, cart_id, num, shop_type ,isSalesmanPage}) => {
    await api.cart.updateNum(shop_id, cart_id, num, shop_type,isSalesmanPage)
  }
)

export const updateCount = createAsyncThunk('cart/updateCount', async (params) => {
  // 获取购物车数量接口
  const { item_count, cart_count } = await api.cart.count(params)
  return { item_count, cart_count }
})

export const updateSalesmanCount = createAsyncThunk('cart/updateSalesmanCount', async (params) => {
  // 获取业务员购物车数量接口
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
    updateCartSalesman: (state, { payload }) => {
      // 更新业务员购物车数量
      state.cartSalesman = payload
    },
    updateShopCartCount: (state, { payload }) => {
      //跟新店铺购物车全部数据
      state.shopCartCount = payload
    },
    updateShopSalesmanCartCount: (state, { payload }) => {
      //跟新业务员店铺购物车全部数据
      state.shopSalesmanCartCount = payload
    },
    updateCustomerLnformation: (state, { payload }) => {
      // 更新业务员顾客信息
      state.customerLnformation = payload
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
    },
    changeZitiAddress: (state, { payload }) => {
      state.zitiAddress = payload
    }
  },
  extraReducers: (builder) => { 
    builder.addCase(fetchCartList.fulfilled, (state, action) => {
      const { valid_cart, invalid_cart } = action.payload
      state.validCart = valid_cart
      state.invalidCart = invalid_cart
    })

    builder.addCase(fetchSalesmanCartList.fulfilled, (state, action) => {
      const { valid_cart, invalid_cart } = action.payload
      state.validSalesmanCart = valid_cart
      state.invalidSalesmanCart = invalid_cart
    })

    builder.addCase(updateCount.fulfilled, (state, action) => {
      const { item_count, cart_count } = action.payload
      state.cartCount = item_count
    })

    builder.addCase(updateSalesmanCount.fulfilled, (state, action) => {
      const { item_count, cart_count } = action.payload
      state.cartSalesman = item_count
    })
  }
})

export const { deleteCart, updateCart, updateCartNum,updateCartSalesman,updateCustomerLnformation, updateShopSalesmanCartCount,changeCoupon, clearCart, changeZitiAddress ,updateShopCartCount} = cartSlice.actions

export default cartSlice.reducer
