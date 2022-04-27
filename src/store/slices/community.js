import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // 商品选品
  selectGoods: [],
  // 社区团购选自提点
  selectCommunityZiti: null
}

const merchantSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {
    updateSelectGoods: (state, { payload }) => {
      state.selectGoods = payload
    },
    updateSelectCommunityZiti: (state, { payload }) => {
      state.selectCommunityZiti = payload
    }
  }
})

export const { updateSelectGoods, updateSelectCommunityZiti } = merchantSlice.actions

export default merchantSlice.reducer
