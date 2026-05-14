/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { Button, View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpFloatLayout } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './comp-share.scss'

function CompShare(props) {
  useTranslation()
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
          {$t('445f2a5d.625fb2')}
        </AtButton>
      }
    >
      <View className='share-bd'>
        <Button className='share-item' openType='share'>
          <SpImage src='wx_share.png' width={100} height={100} />
          <Text className='share-item-txt'>{$t('445f2a5d.2f8efe')}</Text>
        </Button>
        <View className='share-item' onClick={onCreatePoster}>
          <SpImage src='save.png' width={100} height={100} />
          <Text className='share-item-txt'>{$t('445f2a5d.8f9782')}</Text>
        </View>
        <View className='share-item' onClick={onShareEdit}>
          <SpImage src='share_edit.png' width={100} height={100} />
          <Text className='share-item-txt'>{$t('445f2a5d.fd8843')}</Text>
        </View>
      </View>
    </SpFloatLayout>
  )
}

CompShare.options = {
  addGlobalClass: true
}

export default CompShare
