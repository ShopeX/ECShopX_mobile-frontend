import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { SpPage, SpButton, SpCell } from '@/components'
import { View, Picker } from "@tarojs/components"
import "./cancel-trade.scss";

const initialState = {
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
  const { reason, reasons } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { trade_id } = $instance.router.params
  }

  const onCancel = () => { }

  const onConfirm = () => { }

  return <SpPage className='page-dianwu-cancel-trade' renderFooter={
    <View className='btn-wrap'>
      <SpButton confirmText='提交' onReset={onCancel} onConfirm={onConfirm} />
    </View>
  }
  >
    <View className='trade-tip'>
      订单取消后，消费者将无法对订单进行支付操作。
    </View>
    <View className='trade-info'>
      <SpCell title='订单ID'>DD09876556789009</SpCell>
      <SpCell title='买家'>赵照兆    13888888888</SpCell>
      <SpCell title='收货人'>赵照兆    13888888888</SpCell>
      <SpCell title='收货地址'>
        上海市上海徐汇区田林街道宜山路700号普天信息
        产业园区C1幢12楼</SpCell>
    </View>

    <View className='picker-reason'>
      <View className='title'>取消原因</View>
      <Picker
        mode='selector'
        range={reasons}
        onChange={(e) => {
          setState(draft => {
            draft.reason = reasons[e.detail.value]
          })
        }}
      >
        <SpCell className='reason-container' isLink>{`${reason || '请选择取消原因'}`}</SpCell>
      </Picker>
    </View>
  </SpPage>
}

DianwuTradeCancel.options = {
  addGlobalClass: true
}

export default DianwuTradeCancel
