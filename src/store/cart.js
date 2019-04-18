import { createReducer } from 'redux-create-reducer'
import dotProp from 'dot-prop-immutable'

const initState = {
  list: [],
  fastbuy: null,
  coupon: null,
  selection: []
}

const cart = createReducer(initState, {
  ['cart/checkout'](state, action) {
    const checkoutItem = action.payload

    return {
      ...state,
      checkoutItem
    }
  },
  ['cart/fastbuy'](state, action) {
    const { item , num = 1 } = action.payload

    return {
      ...state,
      fastbuy: {
        ...item,
        num
      }
    }
  },
  ['cart/add'](state, action) {
    const { item, num = 1 } = action.payload
    const idx = state.list.findIndex(t => item.item_id === t.item_id)
    let list

    if (idx >= 0) {
      list = dotProp.set(state.list, `${idx}`, { ...item, num: (+state.list[idx].num) + num })
    } else {
      list = [...state.list, { ...item, num }]
    }

    return {
      ...state,
      list
    }
  },
  // ['cart/update'](state, action) {
  //   const { item, num } = action.payload
  //   const idx = state.list.findIndex(t => item.item_id === t.item_id)
  //   let list

  //   if (idx >= 0) {
  //     list = dotProp.set(state.list, `${idx}`, { ...item, num })
  //   } else {
  //     list = [...state.list, { ...item, num }]
  //   }

  //   return {
  //     ...state,
  //     list
  //   }
  // },
  // ['cart/delete'](state, action) {
  //   const { item_id } = action.payload
  //   const idx = state.list.findIndex(t => t.item_id === item_id)

  //   return dotProp.delete(state, `list.${idx}`)
  // },
  ['cart/clearFastbuy'](state) {
    return {
      ...state,
      fastbuy: null
    }
  },
  ['cart/clear'](state) {
    return {
      ...state,
      ...initState
    }
  },
  ['cart/selection'](state, action) {
    const selection = action.payload
    return {
      ...state,
      selection
    }
  },
  ['cart/changeCoupon'](state, action) {
    const coupon = action.payload

    return {
      ...state,
      coupon
    }
  }
})

export default cart

export function getTotalCount (state) {
  return state.list.reduce((acc, item) => (+item.num) + acc, 0)
}

export function getTotalPrice (state) {
  const total = state.list.reduce((acc, item) => {
    if (!state.selection.includes(item.item_id)) {
      return acc
    }

    return (+item.price) * (+item.num) + acc
  }, 0)
  return (total / 100).toFixed(2)
}

export function getSelectedCart (state) {
  return state.list.filter(item => state.selection.includes(item.item_id))
}
