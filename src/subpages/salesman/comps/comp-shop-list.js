import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import api from '@/api'
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpScrollView } from '@/components'
import CompInvitationCode from './comp-invitation-code'
import { formatTime, log } from '@/utils'
import './comp-shop-list.scss'

const initialState = {
  list: [],
  codeStatus: false,
  information: { name: 'cx', distributor_name: 'cx的店铺' }
}

function CompShopList(props) {
  const [state, setState] = useImmer(initialState)
  const { list, codeStatus, information } = state
  const { params } = useRouter()
  const { selectorCheckedIndex, deliverylnformation, refreshData,basis,address } = props
  const goodsRef = useRef()

  useEffect(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  }, [basis,address])

  useDidShow(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    console.log(basis,'basis=====7')
    let params = {
      page: pageIndex,
      page_size: pageSize,
      mobile:"",
      name:'',
      province: address[0],
      city: address[1],
      area: address[2]
    }
    params[basis.key] = basis.keywords

    const { total_count, list: lists } = await api.salesman.getSalespersonSalemanShopList(params)
    lists.map(item=>{
      item.updated = formatTime(item.updated * 1000, 'YYYY-MM-DD')
    })
    console.log(lists, 'lists---')
    setState((draft) => {
      draft.list = [...list, ...lists]
    })
    return {
      total: total_count
    }
  }

  const storeCode = (item) => {
    let params = {
      name:item.name,
      distributor_name:item.name
    }
    setState((draft) => {
      draft.codeStatus = true
      draft.information = params
    })
  }
  return (
    <View className='comp-customer'>
      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        {list.map((item, index) => {
          return (
            <View className='comp-customer-list' key={index}>
              <View className='comp-customer-list-scroll'>
                <View
                  className='comp-customer-list-scroll-list'
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/subpages/salesman/purchasing`
                    })
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
                <View
                  className='comp-customer-list-scroll-store-code'
                  onClick={() => storeCode(item)}
                >
                  <Text>查看店铺码</Text>
                  <Text className='iconfont icon-qianwang-01'></Text>
                </View>
              </View>
            </View>
          )
        })}
      </SpScrollView>
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
