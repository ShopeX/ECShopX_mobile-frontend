import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  current: {}
}

const colorsSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    setColor: (state, { payload }) => {
      state.current = {
        data: [
          {
            primary: payload.primary || '#d42f29',
            marketing: payload.marketing || '#fba629',
            accent: payload.accent || '#2e3030'
          }
        ]
      }
    }
  }
})

export const { setColor } = colorsSlice.actions

export default colorsSlice.reducer
