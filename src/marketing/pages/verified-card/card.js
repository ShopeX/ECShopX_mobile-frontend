/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Form, Button, Picker } from '@tarojs/components'
import S from '@/spx'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { SpNavBar, SpToast, SpInput as AtInput } from '@/components'
import api from '@/api'
import { classNames, pickBy } from '@/utils'
import './verified.scss'

class VerifiedBankCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {},
      multiIndex: [],
      isTrue: false,
      areaList: [],
      selectorChecked: [],
      bankData: null
    }
  }
  async componentDidMount() {
    const { colors } = this.props
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors.data[0].marketing
    })
    this.syncNavTitle()
    Taro.request({
      url: `${process.env.APP_IMAGE_CDN}/hfpayBankData.json`
    }).then((res) => {
      this.setState({
        bankData: res.data
      })
    })

    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('e7ecd058.005e9c') })
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
    if (!info.bank_id) {
      return S?.toast($t('e7ecd058.c28d24'))
    }

    if (!info.card_num || !/^[1-9]\d{9,29}$/.test(info.card_num)) {
      return S?.toast($t('e7ecd058.12fba9'))
    }

    let obj = {
      bank_name: info.bank_name,
      card_num: info.card_num,
      bank_id: info.bank_id
    }
    api.member.hfpayBankSave(obj).then((res) => {
      Taro.showToast({
        title: $t('e7ecd058.48c17b'),
        icon: 'success',
        duration: 2000
      })
      this.setState({
        isTrue: true
      })
    })
  }

  async fetch() {
    const res = await api.member.hfpayBankInfo()
    const info = pickBy(res, {
      card_num: 'card_num',
      bank_id: 'bank_id',
      bank_name: 'bank_name'
    })
    if (info.card_num) {
      this.setState({
        info,
        isTrue: true
      })
    }
  }

  handleChange(e) {
    const { bankData } = this.state
    let bank_name = bankData[e.detail.value].bank_name
    let bank_id = bankData[e.detail.value].bank_code
    let { info } = this.state
    info = { ...info, bank_name, bank_id }
    this.setState({
      info
    })
  }

  render() {
    const { colors } = this.props
    const { info, isTrue, bankData } = this.state
    return (
      <View className='page-distribution-index'>
        <SpNavBar title={$t('e7ecd058.005e9c')} leftIconType='chevron-left' />

        <View className='page-bd'>
          <Form onSubmit={this.handleSubmit}>
            <View className=''>
              <AtInput
                disabled={isTrue}
                title={$t('e7ecd058.d98e9d')}
                type='number'
                placeholder={$t('e7ecd058.d98e9d')}
                value={info.card_num}
                onChange={this.handleInput.bind(this, 'card_num')}
              />
            </View>
            <View className='bt'>
              <Picker
                mode='selector'
                range={bankData}
                rangeKey='bank_name'
                onChange={this.handleChange.bind(this)}
              >
                <View className='picker'>
                  <View className='picker__title'>{$t('e7ecd058.f14b4f')}</View>
                  <Text className={classNames(info.bank_id ? 'pick-value' : 'pick-value-null')}>
                    {info.bank_name ? info.bank_name : $t('e7ecd058.708c9d')}
                  </Text>
                </View>
              </Picker>
            </View>

            <View className='btn'>
              {process.env.TARO_ENV === 'weapp' ? (
                <View>
                  <Button
                    className='submit-btn'
                    type='primary'
                    formType='submit'
                    disabled={isTrue}
                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                  >
                    {$t('e7ecd058.939d53')}
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
                  {$t('e7ecd058.939d53')}
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
}))(withTranslation()(VerifiedBankCard))
