import { createReducer } from 'redux-create-reducer'

const initState = {
  curStore: null
}

const shop = createReducer(initState, {
  ['shop/setShop'] (state, action) {
    const curStore = action.payload
    return {
      ...state,
      curStore
    }
  }
})

export default shop
