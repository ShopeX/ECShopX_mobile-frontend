import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Switch, Text, Button } from '@tarojs/components'
import { AtInput, AtButton, AtTextarea, AtSwitch } from 'taro-ui'
import { SpCell, SpPage, SpAddress } from '@/components'
import api from '@/api'
import { classNames, isWxWeb, showToast } from '@/utils'
import { SG_USER_INFO } from '@/consts/localstorage'
import S from '@/spx'
import { useNavigation } from '@/hooks'

import './edit-deliveryman-salesman.scss'

const initialState = {
  parent: {
    mobile: '',
    name: '',
    is_valid: true
  }
}

function EditDeliverymanSalesman(props) {
  const [state, setState] = useImmer(initialState)
  const { parent } = state
  const { params } = useRouter()
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    if (params?.salesperson_id) {
      edit(params)
    }
    setNavigationBarTitle(initNavigationBarTitle())
  }, [])

  const initNavigationBarTitle = () => {
    return params.salesperson_id ? '编辑业务员' : '创建业务员'
  }

  const edit = async (val) => {
    const { userId } = Taro.getStorageSync(SG_USER_INFO)
    let par = {
      page: 1,
      pageSize: 10,
      distributor_id: val.distributor_id,
      user_id: userId,
      salesperson_id: val.salesperson_id
    }
    let { mobile, name, is_valid } = await api.salesman.salespersonadminSalespersoninfo(par)
    setState((draft) => {
      draft.parent = {
        mobile,
        name,
        is_valid
      }
    })
  }

  const handleChange = (value, val) => {
    let res = JSON.parse(JSON.stringify(parent))
    res[value] = val
    setState((draft) => {
      draft.parent = res
    })
  }

  const preserve = async () => {
    const validations = [
      { field: 'mobile', regex: /^\d{11}$/, message: '请输入有效的业务员手机号' },
      { field: 'name', regex: /.+/, message: '请输入业务员姓名' }
    ]
    if (parent['mobile'] === '') {
      showToast('请输入业务员手机号')
      return
    }

    for (const validation of validations) {
      if (!validation.regex.test(parent[validation.field])) {
        showToast(validation.message)
        return
      }
    }
    Taro.showLoading('正在提交')
    let par = {
      ...parent,
      distributor_id: params.distributor_id,
      is_valid: parent.is_valid
    }
    if (params?.salesperson_id) {
      await api.salesman.salespersonadminUpdatesalesperson({
        salesperson_id: params.salesperson_id,
        ...par
      })
      showToast('编辑成功')
    } else {
      await api.salesman.salespersonadminAddsalesperson(par)
      showToast('添加成功')
    }

    Taro.hideLoading()
    Taro.navigateBack({
      delta: 1 // 默认值是1，表示返回的页面层数
    })
  }

  return (
    <SpPage className='page-address-salesman'>
      <View className='page-address-salesman-content'>
        <AtInput
          name='mobile'
          title='业务员手机号'
          type='phone'
          maxLength='11'
          placeholder='请输入业务员手机号'
          value={parent.mobile}
          onChange={(e) => handleChange('mobile', e)}
          disabled={params?.salesperson_id}
        />
        <AtInput
          name='name'
          title='业务员姓名'
          type='text'
          placeholder='请输入业务员姓名'
          value={parent.name}
          onChange={(e) => handleChange('name', e)}
        />
        <AtSwitch
          title='是否开启'
          checked={parent.is_valid}
          onChange={(e) => handleChange('is_valid', e)}
        />
      </View>
      <View className='page-address-salesman-scroll-establish' onClick={preserve}>
        <View>保 存</View>
      </View>
    </SpPage>
  )
}

EditDeliverymanSalesman.options = {
  addGlobalClass: true
}

export default EditDeliverymanSalesman
