import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  current: {}
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: ( state, { payload } ) => {
      state.current = {
        data: [{
          ...payload
        }]
      }
    }
  }
})

export const { setAddress } = addressSlice.actions

export default addressSlice.reducer

