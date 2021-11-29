import { combineReducers } from '@reduxjs/toolkit'

import userReducer from './slices/user'
import colorsReducer from './slices/colors'
import sysReducer from './slices/sys'
import cartReducer from './slices/cart'

const rootReducer = combineReducers({
  user: userReducer,
  colors: colorsReducer,
  sys: sysReducer,
  cart: cartReducer
})

export default rootReducer
