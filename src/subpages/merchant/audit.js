/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { SpPage, SpImage, Loading } from '@/components'
import { classNames, copyText } from '@/utils'
import { AtButton } from 'taro-ui'
import * as merchantApi from '@/api/merchant'
import { useTranslation, $t, ti } from '@/i18n'
import {
  AUDITING,
  AUDIT_SUCCESS,
  AUDIT_FAIL,
  AUDIT_UNKNOWN,
  AUDIT_MAP_IMG,
  AUDIT_STATUS_TITLE_KEY
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
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { status, memo, mobile, password } = state

  useEffect(() => {
    getAuditStatus()
  }, [])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('53023079.3589d9') })
  }, [i18n.language])

  const getAuditStatus = async () => {
    const { audit_status, audit_memo, mobile, password } = await merchantApi.getAuditstatus()
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
    copyText(
      ti('53023079.0b49bc', [`${process.env.APP_MERCHANT_URL}/merchant/login`, mobile, password])
    )
  }

  const onResetPsd = async () => {
    const { password } = await merchantApi.getResetPsd()
    setState((draft) => {
      draft.password = password
    })
  }

  return (
    <SpPage
      className={classNames('page-merchant-audit', {
        fail: status == AUDIT_FAIL
      })}
    >
      <MNavBar canBack={false} />

      {status == AUDIT_UNKNOWN ? (
        <Loading />
      ) : (
        <SpImage src={AUDIT_MAP_IMG[status]} className='status-img' />
      )}

      {status !== AUDIT_UNKNOWN && (
        <View className='status-title'>{$t(AUDIT_STATUS_TITLE_KEY[status])}</View>
      )}

      <View className='status-info'>
        {status == AUDITING && <View className='text'>{$t('b4dfc303.418885')}</View>}

        {status == AUDIT_SUCCESS && (
          <View>
            <View className='text success'>{$t('53023079.11a9cf')}</View>
            <View className='block'>
              <View className='block-item'>
                <View className='item-label'>{$t('53023079.df3833')}</View>
                <View className='item-field'>{`${process.env.APP_MERCHANT_URL}/merchant/login`}</View>
              </View>
              <View className='block-item'>
                <View className='item-label'>{$t('53023079.d7a47e')}</View>
                <View className='item-field'>{mobile}</View>
              </View>
              <View className='block-item'>
                <View className='item-label'>{$t('53023079.9b55a2')}</View>
                <View className='item-field'>{password}</View>
                <AtButton circle size='small' onClick={onResetPsd}>
                  {$t('029ca60d.017c89')}
                </AtButton>
              </View>
              <AtButton className='btn-copy' circle type='primary' onClick={onCopyLoginInfo}>
                {$t('53023079.1c2fd6')}
              </AtButton>
            </View>
          </View>
        )}

        {status == AUDIT_FAIL && (
          <View className='block'>
            <View className='text'>{$t('53023079.f5c361')}</View>
            <View className='text'>{memo}</View>
          </View>
        )}
      </View>

      {status == AUDIT_FAIL && (
        <View className='status-form'>
          <MButton onClick={handleReset}>{$t('53023079.a5c7b5')}</MButton>
        </View>
      )}
    </SpPage>
  )
}

export default Audit
