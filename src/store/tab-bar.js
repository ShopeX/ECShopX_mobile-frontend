import { createReducer } from 'redux-create-reducer'

const initState = {
  current: null
}

const tabBar = createReducer(initState, {
  ['tabBar'] (state, action) {
    const current = action.payload
    return {
      ...state,
      current
    }
  }
})

export default tabBar
