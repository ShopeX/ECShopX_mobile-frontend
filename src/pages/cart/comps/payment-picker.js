import React, { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtFloatLayout } from 'taro-ui'
import { SpCheckbox } from '@/components'
import { isWeixin } from '@/utils'
import getPaymentList from '@/utils/payment'
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
    // onInitDefaultPayType: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      localType: props.type,
      typeList: []
    }
  }
  componentDidMount () {
    this.fetch()
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
  async fetch () {
    const { list } = await getPaymentList()
    const res = list

    this.setState(
      {
        typeList: res
      },
      () => {
        if (res[0]) {
          this.handlePaymentChange(res[0].pay_type_code, channel)
          this.handleChange(res[0].pay_type_code)
          let channel = ''
          if (typeof res[0].pay_channel != 'undefined') {
            channel = res[0].pay_channel
          }
          // this.props.onInitDefaultPayType(res[0].pay_type_code, channel)
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
    const { typeList } = this.state
    const payItem = typeList.find((item) => item.pay_type_code == type)
    let channel = ''
    if (payItem && typeof payItem.pay_channel != 'undefined') {
      channel = payItem.pay_channel
    }
    this.props.onChange(type, channel)
  }

  render () {
    const {
      isOpened,
      loading,
      disabledPayment,
      colors,
      isShowPoint = true,
      isShowBalance = true,
      isShowDelivery = true
    } = this.props
    const { localType, typeList } = this.state

    return (
      <AtFloatLayout isOpened={isOpened} onClose={this.handleCancel}>
        <View className='payment-picker'>
          <View className='payment-picker__hd'>
            <Text>支付方式</Text>
            <View className='iconfont icon-close' onClick={this.handleCancel}></View>
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
                  <Text className='payment-item__title'>{`${this.props.pointName}支付`}</Text>
                  <Text className='payment-item__desc'>
                    {disabledPayment && disabledPayment['point']
                      ? disabledPayment['point']
                      : `使用${this.props.pointName}支付`}
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
            {/* {isShowBalance && isWeixin && (
              <View
                className={`payment-item ${
                  disabledPayment && disabledPayment['deposit'] ? 'is-disabled' : ''
                }`}
                onClick={this.handlePaymentChange.bind(this, 'deposit')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>余额支付</Text>
                  <Text className='payment-item__desc'>
                    {disabledPayment && disabledPayment['deposit']
                      ? disabledPayment['deposit']
                      : '使用余额支付'}
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
            )} */}
            {isShowDelivery && (
              <View
                className={`payment-item ${
                  disabledPayment && disabledPayment['delivery'] ? 'is-disabled' : ''
                }`}
                onClick={this.handlePaymentChange.bind(this, 'delivery')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>货到付款</Text>
                  <Text className='payment-item__desc'>
                    {disabledPayment && disabledPayment['delivery']
                      ? disabledPayment.message
                      : '货到付款'}
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

            {typeList.map((item) => {
              return (
                <View
                  className='payment-item no-border'
                  onClick={this.handlePaymentChange.bind(this, item.pay_type_code)}
                >
                  <View className='payment-item__bd'>
                    <Text className='payment-item__title'>{item.pay_type_name}</Text>
                    <Text className='payment-item__desc'>使用{item.pay_type_name}</Text>
                  </View>
                  <View className='payment-item__ft'>
                    {/* <View>{localType === item.pay_type_code?'test':'test2'}</View>  */}
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
            确定
          </Button>
        </View>
      </AtFloatLayout>
    )
  }
}
