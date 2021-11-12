import { createReducer } from 'redux-create-reducer'

const initState = {
  Sys: {},
  isqy: false
}

const qywx = createReducer(initState, {
  ['qywx/getSysType'](state, action) {
    const favsList = action.payload
    const isqy = false

    return {
      ...state,
      isqy
    }
  },

  ['qywx/delFav'](state, action) {
    const { item_id } = action.payload
    const favs = {
      ...state.favs
    }
    delete favs[item_id]

    return {
      ...state,
      favs
    }
  },
  ['qywx/closeAdv'](state) {
    return {
      ...state,
      showAdv: false
    }
  }
})

export default qywx
