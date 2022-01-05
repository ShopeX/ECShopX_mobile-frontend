import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  //商户类型
  merchantType: {},
  //经营范围
  businessScope: {}
}

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    updateState: (state, { payload }) => {
      state[payload.key] = payload
    }
  }
})

export const { updateState } = merchantSlice.actions

export default merchantSlice.reducer
