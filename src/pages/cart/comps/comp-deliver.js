import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import { AddressChoose } from '@/components'
import { classNames } from '@/utils'

import './comp-deliver.scss'

const deliveryList = [
  {
    type: 'logistics',
    name: '普通快递',
    key: 'is_delivery'
  },
  {
    type: 'dada',
    name: '同城配',
    key: 'is_dada'
  },
  {
    type: 'ziti',
    name: '自提',
    key: 'is_ziti'
  }
]

const initialState = {
  distributorInfo: {}
}

function CmopDeliver (props) {
  const {
    address = {},
    receiptType = '', // 配送方式（logistics：普通快递  dada：同城配  ziti：自提）
    onChangReceiptType = () => {},
    distributor_id
  } = props

  const { location = {} } = useSelector((state) => state.user)
  const { rgb } = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)
  const { distributorInfo } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    let distributorInfo
    if (distributor_id == 0) {
      distributorInfo = await api.shop.getHeadquarters({ distributor_id })
    } else {
      distributorInfo = await api.shop.getShop({ distributor_id })
    }
    setState((draft) => {
      draft.distributorInfo = distributorInfo
    })
  }

  const handleSwitchExpress = (type) => {
    // 切换配送方式
    if (receiptType === type) return
    onChangReceiptType(type, distributorInfo)
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
    let city = distributorInfo.city
    let params = receiptType === 'dada' ? `&city=${city}&receipt_type=dada` : ''
    Taro.navigateTo({
      url: `/marketing/pages/member/address?isPicker=${choose}${params}`
    })
  }

  return (
    <View className='page-comp-deliver'>
      <View className='switch-box'>
        <View className={classNames(deliveryList.length > 0 && 'switch-tab')}>
          {deliveryList.map((item) => {
            if (distributorInfo[item.key]) {
              return (
                <View
                  key={item.type}
                  className={`switch-item ${receiptType === item.type ? 'active' : ''}`}
                  style={receiptType === item.type && { background: `rgb(${rgb}, 0.4)` }}
                  onClick={handleSwitchExpress.bind(this, item.type)}
                >
                  {item.name}
                </View>
              )
            }
          })}
        </View>
      </View>
      {/** 普通快递 */}
      {receiptType === 'logistics' && <AddressChoose isAddress={address} />}
      {/** 同城配 */}
      {receiptType === 'dada' && (
        <View className='store-module'>
          <AddressChoose isAddress={address} onCustomChosse={handleChooseAddress.bind(this)} />
          <View className='store'>配送门店: {distributorInfo.name}</View>
        </View>
      )}
      {/** 自提 */}
      {receiptType === 'ziti' && (
        <View className='address-module'>
          <View className='address-title'>{distributorInfo.name}</View>
          <View className='address-detail'>
            <View className='address'>{distributorInfo.store_address}</View>
            <View className='iconfont icon-periscope' onClick={handleMapClick.bind(this)}></View>
          </View>
          <View className='other-info'>
            <View className='text-muted light'>门店营业时间：{distributorInfo.hour}</View>
            <View className='text-muted'>
              联系电话：
              <Text className='phone'>{distributorInfo.phone}</Text>
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
