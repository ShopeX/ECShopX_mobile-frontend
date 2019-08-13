import { createReducer } from 'redux-create-reducer'
// import dotProp from 'dot-prop-immutable'

function walkCart (state, fn) {
  state.list.forEach((shopCart,shopIndex) => {
		// console.log('1walkCart',shopCart,shopIndex)
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
  ['cart/updateNum'](state, action) {
    const { cart_id, num } = action.payload

    walkCart(state, t => {
      if (t.cart_id === cart_id) {
        t.num = num
      }
    })
    const list = [...state.list]

    return {
      ...state,
      list
    }
  },
  ['cart/update'](state, action) {
    const list = action.payload
		let cartIds = []
		cartIds = list.map((shopCart,shopIndex)=>{
			return shopCart.list.map(v=>v.cart_id)
		})
		console.log('cartIds',cartIds)

    return {
      ...state,
      list,
      cartIds
    }
  },
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
  ['cart/clearCoupon'](state) {
    return {
      ...state,
      coupon: null
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

export function getTotalCount (state, isAll) {
  let total = 0

  walkCart(state, (item) => {
    if (!isAll && !state.selection.includes(item.cart_id)) return
    total += (+item.num)
  })

  return total
}

export function getTotalPrice (state) {
  // let total = 0
  // walkCart(state, (item) => {
  //   if (!state.selection.includes(item.cart_id)) return
  //   total += (+item.price) * (+item.num)
  // })
	// return (total).toFixed(2)
	const total = state.list.map((shopCart,shopIndex)=>{
		let shop_total = 0
		shopCart.list.map(item=>{
			if(!state.selection.length || !state.selection[shopIndex].size) return
			state.selection[shopIndex].has(item.cart_id) && (shop_total += (+item.price) * (+item.num))
		})
		return (shop_total).toFixed(2)
	})
	return total
}

export function getSelectedCart (state) {
  return state.list.filter(item => state.selection.includes(item.item_id))
}
