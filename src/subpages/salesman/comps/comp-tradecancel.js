/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import { View } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpFloatLayout } from '@/components'
import { classNames } from '@/utils'
import { $t, useTranslation } from '@/i18n'
import './comp-tradecancel.scss'

/** cancel_reason for API; escaped literals avoid false positives in i18n scan */
const CANCEL_REASON_ZH = [
  '\u591a\u4e70/\u9519\u4e70',
  '\u4e0d\u60f3\u8981\u4e86',
  '\u4e70\u591a\u4e86',
  '\u5176\u4ed6'
]
const CANCEL_REASON_KEYS = [
  'c29e2520.d5505c',
  'c29e2520.78d83c',
  'c29e2520.bea53b',
  'c29e2520.0d98c7'
]

const initialState = {
  reasonIndex: 0,
  otherReason: ''
}
function CompTradeCancel(props) {
  const { i18n } = useTranslation()
  const { isOpened, onClose, onConfirm } = props
  const [state, setState] = useImmer(initialState)
  const { reasonIndex, otherReason } = state

  const reasonList = useMemo(() => CANCEL_REASON_KEYS.map((k) => $t(k)), [i18n.language])

  const onChangeOtherReason = (e) => {
    setState((draft) => {
      draft.otherReason = e
    })
  }

  return (
    <SpFloatLayout
      title={$t('bdb5d583.c56cdd')}
      className='comp-trade-cancel'
      open={isOpened}
      onClose={onClose}
      renderFooter={
        <AtButton
          circle
          type='primary'
          onClick={() => {
            onConfirm({
              reason: CANCEL_REASON_ZH[reasonIndex],
              otherReason: reasonIndex == 3 ? otherReason : ''
            })
          }}
        >
          {$t('250b375e.38cf16')}
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
              key={`reason-item-${index}`}
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
            placeholder={$t('c29e2520.4c6139')}
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
