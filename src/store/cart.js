import { createReducer } from 'redux-create-reducer'
// import dotProp from 'dot-prop-immutable'

function walkCart (state, fn) {
  state.list.forEach(shopCart => {
    shopCart.list.forEach(fn)
  })
}

const initState = {
  list: [],
  cartIds: [],
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
  // ['cart/add'](state, action) {
  //   const { item, num = 1 } = action.payload
  //   const idx = state.list.findIndex(t => item.item_id === t.item_id)
  //   let list

  //   if (idx >= 0) {
  //     list = dotProp.set(state.list, `${idx}`, { ...item, num: (+state.list[idx].num) + num })
  //   } else {
  //     list = [...state.list, { ...item, num }]
  //   }

  //   return {
  //     ...state,
  //     list
  //   }
  // },
  ['cart/update'](state, action) {
    const list = action.payload
    let cartIds = []
    walkCart(state, t => {
      cartIds.push(t.cart_id)
    })

    return {
      ...state,
      list,
      cartIds
    }
  },
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
  // ['cart/selection'](state, action) {
  //   const selection = action.payload
  //   return {
  //     ...state,
  //     selection
  //   }
  // },
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
  let total = 0

  walkCart(state, (item) => {
    if (state.selection.includes(item.cart_id)) return
    total += (+item.num)
  })

  return total
}

export function getTotalPrice (state) {
  let total = 0

  walkCart(state, (item) => {
    if (state.selection.includes(item.cart_id)) return

    total += (+item.price) * (+item.num)
  })

  return (total / 100).toFixed(2)
}

export function getSelectedCart (state) {
  return state.list.filter(item => state.selection.includes(item.item_id))
}
