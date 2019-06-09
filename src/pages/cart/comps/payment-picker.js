import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtFloatLayout, AtButton } from 'taro-ui'
import { SpCheckbox } from '@/components'

import './payment-picker.scss'

export default class PaymentPicker extends Component {
  static defaultProps = {
    isOpened: false,
    type: 'amorepay',
    disabledPayment: null
  }

  static options = {
    addGlobalClass: true
  }

  handlePaymentChange = (type) => {
    const { disabledPayment } = this.props
    if (disabledPayment && disabledPayment.name === type) return
    this.props.onChange(type)
  }

  render () {
    const { isOpened, loading, disabledPayment, type } = this.props

    return (
      <AtFloatLayout
        isOpened={isOpened}
      >
        <View className='payment-picker'>
          <View className='payment-picker__hd'>
            <Text>支付方式</Text>
            <View
              className='at-icon at-icon-close'
              onClick={this.props.onClose}
            ></View>
          </View>
          <View className='payment-picker__bd'>
            <View
              className='payment-item'
              onClick={this.handlePaymentChange.bind(this, 'dhpoint')}
            >
              <View className='payment-item__bd'>
                <Text className='payment-item__title'>积分支付</Text>
                <Text className='payment-item__desc'>{disabledPayment ? disabledPayment.message : '使用积分支付'}</Text>
              </View>
              <View className='payment-item__ft'>
                <SpCheckbox
                  disabled={!!disabledPayment}
                  checked={type === 'dhpoint'}
                ></SpCheckbox>
              </View>
            </View>
            <View
              className='payment-item no-border'
              onClick={this.handlePaymentChange.bind(this, 'amorepay')}
            >
              <View className='payment-item__bd'>
                <Text className='payment-item__title'>微信支付</Text>
                <Text className='payment-item__desc'>微信支付可使用优惠券及享受运费优惠</Text>
              </View>
              <View className='payment-item__ft'>
                <SpCheckbox
                  checked={type === 'amorepay'}
                ></SpCheckbox>
              </View>
            </View>

            <AtButton
              type='primary'
              loading={loading}
              onClick={this.props.onConfirm}
            >确定</AtButton>
          </View>
        </View>
      </AtFloatLayout>
    )
  }
}
