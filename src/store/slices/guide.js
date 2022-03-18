import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { showToast } from '@/utils'
import api from '@/api'

const initialState = {
  userInfo: null,
  storeInfo: null, // 导购门店信息
  cartCount: 0,
  validCart: [],
  invalidCart: [],
  list: [],
  cartIds: [],
  fastbuy: null,
  coupon: null,
  freightCoupon: null,
  giftCoupon: null,
  selection: [],
  count: '',
  ads: null,
  receiptType: '',
  showBuyPanel: false,
  goodsSkuInfo: null
}

export const fetchCartList = createAsyncThunk('cart/fetchCartList', async (params) => {
  const { valid_cart, invalid_cart } = await api.guide.cartdatalist(params)
  return {
    valid_cart,
    invalid_cart
  }
})

export const addCart = createAsyncThunk('cart/addCart', async (params) => {
  await api.guide.cartdataadd(params)
  showToast('成功加入购物车')
})

export const updateCartItemNum = createAsyncThunk('cart/updateCartItemNum', async (parmas) => {
  await api.guide.cartdataadd(parmas)
})

export const updateCount = createAsyncThunk('cart/updateCount', async (params) => {
  // 获取购物车数量接口
  const { item_count, cart_count } = await api.guide.cartCount(params)
  return { item_count, cart_count }
})

const guideSlice = createSlice({
  name: 'guide',
  initialState,
  reducers: {
    updateUserInfo: (state, { payload }) => {
      state.userInfo = payload
    },
    updateStoreInfo: (state, { payload }) => {
      state.storeInfo = payload
    },
    ['checkout'](state, action) {
      const checkoutItem = action.payload

      return {
        ...state,
        checkoutItem
      }
    },
    ['fastbuy'](state, action) {
      const { item, num = 1 } = action.payload

      return {
        ...state,
        fastbuy: {
          ...item,
          num
        }
      }
    },
    ['updateNum'](state, action) {
      const { cart_id, num } = action.payload

      walkCart(state, (t) => {
        if (t.cart_id === cart_id) {
          t.num = num
        }
      })
      const list = [...state.list]

      return {
        ...state,
        list
      }
    },
    ['update'](state, action) {
      const list = action.payload

      let cartIds = []
      walkCart({ list }, (t) => {
        cartIds.push(t.cart_id)
      })

      return {
        ...state,
        list,
        cartIds
      }
    },
    ['clearFastbuy'](state) {
      return {
        ...state,
        fastbuy: null
      }
    },
    ['clear'](state) {
      return {
        ...state,
        ...initialState
      }
    },
    ['clearCoupon'](state) {
      return {
        ...state,
        coupon: null
      }
    },
    ['selection'](state, action) {
      const selection = action.payload

      return {
        ...state,
        selection
      }
    },
    ['changeCoupon'](state, action) {
      const coupon = action.payload

      return {
        ...state,
        coupon
      }
    },
    ['freightCoupon'](state, action) {
      const freightCoupon = action.payload

      return {
        ...state,
        freightCoupon
      }
    },
    ['clearFreightCoupon'](state) {
      return {
        ...state,
        freightCoupon: null
      }
    },
    ['count'](state, action) {
      const count = action.payload > 0 ? action.payload : ''

      return {
        ...state,
        count
      }
    },
    ['updateAds'](state, action) {
      const ads = action.payload ? action.payload : null

      return {
        ...state,
        ads
      }
    },
    ['receiptType'](state, action) {
      const receiptType = action.payload

      return {
        ...state,
        receiptType
      }
    },
    ['storeinfo'](state, action) {
      const storeinfo = action.payload

      return {
        ...state,
        storeinfo
      }
    },
    ['clearReceipt'](state) {
      return {
        ...state,
        receiptType: '',
        storeinfo: null
      }
    },
    ['closeCart'](state, action) {
      const showBuyPanel = action.payload
      return {
        ...state,
        showBuyPanel
      }
    },
    ['setGoodsSkuInfo'](state, action) {
      const goodsSkuInfo = action.payload
      return {
        ...state,
        goodsSkuInfo
      }
    },
    ['giftCoupon'](state, action) {
      const giftCoupon = action.payload
      return {
        ...state,
        giftCoupon
      }
    },
    ['clearGiftCoupon'](state) {
      return {
        ...state,
        giftCoupon: null
      }
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

export const { updateUserInfo, updateStoreInfo } = guideSlice.actions

export default guideSlice.reducer

function walkCart(state, fn) {
  state.list.forEach((shopCart) => {
    shopCart.list.forEach(fn)
  })
}
