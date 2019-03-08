import { createReducer } from 'redux-create-reducer'

const initState = {
  list: [],
  fastbuy: null,
  coupon: null
}

const cart = createReducer(initState, {
  ['cart/update'](state, action) {
    const { list } = action.payload

    return {
      ...state,
      list
    }
  },

  ['cart/checkout'](state, action) {
    const checkoutItem = action.payload

    return {
      ...state,
      checkoutItem
    }
  },

  ['cart/fastbuy'](state, action) {
    const { item , num = 1 } = action.payload

    return {
      ...state,
      fastbuy: {
        ...item,
        num
      }
    }
  },

  ['cart/clearFastbuy'](state) {
    return {
      ...state,
      fastbuy: null
    }
  },

  ['cart/changeCoupon'](state, action) {
    const coupon = action.payload

    return {
      ...state,
      coupon
    }
  }
})

export default cart
