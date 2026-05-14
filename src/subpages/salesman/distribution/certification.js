/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Form, Button, Image } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { useTranslation } from 'react-i18next'
import S from '@/spx'
import { SpPage, SpNavBar, SpToast, SpInput as AtInput } from '@/components'
import api from '@/api'
import { isArray } from '@/utils'
import './certification.scss'

/** 与 adapay cert_status.audit_state 对应的内部状态，避免用中文做逻辑判断 */
const CERT_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
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
  const { t } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { info, isDisabled, isEdit, audit_state } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const info = await api.distribution.adapayCert()
    const { cert_status } = info
    let statusCode = null
    let disabled = true
    if (isArray(cert_status)) {
      statusCode = CERT_STATUS.PENDING
      disabled = true
    } else if (cert_status.audit_state == 'A') {
      statusCode = CERT_STATUS.REVIEWING
      disabled = true
    } else if (
      cert_status.audit_state == 'B' ||
      cert_status.audit_state == 'C' ||
      cert_status.audit_state == 'D'
    ) {
      statusCode = CERT_STATUS.FAILED
      disabled = false
    } else if (cert_status.audit_state == 'E') {
      statusCode = CERT_STATUS.VERIFIED
      disabled = false
    }
    setState((draft) => {
      draft.info = info
      draft.isEdit = statusCode === CERT_STATUS.PENDING
      draft.audit_state = statusCode
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
      return S?.toast(t('d9f41fea.8093e3'))
    }
    if (!value.tel_no || !/1\d{10}/.test(value.tel_no)) {
      return S?.toast(t('d9f41fea.a32ab5'))
    }
    if (!value.card_id || !/^[1-9]\d{9,29}$/.test(value.card_id)) {
      return S?.toast(t('d9f41fea.f1f5f1'))
    }
    if (!value.cert_id || !/^(\d{18,18}|\d{15,15}|\d{17,17}X)$/.test(value.cert_id)) {
      return S?.toast(t('d9f41fea.bb56f1'))
    }
    if (isEdit) {
      onSumbitChange()
    }
  }

  const handleEdit = async () => {
    const info = await api.distribution.adapayCert({ is_data_masking: '0' })
    if (audit_state === CERT_STATUS.FAILED) {
      setState((draft) => {
        draft.isEdit = true
        draft.info = info
      })
    } else if (audit_state === CERT_STATUS.VERIFIED) {
      Taro.showModal({
        content: t('d9f41fea.03c385'),
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
    if (audit_state === CERT_STATUS.PENDING) {
      urls = api.distribution.adapayCreateCert
    } else {
      urls = api.distribution.adapayUpdateCert
    }
    urls(obj).then(() => {
      Taro.showToast({
        title: t('d9f41fea.48c17b'),
        icon: 'success',
        duration: 2000
      })
      Taro.navigateBack()
    })
  }

  let imgUrl = ''
  let title = ''
  let subTitle = ''
  if (audit_state === CERT_STATUS.REVIEWING) {
    title = t('d9f41fea.0236d1')
    subTitle = t('d9f41fea.41efac')
    imgUrl = `${process.env.APP_IMAGE_CDN}/waitting_info.png`
  } else if (audit_state === CERT_STATUS.FAILED) {
    title = t('d9f41fea.b11996')
    subTitle = (!isArray(info.cert_status) && info.cert_status?.audit_desc) || t('d9f41fea.35ee77')
    imgUrl = `${process.env.APP_IMAGE_CDN}/error_info.png`
  } else if (audit_state === CERT_STATUS.VERIFIED) {
    title = t('d9f41fea.244402')
    imgUrl = `${process.env.APP_IMAGE_CDN}/success_info.png`
  } else {
    title = t('d9f41fea.cf2559')
    imgUrl = `${process.env.APP_IMAGE_CDN}/certification_info.png`
  }

  return (
    <SpPage className='page-ecshopx-certification'>
      <SpNavBar title={t('d9f41fea.cbaa04')} leftIconType='chevron-left' />
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
              title={t('d9f41fea.e3f6a6')}
              type='text'
              // clear={isEdit}
              required
              name='card_name'
              editable={isEdit}
              placeholder={t('d9f41fea.8093e3')}
              value={info.card_name}
              onChange={handleInputChange('card_name')}
            />
            <AtInput
              title={t('d9f41fea.a0b7da')}
              type='phone'
              // clear={isEdit}
              required
              name='tel_no'
              editable={isEdit}
              maxLength={11}
              placeholder={t('d9f41fea.6e4f4b')}
              value={info.tel_no}
              onChange={handleInputChange('tel_no')}
            />
            <AtInput
              title={t('d9f41fea.6152c4')}
              type='number'
              placeholder={t('d9f41fea.42509b')}
              // clear={isEdit}
              name='card_id'
              required
              editable={isEdit}
              value={info.card_id}
              onChange={handleInputChange('card_id')}
            />
            <AtInput
              title={t('d9f41fea.c503f0')}
              type='idcard'
              name='cert_id'
              // clear={isEdit}
              required
              editable={isEdit}
              placeholder={t('d9f41fea.32bd18')}
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
                {t('d9f41fea.939d53')}
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
                {t('d9f41fea.95b351')}
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
                {t('d9f41fea.939d53')}
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
