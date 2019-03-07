import { createReducer } from 'redux-create-reducer'

const initState = {
  list: [],
  checkoutItem: null
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
  }
})

export default cart
