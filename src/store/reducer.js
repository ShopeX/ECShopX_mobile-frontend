import { combineReducers } from '@reduxjs/toolkit'

import userReducer from './slices/user'
import colorsReducer from './slices/colors'
import sysReducer from './slices/sys'
import cartReducer from './slices/cart'
import merchantReducer from './slices/merchant'
import guideReducer from './slices/guide'
import tabBar from './slices/tab-bar.js'




const rootReducer = combineReducers({
  guide : guideReducer,
  user: userReducer,
  colors: colorsReducer,
  sys: sysReducer,
  cart: cartReducer,
  merchant: merchantReducer,
  tabBar:tabBar  
})

export default rootReducer
