import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage, SpButton, SpUpload, SpCell } from '@/components'
import { AtInput, AtButton } from 'taro-ui'
import './group.scss'

function Group(props) {
  const savePreview = () => {}

  const releaseGroup = () => {}

  return (
    <SpPage
      className='page-community-group'
      renderFooter={
        <View className='btn-group'>
          <SpButton
            resetText='保存并预览'
            confirmText='发布团购'
            onConfirm={savePreview}
            onReset={releaseGroup}
          ></SpButton>
        </View>
      }
    >
      <View className='page-header'>
        <View className='user-info'>
          <SpImage width={120} height={120} />
          <Text className='user-name'>xxx</Text>
        </View>
      </View>
      <View className='card-block'>
        <View className='card-block-hd'>团购介绍</View>
        <View className='card-block-bd'>
          <AtInput placeholder='请输入团购活动标题' />
          <View className='tip'>添加群或个人微信二维码，方便团员取得联系</View>

          <View className="teamhead-barcode">
            <SpUpload />
          </View>
          <View className='info-list'></View>
        </View>
        <View className='card-block-ft'></View>
      </View>
      <View className="card-block">
        <View className='card-block-hd'>团购商品</View>
      </View>

      <View className="card-block">
        <View className='card-block-hd'>团购设置</View>
        <View className='card-block-bd'>
          <SpCell border title="选择服务小区" isLink/>
          <SpCell border title="需要用户填写信息" isLink/>
          <SpCell border title="团购时间" isLink/>
          <SpCell border title="周围邻居是否可见" isLink/>
        </View>
      </View>
    </SpPage>
  )
}

Group.options = {
  addGlobalClass: true
}

export default Group
