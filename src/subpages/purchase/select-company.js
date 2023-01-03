import Taro from '@tarojs/taro'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import arrow from '@/assets/imgs/arrow.png'
import './select-company.scss'
import CompBottomTip from './comps/comp-bottomTip'

const initialState = {
  enterpriseList: [],
  enterpriseName: '',
  enterpriseInfo: {}
}

function SelectComponent(props) {
  const [state, setState] = useImmer(initialState)
  const { enterpriseInfo, enterpriseName, enterpriseList } = state

  useEffect(() => {
    //请求获取企业信息
    getEnterpriseList()
  }, [])

  const getEnterpriseList = async () => {
    const data = await api.purchase.getEnterprisesList({ page: 1, pageSize: 20 })
    setState((draft) => {
      draft.enterpriseList = data.list
    })
  }

  const onPickerChange = (e) => {
    const { name } = enterpriseList[e.detail.value] || {}
    setState((draft) => {
      draft.enterpriseName = name
      draft.enterpriseInfo = enterpriseList[e.detail.value]
    })
  }

  const onValidateChange = () => {
    if (!enterpriseName) return
    const { auth_type, name, enterprise_sn, id } = enterpriseInfo
    console.log(enterpriseInfo)
    let redirectUrl = ''
    if (auth_type == 'account') {
      redirectUrl = `/subpages/purchase/select-company-account`
    } else if (auth_type == 'email') {
      redirectUrl = `/subpages/purchase/select-company-email`
    } else if (auth_type == 'phone') {
      redirectUrl = `/subpages/purchase/select-company-phone?isHasShop=true`
    }
    Taro.navigateTo({
      url: `${redirectUrl}?enterprise_sn=${enterprise_sn}&enterprise_name=${name}&enterprise_id=${id}`
    })
  }

  return (
    <View className='select-component'>
      <View className='select-component-title'>选择企业</View>
      <Picker range={enterpriseList} rangeKey='name' onChange={onPickerChange} className='pick-company'>
        <View className='select-component-enterprise_sn'>{enterpriseName || '选择企业后继续登录'}</View>
        <Text className='iconfont icon-zhankai select'></Text>
      </Picker>
      <AtButton circle className='btns-staff' onClick={onValidateChange} disabled={!enterpriseName}>
        继续验证
      </AtButton>
      <CompBottomTip />
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent
