import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { TABBAR_PATH } from '@/consts'
import { classNames, styleNames, getCurrentRoute, navigateTo } from '@/utils'
import './comp-groupbar.scss'

function CompGroupTabbar(props) {
  const handleClickShare = () => {
    console.log('点击微信分享')
  }

  return (
    <View className='comp-goodsbuytoolbar'>
      {/* <View
        className='toolbar-item'
        onClick={navigateTo.bind(this, '/pages/cart/espier-index?tabbar=0')}
      >
        <Text className='icon iconfont icon-gouwuche'></Text>
        <Text className='toolbar-item-txt'>订单管理</Text>
      </View>
      <View
        className='toolbar-item'
        onClick={navigateTo.bind(this, '/pages/cart/espier-index?tabbar=0')}
      >
        <Text className='icon iconfont icon-gouwuche'></Text>
        <Text className='toolbar-item-txt'>团管理</Text>
      </View>
      <View className='toolbar-item'>
        <View className='toolbar-item-money'>
          <SpPrice value={0} />
        </View>
        <Text className='toolbar-item-txt'>x人来过</Text>
      </View> */}
      <Button className='toolbar-item' openType='share'>
        <View className='toolbar-item-button'>
          <Text className='iconfont icon-weChat'></Text>
          <Text className='toolbar-item-button-txt'>分享</Text>
        </View>
      </Button>
    </View>
  )
}

CompGroupTabbar.options = {
  addGlobalClass: true
}

export default CompGroupTabbar
