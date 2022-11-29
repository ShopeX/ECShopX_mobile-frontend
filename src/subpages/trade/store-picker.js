import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import { AtButton } from 'taro-ui'
import { SpPage, SpSearchInput, SpNote } from '@/components'
import { pickBy, onEventChannel, isWeixin, classNames } from '@/utils'
import "./store-picker.scss";

const initialState = {
  keywords: '',
  list: null,
  refundStore: ''
}
function TradeStorePicker(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { keywords, list, refundStore } = state

  useEffect(() => {
    fetch()
  }, [keywords])

  const fetch = async () => {
    const { distributor_id, refund_store } = $instance.router.params
    let params = {
      distributor_id,
      distributor_name: keywords,

    }
    if(isWeixin) {
      const { errMsg, longitude, latitude } = await Taro.getLocation({
        type: 'gcj02'
      })
      if (errMsg == 'getLocation:ok') {
        params = {
          ...params,
          lng: longitude,
          lat: latitude
        }
      }
    }

    const { list: _list } = await api.aftersales.getAfterSaleStoreList(params)
    setState(draft => {
      draft.list = pickBy(_list, doc.shop.STORE_ITEM)
      draft.refundStore = refund_store
    })
  }

  const onSelectShopItem = (item) => {
    // onEventChannel('onEventPickerStore', item)
    Taro.eventCenter.trigger('onEventPickerStore', item)
    Taro.navigateBack()
  }
  console.log('refundStore:', refundStore)
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
        list?.map((item, index) => (
          <View className={classNames('store-item', {
            'active': refundStore == item.address_id
          })} key={`store-item__${index}`} onClick={onSelectShopItem.bind(this, item)}>
            <View className='store-name'>{item.name}</View>
            <View className='store-address'>{`${item.province}${item.city}${item.area}${item.address}`}</View>
            <View className='store-connect'>{item.mobile}</View>
            <View className='ft-container'>
              <View className='store-time'>{`营业时间 ${item.hours}`}</View>
              <View className='store-distance'>{item.distance}</View>
            </View>
          </View>
        ))
      }
      {
        list?.length == 0 && <SpNote icon title='没有查询到数据' />
      }
    </View>
  </SpPage>;
}

TradeStorePicker.options = {
  addGlobalClass: true
}

export default TradeStorePicker
