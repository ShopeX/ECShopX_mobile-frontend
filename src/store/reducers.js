import { combineReducers } from 'redux'
import cart from './cart'
import user from './user'
import address from './address'

export default combineReducers({
  cart,
  user,
  address
})
