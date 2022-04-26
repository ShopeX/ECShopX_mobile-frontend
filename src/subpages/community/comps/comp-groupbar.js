import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
import { SpFloatLayout, SpPrice, SpModal } from '@/components'
import { useSelector } from 'react-redux'
import { TABBAR_PATH } from '@/consts'
import { useImmer } from 'use-immer'
import { navigateTo } from '@/utils'
import { AtModal } from 'taro-ui'
import api from '@/api'

import './comp-groupbar.scss'

const initialState = {
  isFloatOpened: false,
  isModalOpend: false,
  modalContent: '',
  activity_status: ''
}
function CompGroupTabbar(props) {
  const { info = {}, onRefresh = () => {} } = props
  const [state, setState] = useImmer(initialState)

  const { isFloatOpened, modalContent, isModalOpend, activity_status } = state

  const handleClickShare = () => {
    console.log('点击微信分享')
  }

  const onClickChange = (isFloatOpened) => {
    setState((draft) => {
      draft.isFloatOpened = isFloatOpened
    })
  }

  const onClickItem = (type) => {
    if (type === 'edit') {
      Taro.navigateTo({
        url: `/subpages/community/group?id=${info.activityId}`
      })
    } else if (type === 'success' || type === 'fail') {
      setState((draft) => {
        draft.isModalOpend = true
        draft.modalContent = type === 'success' ? '您确定要成团吗？' : '您确定要取消团吗？'
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
    api.community.updateActivityStatus(info.activityId, { activity_status }).then((res) => {
      onRefresh()
    })
    handleClose()
  }

  return (
    <View className='comp-goodsbuytoolbar'>
      <View
        className='toolbar-item'
        onClick={navigateTo.bind(this, '/subpages/community/order-manage')}
      >
        <Text className='icon iconfont icon-gouwuche'></Text>
        <Text className='toolbar-item-txt'>订单管理</Text>
      </View>
      {info?.isActivityAuthor && (
        <View className='toolbar-item' onClick={() => onClickChange(true)}>
          <Text className='icon iconfont icon-gouwuche'></Text>
          <Text className='toolbar-item-txt'>团管理</Text>
        </View>
      )}
      <View className='toolbar-item'>
        <View className='toolbar-item-money'>
          <SpPrice value={0} />
        </View>
        <Text className='toolbar-item-txt'>x人来过</Text>
      </View>
      <Button className='toolbar-item btn-share' openType='share'>
        <View className='toolbar-item-button'>
          <Text className='iconfont icon-weChat'></Text>
          <Text className='toolbar-item-button-txt'>分享</Text>
        </View>
      </Button>
      <SpFloatLayout hideClose open={isFloatOpened} onClose={() => onClickChange(false)}>
        <View onClick={() => onClickItem('edit')} className='toolbar-list'>
          修改团信息
        </View>
        <View onClick={() => onClickItem('success')} className='toolbar-list'>
          立即成团
        </View>
        <View onClick={() => onClickItem('fail')} className='toolbar-list'>
          取消团
        </View>
        <View onClick={() => onClickItem('close')} className='toolbar-list cancel'>
          取消
        </View>
      </SpFloatLayout>
      <AtModal
        isOpened={isModalOpend}
        cancelText='取消'
        confirmText='确认'
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
