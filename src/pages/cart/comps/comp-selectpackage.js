import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtButton } from 'taro-ui'
import { useSelector } from 'react-redux'
import { SpCheckbox, SpCell, SpFloatLayout } from '@/components'
import { View, Text } from '@tarojs/components'

import './comp-selectpackage.scss'

const initialState = {
  checkedRadio: false
}

function CompSelectPackage(props) {
  const {
    isChecked = true,
    isOpened = false,
    packInfo = {},
    onChange = () => {},
    onClose = () => {}
  } = props

  const { colorPrimary } = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)

  const { checkedRadio } = state

  useEffect(() => {
    setState((draft) => {
      draft.checkedRadio = isChecked
    })
  }, [])

  // 更改选项
  const handleChange = (isCheck) => {
    if (checkedRadio === isCheck) return false
    setState((draft) => {
      draft.checkedRadio = isCheck
    })
  }

  // 触发props
  const handleConfrim = () => {
    onChange(checkedRadio)
  }

  const closePack = () => {
    setState((draft) => {
      draft.checkedRadio = true
    })
    onClose()
  }

  return (
    <View className='pages-comp-selectpackage'>
      <SpFloatLayout
        open={isOpened}
        onClose={closePack}
        renderFooter={
          <AtButton circle className='at-button--primary' onClick={handleConfrim}>
            确定
          </AtButton>
        }
      >
        <View className='payment-picker'>
          <View className='payment-picker__hd'>
            <Text>{packInfo.packName}</Text>
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
