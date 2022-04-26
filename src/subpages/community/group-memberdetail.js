import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { SpPage, SpImage, SpPrice, SpHtml } from '@/components'
import { AtCountdown } from 'taro-ui'
import { useImmer } from 'use-immer'
import api from '@/api'
import { isArray, navigateTo, calcTimer } from '@/utils'

import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '@/pages/home/wgts'

import CompGoodsItemBuy from './comps/comp-goodsitembuy'
import CompGroupLogList from './comps/comp-grouploglist'

import './group-memberdetail.scss'

const initialState = {
  info: {},
  timer: {}
}

function GroupLeaderDetail(props) {
  const [state, setState] = useImmer(initialState)

  const { info, timer } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const info = await api.community.getActiveDetail(1)
    let timer = null
    if (info.last_second > 0) {
      timer = calcTimer(info.last_second)
    }
    setState((draft) => {
      draft.info = info
      draft.timer = timer
    })
  }

  // 点击素材
  const handleClickPic = () => {}

  // 点击分享
  const handleClickShare = () => {}

  const handleClickBuy = () => {}

  const countDownEnd = () => {
    fetch()
  }

  const onNumChange = ({ itemId }, goodsIdx, goodsNum) => {
    console.log(itemId, goodsIdx, goodsNum)
  }

  return (
    <SpPage
      className='page-group-memberdetail'
      renderFooter={
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
              <SpPrice value={0} />
            </View>
            <Text className='toolbar-item-buy-txt'>跟团购买</Text>
          </View>
        </View>
      }
    >
      {/* 头部背景 */}
      <View className='page-bg'></View>

      <View className='page-body'>
        {/* 团长信息 */}
        <View className='page-header'>
          <View className='user-info'>
            <SpImage
              src={info.chief_info && info.chief_info.chief_avatar}
              className='user-head'
              width={120}
              height={120}
            />
            <Text className='user-name'>{info.chief_info && info.chief_info.chief_name}</Text>
          </View>
          <View className='user-info-right'>
            <View className='right-item' onClick={handleClickPic.bind(this)}>
              <Text className='icon iconfont icon-weixin'></Text>
              <Text className='right-item-txt'>朋友圈</Text>
            </View>
            <View className='right-item' onClick={handleClickShare.bind(this)}>
              <Text className='icon iconfont icon-fenxiang-01'></Text>
              <Text className='right-item-txt'>分享</Text>
            </View>
          </View>
        </View>
        {info.chief_info && info.chief_info.chief_desc && (
          <View className='leader'>
            <View className='title'>团长介绍</View>
            <View className='des'>
              {info.chief_info.chief_desc}
              <Text className='icon iconfont icon-arrowRight'></Text>
            </View>
          </View>
        )}

        {/* 本团信息 */}
        <View className='group'>
          <View className='group-title'>{info.activity_name}</View>
          <View className='group-type'>自提</View>
          <View className='group-info'>
            <View className='left'>
              <View className='title'>本团</View>
              <View className='title'>商品</View>
            </View>
            <View className='right'>
              <ScrollView className='scroll-goods' scrollX>
                {info.items &&
                  info.items.map((item, idx) => (
                    <View className='goods' key={idx}>
                      <View className='goods-imgbox'>
                        <Image
                          src={item.item_pics || item.pics[0]}
                          className='goods-img'
                          lazyLoad
                        />
                      </View>
                      <View className='goods-descp-box'>
                        <View className='goods-descp'>{item.item_name}</View>
                        <View className='goods-descp'>
                          <SpPrice primary value={item.price} unit='cent' size={26} />
                        </View>
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </View>
          </View>
          <View className='goods-group-info'>
            <View className='list'>
              <View className='time'>
                <View className='date'>{info.save_time} 发布</View>
                <View className='i'></View>
                <View className='countdown'>
                  <AtCountdown
                    format={{ day: '天', hours: ':', minutes: ':', seconds: '' }}
                    isShowDay={timer.dd > 0}
                    day={timer.dd}
                    hours={timer.hh}
                    minutes={timer.mm}
                    seconds={timer.ss}
                    onTimeUp={countDownEnd}
                  />
                </View>
                后结束
              </View>
            </View>
            <View className='list'>
              <View className='time'>
                {/* <Text className=''>9人查看</Text> */}
                {/* <Text className='i'></Text> */}
                <Text className=''>{info.order_num}人跟团</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='goods-desc'>
          <View className='desc-hd'>
            <Text className='desc-title'>宝贝详情</Text>
          </View>
          {isArray(info.activity_intro) ? (
            <View>
              {info.activity_intro.map((item, idx) => (
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
            <SpHtml content={info.activity_intro} />
          )}
        </View>

        {info.items && (
          <View className='goodslist'>
            {info.items.map((goods, goodsIdx) => (
              <CompGoodsItemBuy
                isShare={false}
                key={goodsIdx}
                info={goods}
                isMarket={false}
                isLeft={false}
                isTag={false}
                onClick={(e) => onNumChange(goods, goodsIdx, e)}
              />
            ))}
          </View>
        )}

        {/* 跟团记录 */}
        <View className='joinlog'>
          <View className='title'>跟团记录</View>
          <CompGroupLogList />
        </View>
      </View>
    </SpPage>
  )
}

GroupLeaderDetail.options = {
  addGlobalClass: true
}

export default GroupLeaderDetail
