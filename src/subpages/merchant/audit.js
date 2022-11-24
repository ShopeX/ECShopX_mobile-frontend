import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { SpPage, SpImage, Loading } from '@/components'
import { classNames, copyText, showToast } from '@/utils'
import { AtButton } from 'taro-ui'
import api from '@/api'
import {
  AUDITING,
  AUDIT_SUCCESS,
  AUDIT_FAIL,
  AUDIT_UNKNOWN,
  AUDIT_MAP_IMG,
  AUDIT_MAP_TITLE
} from './consts'
import { MButton, MNavBar } from './comps'
import './audit.scss'



const initialState = {
  status: AUDIT_UNKNOWN,
  memo: '',
  mobile: '',
  password: ''
}

const Audit = () => {
  const [state, setState] = useImmer(initialState)
  const { status, memo, mobile, password } = state

  useEffect(() => {
    getAuditStatus()
  }, [])

  const getAuditStatus = async () => {
    const { audit_status, audit_memo, mobile, password } = await api.merchant.getAuditstatus()
    setState((draft) => {
      draft.status = audit_status
      draft.memo = audit_memo
      draft.mobile = mobile
      draft.password = password
    })
  }

  const handleReset = () => {
    const url = `/subpages/merchant/apply`
    Taro.redirectTo({
      url
    })
  }

  const onCopyLoginInfo = () => {
    copyText(`地址：${process.env.APP_MERCHANT_URL}/merchant/login\n账号：${mobile}\n密码：${password}`)
  }

  const onResetPsd = async() => {
    const {password} = await api.merchant.getResetPsd()
    setState((draft) => {
      draft.password = password
    })
  }

  return (
    <SpPage
      className={classNames('page-merchant-audit', {
        fail: status == AUDIT_FAIL
      })}
      navbar={false}
    >
      <MNavBar canBack={false} />

      {status == AUDIT_UNKNOWN ? (
        <Loading />
      ) : (
        <SpImage src={AUDIT_MAP_IMG[status]} className='status-img' />
      )}

      <View className='status-title'>{[AUDIT_MAP_TITLE[status]]}</View>

      <View className='status-info'>
        {status == AUDITING && <View className='text'>预计会在1～5个工作日完成审核</View>}

        {status == AUDIT_SUCCESS && <View>
          <View className='text success'>
            您的入驻申请已通过审核，请使用下方的信息登录商户后台继续操作
          </View>
          <View className='block'>
            <View className='block-item'>
              <View className='item-label'>地址：</View>
              <View className='item-field'>{`${process.env.APP_MERCHANT_URL}/merchant/login`}</View>
            </View>
            <View className='block-item'><View className='item-label'>账号：</View><View className='item-field'>{mobile}</View></View>
            <View className='block-item'><View className='item-label'>密码：</View><View className='item-field'>{password}</View>
            <AtButton circle size='small' onClick={onResetPsd}>重新获取</AtButton>
            </View>
            <AtButton className='btn-copy' circle type='primary' onClick={onCopyLoginInfo}>复制登录信息</AtButton>
          </View>
        </View>}

        {status == AUDIT_FAIL && <View className='block'>
          <View className='text'>审批意见：</View>
          <View className='text'>{memo}</View>
        </View>}
      </View>

      {status == AUDIT_FAIL && (
        <View className='status-form'>
          <MButton onClick={handleReset}>重新填写</MButton>
        </View>
      )}
    </SpPage>
  )
}

export default Audit
