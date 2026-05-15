/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useImmer } from 'use-immer'
import { View, Text } from '@tarojs/components'
import { useTranslation, $t } from '@/i18n'
import { SpImage, SpPoster } from '@/components'
import './comp-shop-list.scss'

const initialState = {
  codeStatus: false,
  information: { name: 'cx', distributor_name: 'cx的店铺' }
}

function CompShopList(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { codeStatus, information } = state
  const { item } = props

  // const storeCode = (val) => {
  //   let params = {
  //     name: val?.merchant_name,
  //     distributor_name: val?.name,
  //     distributor_id: val?.distributor_id,
  //     is_valid: val?.salesperson?.is_valid,
  //     user_id: val?.user_id
  //   }
  //   setState((draft) => {
  //     draft.codeStatus = true
  //     draft.information = params
  //   })
  // }
  return (
    <View className='comp-customer'>
      <View className='comp-customer-list'>
        <View className='comp-customer-list-scroll'>
          <View
            className='comp-customer-list-scroll-list'
            // onClick={() => {
            //   Taro.navigateTo({
            //     url: `/subpages/salesman/purchasing?distributor_id=${item.distributor_id}`
            //   })
            // }}
          >
            <SpImage src={item.logo} />
            <View className='details'>
              <View className='customer'>{item.name}</View>
              <View className='source'>
                {$t('4aa16546.c6b4d7')}
                {item.mobile}
              </View>
              <View className='source'>
                {$t('4aa16546.df3833')}
                {`${item.province}${item.city}${item.area}${item.address}`}{' '}
              </View>
              <View className='address'>
                <Text>{item.updated}</Text>
                <Text>{item.province}</Text>
              </View>
            </View>
          </View>
          {/* <View className='comp-customer-list-scroll-store-code' onClick={() => storeCode(item)}>
            <Text>查看店铺码</Text>
            <Text className='iconfont icon-qianwang-01'></Text>
          </View> */}
        </View>
      </View>

      {codeStatus && (
        <SpPoster
          info={information}
          type='storeCode'
          onClose={() => {
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
