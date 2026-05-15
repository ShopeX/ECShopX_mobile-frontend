/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
import { SpFloatLayout, SpPrice } from '@/components'
import { useSelector } from 'react-redux'
import { TABBAR_PATH } from '@/consts'
import { useImmer } from 'use-immer'
import { navigateTo } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import { AtModal } from 'taro-ui'
import api from '@/api'
import * as communityApi from '@/api/community'

import './comp-groupbar.scss'

const initialState = {
  isFloatOpened: false,
  isModalOpend: false,
  modalContent: '',
  activity_status: ''
}
function CompGroupTabbar(props) {
  useTranslation()
  const { info = {}, onRefresh = () => {} } = props
  const [state, setState] = useImmer(initialState)

  const { isFloatOpened, modalContent, isModalOpend, activity_status } = state

  const handleClickShare = () => {
    console.log('点击微信分享')
  }

  const onClickChange = (isFloatOpened) => {
    if (info?.buttons.length <= 0) return
    setState((draft) => {
      draft.isFloatOpened = isFloatOpened
    })
  }

  const onClickItem = (type) => {
    if (type === 'edit') {
      Taro.redirectTo({
        url: `/subpages/community/group?id=${info.activityId}`
      })
    } else if (type === 'success' || type === 'fail') {
      setState((draft) => {
        draft.isModalOpend = true
        draft.modalContent = type === 'success' ? $t('bfa95be3.8b332a') : $t('bfa95be3.279eda')
        draft.activity_status = type
      })
    }
    setState((draft) => {
      draft.isFloatOpened = false
    })
  }

  const handleClose = () => {
    setState((draft) => {
      draft.isModalOpend = false
      draft.modalContent = ''
      draft.activity_status = ''
    })
  }

  const handleConfirm = async () => {
    communityApi.updateActivityStatus(info.activityId, { activity_status }).then((res) => {
      onRefresh()
    })
    handleClose()
  }

  return (
    <View className='comp-goodsbuytoolbar'>
      <View
        className='toolbar-item'
        onClick={navigateTo.bind(
          this,
          `/subpages/community/order-manage?activity_id=${info?.activityId}`
        )}
      >
        <Text className='icon iconfont icon-dingdan'></Text>
        <Text className='toolbar-item-txt'>{$t('bfa95be3.afcd11')}</Text>
      </View>
      {info?.buttons.length > 0 && (
        <View className='toolbar-item' onClick={() => onClickChange(true)}>
          <Text className='icon iconfont icon-quanbu'></Text>
          <Text className='toolbar-item-txt'>{$t('bfa95be3.858b83')}</Text>
        </View>
      )}
      {/* <View className='toolbar-item'>
        <View className='toolbar-item-money'>
          <SpPrice value={0} />
        </View>
        <Text className='toolbar-item-txt'>x人来过</Text>
      </View> */}
      <Button className='toolbar-item btn-share' openType='share'>
        <View className='toolbar-item-button'>
          <Text className='iconfont icon-weChat'></Text>
          <Text className='toolbar-item-button-txt'>{$t('934ffec2.c31f48')}</Text>
        </View>
      </Button>
      <SpFloatLayout hideClose open={isFloatOpened} onClose={() => onClickChange(false)}>
        {info?.buttons.map((item, idx) => (
          <View key={idx}>
            {item == 'update' && (
              <View onClick={() => onClickItem('edit')} className='toolbar-list'>
                {$t('bfa95be3.7a5ed5')}
              </View>
            )}
            {item == 'success' && (
              <View onClick={() => onClickItem('success')} className='toolbar-list'>
                {$t('bfa95be3.60bc68')}
              </View>
            )}
            {item == 'fail' && (
              <View onClick={() => onClickItem('fail')} className='toolbar-list'>
                {$t('bfa95be3.06e6f5')}
              </View>
            )}
          </View>
        ))}
        <View onClick={() => onClickItem('close')} className='toolbar-list cancel'>
          {$t('61e2d21a.625fb2')}
        </View>
      </SpFloatLayout>
      <AtModal
        isOpened={isModalOpend}
        cancelText={$t('61e2d21a.625fb2')}
        confirmText={$t('61e2d21a.e83a25')}
        onClose={handleClose}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        content={modalContent}
      />
    </View>
  )
}

CompGroupTabbar.options = {
  addGlobalClass: true
}

export default CompGroupTabbar
