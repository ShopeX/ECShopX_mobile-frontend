import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtFloatLayout, AtButton } from 'taro-ui'
import { SpCheckbox } from '@/components'

import './payment-picker.scss'

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

  render () {
    const { isOpened, loading, disabledPayment } = this.props
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
            { /*
              <View
                className={`payment-item ${!!disabledPayment ? 'is-disabled' : ''}`}
                onClick={this.handlePaymentChange.bind(this, 'dhpoint')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>积分支付</Text>
                  <Text className='payment-item__desc'>{disabledPayment ? disabledPayment.message : '使用积分支付'}</Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox
                    disabled={!!disabledPayment}
                    checked={localType === 'dhpoint'}
                  ></SpCheckbox>
                </View>
              </View>*/
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

            <AtButton
              type='primary'
              loading={loading}
              onClick={this.props.onChange.bind(this, localType)}
            >确定</AtButton>
          </View>
        </View>
      </AtFloatLayout>
    )
  }
}
