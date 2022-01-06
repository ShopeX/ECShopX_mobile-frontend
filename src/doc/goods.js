export const WGT_GOODS_GRID = {
  cross: {
    key: 'origincountry_img_url',
    default: []
  },
  pic: ({ imgUrl }) => {
    return imgUrl
  },
  itemId: 'goodsId',
  itemName: 'title',
  brief: 'brief',
  promotion: 'promotion_activity',
  distributorId: 'distributor_id',
  isPoint: 'is_point',
  price: ({ act_price, member_price, price }) => {
    if (act_price > 0) {
      return act_price
    } else if (member_price > 0) {
      return member_price
    } else {
      return price
    }
  },
  marketPrice: 'market_price'
}

export const WGT_GOODS_GRID_TAB = {
  pic: ({ imgUrl }) => {
    return imgUrl
  },
  itemId: 'goodsId',
  itemName: 'title',
  brief: 'brief',
  promotion: 'promotion_activity',
  distributorId: 'distributor_id',
  isPoint: 'is_point',
  price: ({ act_price, member_price, price }) => {
    if (act_price > 0) {
      return act_price
    } else if (member_price > 0) {
      return member_price
    } else {
      return price
    }
  },
  marketPrice: 'market_price',
  brand: 'brand'
}

export const WGT_GOODS_BRAND = {
  id: 'attribute_id',
  name: 'attribute_name'
}

export const BUSINESS_LIST_TAG = {
  id: 'tag_id',
  name: 'tag_name'
}

export const ITEM_LIST_GOODS = {
  pic: ({ pics }) => (pics ? (typeof pics !== 'string' ? pics[0] : JSON.parse(pics)[0]) : ''),
  itemId: 'item_id',
  itemName: 'item_name',
  brief: 'brief',
  distributorId: 'distributor_id',
  distributor_info: 'distributor_info',
  promotion: 'promotion_activity',
  origincountry_name: 'origincountry_name',
  origincountry_img_url: 'origincountry_img_url',
  type: 'type',
  price: 'price',
  marketPrice: 'market_price',
  // is_fav: ({ item_id }) => Boolean(favs[item_id]),
  store: 'store'
}

export const GOODS_INFO = {
  imgs: 'pics'
}
