import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import { AtButton } from 'taro-ui'
import { SpPage, SpSearchInput } from '@/components'
import "./store-picker.scss";

const initialState = {
  keywords: '',
  list: []
}
function TradeStorePicker(props) {
  const [state, setState] = useImmer(initialState)
  const { keywords } = state

  return <SpPage className='page-trade-store-picker' renderFooter={<View className='btn-wrap'>
    <AtButton circle type='primary'>确定</AtButton>
  </View>}>
    <SpSearchInput placeholder='输入门店地址或门店名称'
      onConfirm={(val) => {
        setState((draft) => {
          draft.keywords = val
        })
      }} />
    <View>
      {
        [1, 2, 3].map((item, index) => (
          <View className='store-item active' key={`store-item__${index}`}>
            <View className='store-name'>ShopX徐汇区田尚坊钦州北路店显示全部</View>
            <View className='store-address'>上海市徐汇区钦州北路282号-2备份</View>
            <View className='store-connect'>021-33333333</View>
            <View className='ft-container'>
              <View className='store-time'>营业时间 9:00-21:00</View>
              <View className='store-distance'>600m</View>
            </View>
          </View>
        ))
      }
    </View>
  </SpPage>;
}

TradeStorePicker.options = {
  addGlobalClass: true
}

export default TradeStorePicker
