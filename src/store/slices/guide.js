import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
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
  storeinfo: null,
  showBuyPanel: false,
  goodsSkuInfo: null,
  // 导购门店信息
  storeInfo: null
}

const guideSlice = createSlice({
  name: 'guide',
  initialState,
  reducers: {
    ['updateStoreInfo'](state, action) {
      const { info: storeInfo } = action.payload
      return {
        ...state,
        storeInfo
      }
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
  }
})

export const { setColor } = guideSlice.actions

export default guideSlice.reducer





function walkCart(state, fn) {
  state.list.forEach((shopCart) => {
    shopCart.list.forEach(fn)
  })
}


