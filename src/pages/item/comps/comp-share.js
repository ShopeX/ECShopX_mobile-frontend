import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { Button, View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpFloatLayout } from '@/components'
import './comp-share.scss'

function CompShare (props) {
  const {
    info,
    open = false,
    onClose = () => {},
    onCreatePoster = () => {},
    onShareEdit = () => {}
  } = props

  return (
    <SpFloatLayout
      className='comp-share'
      open={open}
      hideClose
      renderFooter={
        <AtButton circle className='at-button--txt' onClick={onClose}>
          取消
        </AtButton>
      }
    >
      <View className='share-bd'>
        <Button className='share-item' openType='share'>
          <SpImage src='wx_share.png' width={100} height={100} />
          <Text className='share-item-txt'>分享给好友</Text>
        </Button>
        <View className='share-item' onClick={onCreatePoster}>
          <SpImage src='wx_share.png' width={100} height={100} />
          <Text className='share-item-txt'>海报分享</Text>
        </View>
        <View className='share-item' onClick={onShareEdit}>
          <SpImage src='wx_share.png' width={100} height={100} />
          <Text className='share-item-txt'>分享编辑</Text>
        </View>
      </View>
    </SpFloatLayout>
  )
}

CompShare.options = {
  addGlobalClass: true
}

export default CompShare
