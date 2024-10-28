import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtButton } from 'taro-ui'
import { useSelector } from 'react-redux'
import { SpCheckbox, SpCell, SpFloatLayout } from '@/components'
import { View, Text } from '@tarojs/components'

import './comp-selectpackage.scss'

const initialState = {
  selectValue: false
}

const list = [
  { label: '不需要', value: false },
  { label: '需要', value: true }
]

function CompSelectPackage(props) {
  const { value, isOpened = false, info, onChange = () => {}, onClose = () => {} } = props

  const [state, setState] = useImmer(initialState)

  const { selectValue } = state

  useEffect(() => {
    if (!isOpened) {
      setState((draft) => {
        draft.selectValue = value
      })
    }
  }, [value, isOpened])

  const onConfirm = () => {
    onClose()
    onChange(selectValue)
  }

  const onCloseFloatLayout = () => {
    setState((draft) => {
      draft.selectValue = value
    })
    onClose()
  }

  const onChangePackage = ({ value }) => {
    setState((draft) => {
      draft.selectValue = value
    })
  }

  if (!info) {
    return null
  }

  return (
    <SpFloatLayout
      className='comp-selectpackage'
      title={info.packName}
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
          <View className='package-item' key={`package-item__${index}`}>
            <SpCheckbox
              checked={item.value == selectValue}
              onChange={onChangePackage.bind(this, item)}
            >
              {item.label}
            </SpCheckbox>
          </View>
        ))}
        <View className='package-desc'>包装说明：{info.packDes}</View>
      </View>

      {/* <View className='payment-picker'>
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
      </View> */}
    </SpFloatLayout>
  )
}

export default CompSelectPackage
