import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { SpPage, SpButton, SpCell } from '@/components'
import { View, Picker } from "@tarojs/components"
import { showToast } from '@/utils'
import CompTradeInfo from './../comps/comp-trade-info'
import "./cancel-trade.scss";

const initialState = {
  info: null,
  reason: '',
  reasons: [
    '客户现在不想购买',
    '客户商品价格较贵',
    '客户价格波动',
    '客户商品缺货',
    '客户重复下单',
    '客户订单商品选择有误',
    '客户支付方式选择有误',
    '客户收货信息填写有误',
    '客户发票信息填写有误',
    '客户无法支付订单',
    '客户长时间未付款',
    '客户其他原因'
  ]
}

function DianwuTradeCancel(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { info, reason, reasons } = state

  const onCancel = () => {
    Taro.navigateBack()
  }

  const onConfirm = async () => {
    if(!reason) {
      return showToast('请选择订单取消原因')
    }
    const { trade_id } = $instance.router.params
    await api.dianwu.cancelTrade({
      order_id: trade_id,
      cancel_reason: reason
    })
    showToast('订单取消成功')
    setTimeout(() => {
      Taro.navigateBack()
    }, 2000)
  }

  return <SpPage className='page-dianwu-cancel-trade' renderFooter={
    <View className='btn-wrap'>
      <SpButton confirmText='提交' onReset={onCancel} onConfirm={onConfirm} />
    </View>
  }
  >
    <View className='trade-tip'>
      订单取消后，消费者将无法对订单进行支付操作。
    </View>

    <CompTradeInfo onFetch={(data) => {
      setState(draft => {
        draft.info = data
      })
    }} />

    <View className='picker-reason'>
      <View className='title'>取消原因</View>
      <Picker
        mode='selector'
        range={reasons}
        onChange={(e) => {
          setState(draft => {
            draft.reason = e.detail.value
          })
        }}
      >
        <SpCell className='reason-container' isLink>{`${reasons?.[reason] || '请选择取消原因'}`}</SpCell>
      </Picker>
    </View>
  </SpPage>
}

DianwuTradeCancel.options = {
  addGlobalClass: true
}

export default DianwuTradeCancel
