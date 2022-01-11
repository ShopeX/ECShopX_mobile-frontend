import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  //商户类型
  merchantType: {},
  //经营范围
  businessScope: {},
  //银行
  bank: { name: '' }
}

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    updateMerchantType: (state, { payload }) => {
      state.merchantType = payload
    },
    updateBusinessScope: (state, { payload }) => {
      state.businessScope = payload
    },
    updateBank: (state, { payload }) => {
      state.bank = payload
    }
  }
})

export const { updateMerchantType, updateBusinessScope, updateBank } = merchantSlice.actions

export default merchantSlice.reducer
