import { combineReducers } from '@reduxjs/toolkit'

import userReducer from './slices/user'
import colorsReducer from './slices/colors'
import sysReducer from './slices/sys'
import cartReducer from './slices/cart'
import merchantReducer from './slices/merchant'
import shopReducer from './slices/shop'
import guideReducer from './slices/guide'
import tabBar from './slices/tab-bar'
import communityReducer from './slices/community'

const rootReducer = combineReducers({
  guide: guideReducer,
  user: userReducer,
  colors: colorsReducer,
  sys: sysReducer,
  cart: cartReducer,
  merchant: merchantReducer,
  shop: shopReducer,
  tabBar: tabBar,
  community: communityReducer
})

export default rootReducer
