// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
export const SHOP_ITEM = {
  logo: 'logo',
  title: 'title',
  store_name: 'store_name',
  name: 'store_name',
  hour: 'hour',
  store_address: 'store_address',
  address: 'address',
  tagList: 'tagList',
  distributor_id: 'distributor_id',
  distance: ({ distance, distance_unit }) => {
    return distance
      ? (distance < 1 ? Math.round(distance * Math.pow(10, 3)) : Number(distance).toFixed(0)) +
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
  lng: 'lng',
  selfDeliveryRule: 'selfDeliveryRule',
  is_self_delivery: 'is_self_delivery',
  created: 'created', // 创建时间
  isOpenDivided: 'isOpenDivided', // 是否开启店铺隔离
  sort_id: 'sort_id' // 店铺隔离最新排序id
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

export const STORE_ITEM = {
  name: 'name',
  province: 'province',
  city: 'city',
  area: 'area',
  address: 'address',
  mobile: 'mobile',
  hours: 'hours',
  address_id: 'address_id',
  distributor_id: 'distributor_id',
  distance: ({ distance }) => {
    const _distance = parseFloat(distance)
    return distance
      ? _distance < 1000
        ? `${parseInt(_distance)}m`
        : `${(_distance / 1000).toFixed(1)}km`
      : ''
  }
}
