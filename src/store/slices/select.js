import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  //商品选品
  selectGoods: []
}

const merchantSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {
    updateSelectGoods: (state, { payload }) => {
      state.selectGoods = payload
    }
  }
})

export const { updateSelectGoods } = merchantSlice.actions

export default merchantSlice.reducer
