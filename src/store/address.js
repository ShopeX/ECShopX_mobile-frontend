import { createReducer } from 'redux-create-reducer'

const initState = {
  defaultAddress: null,
}

const address = createReducer(initState, {
  ['address/choose'](state, action) {
    const defaultAddress = action.payload

    return {
      ...state,
      defaultAddress
    }
  }

})

export default address

