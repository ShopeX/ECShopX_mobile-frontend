import React, { useMemo } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AddressChoose, SpPage } from '@/components'

import './comp-deliver.scss'

function CmopDeliver (props) {
  const {
    curStore = {},
    address = {},
    isOpenStore = false,
    receiptType = '',
    headShop = {},
    onChangReceiptType = () => {},
    onEidtZiti = () => {}
  } = props

  const $instance = getCurrentInstance()
  const router = $instance.router
  const { goodType, type } = router.params

  const { location = {} } = useSelector((state) => state.user)

  const handleSwitchExpress = (type) => {
    // 切换配送方式
    if (receiptType === type) return false
    onChangReceiptType(type)
  }

  const handleEditZitiClick = (id) => {
    // 切换自提店铺
    onEidtZiti(id)
  }

  const handleMapClick = () => {
    // 点击地图icon
    const { lat, lng } = location || {}
    Taro.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      scale: 18
    })
  }

  const handleChooseAddress = (choose) => {
    // 自定义选择店铺跳转事件
    let city = headShop.is_current ? headShop.city : curStore.city
    let params = ''
    if (receiptType === 'dada') {
      params = `&city=${city}&receipt_type=${receiptType}`
    }
    Taro.navigateTo({
      url: `/marketing/pages/member/address?isPicker=${choose}${params}`
    })
  }

  const deliveryList = [
    {
      type: 'logistics',
      name: '普通快递',
      isopen: curStore.is_delivery || (!curStore.is_delivery && !curStore.is_ziti)
    },
    {
      type: 'dada',
      name: '同城配送',
      isopen: headShop.is_current ? headShop.is_dada : curStore.is_dada
    },
    {
      type: 'ziti',
      name: '自提',
      isopen: type !== 'pointitem' && curStore.is_ziti
    }
  ]

  const showSwitchDeliver = deliveryList.filter((item) => item.isopen)

  const showSwitchDeliverComp = () => {
    if (showSwitchDeliver && showSwitchDeliver.length > 0) {
      return (
        <View className='switch-tab'>
          {showSwitchDeliver.map((item) => (
            <View
              key={item.type}
              className={`switch-item ${receiptType === item.type ? 'active' : ''}`}
              onClick={handleSwitchExpress.bind(this, item.type)}
            >
              {item.name}
            </View>
          ))}
        </View>
      )
    }
  }

  return (
    <SpPage className='comp-deliver'>
      {showSwitchDeliverComp()}
      {/** 普通快递 */}
      {receiptType === 'logistics' && <AddressChoose isAddress={address} />}
      {/** 同城配送 */}
      {receiptType === 'dada' && (
        <View className='cityDeliver'>
          <AddressChoose isAddress={address} onCustomChosse={handleChooseAddress.bind(this)} />
          <View className='store'>
            配送门店: {headShop.is_current ? headShop.name : curStore.name}
          </View>
        </View>
      )}
      {/** 自提 */}
      {receiptType === 'ziti' && (
        <View className='address-module'>
          <View className='addr-title'>{curStore.name}</View>
          <View className='addr-detail'>
            <View className='address'>{curStore.store_address}</View>
            {isOpenStore && process.env.APP_PLATFORM === 'standard' ? (
              <View
                className='iconfont icon-edit'
                onClick={handleEditZitiClick.bind(this, curStore.distributor_id)}
              ></View>
            ) : (
              <View className='iconfont icon-periscope' onClick={handleMapClick.bind(this)}></View>
            )}
          </View>
          <View className='otherInfo'>
            <View className='text-muted light'>门店营业时间：{curStore.hour}</View>
            <View className='text-muted'>
              联系电话：
              <Text className='phone'>{headShop.is_current ? headShop.phone : curStore.phone}</Text>
            </View>
          </View>
        </View>
      )}
    </SpPage>
  )
}

CmopDeliver.options = {
  addGlobalClass: true
}
export default CmopDeliver
