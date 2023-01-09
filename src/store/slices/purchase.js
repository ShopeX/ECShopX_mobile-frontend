import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  tabbar: null,
  purchase_share_info: {},
  invite_code: ''
}

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    updatePurchaseTabbar: (state, { payload }) => {
      state.tabbar = payload.tabbar
    },
    updatePurchaseShareInfo: (state, { payload = {} }) => {
      state.purchase_share_info = payload
    },
    updateInviteCode: (state, { payload }) => {
      state.invite_code = payload
    }
  }
})

export const { updatePurchaseTabbar, updatePurchaseShareInfo, updateInviteCode } = purchaseSlice.actions

export default purchaseSlice.reducer
