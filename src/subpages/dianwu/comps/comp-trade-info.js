import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import { SpCell } from '@/components'
import { pickBy } from '@/utils'
import "./comp-trade-info.scss";

const initialState = {
  tradeId: '',
  buyMember: '',
  receiptType: '',
  receiveName: '',
  receiveDate: '',
  receiveAddress: ''
}

function CompTradeInfo(props) {
  const { onFetch = () => {} } = props
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { tradeId, buyMember, receiptType, receiveName, receiveDate, receiveAddress } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { trade_id } = $instance.router.params
    const { orderInfo, distributor } = await api.dianwu.getTradeDetail(trade_id)
    const info = pickBy(orderInfo, doc.dianwu.ORDER_INFO)
    const {
      user_id,
      receiver_name,
      receiver_mobile,
      receiver_state,
      receiver_city,
      receiver_district,
      receiver_address,
      order_class,
      receipt_type,
      itemFeeNew,
      freightFee,
      totalFee,
      pointFreightFee,
      ziti_info
    } = info
    const { store_address, store_name } = distributor
    const { username, mobile } = await api.dianwu.getMemberByUserId({ user_id })

    let _buyMember = ''
    let _receiveName = ''
    let _receiveDate = ''
    let _receiveAddress = ''

    if (
      order_class == 'excard' ||
      order_class == 'shopadmin'
    ) {
      _buyMember = `${username} ${mobile}`
      _receiveName = `${username}（${mobile}）`
      _receiveAddress = `${store_address}（${store_name}）`
    } else if (receipt_type == 'ziti') {
      const { province, city, area, address, pickup_date, pickup_time } = ziti_info
      _buyMember = `${username} ${mobile}`
      _receiveName = `${receiver_name} ${receiver_mobile}`
      _receiveDate = `${pickup_date} ${pickup_time.join('~')}`
      _receiveAddress = `${province}${city}${area}${address}`
    } else {
      _buyMember = `${username} ${mobile}`
      _receiveName = `${receiver_name}（${receiver_mobile}）`
      _receiveAddress = `${receiver_state}${receiver_city}${receiver_district}${receiver_address}`
    }

    setState(draft => {
      draft.tradeId = trade_id
      draft.orderInfo = pickBy(orderInfo, doc.dianwu.ORDER_INFO)
      draft.buyMember = _buyMember
      draft.receiptType = receipt_type
      draft.receiveName = _receiveName
      draft.receiveDate = _receiveDate
      draft.receiveAddress = _receiveAddress
    })

    onFetch(info)
  }

  return <View className='comp-trade-info'>
    <SpCell title='订单ID'>{tradeId}</SpCell>
    <SpCell title='买家'>{buyMember}</SpCell>
    <SpCell title={`${receiptType == 'ziti' ? '提货人' : '收货人'}`}>{receiveName}</SpCell>
    <SpCell title={`${receiptType == 'ziti' ? '提货地址' : '收货地址'}`}>{receiveAddress}</SpCell>
    {receiveDate && <SpCell title='提货时间'>{receiveDate}</SpCell>}
  </View>;
}

CompTradeInfo.options = {
  addGlobalClass: true
}

export default CompTradeInfo
