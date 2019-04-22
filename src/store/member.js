import { createReducer } from 'redux-create-reducer'
import dotProp from 'dot-prop-immutable'

const initState = {
  favs: []
}

const member = createReducer(initState, {
  ['member/favs'](state, action) {
    const favs = action.payload

    return {
      ...state,
      favs
    }
  },
  ['member/addFav'](state, action) {
    const { item_id } = action.payload

    return dotProp.set(state, 'favs', favs => [...favs, item_id])
  },
  ['member/delFav'](state, action) {
    const { item_id } = action.payload

    const idx = state.favs.indexOf(item_id)
    if (idx >= 0) {
      dotProp.delete(state, `favs.${idx}`)
    }

    return state
  }
})

export default member
