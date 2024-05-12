import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Switch, Text, Button } from '@tarojs/components'
import { AtInput, AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpPage, SpAddress } from '@/components'
import api from '@/api'
import { classNames, isWxWeb, showToast } from '@/utils'
import S from '@/spx'
import { useNavigation } from '@/hooks'

import './edit-deliveryman.scss'

const initialState = {
  isOpened: true,
  parent: {
    operator_type: 'self_delivery_staff',
    staff_no: '',
    staff_attribute: 'part_time',
    payment_method: 'order',
    payment_fee: 1,
    mobile: '',
    username:'',
    password: '',
  },
  property: [
    {
      label: 'part_time',
      name: '兼职'
    },
    {
      label: 'full_time',
      name: '全职'
    }
  ],
  manner: [
    {
      label: 'order',
      name: '按单笔订单'
    },
    {
      label: 'amount',
      name: '按订单金额比例'
    }
  ],
  propertyIndex:0,
  mannerIndex:0,
  paymentTitle:'（元/每单）'
}

function EditDeliveryman(props) {
  const [state, setState] = useImmer(initialState)
  const { isOpened, parent, property, manner ,propertyIndex,mannerIndex,paymentTitle} = state
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    setNavigationBarTitle(initNavigationBarTitle())
  }, [])

  const initNavigationBarTitle = () => {
    return isOpened ? '新增配送员' : '编辑配送员'
  }


  const handleChange = (value,val) => {
    let res = JSON.parse(JSON.stringify(parent))
    res[value] = val
    setState((draft) => {
      draft.parent = res
    })
  }


  // 编码和方式切换
  const propertySwitch = (val, index) => {
    if (val) {
      setState((draft) => {
        draft.parent.staff_attribute = property[index].label
        draft.mannerIndex = index
      })
    } else {
      setState((draft) => {
        draft.parent.payment_method = manner[index].label
        draft.propertyIndex = index
        draft.paymentTitle = index==0?'（元/每单）':'（%/每单）'
      })
    }
  }


  const preserve = () => {
    const validations = [
      { field: 'staff_no', regex: /.+/, message: '请输入配送员编码' },
      { field: 'payment_fee', regex: /^\d+$/, message: '结算费用只能输入数字' },
      { field: 'mobile', regex: /^\d{11}$/, message: '请输入有效的配送员手机号' },
      { field: 'username', regex: /.+/, message: '请输入配送员姓名' },
      { field: 'password', regex: /.+/, message: '请输入登录密码' },
      { field: 'password', regex: /^[0-9a-zA-Z]\w{5,17}$/, message: '登录密码只能输入数字和字母' },
      // 添加其他字段的验证条件
    ];
  
    const requiredFields = ['payment_fee', 'mobile', 'password'];
  
    for (const field of requiredFields) {
      if (parent[field] === '') {
        showToast(`请输入${field === 'payment_fee' ? '结算费用' : field === 'mobile' ? '配送员手机号' : '登录密码'}`);
        return;
      }
    }
  
    for (const validation of validations) {
      if (!validation.regex.test(parent[validation.field])) {
        showToast(validation.message);
        return;
      }
    }

    let parse = {
        ...parent,
        staff_attribute: propertyIndex==0? 'part_time':'full_time',
        payment_method:mannerIndex == 0? 'order':'amount'
    }

    console.log(parse,'jjj');
  
    // 执行提交逻辑
  }

 



  return (
    <SpPage className='page-address-edit'>
      <View className='page-address-edit-content'>
        <AtInput
          name='staff_no'
          title='配送员编码'
          type='text'
          placeholder='请输入配送员编码'
          value={parent.staff_no}
          onChange={(e)=>handleChange('staff_no',e)}
        />
        {/* staff_attribute */}
        <View className='attribute'>
          <Text>配送员属性</Text>
          {property.map((item, index) => {
            return (
              <View key={index} onClick={() => propertySwitch(true, index)} className={classNames(mannerIndex==index?'active':'')}>
                {item.name}
              </View>
            )
          })}
        </View>
        {/* payment_method */}
        <View className='attribute'>
          <Text>配送员结算方式</Text>
          {manner.map((item, index) => {
            return (
              <View key={index} onClick={() => propertySwitch(false, index)} className={classNames(propertyIndex==index?'active':'')}>
                {item.name}
              </View>
            )
          })}
        </View>
        <AtInput
          name='payment_fee'
          title='结算费用'
          type='number'
          maxLength='5'
          placeholder='请输入结算费用'
          value={parent.payment_fee}
          onChange={(e)=>handleChange('payment_fee',e)}
        >
          <View className='remarks'>{paymentTitle}</View>
        </AtInput>
        <AtInput
          name='mobile'
          title='配送员手机号'
          type='phone'
          maxLength='11'
          placeholder='请输入配送员手机号'
          value={parent.mobile}
          onChange={(e)=>handleChange('mobile',e)}
        />
        <AtInput
          name='username'
          title='配送员姓名'
          type='text'
          placeholder='请输入配送员姓名'
          value={parent.username}
          onChange={(e)=>handleChange('username',e)}
        />
        <AtInput
          name='password'
          title='登录密码'
          type='text'
          placeholder='请输入登录密码'
          value={parent.password}
          onChange={(e)=>handleChange('password',e)}
        />
      </View>
      <View className='page-address-edit-scroll-establish' onClick={preserve}>
        <View>保 存</View>
      </View>
    </SpPage>
  )
}

EditDeliveryman.options = {
  addGlobalClass: true
}

export default EditDeliveryman
