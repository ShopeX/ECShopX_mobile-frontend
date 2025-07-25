import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  shopInfo: {},
  zitiShop: null
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
    }
  }
})

export const { updateShopInfo, changeZitiStore } = shopSlice.actions

export default shopSlice.reducer
