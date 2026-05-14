/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import { View } from '@tarojs/components'
import { VERSION_STANDARD } from '@/utils'
import { changeZitiAddress } from '@/store/slices/cart'
import { SpPage, SpCheckboxNew } from '@/components'
import { useTranslation, $t, i18n } from '@/i18n'
import { useNavigation } from '@/hooks'
import './ziti-picker.scss'

const initialState = {
  zitiList: [],
  zitiId: null,
  isDefault: false
}
function StoreZitiPicker(props) {
  useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { zitiList, zitiId, isDefault } = state
  const dispatch = useDispatch()

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('f5f607aa.47c2de'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle])

  useEffect(() => {
    fetchZitiList()
  }, [])

  const fetchZitiList = async () => {
    const {
      distributor_id,
      zitiId,
      cart_type,
      type: orderType = 'distributor'
    } = $instance?.router?.params || {}
    let _params = {
      cart_type,
      distributor_id
    }
    // 与 pages/cart/espier-checkout.js getParamsInfo 中 isNostores 规则一致：云店 distributor 为 0
    if (VERSION_STANDARD) {
      _params['isNostores'] = orderType == 'distributor' ? 0 : 1
    }

    const { list } = await api.cart.getZitiList(_params)
    setState((draft) => {
      draft.zitiList = list
      draft.isDefault = list.length == 0
      draft.zitiId = zitiId
    })
  }

  const onChangeSelectZiti = (item, e) => {
    const workdays = item?.workdays?.map((item) => {
      if (item == 7) {
        // 管理端周日设置的是7 dayjs().day()格式化周日为0 所以会导致周日不能选择，在这里处理一下为7的时候return0
        return '0'
      } else {
        return item
      }
    })
    dispatch(changeZitiAddress({ ...item, workdays }))

    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }

  return (
    <SpPage className='page-store-zitipicker' isDefault={isDefault} defaultMsg='暂无数据'>
      {zitiList.map((item, index) => (
        <View className='ziti-item' key={`ziti-item__${index}`}>
          <View className='ziti-item-bd'>
            <View className='name'>{item.name}</View>
            <View className='address'>{`${item.province}${item.city}${item.area}${item.address}`}</View>
          </View>
          <SpCheckboxNew
            onChange={onChangeSelectZiti.bind(this, item)}
            checked={zitiId == item.id}
          />
        </View>
      ))}
    </SpPage>
  )
}

StoreZitiPicker.options = {
  addGlobalClass: true
}

export default StoreZitiPicker
