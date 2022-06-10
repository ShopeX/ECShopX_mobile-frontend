import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton } from 'taro-ui'
import { SpPage, SpPrice, SpForm, SpFormItem } from '@/components'
import { showToast } from '@/utils'
import './withdraw-bank.scss'

const initialState = {
  form: {
    bankName: '',
    bankNum: ''
  },
  rules: {
    bankName: [{ required: true, message: '银行名称不能为空' }],
    bankNum: [{ required: true, message: '银行卡号不能为空' }]
  }
}
function CommunityWithdrawBank(props) {
  const [state, setState] = useImmer(initialState)
  const { form, rules } = state
  const formRef = useRef()

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { bank_name, bankcard_no } = await api.community.getCashWithDrawAccount()
    setState(draft => {
      draft.form.bankName = bank_name
      draft.form.bankNum = bankcard_no
    })
  }

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  const onFormSubmit = () => {
    formRef.current.onSubmit(async () => {
      console.log(form)
      const { bankName, bankNum } = form
      await api.community.updateCashWithDrawAccount({
        bank_name: bankName,
        bankcard_no: bankNum
      })
      showToast('添加成功')
      Taro.navigateBack()
    })
  }

  return (
    <SpPage
      className='page-community-withdraw-bank'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={onFormSubmit}>
            提交
          </AtButton>
        </View>
      }
    >
      <View className='form-container'>
        <SpForm ref={formRef} className='applychief-form' formData={form} rules={rules}>
          <SpFormItem label='银行名称' prop='bankName'>
            <AtInput
              clear
              focus
              name='bankName'
              value={form.bankName}
              placeholder={'点击输入银行名称'}
              onChange={onInputChange.bind(this, 'bankName')}
            />
          </SpFormItem>
          <SpFormItem label='银行卡号' prop='bankNum'>
            <AtInput
              clear
              focus
              name='bankNum'
              value={form.bankNum}
              placeholder={'点击输入本人银行卡号'}
              onChange={onInputChange.bind(this, 'bankNum')}
            />
          </SpFormItem>
        </SpForm>
      </View>
      <View className='withdraw-tip'>
        <View className='tip-content'>• 提现至银行卡需实名认证</View>
        <View className='tip-content'>• 工作人员会通过线下汇款至填写卡号</View>
      </View>
    </SpPage>
  )
}

CommunityWithdrawBank.options = {
  addGlobalClass: true
}

export default CommunityWithdrawBank
