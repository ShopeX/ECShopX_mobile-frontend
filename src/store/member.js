import { createReducer } from 'redux-create-reducer'
// import dotProp from 'dot-prop-immutable'

const initState = {
  favs: {}
}

const member = createReducer(initState, {
  ['member/favs'](state, action) {
    const favsList = action.payload
    const favs = {}
    favsList.forEach(({ item_id, fav_id }) => {
      favs[item_id] = {
        item_id,
        fav_id
      }
    })

    return {
      ...state,
      favs
    }
  },
  ['member/addFav'](state, action) {
    const { item_id } = action.payload
    const favs = {
      ...state.favs,
      [item_id]: action.payload
    }

    return {
      ...state,
      favs
    }
  },
  ['member/delFav'](state, action) {
    const { item_id } = action.payload
    const favs = {
      ...state.favs
    }
    delete favs[item_id]

    return {
      ...state,
      favs
    }
  }
})

export default member
