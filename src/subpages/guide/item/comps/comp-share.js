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
import { Button, View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpFloatLayout } from '@/components'
import './comp-share.scss'

function CompShare(props) {
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
          <SpImage src='save.png' width={100} height={100} />
          <Text className='share-item-txt'>海报分享</Text>
        </View>
      </View>
    </SpFloatLayout>
  )
}

CompShare.options = {
  addGlobalClass: true
}

export default CompShare
