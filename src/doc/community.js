import { pickBy, calcTimer } from '@/utils'
import { AFTER_SALE_STATUS } from '@/consts'

export const COMMUNITY_ORDER_LIST = {
  orderId: 'order_id',
  orderStatus: 'order_status',
  orderStatusMsg: 'order_status_msg',
  items: 'items',
  remark: 'remark',
  receiver_name: 'receiver_name',
  receiver_mobile: 'receiver_mobile',
  receiver_state: 'receiver_state',
  receiver_city: 'receiver_city',
  receiver_district: 'receiver_district',
  receiver_address: 'receiver_address',
  receiver_type: 'receiver_type',
  memberInfo: 'member',
  communityInfo: 'community_info',
  createDate: 'create_date',
  totalNum: 'total_num',
  buildingNumber: 'building_number',
  houseNumber: 'house_number',
  payStatus: 'pay_status',
  isLogistics: 'is_logistics',
  canApplyCancel: 'can_apply_cancel',
  orderStatusDes: 'order_status_des',
  status: 'status',
  orderType: 'order_type',
  payType: 'pay_type',
  canApplyAftersales: 'can_apply_aftersales',
  autoCancelSeconds: ({ auto_cancel_seconds }) => {
    if (auto_cancel_seconds) {
      return calcTimer(auto_cancel_seconds)
    } else {
      return {}
    }
  },
  items: ({ items }) => {
    if (!items) {
      return []
    } else {
      return pickBy(items, {
        orderId: 'order_id',
        itemName: 'item_name',
        // price: 'price',
        total_fee: 'total_fee',
        num: 'num',
        zitiName: 'ziti_name',
        pic: 'pic'
      })
    }
  }
}

export const COMMUNITY_ACTIVITY_ITEM = {
  activityIntro: ({ activity_intro }) => {
    return JSON.parse(activity_intro)
  },
  activityPics: ({ activity_pics }) => {
    return JSON.parse(activity_pics)
  },
  activityName: 'activity_name',
  activityId: 'activity_id',
  chiefInfo: 'chief_info',
  isActivityAuthor: 'is_activity_author',
  items: ({ items }) => {
    return pickBy(items, {
      itemId: 'itemId',
      pic: 'pics[0]',
      itemName: 'item_name',
      store: 'store',
      price: ({ price }) => (price / 100).toFixed(2),
      num: 0
    })
  },
  ziti: ({ ziti }) => {
    return pickBy(ziti, {
      area: ({ province, city, area }) => {
        return `${province} ${city} ${area}`
      },
      zitiName: 'ziti_name',
      province: 'province',
      city: 'city',
      country: 'area',
      address: 'address'
    })
  }
}

export const COMMUNITY_ACTIVITY_DETAIL_ITEM = {
  chiefInfo: 'chief_info',
  activityIntro: ({ activity_intro }) => {
    return JSON.parse(activity_intro)
  },
  activityPics: ({ activity_pics }) => {
    return JSON.parse(activity_pics)
  },
  activityName: 'activity_name',
  activityId: 'activity_id',
  items: ({ items }) => {
    return pickBy(items, {
      itemId: 'itemId',
      pic: 'pics[0]',
      itemName: 'item_name',
      store: 'store',
      price: ({ price }) => (price / 100).toFixed(2)
    })
  },
  ziti: ({ ziti }) => {
    return pickBy(ziti, {
      area: ({ province, city, area }) => {
        return `${province} ${city} ${area}`
      },
      zitiName: 'ziti_name',
      province: 'province',
      city: 'city',
      country: 'area',
      address: 'address'
    })
  }
}

export const COMMUNITY_ACTIVITY_LIST = {
  activityId: 'activity_id',
  chiefId: 'chief_id',
  activityName: 'activity_name',
  activityStatus: 'activity_status',
  activityStatusMsg: 'activity_status_msg',
  startTime: 'start_time',
  priceRange: 'price_range',
  deliveryStatus: 'delivery_status',
  orderNum: 'order_num',
  totalFee: 'total_fee',
  items: ({ items }) => {
    if (!items) {
      return []
    } else {
      return pickBy(items, {
        itemId: 'item_id',
        itemName: 'item_name',
        itemPics: 'item_pics',
        pics: ({ pics }) => pics[0]
      })
    }
  }
}

export const COMMUNITY_ZITI = {
  id: 'ziti_id',
  area: ({ province, city, area }) => {
    return `${province} ${city} ${area}`
  },
  zitiName: 'ziti_name',
  province: 'province',
  city: 'city',
  country: 'area',
  address: 'address'
}

export const COMMUNITY_GOODS_ITEM = {
  itemId: 'itemId',
  pic: 'pics[0]',
  itemName: 'item_name',
  store: 'store',
  price: ({ price }) => (price / 100).toFixed(2)
}

export const COMMUNITY_AFTER_SALE_ITEM = {
  id: 'aftersales_bn',
  status_desc: ({ aftersales_status }) => AFTER_SALE_STATUS[aftersales_status],
  totalItems: 'num',
  payment: ({ refund_fee }) => (refund_fee / 100).toFixed(2),
  pay_type: 'pay_type',
  point: 'point',
  distributor_info: 'distributor_info',
  order: ({ detail }) =>
    pickBy(detail, {
      order_id: 'order_id',
      item_id: 'item_id',
      pic_path: 'item_pic',
      title: 'item_name',
      price: ({ refund_fee }) => (+refund_fee / 100).toFixed(2),
      point: 'item_point',
      num: 'num'
    })
}
