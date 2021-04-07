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
  freightCoupon: null,
  giftCoupon:null,
  selection: [],
  count: '',
  ads:null,
  receiptType: '',
  storeinfo: null,
  showBuyPanel:false,
  goodsSkuInfo:null

  // receiptType: 'ziti',
  // storeinfo: {"wxShopId":"1125","mapPoiId":null,"picList":null,"contractPhone":"02164879211","hour":"","credential":null,"companyName":null,"qualificationList":null,"cardId":null,"status":5,"companyId":"2","created":1575540642,"updated":1575540642,"lng":"121.440426","lat":"31.19286","address":"上海市上海市徐汇区肇嘉浜路6567号美罗城九层7-81,6-52a","category":null,"poiId":null,"errmsg":null,"auditId":null,"resourceId":null,"expiredAt":null,"isDefault":false,"storeName":"IF SH Metro City (美罗城)","addType":3,"country":null,"city":null,"isDomestic":1,"isDirectStore":1,"isOpen":true,"orgId":"200015","shopBn":"CN300031","customerId":"1015","ownNum":null,"onlineStatus":"1","startDate":"1990-01-01","endDate":"1990-01-01","isSelfPick":"1","isSfExpress":"1","isDelivery":"0","isAllChannels":"0","province":null,"district":null,"isDeleted":null,"is_valid":false,"store_notice":1,"out_limit":0,"distance":613.5,"distance_unit":"m","receiptType":"ziti"}
}

const guideCart = createReducer(initState, {
  ['guideCart/checkout'](state, action) {
    const checkoutItem = action.payload

    return {
      ...state,
      checkoutItem
    }
  },
  ['guideCart/fastbuy'](state, action) {
    const { item , num = 1 } = action.payload

    return {
      ...state,
      fastbuy: {
        ...item,
        num
      }
    }
  },
  ['guideCart/updateNum'](state, action) {
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
  ['guideCart/update'](state, action) {
    
    const list = action.payload
   
    let cartIds = []
    walkCart({ list }, t => {
      cartIds.push(t.cart_id)
    })

    return {
      ...state,
      list,
      cartIds
    }
  },
  ['guideCart/clearFastbuy'](state) {
    return {
      ...state,
      fastbuy: null
    }
  },
  ['guideCart/clear'](state) {
    return {
      ...state,
      ...initState
    }
  },
  ['guideCart/clearCoupon'](state) {
    return {
      ...state,
      coupon: null
    }
  },
  ['guideCart/selection'](state, action) {
    const selection = action.payload
  
    return {
      ...state,
      selection
    }
  },
  ['guideCart/changeCoupon'](state, action) {
    const coupon = action.payload

    return {
      ...state,
      coupon
    }
  },
  ['guideCart/freightCoupon'](state, action) {
    const freightCoupon = action.payload
    
    return {
      ...state,
      freightCoupon
    }
  },
  ['guideCart/clearFreightCoupon'](state) {
   
    return {
      ...state,
      freightCoupon: null
    }
  },
  ['guideCart/count'](state, action) {
    const count = action.payload > 0 ? action.payload : ''

    return {
      ...state,
      count
    }
  },
  ['guideCart/updateAds'](state, action) {
   
    const ads = action.payload ? action.payload : null

    return {
      ...state,
      ads
    }
  },
  ['guideCart/receiptType'](state, action) {

    const receiptType = action.payload
   
    return {
      ...state,
      receiptType
    }
  },
  ['guideCart/storeinfo'](state, action) {
    const storeinfo = action.payload

    return {
      ...state,
      storeinfo
    }
  },
  ['guideCart/clearReceipt'](state) {
    return {
      ...state,
      receiptType: '',
      storeinfo: null
    }
  },
  ['guideCart/closeCart'](state,action) {
    const showBuyPanel = action.payload
    return {
      ...state,
      showBuyPanel
     
    }
  },
  ['guideCart/setGoodsSkuInfo'](state,action) {
    const goodsSkuInfo = action.payload
    return {
      ...state,
      goodsSkuInfo
     
    }
  },
  ['guideCart/giftCoupon'](state,action) {
    const giftCoupon = action.payload
    return {
      ...state,
      giftCoupon
     
    }
  },
  ['guideCart/clearGiftCoupon'](state) {
    return {
      ...state,
      giftCoupon: null
    }
  },
 
  
})

export default guideCart

export function getTotalCount (state, isAll) {
  let total = 0

  walkCart(state, (item) => {
    if (!isAll && !state.selection.includes(item.cart_id)) return
    total += (+item.num)
  })

  return total
}

export function getTotalPrice (state) {
  let total = 0

  walkCart(state, (item) => {
    if (!state.selection.includes(item.cart_id)) return

    total += (+item.price) * (+item.num)
  })

  return (total).toFixed(2)
}

export function getSelectedCart (state) {
  return state.list.filter(item => state.selection.includes(item.item_id))
}
