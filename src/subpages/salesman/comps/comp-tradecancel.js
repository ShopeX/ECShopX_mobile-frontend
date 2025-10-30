// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpFloatLayout } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { classNames } from '@/utils'
import './comp-tradecancel.scss'

const initialState = {
  reasonList: ['多买/错买', '不想要了', '买多了', '其他'],
  reasonIndex: 0,
  otherReason: ''
}
function CompTradeCancel(props) {
  const { isOpened, onClose, onConfirm } = props
  const [state, setState] = useImmer(initialState)
  const { reasonList, reasonIndex, otherReason } = state

  const onChangeOtherReason = (e) => {
    setState((draft) => {
      draft.otherReason = e
    })
  }

  return (
    <SpFloatLayout
      title='选择取消理由'
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
          确定
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
            placeholder='请输入你的理由...'
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
