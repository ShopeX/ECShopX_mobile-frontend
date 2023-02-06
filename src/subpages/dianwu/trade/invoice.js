import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import './invoice.scss'
import { SpPage } from '@/components'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import api from '@/api'

const initialState = {
  billInfo: '',
  realFee:"0.00"
}
function DianWuInvoice() {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { billInfo,realFee } = state
  //trade_id传递过来的订单id 获取订单发票详情
  const { trade_id } = $instance.router.params
  useEffect(()=>{
    getBillInfo()
  },[])
  async function getBillInfo() {
    const res = await api.dianwu.getTradeDetail(trade_id)
    const {orderInfo} = res
    setState((draft) => {
      draft.billInfo = orderInfo.invoice
      draft.realFee = (orderInfo.item_total_fee/100).toFixed(2)
    })
  }
  //确定开票
  const drawBill = async () => {
    const { confirm } = await Taro.showModal({
      content: '确定将该订单标记为已开票吗？',
      cancelText: '取消',
      confirmText: '已开票'
    })
    if (confirm) {
      //确定开票
      const { success } = await api.dianwu.openBill({
        order_id: trade_id,
        status: true
      })
      if(success){
        wx.showToast({ title: '开票成功' })
      }
    }
  }
  //复制发票
  const copyBill = () => {
    wx.setClipboardData({
      data: `
      订单编号：${trade_id}
      实收金额：${realFee}
      名称：${billInfo.content}
      税号：${billInfo.registration_number}
      单位地址：${billInfo.company_address}
      电话号码：${billInfo.company_phone}
      开户银行：${billInfo.bankname}
      银行账户：${billInfo.bankaccount}`,
      success: function () {
        return wx.showToast({ title: '复制成功' })
      }
    })
  }
  return (
    <SpPage className='page-dianwu-invoice'>
      <View className='dianwu-invoice-order-info'>
        <View className='line'>
          <View className='title'>订单编号：</View>
          <View className='content'>{trade_id}</View>
        </View>
        <View className='line'>
          <View className='title'>实收金额：</View>
          <View className='content'>{realFee}</View>
        </View>
      </View>
      <View className='dianwu-invoice-order-info'>
        <View className='line'>
          <View className='title'>名称：</View>
          <View className='content'>{billInfo.content}</View>
        </View>
        <View className='line'>
          <View className='title'>税号：</View>
          <View className='content'>{billInfo.registration_number}</View>
        </View>
        <View className='line'>
          <View className='title'>单位地址：</View>
          <View className='content'>{billInfo.company_address}</View>
        </View>
        <View className='line'>
          <View className='title'>电话号码：</View>
          <View className='content'>{billInfo.company_phone}</View>
        </View>
        <View className='line'>
          <View className='title'>开户银行：</View>
          <View className='content'>{billInfo.bankname}</View>
        </View>
        <View className='line'>
          <View className='title'>银行账户：</View>
          <View className='content'>{billInfo.bankaccount}</View>
        </View>
      </View>
      <View className='dianwu-invoice-footer'>
        <View className='button copy' onClick={copyBill}>
          复制发票资料
        </View>
        <View className='button' onClick={drawBill}>
          已开票
        </View>
      </View>
    </SpPage>
  )
}
DianWuInvoice.options = {
  addGlobalClass: true
}
export default DianWuInvoice
