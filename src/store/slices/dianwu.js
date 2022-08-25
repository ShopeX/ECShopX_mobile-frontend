import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { showToast } from '@/utils'
import api from '@/api'

const initialState = {
  member: null
}

const cartSlice = createSlice({
  name: 'dianwu',
  initialState,
  reducers: {
    selectMember: (state, { payload }) => {
      state.member = payload
    }
  }
})

export const { selectMember } = cartSlice.actions

export default cartSlice.reducer
