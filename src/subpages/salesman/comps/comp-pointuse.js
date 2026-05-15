/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtButton } from 'taro-ui'
import { useSelector } from 'react-redux'
import { SpNumberKeyBoard, SpFloatLayout } from '@/components'
import { $t, ti, useTranslation } from '@/i18n'
import { View, Text, Button } from '@tarojs/components'
import './comp-pointuse.scss'

const initialState = {
  isOpenRule: false
}

function CompPointUse(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, onClose, onChange } = props
  const { pointName } = useSelector((state) => state.sys)
  const { isOpenRule } = state

  if (!info) {
    return null
  }

  const { deduct_point_rule = {} } = info

  return (
    <View className='comp-pointuse'>
      <SpFloatLayout className='point-float-layout' open={isOpened} hideClose>
        <View className='point-hd'>
          <View className='point-info'>
            {ti('b37d087a.c00678', [pointName, info.user_point, info.max_point])}
          </View>
          <Text
            className='point-rule'
            onClick={() => {
              setState((draf) => {
                draf.isOpenRule = true
              })
            }}
          >
            {$t('b37d087a.1ebbd6')}
          </Text>
        </View>
        <SpNumberKeyBoard
          maxValue={info.max_point}
          value={info.user_point}
          onClose={onClose}
          onConfirm={onChange}
        />
      </SpFloatLayout>

      <AtModal isOpened={isOpenRule}>
        <AtModalHeader>{ti('b37d087a.ee9ad7', [pointName])}</AtModalHeader>
        <AtModalContent>
          <View>{$t('b37d087a.2f99a3')}</View>
          <View>
            {ti('b37d087a.21434c', [pointName, deduct_point_rule.deduct_proportion_limit ?? ''])}
          </View>
          <View>{$t('b37d087a.9b017d')}</View>
          <View>{ti('b37d087a.2ead76', [pointName, deduct_point_rule.deduct_point ?? ''])}</View>
        </AtModalContent>
        <AtModalAction>
          <Button
            onClick={() => {
              setState((draf) => {
                draf.isOpenRule = false
              })
            }}
          >
            {$t('edc703ce.ce2695')}
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
