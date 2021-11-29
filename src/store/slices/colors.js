import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  current: {}
}

const colorsSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    setColor: ( state, { payload } ) => {
      debugger
      state.userInfo = payload
    }
  }
})

export const { setColor } = colorsSlice.actions

export default colorsSlice.reducer
