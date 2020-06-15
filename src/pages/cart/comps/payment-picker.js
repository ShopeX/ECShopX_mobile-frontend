import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon, AtFloatLayout, AtButton } from 'taro-ui'
import { SpCheckbox } from '@/components'

import './payment-picker.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class PaymentPicker extends Component {
  static defaultProps = {
    isOpened: false,
    type: 'wxpay',
    disabledPayment: null
  }

  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      localType: props.type
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.type !== this.props.type) {
      this.setState({
        localType: nextProps.type
      })
    }
  }

  handleCancel = () => {
    this.setState({
      localType: this.props.type
    })
    this.props.onClose()
  }

  handlePaymentChange = (type) => {
    const { disabledPayment } = this.props
    if (disabledPayment && disabledPayment.name === type) return

    this.setState({
      localType: type
    })
  }

  handleChange = (type) => {
    this.props.onChange(type)
  }

  render () {
    const { isOpened, loading, disabledPayment, colors, isShowPoint = true, isShowBalance = true, isShowDelivery = true } = this.props
    const { localType } = this.state

    return (
      <AtFloatLayout
        isOpened={isOpened}
      >
        <View className='payment-picker'>
          <View className='payment-picker__hd'>
            <Text>支付方式</Text>
            <View
              className='at-icon at-icon-close'
              onClick={this.handleCancel}
            ></View>
          </View>
          <View className='payment-picker__bd'>
          {
              isShowPoint &&
              <View
                className={`payment-item ${disabledPayment && disabledPayment.name === 'point' ? 'is-disabled' : ''}`}
                onClick={this.handlePaymentChange.bind(this, 'point')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>积分支付</Text>
                  <Text className='payment-item__desc'>{disabledPayment && disabledPayment.name === 'point' ? disabledPayment.message : '使用积分支付'}</Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox
                    disabled={!!disabledPayment}
                    colors={colors}
                    checked={localType === 'point'}
                  ></SpCheckbox>
                </View>
              </View>
            }
            {
              isShowBalance &&
              <View
                className={`payment-item ${disabledPayment && disabledPayment.name === 'balance' ? 'is-disabled' : ''}`}
                onClick={this.handlePaymentChange.bind(this, 'balance')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>余额支付</Text>
                  <Text className='payment-item__desc'>{disabledPayment && disabledPayment.name === 'balance' ? disabledPayment.message : '使用余额支付'}</Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox
                    disabled={!!disabledPayment}
                    colors={colors}
                    checked={localType === 'balance'}
                  ></SpCheckbox>
                </View>
              </View>
            }
            {
              isShowDelivery &&
              <View
                className={`payment-item ${disabledPayment && disabledPayment.name === 'delivery' ? 'is-disabled' : ''}`}
                onClick={this.handlePaymentChange.bind(this, 'delivery')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>货到付款</Text>
                  <Text className='payment-item__desc'>{disabledPayment && disabledPayment.name === 'delivery' ? disabledPayment.message : '货到付款'}</Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox
                    disabled={!!disabledPayment}
                    colors={colors}
                    checked={localType === 'delivery'}
                  ></SpCheckbox>
                </View>
              </View>
            }
            
            <View
              className='payment-item no-border'
              onClick={this.handlePaymentChange.bind(this, 'wxpay')}
            >
              <View className='payment-item__bd'>
                <Text className='payment-item__title'>微信支付</Text>
                <Text className='payment-item__desc'>微信支付可使用优惠券及享受运费优惠</Text>
              </View>
              <View className='payment-item__ft'>
                <SpCheckbox
                  checked={localType === 'wxpay'}
                ></SpCheckbox>
              </View>
            </View>
          </View>
          <Button
            type='primary'
            className='btn-submit'
            style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary};`}
            loading={loading}
            onClick={this.handleChange.bind(this, localType)}
          >确定</Button>
        </View>
      </AtFloatLayout>
    )
  }
}
