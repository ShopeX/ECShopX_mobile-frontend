/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
          ` ${distance_unit}`
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
  sort_id: 'sort_id', // 店铺隔离最新排序id
  show_salesperson: 'show_salesperson', // 是否显示导购：0-不显示，1-显示门店二维码，2-显示导购二维码
  show_float: 'show_float', // 小程序客服（标题栏热区 customerService）：1-展示，0-不展示（接口 distributor/salesperson/qrcode）
  fixed_salesperson_qrcode_url: 'fixed_salesperson_qrcode_url', // 门店固定二维码
  work_qrcode: 'work_qrcode', // 导购企微二维码
  work_qrcode_configid: 'work_qrcode_configid', // 导购企微configid
  salesperson_name: 'salesperson_name', // 导购姓名
  salesperson_avatar: 'salesperson_avatar', // 导购头像
  show_mobile: 'show_mobile' // 是否显示电话咨询
}

export const BUSINESS_SORT = {
  tag_name: 'title',
  tag_id: 'sort'
}

export const STORE_INFO = {
  name: 'name',
  logo: 'logo',
  marketingActivityList: 'marketingActivityList',
  banner: 'banner'
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
