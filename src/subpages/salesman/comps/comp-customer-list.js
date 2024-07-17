import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { usePullDownRefresh, useRouter, useDidShow } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import api from '@/api'
import doc from '@/doc'
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpPage, SpScrollView } from '@/components'
import { updateCustomerLnformation, updateCustomerSalesman } from '@/store/slices/cart'
import './comp-customer-list.scss'

const initialState = {}

function CompCustomerList(props) {
  const dispatch = useDispatch()
  const [state, setState] = useImmer(initialState)
  const { items } = props
  const {} = state

  return (
    <View className='comp-customer-list'>
      <View className='comp-customer-list-scroll'>
        <View
          className='comp-customer-list-scroll-list'
          onClick={async () => {
            const { userId } = Taro.getStorageSync('userinfo')
            let params = {
              isSalesmanPage: 1,
              promoter_user_id: userId,
              buy_user_id: items.user_id
            }
            //存必传参数
            await dispatch(updateCustomerLnformation(params))
            //存用户信息
            await dispatch(updateCustomerSalesman(items))
            // 跳转至选择店铺
            Taro.navigateTo({
              url: `/subpages/salesman/selectShop`
            })
          }}
        >
          <SpImage
            src={items.headimgurl ? items.headimgurl : `${process.env.APP_IMAGE_CDN}/logo.png`}
          />
          <View className='details'>
            <View className='customer'>
              <View>
                <Text> {items.username || '匿名用户'}</Text>
                <Text>（客户）</Text>
              </View>
              <Text>{items.mobile}</Text>
            </View>
            {items?.name && <View className='source'>来源店铺：{items.name}</View>}
            <View className='source'>绑定时间：{items.bind_date}</View>
          </View>
        </View>
      </View>
    </View>
  )
}

CompCustomerList.options = {
  addGlobalClass: true
}

export default CompCustomerList
