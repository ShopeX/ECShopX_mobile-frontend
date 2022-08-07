import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtButton } from 'taro-ui'
import { useSelector } from 'react-redux'
import { isWeixin, VERSION_STANDARD } from '@/utils'
import getPaymentList from '@/utils/payment'
import { SpCheckbox, SpCell, SpFloatLayout } from '@/components'
import { View, Text, Button } from '@tarojs/components'

import './comp-paymentpicker.scss'

function CompPaymentPicker(props) {
  const {
    type = '',
    distributor_id,
    isShowDelivery = false,
    loading,
    isPointitemGood = false,
    isShowBalance = true,
    disabledPayment = null,
    title = '支付方式',
    isOpened = false,
    onChange = () => {},
    onClose = () => {},
    onInitDefaultPayType = () => {}
  } = props

  const { colorPrimary, pointName } = useSelector((state) => state.sys)

  const [state, setState] = useImmer({
    localType: type,
    typeList: []
  })

  const { localType, typeList } = state

  useEffect(() => {
    setState((draft) => {
      draft.localType = type
    })
    getFetch()
  }, [])

  const getFetch = async () => {
    const { list } = await getPaymentList(distributor_id)
    setState((draft) => {
      draft.typeList = list
    })
    if (list[0]) {
      handlePaymentChange(list[0].pay_type_code, channel)
      handleChange(list[0].pay_type_code)
      let channel = ''
      if (typeof list[0].pay_channel != 'undefined') {
        channel = list[0].pay_channel
      }
      onInitDefaultPayType(list[0].pay_type_code, channel)
    }
  }

  const handlePaymentChange = (type) => {
    if (disabledPayment && disabledPayment[type]) return
    setState((draft) => {
      draft.localType = type
    })
  }

  const handleChange = (type) => {
    const payItem = typeList.find((item) => item.pay_type_code == type)
    let channel = ''
    if (payItem && typeof payItem.pay_channel != 'undefined') {
      channel = payItem.pay_channel
    }
    onChange(type, channel)
  }

  const handleCancel = () => {
    setState((draft) => {
      draft.localType = type
    })
    onClose()
  }

  return (
    <View className='pages-comp-paymentpicker'>
      <SpFloatLayout
        open={isOpened}
        onClose={handleCancel}
        renderFooter={
          <AtButton
            loading={loading}
            circle
            className='at-button--primary'
            onClick={handleChange.bind(this, localType)}
          >
            确定
          </AtButton>
        }
      >
        <View className='payment-picker'>
          <View className='payment-picker__hd'>
            <Text>{title}</Text>
          </View>
          <View className='payment-picker__bd'>
            {isPointitemGood && (
              <View
                className={`payment-item ${
                  disabledPayment && disabledPayment['point'] ? 'is-disabled' : ''
                }`}
                onClick={handlePaymentChange.bind(this, 'point')}
              >
                <View className='payment-item__bd'>
                  <Text className='payment-item__title'>{`${pointName}支付`}</Text>
                  <Text className='payment-item__desc'>
                    {disabledPayment && disabledPayment['point']
                      ? disabledPayment['point']
                      : `使用${pointName}支付`}
                  </Text>
                </View>
                <View className='payment-item__ft'>
                  <SpCheckbox
                    disabled={disabledPayment && !!disabledPayment['point']}
                    colors={colorPrimary}
                    checked={localType === 'point'}
                  />
                </View>
              </View>
            )}
            {/* {isShowBalance && VERSION_STANDARD && isWeixin && ( // 临时加的 后期需开启注释 */}
            {/* <View
              className={`payment-item ${
                disabledPayment && disabledPayment['deposit'] ? 'is-disabled' : ''
              }`}
              onClick={handlePaymentChange.bind(this, 'deposit')}
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
                  colors={colorPrimary}
                  checked={localType === 'deposit'}
                ></SpCheckbox>
              </View>
            </View> */}
            {/* )} */}
            {isShowDelivery && (
              <View
                className={`payment-item ${
                  disabledPayment && disabledPayment['delivery'] ? 'is-disabled' : ''
                }`}
                onClick={handlePaymentChange.bind(this, 'delivery')}
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
                    colors={colorPrimary}
                    checked={localType === 'delivery'}
                  />
                </View>
              </View>
            )}

            {typeList.map((item, index) => {
              return (
                <View
                  key={index}
                  className='payment-item no-border'
                  onClick={handlePaymentChange.bind(this, item.pay_type_code)}
                >
                  <View className='payment-item__bd'>
                    <Text className='payment-item__title'>{item.pay_type_name}</Text>
                    <Text className='payment-item__desc'>使用{item.pay_type_name}</Text>
                  </View>
                  <View className='payment-item__ft'>
                    <SpCheckbox checked={localType === item.pay_type_code}></SpCheckbox>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </SpFloatLayout>
    </View>
  )
}

CompPaymentPicker.options = {
  addGlobalClass: true
}

export default CompPaymentPicker
