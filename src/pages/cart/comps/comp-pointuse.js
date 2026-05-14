/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { useImmer } from 'use-immer'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtButton } from 'taro-ui'
import { useSelector } from 'react-redux'
import { SpNumberKeyBoard, SpFloatLayout } from '@/components'
import { View, Text, Button } from '@tarojs/components'
import { useTranslation, $t, ti } from '@/i18n'

import './comp-pointuse.scss'

const initialState = {
  isOpenRule: false
}

function CompPointUse(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, pointPayFirst, onClose, onChange } = props
  const { pointName } = useSelector((state) => state.sys)
  const { isOpenRule } = state

  if (!info) {
    return null
  }

  const { deduct_point_rule = {} } = info
  const maxPoint = info?.receiptType == 'ziti' ? info.max_point_ziti : info.max_point

  return (
    <View className='comp-pointuse'>
      <SpFloatLayout className='point-float-layout' open={isOpened} hideClose>
        <View className='point-hd'>
          <View className='point-info'>
            {ti('5ed7ac10.c00678', [pointName, info.user_point, maxPoint])}
          </View>
          <Text
            className='point-rule'
            onClick={() => {
              setState((draf) => {
                draf.isOpenRule = true
              })
            }}
          >
            {$t('5ed7ac10.1ebbd6')}
          </Text>
        </View>
        <SpNumberKeyBoard
          realUsePoint={info.real_use_point}
          isShowDefault={pointPayFirst}
          maxValue={info?.receiptType == 'ziti' ? info.max_point_ziti : info.max_point}
          value={info.user_point}
          onClose={onClose}
          onConfirm={onChange}
        />
      </SpFloatLayout>

      <AtModal isOpened={isOpenRule}>
        <AtModalHeader>{$t('5ed7ac10.117486')}</AtModalHeader>
        <AtModalContent>
          <View>{$t('5ed7ac10.2f99a3')}</View>
          <View>
            {ti('5ed7ac10.21434c', [pointName, deduct_point_rule.deduct_proportion_limit])}
          </View>
          <View>{$t('5ed7ac10.9b017d')}</View>
          <View>{ti('5ed7ac10.bd63ae', [deduct_point_rule.deduct_point, pointName])}</View>
        </AtModalContent>
        <AtModalAction>
          <Button
            onClick={() => {
              setState((draf) => {
                draf.isOpenRule = false
              })
            }}
          >
            {$t('5ed7ac10.fe0337')}
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
}

CompPointUse.defaultProps = {
  isOpened: false,
  disabledPoint: false,
  onClose: () => {}
}

CompPointUse.addGlobalClass = {
  addGlobalClass: true
}

export default CompPointUse
