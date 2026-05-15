/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtFloatLayout } from 'taro-ui'
import { SpCheckbox } from '@/components'
import api from '@/api'
import { DEFAULT_POINT_NAME } from '@/consts'
import { $t, ti, i18n } from '@/i18n'
import './payment-picker.scss'

@connect(({ colors, sys }) => ({
  colors: colors.current,
  pointName: sys.pointName
}))
export default class PaymentPicker extends Component {
  static defaultProps = {
    isOpened: false,
    type: '',
    disabledPayment: null
  }

  constructor(props) {
    super(props)

    this.state = {
      localType: props.type,
      typeList: []
    }
  }
  componentDidMount() {
    this._onLanguageChanged = () => this.forceUpdate()
    i18n.on('languageChanged', this._onLanguageChanged)
    this.fatch()
  }

  componentWillUnmount() {
    if (this._onLanguageChanged) {
      i18n.off('languageChanged', this._onLanguageChanged)
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.type !== this.props.type) {
      this.setState({
        localType: nextProps.type
      })
    }
  }

  static options = {
    addGlobalClass: true
  }
  async fatch() {
    let res = await api.member.getTradePaymentList()
    this.setState(
      {
        typeList: res
      },
      () => {
        if (res[0]) {
          console.log(111)
          this.handlePaymentChange(res[0].pay_type_code)
          this.handleChange(res[0].pay_type_code)
        }
      }
    )
  }
  handleCancel = () => {
    this.setState({
      localType: this.props.type
    })
    this.props.onClose()
  }

  handlePaymentChange = (type) => {
    const { disabledPayment } = this.props
    if (disabledPayment && disabledPayment[type]) return

    this.setState({
      localType: type
    })
  }

  handleChange = (type) => {
    this.props.onChange(type)
  }

  render() {
    const {
      isOpened,
      loading,
      disabledPayment,
      colors,
      isShowPoint = true,
      isShowBalance = true,
      isShowDelivery = true,
      pointName
    } = this.props
    const { localType, typeList } = this.state

    return (
      <AtFloatLayout isOpened={isOpened}>
        <View className='payment-picker'>
          <View className='payment-picker__hd'>
            <Text>{$t('250b375e.0c9d2b')}</Text>
            <View className='at-icon at-icon-close' onClick={this.handleCancel}></View>
          </View>
          <View className='payment-picker__bd'>
            {isShowPoint && (
              <View
                className={`payment-item ${
                  disabledPayment && disabledPayment['point'] ? 'is-disabled' : ''
                }`}
                onClick={this.handlePaymentChange.bind(this, 'point')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>
                    {ti('f74b9eea.717604', [pointName || DEFAULT_POINT_NAME()])}
                  </Text>
                  <Text className='payment-item__desc'>
                    {disabledPayment && disabledPayment['point']
                      ? disabledPayment['point']
                      : ti('f74b9eea.381488', [pointName || DEFAULT_POINT_NAME()])}
                  </Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox
                    disabled={disabledPayment && !!disabledPayment['point']}
                    colors={colors}
                    checked={localType === 'point'}
                  ></SpCheckbox>
                </View>
              </View>
            )}
            {isShowBalance && (
              <View
                className={`payment-item ${
                  disabledPayment && disabledPayment['deposit'] ? 'is-disabled' : ''
                }`}
                onClick={this.handlePaymentChange.bind(this, 'deposit')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>{$t('f74b9eea.89ac23')}</Text>
                  <Text className='payment-item__desc'>
                    {disabledPayment && disabledPayment['deposit']
                      ? disabledPayment['deposit']
                      : $t('f74b9eea.e2b46a')}
                  </Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox
                    disabled={disabledPayment && !!disabledPayment['deposit']}
                    colors={colors}
                    checked={localType === 'deposit'}
                  ></SpCheckbox>
                </View>
              </View>
            )}
            {isShowDelivery && (
              <View
                className={`payment-item ${
                  disabledPayment && disabledPayment['delivery'] ? 'is-disabled' : ''
                }`}
                onClick={this.handlePaymentChange.bind(this, 'delivery')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>{$t('f74b9eea.2d2ccd')}</Text>
                  <Text className='payment-item__desc'>
                    {disabledPayment && disabledPayment['delivery']
                      ? disabledPayment.message
                      : $t('f74b9eea.2d2ccd')}
                  </Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox
                    disabled={disabledPayment && !!disabledPayment['delivery']}
                    colors={colors}
                    checked={localType === 'delivery'}
                  ></SpCheckbox>
                </View>
              </View>
            )}

            {typeList.map((item, index) => {
              return (
                <View
                  key={index}
                  className='payment-item no-border'
                  onClick={this.handlePaymentChange.bind(this, item.pay_type_code)}
                >
                  <View className='payment-item__bd'>
                    <Text className='payment-item__title'>{item.pay_type_name}</Text>
                    <Text className='payment-item__desc'>
                      {ti('f74b9eea.7f2392', [item.pay_type_name])}
                    </Text>
                  </View>
                  <View className='payment-item__ft'>
                    <SpCheckbox checked={localType === item.pay_type_code}></SpCheckbox>
                  </View>
                </View>
              )
            })}
          </View>
          <Button
            type='primary'
            className='btn-submit'
            style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary};`}
            loading={loading}
            onClick={this.handleChange.bind(this, localType)}
          >
            {$t('f74b9eea.38cf16')}
          </Button>
        </View>
      </AtFloatLayout>
    )
  }
}
