/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  favs: {},
  // 是否显示广告
  showAdv: true,
  member: {}
}

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    favs: (state, { payload }) => {
      const favsList = payload
      const favs = {}
      favsList.forEach(({ item_id, fav_id }) => {
        favs[item_id] = {
          item_id,
          fav_id
        }
      })
      state.favs = favs
    },
    addFav: (state, { payload }) => {
      const { item_id } = payload
      const favs = {
        ...state.favs,
        [item_id]: payload
      }
      state.favs = favs
    },
    delFav: (state, { payload }) => {
      const { item_id } = payload
      const favs = {
        ...state.favs
      }
      delete favs[item_id]
      state.favs = favs
    },
    closeAdv: (state, { payload }) => {
      state.showAdv = false
    },
    init: (state, { payload }) => {
      state.member = payload
    }
  }
})

export default memberSlice.reducer
