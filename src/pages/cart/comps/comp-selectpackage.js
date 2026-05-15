/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtButton } from 'taro-ui'
import { useSelector } from 'react-redux'
import { SpCheckbox, SpCell, SpFloatLayout } from '@/components'
import { View, Text } from '@tarojs/components'
import { useTranslation, $t, ti } from '@/i18n'

import './comp-selectpackage.scss'

const initialState = {
  selectValue: false
}

const PACKAGE_OPTIONS = [
  { labelKey: '8112d152.8755a5', value: false },
  { labelKey: '8112d152.df16ff', value: true }
]

function CompSelectPackage(props) {
  useTranslation()
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
          {$t('8112d152.38cf16')}
        </AtButton>
      }
    >
      <View>
        {PACKAGE_OPTIONS.map((item, index) => (
          <View className='package-item' key={`package-item__${index}`}>
            <SpCheckbox
              checked={item.value == selectValue}
              onChange={onChangePackage.bind(this, item)}
            >
              {$t(item.labelKey)}
            </SpCheckbox>
          </View>
        ))}
        <View className='package-desc'>{ti('8112d152.db9365', [info.packDes])}</View>
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
