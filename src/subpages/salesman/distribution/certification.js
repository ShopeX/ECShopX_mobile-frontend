import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Form, Button, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtInput } from 'taro-ui'
import { useImmer } from 'use-immer'
import S from '@/spx'
import { SpPage, SpNavBar, SpToast } from '@/components'
import api from '@/api'
import { isArray } from '@/utils'

import './certification.scss'

const initialState = {
  info: {},
  isDisabled: true,
  isEdit: true,
  audit_state: null
}

function Certification(props) {
  const [state, setState] = useImmer(initialState)
  const { location = {}, address } = useSelector((state) => state.user)
  const { info, isDisabled, isEdit, audit_state } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const info = await api.distribution.adapayCert()
    const { cert_status } = info
    let status = null
    let disabled = true
    if (isArray(cert_status)) {
      status = '未认证'
      disabled = true
    } else if (cert_status.audit_state == 'A') {
      status = '审核中'
      disabled = true
    } else if (
      cert_status.audit_state == 'B' ||
      cert_status.audit_state == 'C' ||
      cert_status.audit_state == 'D'
    ) {
      status = '认证失败'
      disabled = false
    } else if (cert_status.audit_state == 'E') {
      status = '已认证'
      disabled = false
    }
    setState((draft) => {
      draft.info = info
      draft.isEdit = status == '未认证'
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
      return S.toast('请输入姓名')
    }
    if (!value.tel_no || !/1\d{10}/.test(value.tel_no)) {
      return S.toast('请输入正确的手机号')
    }
    if (!value.card_id || !/^[1-9]\d{9,29}$/.test(value.card_id)) {
      return S.toast('请输入正确的结算卡号')
    }
    if (!value.cert_id || !/^(\d{18,18}|\d{15,15}|\d{17,17}X)$/.test(value.cert_id)) {
      return S.toast('请输入正确的证件号码')
    }
    if (isEdit) {
      onSumbitChange()
    }
  }

  const handleEdit = async () => {
    const info = await api.distribution.adapayCert({ is_data_masking: '0' })
    if (audit_state == '认证失败') {
      setState((draft) => {
        draft.isEdit = true
        draft.info = info
      })
    } else if (audit_state === '已认证') {
      Taro.showModal({
        content: '认证信息编辑后需重新提交审核，审核完成前无法进行提现操作，请确认是否要编辑信息',
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
    if (audit_state == '未认证') {
      urls = api.distribution.adapayCreateCert
    } else {
      urls = api.distribution.adapayUpdateCert
    }
    urls(obj).then(() => {
      Taro.showToast({
        title: '提交成功等待审核',
        icon: 'success',
        duration: 2000
      })
      Taro.navigateBack()
    })
  }

  let imgUrl = ''
  let title = ''
  let subTitle = ''
  if (audit_state == '审核中') {
    title = '已提交审核，请耐心等待～'
    subTitle = '预计会在1-5个工作如完成审核'
    imgUrl = `${process.env.APP_IMAGE_CDN}/waitting_info.png`
  } else if (audit_state == '认证失败') {
    title = '认证失败'
    subTitle = info.cert_status.audit_desc || '未匹配到该银行卡，请稍后再试'
    imgUrl = `${process.env.APP_IMAGE_CDN}/error_info.png`
  } else if (audit_state == '已认证') {
    title = '您已实名认证！'
    imgUrl = `${process.env.APP_IMAGE_CDN}/success_info.png`
  } else {
    title = '请完善信息后，进行认证～'
    imgUrl = `${process.env.APP_IMAGE_CDN}/certification_info.png`
  }

  return (
    <SpPage className='page-ecshopx-certification'>
      <SpNavBar title='认证信息' leftIconType='chevron-left' />
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
              title='开户人姓名'
              type='text'
              // clear={isEdit}
              required
              name='card_name'
              editable={isEdit}
              placeholder='请输入姓名'
              value={info.card_name}
              onChange={handleInputChange('card_name')}
            />
            <AtInput
              title='银行预留手机号'
              type='phone'
              // clear={isEdit}
              required
              name='tel_no'
              editable={isEdit}
              maxLength={11}
              placeholder='请输入手机号'
              value={info.tel_no}
              onChange={handleInputChange('tel_no')}
            />
            <AtInput
              title='开户结算卡号'
              type='number'
              placeholder='请输入结算卡号'
              // clear={isEdit}
              name='card_id'
              required
              editable={isEdit}
              value={info.card_id}
              onChange={handleInputChange('card_id')}
            />
            <AtInput
              title='开户人证件号码'
              type='idcard'
              name='cert_id'
              // clear={isEdit}
              required
              editable={isEdit}
              placeholder='请输入证件号码'
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
                提交
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
                编辑
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
                提交
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
