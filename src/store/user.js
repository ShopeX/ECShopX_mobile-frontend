import { createReducer } from 'redux-create-reducer'

const initState = {
  land_params: null
}

const user = createReducer(initState, {
  ['user/landing'] (state, action) {
    const land_params = action.payload

    return {
      ...state,
      land_params
    }
  }
})

export default user
