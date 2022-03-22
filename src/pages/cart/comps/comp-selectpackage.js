import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtButton } from 'taro-ui'
import { useSelector } from 'react-redux'
import { SpCheckbox, SpCell, SpFloatLayout } from '@/components'
import { View, Text } from '@tarojs/components'

import './comp-selectpackage.scss'

const initialState = {
  isOpendActionSheet: false,
  checkedRadio: false
}

function CompSelectPackage(props) {
  const {
    isChecked = false,
    packInfo = {},
    isPointitemGood = false, // 是否为积分商品
    onHandleChange = () => {}
  } = props

  const { colorPrimary } = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)

  const { isOpendActionSheet, checkedRadio } = state

  useEffect(() => {
    setState((draft) => {
      draft.checkedRadio = isChecked
    })
  }, [])

  const onShowSheet = () => {
    setState((draft) => {
      draft.isOpendActionSheet = true
      draft.checkedRadio = isChecked
    })
  }

  // 更改选项
  const handleChange = (isCheck) => {
    if (checkedRadio === isCheck) return false
    setState((draft) => {
      draft.checkedRadio = isCheck
    })
  }

  // 触发props
  const handleConfrim = (ischange) => {
    setState((draft) => {
      draft.isOpendActionSheet = false
    })
    if (ischange) onHandleChange && onHandleChange(checkedRadio)
  }

  return (
    <View className='pages-comp-selectpackage'>
      {!isPointitemGood && (
        <SpCell isLink className='trade-invoice' title={packInfo.packName} onClick={onShowSheet}>
          <View className='invoice-title'>{isChecked ? '需要' : '不需要'}</View>
        </SpCell>
      )}

      <SpFloatLayout
        open={isOpendActionSheet}
        onClose={() => handleConfrim(false)}
        renderFooter={
          <AtButton circle className='at-button--primary' onClick={() => handleConfrim(true)}>
            确定
          </AtButton>
        }
      >
        <View className='payment-picker'>
          <View className='payment-picker__hd'>
            <Text>{packInfo.packName}</Text>
            {/* <View onClick={() => handleConfrim(false)} className='iconfont icon-close'></View> */}
          </View>
          <View className='payment-picker__bd'>
            <View className='payment-item no-border' onClick={handleChange.bind(this, false)}>
              <View className='payment-item__bd'>
                <Text className='payment-item__title'>不需要</Text>
              </View>
              <View className='payment-item__ft'>
                <SpCheckbox colors={colorPrimary} checked={!checkedRadio} />
              </View>
            </View>

            <View className='payment-item no-border' onClick={handleChange.bind(this, true)}>
              <View className='payment-item__bd'>
                <Text className='payment-item__title'>需要</Text>
              </View>
              <View className='payment-item__ft'>
                <SpCheckbox colors={colorPrimary} checked={checkedRadio} />
              </View>
            </View>
            <View className='payment-item__desc'>包装说明：{packInfo.packDes}</View>
          </View>
        </View>
      </SpFloatLayout>
    </View>
  )
}

export default CompSelectPackage
