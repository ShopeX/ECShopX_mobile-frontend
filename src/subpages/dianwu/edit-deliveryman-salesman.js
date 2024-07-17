import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Switch, Text, Button } from '@tarojs/components'
import { AtInput, AtButton, AtTextarea, AtSwitch } from 'taro-ui'
import { SpCell, SpPage, SpAddress } from '@/components'
import api from '@/api'
import { classNames, isWxWeb, showToast } from '@/utils'
import S from '@/spx'
import { useNavigation } from '@/hooks'

import './edit-deliveryman-salesman.scss'

const initialState = {
  parent: {
    mobile: '',
    username: '',
    status: true
  }
}

function EditDeliverymanSalesman(props) {
  const [state, setState] = useImmer(initialState)
  const { parent } = state
  const { params } = useRouter()
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    if (params?.operator_id) {
      edit(params?.operator_id)
    }
    setNavigationBarTitle(initNavigationBarTitle())
  }, [])

  const initNavigationBarTitle = () => {
    return params.operator_id ? '编辑业务员' : '创建业务员'
  }

  const edit = async (operator_id) => {
    let res = await api.dianwu.salespersonadminUpdatesalesperson(operator_id)
    setState((draft) => {
      draft.parent = {
        mobile: res.mobile,
        username: res.username,
        status: res.status == 1 ? true : false
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
      { field: 'username', regex: /.+/, message: '请输入业务员姓名' }
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
      status: parent.status ? 1 : 0
    }
    if (params?.operator_id) {
      await api.salesman.salespersonadminUpdatesalesperson({ id: params.operator_id, ...par })
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
        />
        <AtInput
          name='username'
          title='业务员姓名'
          type='text'
          placeholder='请输入业务员姓名'
          value={parent.username}
          onChange={(e) => handleChange('username', e)}
        />
        <AtSwitch
          title='是否开启'
          checked={parent.status}
          onChange={(e) => handleChange('status', e)}
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
