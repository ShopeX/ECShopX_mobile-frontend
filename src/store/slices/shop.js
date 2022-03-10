import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  shopInfo: {}
}

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    updateShopInfo: (state, { payload }) => {
      state.shopInfo = payload
    }
  }
})

export const { updateShopInfo } = shopSlice.actions

export default shopSlice.reducer
