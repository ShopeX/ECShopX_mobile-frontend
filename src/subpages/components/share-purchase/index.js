/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { Button, View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpFloatLayout } from '@/components'
import './index.scss'

function CompSharePurchase(props) {
  const { open = false, onClose = () => {}, onCreatePoster = () => {} } = props

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
          <SpImage src={`${process.env.APP_IMAGE_CDN}/icon-wechat.png`} width={134} height={122} />
          <Text className='share-item-txt'>微信好友</Text>
        </Button>
        <View className='share-item' onClick={onCreatePoster}>
          <SpImage src={`${process.env.APP_IMAGE_CDN}/icon-share.png`} width={134} height={122} />
          <Text className='share-item-txt'>分享海报</Text>
        </View>
      </View>
    </SpFloatLayout>
  )
}

CompSharePurchase.options = {
  addGlobalClass: true
}

export default CompSharePurchase
