import React, { useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import CompInvitationCode from './comp-invitation-code'
import './comp-shop-list.scss'

const initialState = {
  codeStatus: false,
  information: { name: 'cx', distributor_name: 'cx的店铺' }
}

function CompShopList(props) {
  const [state, setState] = useImmer(initialState)
  const { codeStatus, information } = state
  const { item } = props

  const storeCode = (val) => {
    let params = {
      name: val.merchant_name,
      distributor_name: val.name,
      distributor_id: val.distributor_id
    }
    setState((draft) => {
      draft.codeStatus = true
      draft.information = params
    })
  }
  return (
    <View className='comp-customer'>
      <View className='comp-customer-list'>
        <View className='comp-customer-list-scroll'>
          <View
            className='comp-customer-list-scroll-list'
            onClick={() => {
              // Taro.navigateTo({
              //   url: `/subpages/salesman/purchasing`
              // })
            }}
          >
            <SpImage src={item.logo} />
            <View className='details'>
              <View className='customer'>{item.name}</View>
              <View className='source'>电话：{item.mobile}</View>
              <View className='source'>
                地址：{`${item.province}${item.city}${item.area}${item.address}`}{' '}
              </View>
              <View className='address'>
                <Text>{item.updated}</Text>
                <Text>{item.province}</Text>
              </View>
            </View>
          </View>
          <View className='comp-customer-list-scroll-store-code' onClick={() => storeCode(item)}>
            <Text>查看店铺码</Text>
            <Text className='iconfont icon-qianwang-01'></Text>
          </View>
        </View>
      </View>

      {codeStatus && (
        <CompInvitationCode
          status
          information={information}
          cancel={() => {
            setState((draft) => {
              draft.codeStatus = false
            })
          }}
        />
      )}
    </View>
  )
}

CompShopList.options = {
  addGlobalClass: true
}

export default CompShopList
