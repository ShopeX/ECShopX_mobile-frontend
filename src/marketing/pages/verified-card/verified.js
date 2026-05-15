/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Form, Button } from '@tarojs/components'
import S from '@/spx'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { SpNavBar, SpToast, SpInput as AtInput } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import './index.scss'
import './verified.scss'

class VerifiedIdentity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {},
      isTrue: false
    }
  }
  componentDidMount() {
    const { colors } = this.props
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors.data[0].marketing
    })
    this.syncNavTitle()
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('a60c60be.5197d0') })
  }

  handleInput(type, val) {
    let info = this.state.info
    info[type] = val

    this.setState({
      info
    })
  }

  handleSubmit(e) {
    let { info } = this.state
    if (!info.user_name) {
      return S?.toast($t('a60c60be.3348b7'))
    }
    if (!info.id_card || !/^(\d{18,18}|\d{15,15}|\d{17,17}X)$/.test(info.id_card)) {
      return S?.toast($t('a60c60be.2e5d39'))
    }
    if (!info.user_mobile || !/1\d{10}/.test(info.user_mobile)) {
      return S?.toast($t('a60c60be.a32ab5'))
    }
    let obj = {
      user_name: info.user_name,
      id_card: info.id_card,
      user_mobile: info.user_mobile
    }
    api.member.hfpayApplySave(obj).then((res) => {
      Taro.showToast({
        title: $t('a60c60be.48c17b'),
        icon: 'success',
        duration: 2000
      })
      this.setState({
        isTrue: true
      })
    })
  }

  async fetch() {
    const res = await api.member.hfpayUserApply()
    const info = pickBy(res, {
      user_name: 'user_name',
      id_card: 'id_card',
      user_mobile: 'user_mobile',
      status: 'status'
    })
    if (info.status == 3) {
      this.setState({
        info,
        isTrue: true
      })
    }
  }

  render() {
    const { colors } = this.props
    const { info, isTrue } = this.state

    return (
      <View className='page-distribution-index'>
        <SpNavBar title={$t('a60c60be.5197d0')} leftIconType='chevron-left' />

        <View className='page-bd'>
          <Form onSubmit={this.handleSubmit}>
            <View className=''>
              <View className=''>
                <AtInput
                  disabled={isTrue}
                  title={$t('a60c60be.60d045')}
                  type='text'
                  placeholder={$t('a60c60be.60d045')}
                  value={info.user_name}
                  onChange={this.handleInput.bind(this, 'user_name')}
                />
              </View>
              <View className=''>
                <AtInput
                  title={$t('a60c60be.84e0cb')}
                  disabled={isTrue}
                  type='idcard'
                  placeholder={$t('a60c60be.84e0cb')}
                  value={info.id_card}
                  onChange={this.handleInput.bind(this, 'id_card')}
                />
              </View>
              <View className=''>
                <AtInput
                  disabled={isTrue}
                  title={$t('a60c60be.92448a')}
                  type='user_mobile'
                  placeholder={$t('a60c60be.92448a')}
                  value={info.user_mobile}
                  onChange={this.handleInput.bind(this, 'user_mobile')}
                />
              </View>
            </View>
            <View>
              {process.env.TARO_ENV === 'weapp' ? (
                <View>
                  <Button
                    className='submit-btn'
                    type='primary'
                    formType='submit'
                    disabled={isTrue}
                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                  >
                    {$t('a60c60be.939d53')}
                  </Button>
                </View>
              ) : (
                <Button
                  type='primary'
                  disabled={isTrue}
                  onClick={this.handleSubmit}
                  formType='submit'
                  style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                >
                  {$t('a60c60be.939d53')}
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

export default connect(({ colors }) => ({
  colors: colors.current
}))(withTranslation()(VerifiedIdentity))
