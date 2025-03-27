import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  shopInfo: {},
  zitiShop: null,
  shopInWhite: undefined
}

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    updateShopInfo: (state, { payload }) => {
      state.shopInfo = payload
    },
    changeZitiStore: (state, { payload }) => {
      state.zitiShop = payload
    },
    changeInWhite: (state, { payload }) => {
      state.shopInWhite = payload
    }
  }
})

export const { updateShopInfo, changeZitiStore, changeInWhite } = shopSlice.actions

export default shopSlice.reducer
