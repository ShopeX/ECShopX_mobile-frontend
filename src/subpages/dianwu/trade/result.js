import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import { AtButton } from 'taro-ui'
import { SpPage, SpImage } from '@/components'
import "./result.scss";


function DianwuTradeResult(props) {
  const defaultImg = 'success.png'
  const defaultMsg = 'xxx'
  return <SpPage className='page-dianwu-trade-result'>
    <SpImage src='success.png' width={181} height={180} />
    <View className='title'>{'订单已取消'}</View>
    <View className='desc'>{'请耐心等待系统退款'}</View>

    <AtButton className='btn-return' circle>返回订单列表</AtButton>
  </SpPage>;
}

DianwuTradeResult.options = {
  addGlobalClass: true
}

export default DianwuTradeResult
