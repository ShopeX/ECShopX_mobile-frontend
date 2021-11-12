import { createReducer } from 'redux-create-reducer'

const initState = {
  current: null
}

const address = createReducer(initState, {
  ['address/choose'](state, action) {
    const current = action.payload

    return {
      ...state,
      current
    }
  }
})

export default address
