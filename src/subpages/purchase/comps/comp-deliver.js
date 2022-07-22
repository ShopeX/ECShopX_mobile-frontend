import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AddressChoose } from '@/components'
import { updateChooseAddress } from '@/store/slices/user'
import { classNames, VERSION_STANDARD } from '@/utils'
import api from '@/api'

import { deliveryList } from '../const'
import './comp-deliver.scss'
import { isNull } from 'lodash'

const initialState = {
  distributorInfo: null,
  receiptType: 'logistics'
}

function CmopDeliver(props) {
  const {
    address = {},
    distributor_id,
    onChangReceiptType = () => {},
    onChange = () => {},
    onEidtZiti = () => {}
  } = props

  const dispatch = useDispatch()

  const { location = {}, address: storeAddress } = useSelector((state) => state.user)
  const { rgb, openStore } = useSelector((state) => state.sys)
  const { zitiShop } = useSelector((state) => state.shop)
  const [state, setState] = useImmer(initialState)
  const { distributorInfo, receiptType } = state

  // useEffect(() => {
  //   fetch()
  // }, [])

  useEffect(() => {
    //logistics
    fetchAddress()
  }, [receiptType])

  const fetchAddress = async () => {
    let _distributorInfo = distributorInfo
    let _receiptType = receiptType
    if (!distributorInfo) {
      if (distributor_id == 0) {
        _distributorInfo = await api.shop.getHeadquarters({ distributor_id })
      } else {
        _distributorInfo = await api.shop.getShop({ distributor_id })
      }
      setState((draft) => {
        draft.distributorInfo = _distributorInfo
        const fd = deliveryList.find((item) => _distributorInfo[item.key])
        if(fd) {
          draft.receiptType = fd.type
          _receiptType = fd.type
        }
      })
    }
    if (_receiptType == 'ziti') {
      onChange({
        receipt_type: _receiptType,
        distributor_info: _distributorInfo,
        address_info: null
      })
      return
    }

    let query = {
      receipt_type: _receiptType
    }
    if (_receiptType == 'dada') {
      query['city'] = _distributorInfo.city
    }
    // 非自提情况下，把地址存起来，否则清空地址
    const { list } = await api.member.addressList(query)
    const defaultAddress = list.find((item) => item.is_def) || list[0] || null

    const selectAddress = list.find(item => item.address_id == storeAddress?.address_id )
    onChange({
      receipt_type: _receiptType,
      distributor_info: _distributorInfo,
      address_info: selectAddress || defaultAddress
    })
  }

  const handleSwitchExpress = async (receipt_type) => {
    // 切换配送方式
    if (receiptType === receipt_type) return
    setState((draft) => {
      draft.receiptType = receipt_type
    })
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

  // 切换自提店铺
  const handleEditZitiClick = (id = 0) => {
    onEidtZiti(id)
  }

  const handleChooseAddress = (choose) => {
    // 自定义选择店铺跳转事件
    let city = distributorInfo.city
    Taro.navigateTo({
      url: `/marketing/pages/member/address?isPicker=${choose}&city=${city}&receipt_type=dada`
    })
  }

  const zitiInfo = zitiShop && receiptType === 'ziti' ? zitiShop : distributorInfo

  if (!distributorInfo) {
    return null
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
          <AddressChoose isAddress={address} onCustomChosse={handleChooseAddress} />
          <View className='store'>配送门店: {distributorInfo.name}</View>
        </View>
      )}
      {/** 自提 */}
      {receiptType === 'ziti' && (
        <View className='address-module'>
          <View className='address-title'>{zitiInfo.name}</View>
          <View className='address-detail'>
            <View className='address'>{zitiInfo.store_address}</View>
            {!openStore && VERSION_STANDARD ? (
              <View
                className='iconfont icon-edit'
                onClick={() => handleEditZitiClick(zitiInfo.distributor_id)}
              ></View>
            ) : (
              <View className='iconfont icon-periscope' onClick={() => handleMapClick()}></View>
            )}
          </View>
          <View className='other-info'>
            <View className='text-muted light'>门店营业时间：{zitiInfo.hour}</View>
            <View className='text-muted'>
              联系电话：
              <Text className='phone'>{zitiInfo.phone}</Text>
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
