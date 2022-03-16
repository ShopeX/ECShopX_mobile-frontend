import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtFloatLayout } from 'taro-ui'
import { useSelector } from 'react-redux'
import { isWeixin, VERSION_STANDARD } from '@/utils'
import getPaymentList from '@/utils/payment'
import { SpCheckbox, SpCell } from '@/components'
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
    onChange = () => {},
    title = '支付方式',
    totalInfo
    // onInitDefaultPayType = () => {}
  } = props

  const { colorPrimary, pointName } = useSelector((state) => state.sys)

  const [state, setState] = useImmer({
    localType: type,
    typeList: [],
    isOpendActionSheet: false
  })

  const { localType, typeList, isOpendActionSheet } = state

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
      // onInitDefaultPayType(res[0].pay_type_code, channel)
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
    setState((draft) => {
      draft.isOpendActionSheet = false
    })
  }

  const handlePaymentShow = (isOpend) => {
    setState((draft) => {
      draft.isOpendActionSheet = isOpend
    })
  }

  const payTypeText = {
    wxpay: '微信支付',
    hfpay: '微信支付',
    alipayh5: '支付宝支付',
    wxpayh5: '微信支付',
    wxpayjs: '微信支付',
    point: `${pointName}支付`,
    deposit: '余额支付'
    // delivery: '货到付款',
  }

  return (
    <View className='pages-comp-paymentpicker'>
      <View>
        <SpCell
          isLink
          className='trade-invoice'
          title={title}
          onClick={() => handlePaymentShow(true)}
        >
          {totalInfo.deduction && (
            <Text>
              {totalInfo.remainpt}
              {`${pointName}可用`}
            </Text>
          )}
          <Text className='invoice-title'>{payTypeText[type]}</Text>
        </SpCell>
        {totalInfo.deduction && (
          <View>
            可用{totalInfo.point}
            {pointName}，抵扣 <SpPrice unit='cent' value={totalInfo.deduction} />
            包含运费 <SpPrice unit='cent' value={totalInfo.freight_fee} />
          </View>
        )}
      </View>

      <AtFloatLayout isOpened={isOpendActionSheet} onClose={() => handlePaymentShow(false)}>
        <View className='payment-picker'>
          <View className='payment-picker__hd'>
            <Text>{title}</Text>
            <View onClick={() => handlePaymentShow(false)} className='iconfont icon-close'></View>
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
            <View
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
            </View>
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
          <Button
            type='primary'
            className='btn-submit'
            loading={loading}
            onClick={handleChange.bind(this, localType)}
          >
            确定
          </Button>
        </View>
      </AtFloatLayout>
    </View>
  )
}

CompPaymentPicker.options = {
  addGlobalClass: true
}

export default CompPaymentPicker
