/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Form, Button, Image } from '@tarojs/components'
import { useImmer } from 'use-immer'
import S from '@/spx'
import { SpPage, SpNavBar, SpToast, SpInput as AtInput } from '@/components'
import api from '@/api'
import { isArray } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './certification.scss'

const AUDIT = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  FAILED: 'failed',
  VERIFIED: 'verified'
}

const initialState = {
  info: {},
  isDisabled: true,
  isEdit: true,
  audit_state: null
}

function Certification() {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { info, isDisabled, isEdit, audit_state } = state

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('99c3c114.cbaa04') })
    const onLang = () => Taro.setNavigationBarTitle({ title: $t('99c3c114.cbaa04') })
    i18n.on('languageChanged', onLang)
    return () => i18n.off('languageChanged', onLang)
  }, [i18n])

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const info = await api.distribution.adapayCert()
    const { cert_status } = info
    let status = null
    let disabled = true
    if (isArray(cert_status)) {
      status = AUDIT.UNVERIFIED
      disabled = true
    } else if (cert_status.audit_state == 'A') {
      status = AUDIT.PENDING
      disabled = true
    } else if (
      cert_status.audit_state == 'B' ||
      cert_status.audit_state == 'C' ||
      cert_status.audit_state == 'D'
    ) {
      status = AUDIT.FAILED
      disabled = false
    } else if (cert_status.audit_state == 'E') {
      status = AUDIT.VERIFIED
      disabled = false
    }
    setState((draft) => {
      draft.info = info
      draft.isEdit = status === AUDIT.UNVERIFIED
      draft.audit_state = status
      draft.isDisabled = disabled
    })
  }

  const handleInputChange = (type) => (val) => {
    let obj = { ...info }
    obj[type] = val
    setState((draft) => {
      draft.info = obj
      draft.isDisabled = !(obj.card_name && obj.card_id && obj.cert_id && obj.tel_no)
    })
  }

  const handleSubmit = (e) => {
    const { value } = e.detail
    if (!value.card_name) {
      return S?.toast($t('b4dfc303.8093e3'))
    }
    if (!value.tel_no || !/1\d{10}/.test(value.tel_no)) {
      return S?.toast($t('b4dfc303.a32ab5'))
    }
    if (!value.card_id || !/^[1-9]\d{9,29}$/.test(value.card_id)) {
      return S?.toast($t('b4dfc303.f1f5f1'))
    }
    if (!value.cert_id || !/^(\d{18,18}|\d{15,15}|\d{17,17}X)$/.test(value.cert_id)) {
      return S?.toast($t('b4dfc303.bb56f1'))
    }
    if (isEdit) {
      onSumbitChange()
    }
  }

  const handleEdit = async () => {
    const info = await api.distribution.adapayCert({ is_data_masking: '0' })
    if (audit_state === AUDIT.FAILED) {
      setState((draft) => {
        draft.isEdit = true
        draft.info = info
      })
    } else if (audit_state === AUDIT.VERIFIED) {
      Taro.showModal({
        content: $t('b4dfc303.03c385'),
        success: (res) => {
          if (res.confirm) {
            setState((draft) => {
              draft.isEdit = true
              draft.info = info
            })
          }
        }
      })
    }
  }

  const onSumbitChange = () => {
    let urls = ''
    let obj = { ...info }
    delete obj.cert_status
    if (audit_state === AUDIT.UNVERIFIED) {
      urls = api.distribution.adapayCreateCert
    } else {
      urls = api.distribution.adapayUpdateCert
    }
    urls(obj).then(() => {
      Taro.showToast({
        title: $t('b4dfc303.48c17b'),
        icon: 'success',
        duration: 2000
      })
      Taro.navigateBack()
    })
  }

  let imgUrl = ''
  let title = ''
  let subTitle = ''
  if (audit_state === AUDIT.PENDING) {
    title = $t('b4dfc303.0236d1')
    subTitle = $t('b4dfc303.418885')
    imgUrl = `${process.env.APP_IMAGE_CDN}/waitting_info.png`
  } else if (audit_state === AUDIT.FAILED) {
    title = $t('b4dfc303.b11996')
    subTitle = info.cert_status?.audit_desc || $t('b4dfc303.35ee77')
    imgUrl = `${process.env.APP_IMAGE_CDN}/error_info.png`
  } else if (audit_state === AUDIT.VERIFIED) {
    title = $t('b4dfc303.244402')
    imgUrl = `${process.env.APP_IMAGE_CDN}/success_info.png`
  } else {
    title = $t('b4dfc303.cf2559')
    imgUrl = `${process.env.APP_IMAGE_CDN}/certification_info.png`
  }

  return (
    <SpPage className='page-ecshopx-certification'>
      <SpNavBar title={$t('b4dfc303.cbaa04')} leftIconType='chevron-left' />
      <View className='page'>
        <View className='header-box'>
          <View className='header'>
            <View style={{ marginLeft: '30rpx' }}>
              <View className='title'>{title}</View>
              {subTitle && <View className='tips'>{subTitle}</View>}
            </View>
            <Image className='img' src={imgUrl} />
          </View>
        </View>
        <Form onSubmit={handleSubmit}>
          <View className='page-certification-form'>
            <AtInput
              title={$t('b4dfc303.60d045')}
              type='text'
              // clear={isEdit}
              required
              name='card_name'
              editable={isEdit}
              placeholder={$t('b4dfc303.fb1b19')}
              value={info.card_name}
              onChange={handleInputChange('card_name')}
            />
            <AtInput
              title={$t('b4dfc303.8098e2')}
              type='phone'
              // clear={isEdit}
              required
              name='tel_no'
              editable={isEdit}
              maxLength={11}
              placeholder={$t('b4dfc303.a938d7')}
              value={info.tel_no}
              onChange={handleInputChange('tel_no')}
            />
            <AtInput
              title={$t('b4dfc303.c2133e')}
              type='number'
              placeholder={$t('b4dfc303.8cf6f9')}
              // clear={isEdit}
              name='card_id'
              required
              editable={isEdit}
              value={info.card_id}
              onChange={handleInputChange('card_id')}
            />
            <AtInput
              title={$t('b4dfc303.f2474f')}
              type='idcard'
              name='cert_id'
              // clear={isEdit}
              required
              editable={isEdit}
              placeholder={$t('b4dfc303.73c23b')}
              value={info.cert_id}
              maxLength={18}
              onChange={handleInputChange('cert_id')}
            />
          </View>
          <View className='page-certification-btn'>
            {process.env.TARO_ENV === 'weapp' && isEdit && (
              <Button
                type='primary'
                className='sumbit-btn'
                formType='submit'
                disabled={isDisabled}
                style={isDisabled ? { background: '#CCC' } : { background: '#3593FF' }}
              >
                {$t('b4dfc303.939d53')}
              </Button>
            )}
            {process.env.TARO_ENV === 'weapp' && !isEdit && (
              <Button
                type='primary'
                className='sumbit-btn'
                disabled={isDisabled}
                onClick={handleEdit}
                style={isDisabled ? { background: '#CCC' } : { background: '#3593FF' }}
              >
                {$t('b4dfc303.95b351')}
              </Button>
            )}
            {process.env.TARO_ENV !== 'weapp' && (
              <Button
                type='primary'
                className='sumbit-btn'
                disabled={isDisabled}
                onClick={handleSubmit}
                formType='submit'
                style={isDisabled ? { background: '#CCC' } : { background: '#3593FF' }}
              >
                {$t('b4dfc303.939d53')}
              </Button>
            )}
            <SpToast />
          </View>
        </Form>
      </View>
    </SpPage>
  )
}

export default Certification
