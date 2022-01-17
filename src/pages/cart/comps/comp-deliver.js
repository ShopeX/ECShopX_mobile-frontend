import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AddressChoose } from '@/components'

import './comp-deliver.scss'
import classNames from 'classnames'

function CmopDeliver (props) {
  const {
    currentStore = {},
    address = {},
    receiptType = '', // 配送方式（logistics：普通快递  dada：同城配  ziti：自提）
    headquartersStore = {}, // 总店自提点
    onChangReceiptType = () => {}
  } = props

  const { location = {} } = useSelector((state) => state.user)
  const { rgb } = useSelector((state) => state.sys)

  const deliveryList = [
    {
      type: 'logistics',
      name: '普通快递',
      isopen: true || currentStore.is_delivery
    },
    {
      type: 'dada',
      name: '同城配',
      isopen:
        true || (headquartersStore.is_current ? headquartersStore.is_dada : currentStore.is_dada)
    },
    {
      type: 'ziti',
      name: '自提',
      isopen:
        true || (headquartersStore.is_current ? headquartersStore.is_ziti : currentStore.is_ziti) // type !== 'pointitem' && currentStore.is_ziti
    }
  ]

  const showSwitchDeliver = deliveryList.filter((item) => item.isopen) || []

  const handleSwitchExpress = (type) => {
    // 切换配送方式
    if (receiptType === type) return
    onChangReceiptType(type)
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
    let city = headquartersStore.is_current ? headquartersStore.city : currentStore.city
    let params = ''
    if (receiptType === 'dada') {
      params = `&city=${city}&receipt_type=dada`
    }
    Taro.navigateTo({
      url: `/marketing/pages/member/address?isPicker=${choose}${params}`
    })
  }

  const showSwitchDeliverComp = () => {
    // 配送方式选择器
    return (
      <View className='switch-box'>
        <View className={classNames(showSwitchDeliver.length > 0 && 'switch-tab')}>
          {showSwitchDeliver.map((item) => (
            <View
              key={item.type}
              className={`switch-item ${receiptType === item.type ? 'active' : ''}`}
              style={receiptType === item.type && { background: `rgb(${rgb}, 0.4)` }}
              onClick={handleSwitchExpress.bind(this, item.type)}
            >
              {item.name}
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View className='page-comp-deliver'>
      {showSwitchDeliverComp()}
      {/** 普通快递 */}
      {receiptType === 'logistics' && <AddressChoose isAddress={address} />}
      {/** 同城配 */}
      {receiptType === 'dada' && (
        <View className='store-module'>
          <AddressChoose isAddress={address} onCustomChosse={handleChooseAddress.bind(this)} />
          <View className='store'>
            配送门店: {headquartersStore.is_current ? headquartersStore.name : currentStore.name}
          </View>
        </View>
      )}
      {/** 自提 */}
      {receiptType === 'ziti' && (
        <View className='address-module'>
          <View className='address-title'>{currentStore.name}</View>
          <View className='address-detail'>
            <View className='address'>{currentStore.store_address}</View>
            <View className='iconfont icon-periscope' onClick={handleMapClick.bind(this)}></View>
          </View>
          <View className='other-info'>
            <View className='text-muted light'>门店营业时间：{currentStore.hour}</View>
            <View className='text-muted'>
              联系电话：
              <Text className='phone'>
                {headquartersStore.is_current ? headquartersStore.phone : currentStore.phone}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

CmopDeliver.options = {
  addGlobalClass: true
}
export default CmopDeliver
