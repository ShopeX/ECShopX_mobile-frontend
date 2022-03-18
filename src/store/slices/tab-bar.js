import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  current: null
}

const tabBarSlice = createSlice({
  name: 'tabBar',
  initialState,
  reducers: {
    ['tabBar'](state, action) {
      const current = action.payload
      return {
        ...state,
        current
      }
    }
  }
})

export const { setColor } = tabBarSlice.actions
export default tabBarSlice.reducer
