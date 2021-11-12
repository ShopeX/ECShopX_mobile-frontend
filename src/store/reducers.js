import { combineReducers } from 'redux'
import cart from './cart'
import user from './user'
import address from './address'
import member from './member'
import tabBar from './tab-bar'
import colors from './colors'
import system from './system'
import home from './home'
import guide from './guide'
import shop from './shop'

export default combineReducers({
  cart,
  user,
  address,
  member,
  tabBar,
  colors,
  guide,
  home,
  shop,
  system
})
