import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { SpPage, SpImage, Loading } from '@/components'
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
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'

const Audit = () => {
  const [state, setState] = useImmer({
    status: AUDIT_UNKNOWN,
    memo: ''
  })

  const getAuditStatus = async () => {
    const { audit_status, audit_memo } = await api.merchant.getAuditstatus()
    setState((v) => {
      v.status = audit_status
      v.memo = audit_memo
    })
  }

  const { status, memo } = state

  const renderIng = <View className='text'>预计会在1～5个工作日完成审核</View>

  const renderSuccess = (
    <View className='text success'>登录地址及账号密码将发送短信至注册手机号，请注意查收</View>
  )

  const renderFail = (
    <View className='block'>
      <View className='text'>审批意见：</View>
      <View className='text'>{memo}</View>
    </View>
  )

  const handleReset = () => {
    const url = `/subpages/merchant/apply`
    Taro.redirectTo({
      url
    })
  }

  useEffect(() => {
    getAuditStatus()
  }, [])

  return (
    <SpPage
      className={classNames('page-merchant-audit', {
        fail: status == AUDIT_FAIL
      })}
      needNavbar={false}
    >
      <MNavBar canBack={false} />

      {status == AUDIT_UNKNOWN ? (
        <Loading />
      ) : (
        <SpImage src={AUDIT_MAP_IMG[status]} className='status-img' />
      )}

      <View className='status-title'>{[AUDIT_MAP_TITLE[status]]}</View>

      <View className='status-info'>
        {status == AUDITING && renderIng}
        {status == AUDIT_SUCCESS && renderSuccess}
        {status == AUDIT_FAIL && renderFail}
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
