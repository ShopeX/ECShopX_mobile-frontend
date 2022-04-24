import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage, SpPrice, SpHtml } from '@/components'
import { AtButton, } from 'taro-ui'
import { isArray, classNames, navigateTo, } from '@/utils'

import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '@/pages/home/wgts'

import CompGoodsItemBuy from './comps/comp-goodsitembuy'
import CompGroupLogList from './comps/comp-grouploglist'

import './group-memberdetail.scss'

function GroupLeaderDetail(props) {
  const [info, setInfo] = useState({
    intro: '详情'
  })
  // 点击素材
  const handleClickPic = () => { }

  // 点击分享
  const handleClickShare = () => { }

  const handleClickBuy = () => {

  }



  return (
    <SpPage className='page-group-memberdetail' renderFooter={
      <View className='comp-goodsbuytoolbar'>
        <View
          className='toolbar-item'
          onClick={navigateTo.bind(this, '/pages/cart/espier-index?tabbar=0')}
        >
          <Text className='icon iconfont icon-gouwuche'></Text>
          <Text className='toolbar-item-txt'>订单</Text>
        </View>
        <View
          className='toolbar-item'
          onClick={navigateTo.bind(this, '/pages/cart/espier-index?tabbar=0')}
        >
          <Text className='icon iconfont icon-gouwuche'></Text>
          <Text className='toolbar-item-txt'>购物车</Text>
        </View>
        <View className='toolbar-item toolbar-item-buy' onClick={handleClickBuy.bind(this)}>
          <View className='price'>
            <SpPrice
              value={0}
            />
          </View>
          <Text className='toolbar-item-buy-txt'>跟团购买</Text>
        </View>
      </View>}
    >
      {/* 头部背景 */}
      <View className='page-bg'></View>

      <View className='page-body'>
        {/* 团长信息 */}
        <View className='page-header'>
          <View className='user-info'>
            <SpImage className='user-head' width={120} height={120} />
            <Text className='user-name'>xxx</Text>
          </View>
          <View className='user-info-right'>
            <View className='right-item' onClick={handleClickPic.bind(this)}>
              <Text className='icon iconfont icon-gouwuche'></Text>
              <Text className='right-item-txt'>朋友圈</Text>
            </View>
            <View className='right-item' onClick={handleClickShare.bind(this)}>
              <Text className='icon iconfont icon-gouwuche'></Text>
              <Text className='right-item-txt'>分享</Text>
            </View>
          </View>
        </View>

        <View className='leader'>
          <View className='title'>
            团长介绍
          </View>
          <View className='des'>
            团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍 团长介绍
            <Text className='icon iconfont icon-arrowRight'></Text>
          </View>
        </View>

        {/* 本团信息 */}
        <View className='group'>
          <View className='group-title'>
            【1-3天送到】
          </View>
          <View className='group-type'>
            快递
          </View>
          <View className='group-info'>
            <View className='left'>
              <View className='title'>
                本团
              </View>
              <View className='title'>
                商品
              </View>
            </View>
            <View className='goods'>
              <View className='goods-img'>
                <SpImage className='group-head' width={100} height={100} />
              </View>
              <View className='goods-info'>
                <View className='goods-info__name'>
                  肉肉
                </View>
                <View className='goods-info__price'>
                  <View className='price'>
                    <SpPrice
                      value={0}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className='goods-group-info'>
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

          </View>
        </View>

        <View className='goods-desc'>
          <View className='desc-hd'>
            <Text className='desc-title'>宝贝详情</Text>
          </View>
          {isArray(info.intro) ? (
            <View>
              {info.intro.map((item, idx) => (
                <View className='wgt-wrap' key={`wgt-wrap__${idx}`}>
                  {item.name === 'film' && <WgtFilm info={item} />}
                  {item.name === 'slider' && <WgtSlider info={item} />}
                  {item.name === 'writing' && <WgtWriting info={item} />}
                  {item.name === 'heading' && <WgtHeading info={item} />}
                  {item.name === 'goods' && <WgtGoods info={item} />}
                </View>
              ))}
            </View>
          ) : (
            <SpHtml content={info.intro} />
          )}
        </View>

        <View className='goodslist'>
          <CompGoodsItemBuy isShare={false} isMarket={false} isLeft={false} isTag={false}></CompGoodsItemBuy>
        </View>

        {/* 跟团记录 */}
        <View className='joinlog'>
          <View className='title'>
            跟团记录
          </View>
          <CompGroupLogList></CompGroupLogList>
        </View>

      </View>
    </SpPage>
  )
}

GroupLeaderDetail.options = {
  addGlobalClass: true
}

export default GroupLeaderDetail
