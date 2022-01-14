import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtActionSheet } from 'taro-ui'
import { SpCheckbox, SpCell } from '@/components'
import { View, Text, Button } from '@tarojs/components'

import './comp-selectpackage.scss'

const initialState = {
  isOpendActionSheet: false,
  checkedRadio: false
}

function CompSelectPackage (props) {
  const {
    isChecked = false,
    packInfo = {},
    isPointitemGood = false, // 是否为积分商品
    onHanleChange = () => {}
  } = props

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
    if (ischange) onHanleChange && onHanleChange(checkedRadio)
  }

  return (
    <View className='pages-comp-selectpackage'>
      {!isPointitemGood && (
        <SpCell isLink className='trade-invoice' title={packInfo.packName} onClick={onShowSheet}>
          <View className='invoice-title'>{isChecked ? '需要' : '不需要'}</View>
        </SpCell>
      )}

      <AtActionSheet isOpened={isOpendActionSheet} onClose={() => handleConfrim(false)}>
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
                <SpCheckbox colors='var(--color-primary)' checked={!checkedRadio} />
              </View>
            </View>

            <View className='payment-item no-border' onClick={handleChange.bind(this, true)}>
              <View className='payment-item__bd'>
                <Text className='payment-item__title'>需要</Text>
              </View>
              <View className='payment-item__ft'>
                <SpCheckbox colors='var(--color-primary)' checked={checkedRadio} />
              </View>
            </View>
            <View className='payment-item__desc'>包装说明：{packInfo.packDes}</View>
          </View>
          <Button
            type='primary'
            className='btn-submit'
            style='background: var(--color-primary); border-color: var(--color-primary);'
            onClick={() => handleConfrim(true)}
          >
            确定
          </Button>
        </View>
      </AtActionSheet>
    </View>
  )
}

export default CompSelectPackage
