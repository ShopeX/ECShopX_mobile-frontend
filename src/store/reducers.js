import { combineReducers } from 'redux'
import cart from './cart'
import user from './user'
import address from './address'
import member from './member'

export default combineReducers({
  cart,
  user,
  address,
  member
})
