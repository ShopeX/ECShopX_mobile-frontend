import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpFloatLayout, SpCheckbox } from '@/components'
import api from '@/api'
import { isWxWeb, getDistributorId, isAPP, pickBy } from '@/utils'
import doc from '@/doc'
import { payment_platform } from '@/utils/platform'
import './index.scss'

const paymentList = [
  {
    paymentChannel: 'deposit',
    paymentCode: 'deposit',
    paymentName: '余额支付'
  }
]

const initialState = {
  list: [],
  selectPayment: '',
  selectItem: null
}

function SpCashier(props) {
  const {
    isOpened = true,
    value,
    onClose = () => {},
    onChange = () => {},
    paymentAmount = 0
  } = props
  const { userInfo } = useSelector((state) => state.user)
  const [state, setState] = useImmer(initialState)
  const { list, selectPayment, selectItem } = state
  console.log('isAPP:', isAPP(), Taro.getEnv(), Taro.ENV_TYPE.APP)
  const ENV = Taro.getEnv()
  useEffect(() => {
    if (isAPP()) {
      fetchAppPaymentList()
    } else {
      fetchPaymentList()
    }
  }, [ENV])

  useEffect(() => {
    if (!isOpened) {
      setState((draft) => {
        draft.selectPayment = value
      })
    }
  }, [value, isOpened])

  const fetchPaymentList = async () => {
    const params = {
      distributor_id: getDistributorId(),
      platform: isWxWeb ? 'wxPlatform' : payment_platform
    }
    const res = await api.member.getTradePaymentList(params)
    const list = [...pickBy(res, doc.payment.PAYMENT_ITEM), ...paymentList]
    setState((draft) => {
      draft.list = list
    })
    onChange(list[0])
    // console.log('===list===', list)
    // const isHasAlipay = list.some((item) => item.pay_type_code === 'alipayh5')
    // return {
    //   list,
    //   isHasAlipay
    // }
  }

  const fetchAppPaymentList = async () => {
    const res = await Taro.SAPPPay.getPayList()
    console.log('fetchAppPaymentList:', res)
    const list = [...pickBy(res, doc.payment.APP_PAYMENT_ITEM), ...paymentList]
    setState((draft) => {
      draft.list = list
    })
    onChange(list[0])
  }

  const onChangePayment = (item) => {
    const { paymentCode, paymentChannel } = item
    setState((draft) => {
      draft.selectPayment = paymentChannel
      draft.selectItem = item
    })
  }

  const onConfirm = () => {
    onClose()
    onChange(selectItem)
  }

  const onCloseFloatLayout = () => {
    setState((draft) => {
      draft.selectPayment = value
    })
    onClose()
  }

  const renderPaymentName = ({ paymentCode, paymentName }) => {
    if (paymentCode == 'deposit') {
      return `${paymentName} (余额: ${userInfo.deposit || 0})`
    } else {
      return paymentName
    }
  }

  return (
    <SpFloatLayout
      title='支付方式'
      className='sp-cashier'
      open={isOpened}
      onClose={onCloseFloatLayout}
      renderFooter={
        <AtButton circle type='primary' onClick={onConfirm}>
          确定
        </AtButton>
      }
    >
      <View>
        {list.map((item, index) => (
          <View className='payment-item' key={`payment-item__${index}`}>
            <SpCheckbox
              checked={item.paymentChannel == selectPayment}
              onChange={onChangePayment.bind(this, item)}
              // disabled={onDisabled(item)}
            >
              {renderPaymentName(item)}
            </SpCheckbox>
          </View>
        ))}
      </View>
    </SpFloatLayout>
  )
}

SpCashier.options = {
  addGlobalClass: true
}

export default SpCashier
