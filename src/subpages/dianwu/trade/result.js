import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import { AtButton } from 'taro-ui'
import { SpPage, SpImage } from '@/components'
import "./result.scss";

const tipMessage = {
  '1': {
    title: '订单已取消',
    desc: ''
  },
  '2': {
    title: '订单已取消',
    desc: '请耐心等待系统退款'
  },
  '3': {
    title: '售后申请提交成功',
    desc: '请耐心等待系统退款'
  },
  '4': {
    title: '售后申请提交成功',
    desc: '请通知消费者尽快寄回商品'
  },
  '5': {
    title: '售后申请提交成功',
    desc: '请耐心等待系统退款'
  }
}

function DianwuTradeResult(props) {
  const $instance = getCurrentInstance()
  const { type = '1' } = $instance.router.params

  const { title, desc } = tipMessage[type]


  return <SpPage className='page-dianwu-trade-result'>
    <SpImage src='success.png' width={181} height={180} />
    <View className='title'>{title}</View>
    <View className='desc'>{desc}</View>

    <AtButton className='btn-return' circle onClick={() => {
      Taro.navigateBack()
    }}>返回订单列表</AtButton>
  </SpPage>;
}

DianwuTradeResult.options = {
  addGlobalClass: true
}

export default DianwuTradeResult
