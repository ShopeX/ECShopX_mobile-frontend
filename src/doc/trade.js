import { pickBy, formatDateTime, isObject } from "@/utils"
import dayjs from "dayjs"

export const TRADE_ITEM = {
  activityType: 'activity_type',
  autoCancelSeconds: 'auto_cancel_seconds',
  createDate: 'create_date',
  createdTime: ({ create_time }) => formatDateTime(create_time * 1000),
  canApplyCancel: ({ can_apply_cancel }) => can_apply_cancel == 1,
  canApplyAftersales: ({ can_apply_aftersales }) => can_apply_aftersales == 1,
  couponDiscount: ({ coupon_discount }) => coupon_discount / 100,
  cancelStatus: 'cancel_status',
  deliveryStatus: 'delivery_status',
  distributorId: 'distributor_id',
  distributorName: 'distributor_name',
  enterpriseId:'enterprise_id',
  distributorInfo: ({ distributor_info }) => {
    return pickBy(distributor_info, {
      name: 'name',
      logo: 'logo'
    })
  },
  offlinePayCheckStatus: 'offline_pay_check_status',
  offlinePayName: 'offline_pay_name',
  deliveryCorpName: 'delivery_corp_name',
  deliveryCode: 'delivery_code',
  dada: ({ dada }) => {
    return pickBy(dada, {
      dadaStatus: 'dada_status',
      dmName: 'dm_name',
      dmMobile: 'dm_mobile'
    })
  },
  freightFee: ({ freight_fee }) => freight_fee / 100,
  itemFee: ({ item_fee_new }) => item_fee_new / 100,
  itemPoint: 'item_point',
  isLogistics: ({ is_logistics }) => is_logistics == '1',
  items: ({ items }) => {
    return pickBy(items, {
      activityId:'act_id',
      deliveryStatus: 'delivery_status',
      distributorId: 'distributor_id',
      pic: 'pic',
      price: ({ price }) => price / 100,
      id: 'id',
      itemId: 'item_id',
      itemName: 'item_name',
      itemPoint: 'item_point',
      itemSpecDesc: 'item_spec_desc',
      num: 'num',
      // 可售后商品数
      leftAftersalesNum: 'left_aftersales_num',
      // 默认售后商品数
      refundNum: 1,
      point: 'point',
      checked: () => false,
      showAftersales: ({ show_aftersales }) => show_aftersales == 1,
      isPrescription: 'is_prescription',
      medicineSymptomSet: ({ medicine_symptom_set }) => medicine_symptom_set?.map((item1, index1) => {
        return {
          key: index1,
          value: item1,
          show: false
        }
      })
    })
  },
  selfDeliveryOperatorName: 'self_delivery_operator_name',
  selfDeliveryOperatorMobile: 'self_delivery_operator_mobile',
  selfDeliveryOperatorId: 'self_delivery_operator_id',
  selfDeliveryTime: ({ self_delivery_time }) => self_delivery_time && formatDateTime(self_delivery_time * 1000),
  invoice: 'invoice',
  isRate: ({ is_rate }) => is_rate == "1",
  // 是否整单发货
  isAllDelivery: 'is_all_delivery',
  marketFee: ({ market_fee }) => market_fee / 100,
  orderStatus: 'order_status',
  orderId: 'order_id',
  orderStatusMsg: 'order_status_msg',
  orderClass: 'order_class',
  orderType: 'order_type',
  ordersDeliveryId: 'orders_delivery_id',
  point: 'point',
  promotionDiscount: ({ promotion_discount }) => promotion_discount / 100,
  payChannel: 'pay_channel',
  payType: 'pay_type',
  receiptType: 'receipt_type',
  receiverAddress: 'receiver_address',
  receiverCity: "receiver_city",
  receiverDistrict: "receiver_district",
  receiverMobile: "receiver_mobile",
  receiverName: "receiver_name",
  receiverState: "receiver_state",
  totalFee: ({ total_fee }) => total_fee / 100,
  zitiStatus: 'ziti_status',
  zitiInfo: 'ziti_info',
  selfDeliveryFee: ({ self_delivery_fee }) => self_delivery_fee / 100,
  selfDeliveryStatus: 'self_delivery_status',
  createTime: 'create_time',
  payDate: 'pay_date',
  deliveryTime: 'delivery_time',
  tradeId: 'trade_id',
  userId: 'user_id',
  diagnosisData: 'diagnosis_data',
  prescriptionData: 'prescription_data',
  prescriptionStatus: ({ prescription_status }) => {
    return prescription_status || 0
  },
  diagnosisData: 'diagnosis_data',
  pointFee: ({ point_fee }) => point_fee / 100,
  invoice_amount:'invoice_amount',
  invoiceAble: 'invoice_able',
  invoiceId: 'invoice_id',
}

export const SHOP_INFO = {

}

export const AFTER_TRADE = {
  aftersalesBn: 'aftersales_bn',
  aftersalesStatus: 'aftersales_status',
  createdTime: ({ create_time }) => formatDateTime(create_time * 1000),
  distributorId: 'distributor_id',
  distributorName: 'distributor_name',
  distributorInfo: 'distributor_info',
  items: ({ detail }) => {
    return pickBy(detail, {
      itemId: 'item_id',
      itemName: 'item_name',
      num: 'num',
      pic: 'item_pic',
      price: ({ refund_fee,num }) => refund_fee / num / 100,
      point: 'point',
      isPrescription: 'is_prescription',
    })
  },
  orderId: 'order_id',
  refundFee: ({ refund_fee }) => refund_fee / 100,
  userId: 'user_id',
  freight: ({ freight }) => freight / 100,
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
      num: ({ orderItem }) => orderItem.refundNum,
      price: ({ orderItem }) => orderItem.refundFee,
      isPrescription: ({ orderItem }) => orderItem.is_prescription,
    })
  },
  hasAftersalesAddress: ({ aftersales_address }) => isObject(aftersales_address),
  afterSalesName: ({ aftersales_address }) => aftersales_address.aftersales_name,
  afterSalesMobile: ({ aftersales_address }) => aftersales_address.aftersales_mobile,
  afterSalesAddress: ({ aftersales_address }) => aftersales_address.aftersales_address,
  afterSalesContact: ({ aftersales_address }) => aftersales_address.aftersales_contact,
  aftersalesHours: ({ aftersales_address }) => aftersales_address.aftersales_hours,
  refundFee: ({ refund_fee }) => refund_fee / 100,
  refund_info: ({ refund_info }) => {
    return pickBy(refund_info, {
      refundFee: ({ refunded_fee }) => refunded_fee / 100,
      refundPoint: 'refund_point',
    })
  },
  refundPoint: 'refund_point',
  reason: 'reason',
  description: 'description',
  evidencePic: 'evidence_pic',
  createTime: ({ create_time }) => formatDateTime(create_time * 1000),
  returnType: 'return_type',
  freight: ({ freight }) => freight / 100
}
