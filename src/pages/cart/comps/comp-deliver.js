import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AddressChoose } from '@/components'
import { updateChooseAddress } from '@/store/slices/user'
import { classNames } from '@/utils'
import api from '@/api'

import { deliveryList } from '../const'
import './comp-deliver.scss'

const initialState = {
  distributorInfo: {},
  receiptType: 'logistics'
}

function CmopDeliver (props) {
  const { address = {}, distributor_id, onChangReceiptType = () => {} } = props

  const dispatch = useDispatch()

  const { location = {} } = useSelector((state) => state.user)
  const { rgb } = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)
  const { distributorInfo, receiptType } = state

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    fetchAddress()
  }, [receiptType])

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

  const fetchAddress = async () => {
    let query = {
      receipt_type: receiptType
    }
    if (receiptType == 'dada') {
      query['city'] = distributorInfo.city
    }
    if (receiptType !== 'ziti') {
      // 非自提情况下，把地址存起来，否则清空地址
      const { list } = await api.member.addressList(query)
      const defaultAddress = list.find((item) => item.is_def) || list[0] || null
      await dispatch(updateChooseAddress(defaultAddress))
    } else {
      await dispatch(updateChooseAddress(null))
    }
  }

  const handleSwitchExpress = async (receipt_type) => {
    // 切换配送方式
    if (receiptType === receipt_type) return
    setState((draft) => {
      draft.receiptType = receipt_type
    })
    onChangReceiptType({ receipt_type, distributorInfo })
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
    Taro.navigateTo({
      url: `/marketing/pages/member/address?isPicker=${choose}&city=${city}&receipt_type=dada`
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
                  onClick={() => {
                    handleSwitchExpress(item.type)
                  }}
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
          <AddressChoose isAddress={address} onCustomChosse={handleChooseAddress} />
          <View className='store'>配送门店: {distributorInfo.name}</View>
        </View>
      )}
      {/** 自提 */}
      {receiptType === 'ziti' && (
        <View className='address-module'>
          <View className='address-title'>{distributorInfo.name}</View>
          <View className='address-detail'>
            <View className='address'>{distributorInfo.store_address}</View>
            <View className='iconfont icon-periscope' onClick={() => handleMapClick()}></View>
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
