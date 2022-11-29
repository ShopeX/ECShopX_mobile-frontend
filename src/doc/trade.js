import { pickBy, formatDateTime, isObject } from "@/utils"

export const TRADE_ITEM = {
  orderId: 'order_id',
  createDate: 'create_date',
  orderStatusMsg: 'order_status_msg',
  distributorId: 'distributor_id',
  distributorName: 'distributor_name',
  distributorInfo: ({ distributor_info }) => {
    return pickBy(distributor_info, {
      name: 'name',
      logo: 'logo'
    })
  },
  orderStatus: 'order_status',
  isLogistics: ({ is_logistics }) => is_logistics == '1',
  canApplyCancel: ({ can_apply_cancel }) => can_apply_cancel == 1,
  deliveryStatus: 'delivery_status',
  receiptType: 'receipt_type',
  receiverAddress: 'receiver_address',
  receiverCity: "receiver_city",
  receiverDistrict: "receiver_district",
  receiverMobile: "receiver_mobile",
  receiverName: "receiver_name",
  receiverState: "receiver_state",
  items: ({ items }) => {
    return pickBy(items, {
      id: 'id',
      pic: 'pic',
      itemName: 'item_name',
      price: ({ total_fee }) => total_fee / 100,
      num: 'num',
      // 可售后商品数
      leftAftersalesNum: 'left_aftersales_num',
      // 默认售后商品数
      refundNum: 1,
      itemSpecDesc: 'item_spec_desc',
      point: 'point',
      checked: () => false
    })
  },
  point: 'point',
  createdTime: ({ create_time }) => formatDateTime(create_time * 1000),
  totalFee: ({ total_fee }) => total_fee / 100,
  marketFee: ({ market_fee }) => market_fee / 100,
  itemFee: ({ item_fee_new }) => item_fee_new / 100,
  freightFee: ({ freight_fee }) => freight_fee / 100
}

export const SHOP_INFO = {

}

export const TRADE_AFTER_SALES_ITEM = {
  orderId: 'order_id',
  progress: 'progress',
  progressMsg: ({ app_info }) => app_info.progress_msg,
  afterSalesBn: 'aftersales_bn',
  afterSalesType: 'aftersales_type',
  distributorRemark: 'distributor_remark',
  refuseReason: 'refuse_reason',
  items: ({ detail }) => {
    return pickBy(detail, {
      pic: ({ orderItem }) => orderItem.pic,
      itemName: ({ orderItem }) => orderItem.item_name,
      itemSpecDesc: ({ orderItem }) => orderItem.item_spec_desc,
      num: ({ orderItem }) => orderItem.num,
      price: ({ orderItem }) => orderItem.total_fee / 100,
    })
  },
  hasAftersalesAddress: ({ aftersales_address }) => isObject(aftersales_address),
  afterSalesName: ({ aftersales_address }) =>  aftersales_address.aftersales_name,
  afterSalesMobile: ({ aftersales_address }) =>  aftersales_address.aftersales_mobile,
  afterSalesAddress: ({ aftersales_address }) =>  aftersales_address.aftersales_address,
  afterSalesContact: ({ aftersales_address }) =>  aftersales_address.aftersales_contact,
  aftersalesHours: ({ aftersales_address }) =>  aftersales_address.aftersales_hours,
  refundFee: ({ refund_fee }) => refund_fee / 100,
  refundPoint: ({ refund_point }) => refund_point / 100,
  reason: 'reason',
  description: 'description',
  evidencePic: 'evidence_pic',
  createTime: ({ create_time }) => formatDateTime(create_time * 1000),
  returnType: 'return_type'
}
