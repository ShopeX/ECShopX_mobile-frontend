/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpFloatLayout } from '@/components'
import { classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './comp-tradecancel.scss'

const initialState = {
  reasonIndex: 0,
  otherReason: ''
}
function CompTradeCancel(props) {
  useTranslation()
  const { isOpened, onClose, onConfirm } = props
  const [state, setState] = useImmer(initialState)
  const { reasonIndex, otherReason } = state
  const reasonList = [
    $t('f792549d.d5505c'),
    $t('f792549d.78d83c'),
    $t('f792549d.bea53b'),
    $t('f792549d.0d98c7')
  ]

  const onChangeOtherReason = (e) => {
    setState((draft) => {
      draft.otherReason = e
    })
  }

  return (
    <SpFloatLayout
      title={$t('f792549d.c56cdd')}
      className='comp-trade-cancel'
      open={isOpened}
      onClose={onClose}
      renderFooter={
        <AtButton
          circle
          type='primary'
          onClick={() => {
            onConfirm({
              reason: reasonList[reasonIndex],
              otherReason: reasonIndex == 3 ? otherReason : ''
            })
          }}
        >
          {$t('f792549d.38cf16')}
        </AtButton>
      }
    >
      <View>
        <View className='reason-list'>
          {reasonList.map((item, index) => (
            <View
              className={classNames('reason-item', {
                'active': index === reasonIndex
              })}
              onClick={() => {
                setState((draft) => {
                  draft.reasonIndex = index
                })
              }}
            >
              {item}
            </View>
          ))}
        </View>
        <View className='reason-other'>
          <AtTextarea
            type='textarea'
            placeholder={$t('f792549d.604c4a')}
            value={otherReason}
            className={classNames('reason-other-textarea', {
              'disabled': reasonIndex != 3
            })}
            disabled={reasonIndex != 3}
            onChange={onChangeOtherReason}
          />
        </View>
      </View>
    </SpFloatLayout>
  )
}

CompTradeCancel.options = {
  addGlobalClass: true
}

CompTradeCancel.defaultProps = {
  isOpened: false,
  onClose: () => {},
  onConfirm: () => {}
}

export default CompTradeCancel
