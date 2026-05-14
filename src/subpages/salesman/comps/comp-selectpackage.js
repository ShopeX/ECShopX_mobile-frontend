/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { AtButton } from 'taro-ui'
import { SpCheckbox, SpCell, SpFloatLayout } from '@/components'
import { $t, useTranslation } from '@/i18n'
import { View, Text } from '@tarojs/components'
import './comp-selectpackage.scss'

const initialState = {
  selectValue: false
}

function CompSelectPackage(props) {
  const { i18n } = useTranslation()
  const { value, isOpened = false, info, onChange = () => {}, onClose = () => {} } = props

  const list = useMemo(
    () => [
      { label: $t('edc703ce.8755a5'), value: false },
      { label: $t('edc703ce.df16ff'), value: true }
    ],
    [i18n.language]
  )

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
          {$t('250b375e.38cf16')}
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
        <View className='package-desc'>
          {$t('655dda5a.66d5ec')}
          {info.packDes}
        </View>
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
