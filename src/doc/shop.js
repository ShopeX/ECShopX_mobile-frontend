export const SHOP_ITEM = {
  logo: 'logo',
  title: 'title',
  store_name: 'store_name',
  hour: 'hour',
  store_address: 'store_address',
  address: 'address',
  tagList: 'tagList',
  distributor_id: 'distributor_id',
  distance: ({ distance, distance_unit }) => {
    return distance
      ? (distance < 1 ? Math.round(distance * Math.pow(10, 3)) : Number(distance).toFixed(2)) +
          distance_unit
      : ''
  },
  cardList: 'discountCardList',
  salesCount: 'sales_count',
  rate: 'rate',
  scoreList: 'scoreList',
  is_dada: 'is_dada',
  marketingActivityList: 'marketingActivityList',
  itemList: 'itemList',
  mobile: 'mobile',
  regions: 'regions',
  regions_id: 'regions_id',
  is_valid: 'is_valid',
  is_dada: 'is_dada',
  is_default: 'is_default',
  is_delivery: 'is_delivery',
  is_ziti: 'is_ziti',
  lat: 'lat',
  lng: 'lng'
}

export const BUSINESS_SORT = {
  tag_name: 'title',
  tag_id: 'sort'
}

export const STORE_INFO = {
  name: 'name',
  logo: 'logo',
  marketingActivityList: 'marketingActivityList'
}