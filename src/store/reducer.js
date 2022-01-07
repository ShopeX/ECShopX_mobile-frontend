import { combineReducers } from '@reduxjs/toolkit'

import userReducer from './slices/user'
import colorsReducer from './slices/colors'
import sysReducer from './slices/sys'
import cartReducer from './slices/cart'
import merchantReducer from './slices/merchant'

const rootReducer = combineReducers({
  user: userReducer,
  colors: colorsReducer,
  sys: sysReducer,
  cart: cartReducer,
  merchant: merchantReducer
})

export default rootReducer
