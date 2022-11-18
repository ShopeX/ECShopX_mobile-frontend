import { pickBy, formatDateTime } from "@/utils"

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
