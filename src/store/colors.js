import { createReducer } from 'redux-create-reducer'

const initState = {
  current: null,
}

const colors = createReducer(initState, {
  ['colors'](state, action) {
    const current = action.payload
    return {
      ...state,
      current
    }
  } 
})

export default colors
