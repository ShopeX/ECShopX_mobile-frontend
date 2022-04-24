import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage, SpButton, SpUpload, SpCell } from '@/components'
import { AtInput, AtButton, AtProgress } from 'taro-ui'
import './group-leaderdetail.scss'
import { classNames } from '@/utils'

import CompGroupTabbar from './comps/comp-groupbar'
import CompGroupNeighbour from './comps/comp-groupneighbour'
import CompGoodsItemBuy from './comps/comp-goodsitembuy'
import CompGroupLogList from './comps/comp-grouploglist'

function GroupLeaderDetail(props) {
  // 点击素材
  const handleClickPic = () => {}

  // 点击分享
  const handleClickShare = () => {}

  // 加入购物车
  const handleAddCart = () => {}

  return (
    <SpPage
      className='page-community-group-leaderdetail'
      renderFooter={<CompGroupTabbar></CompGroupTabbar>}
    >
      <View className='page-bg'></View>
      <View className='page-body'>
        <View className='page-header'>
          <View className='user-info'>
            <SpImage className='user-head' width={120} height={120} />
            <Text className='user-name'>xxx</Text>
            <View className='leader-info'>
              成员 xx <Text className='i'></Text> 跟团人次 xx
            </View>
          </View>
          <View className='user-info-right'>
            <View className='right-item' onClick={handleClickPic.bind(this)}>
              <Text className='icon iconfont icon-gouwuche'></Text>
              <Text className='right-item-txt'>素材</Text>
            </View>
            <View className='right-item' onClick={handleClickShare.bind(this)}>
              <Text className='icon iconfont icon-gouwuche'></Text>
              <Text className='right-item-txt'>分享</Text>
            </View>
          </View>
          <CompGroupNeighbour></CompGroupNeighbour>
          <View className='group-info'>
            <View className='head'>
              <Text className='name'>测试团购</Text>
              <Text className='type'>顾客自提</Text>
            </View>

            <View className='list'>
              <View className='time'>
                <Text className=''>昨天 发布</Text>
                <Text className='i'></Text>
                <Text className='countdown'>5天22:22:40 后结束</Text>
              </View>
            </View>
            <View className='list'>
              <View className='time'>
                <Text className=''>9人查看</Text>
                <Text className='i'></Text>
                <Text className=''>14人跟团</Text>
              </View>
            </View>

            <View className='warning'>
              <Text className='icon iconfont icon-gouwuche'></Text>
              请先加好友或进群，确认邻居身份后再下单
            </View>
            <SpImage className='group-head' width={200} height={200} />
          </View>
          <View className='group-foot'>测试测试</View>
        </View>

        <View className='goodslist'>
          <CompGoodsItemBuy isShare isMarket isLeft isTag isSpecs></CompGoodsItemBuy>
          <CompGoodsItemBuy isShare isMarket isLeft></CompGoodsItemBuy>
          <AtButton className='add-cart' type='primary' circle onClick={handleAddCart.bind(this)}>
            加入购物车
          </AtButton>
        </View>

        <View className='joinlog'>
          <View className='title'>跟团记录</View>
          <CompGroupLogList isLeader></CompGroupLogList>
        </View>
      </View>
    </SpPage>
  )
}

GroupLeaderDetail.options = {
  addGlobalClass: true
}

export default GroupLeaderDetail
