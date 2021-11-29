import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  cartCount: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateUserInfo: (state, { payload }) => {
      state.userInfo = payload
    }
  }
})

export const { updateUserInfo } = cartSlice.actions

export default cartSlice.reducer
