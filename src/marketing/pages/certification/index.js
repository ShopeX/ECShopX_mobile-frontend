import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Form, Button, Image } from '@tarojs/components'
import { AtInput, AtButton } from 'taro-ui'
import S from '@/spx'
import { connect } from 'react-redux'
import { SpNavBar, SpToast } from '@/components'
import api from '@/api'
import { isArray } from '@/utils'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class Certification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {},
      isDisabled: true,
      isEdit: true,
      audit_state: null
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
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
    this.setState({
      info,
      isEdit: status == '未认证',
      audit_state: status,
      isDisabled: disabled
    })
  }

  handleInputChange(type, val) {
    let info = this.state.info
    info[type] = val
    this.setState({
      info,
      isDisabled: !(info.card_name && info.card_id && info.cert_id && info.tel_no)
    })
  }

  handleSubmit = (e) => {
    const { value } = e.detail
    const { isEdit } = this.state
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
      this.onSumbitChange()
    }
  }

  handleEdit = async () => {
    const { audit_state } = this.state
    const info = await api.distribution.adapayCert({ is_data_masking: '0' })
    if (audit_state == '认证失败') {
      this.setState({
        isEdit: true,
        info
      })
    } else if (audit_state === '已认证') {
      Taro.showModal({
        content: '认证信息编辑后需重新提交审核，审核完成前无法进行提现操作，请确认是否要编辑信息',
        success: (res) => {
          if (res.confirm) {
            this.setState({
              isEdit: true,
              info
            })
          }
        }
      })
    }
  }

  onSumbitChange = () => {
    const { audit_state, info } = this.state
    let urls = ''
    delete info.cert_status
    if (audit_state == '未认证') {
      urls = api.distribution.adapayCreateCert
    } else {
      urls = api.distribution.adapayUpdateCert
    }
    urls(info).then(() => {
      Taro.showToast({
        title: '提交成功等待审核',
        icon: 'success',
        duration: 2000
      })
      Taro.navigateBack()
    })
  }

  render() {
    let { info, isDisabled, isEdit, audit_state } = this.state
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
      <View className='certification-box'>
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
          <Form onSubmit={this.handleSubmit}>
            <View className='certification-form'>
              <AtInput
                title='开户人姓名'
                type='text'
                clear={isEdit}
                required
                name='card_name'
                editable={isEdit}
                placeholder='请输入姓名'
                value={info.card_name}
                onChange={this.handleInputChange.bind(this, 'card_name')}
              />
              <AtInput
                title='银行预留手机号'
                type='phone'
                clear={isEdit}
                required
                name='tel_no'
                editable={isEdit}
                maxLength={11}
                placeholder='请输入手机号'
                value={info.tel_no}
                onChange={this.handleInputChange.bind(this, 'tel_no')}
              />
              <AtInput
                title='开户结算卡号'
                type='number'
                placeholder='请输入结算卡号'
                clear={isEdit}
                name='card_id'
                required
                editable={isEdit}
                value={info.card_id}
                onChange={this.handleInputChange.bind(this, 'card_id')}
              />
              <AtInput
                title='开户人证件号码'
                type='idcard'
                name='cert_id'
                clear={isEdit}
                required
                editable={isEdit}
                placeholder='请输入证件号码'
                value={info.cert_id}
                maxLength={18}
                onChange={this.handleInputChange.bind(this, 'cert_id')}
              />
            </View>
            <View className='certification-btn'>
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
                  onClick={this.handleEdit}
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
                  onClick={this.handleSubmit}
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
      </View>
    )
  }
}
