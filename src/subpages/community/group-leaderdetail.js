import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useShareAppMessage, useDidShow, getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { SpPage, SpImage, SpButton, SpUpload, SpCell } from '@/components'
import { AtCountdown, AtButton, AtProgress } from 'taro-ui'
import { calcTimer, pickBy, log, isArray } from '@/utils'
import doc from '@/doc'
import api from '@/api'

import CompGroupTabbar from './comps/comp-groupbar'
import CompGroupNeighbour from './comps/comp-groupneighbour'
import CompGoodsItemBuy from './comps/comp-goodsitembuy'
import CompGroupLogList from './comps/comp-grouploglist'
import CompGoodsItem from './comps/comp-goodsitem'
import CompWgts from './comps/comp-wgts'

import './group-leaderdetail.scss'

const initialState = {
  detail: null,
  loading: true,
  timer: {}
}
function GroupLeaderDetail(props) {
  const $instance = getCurrentInstance()
  const { activity_id } = $instance.router.params

  const [state, setState] = useImmer(initialState)
  const { detail, loading, timer } = state
  const { userInfo = {} } = useSelector((state) => state.user)

  useDidShow(() => {
    fetchDetial()
  }, [])

  const fetchDetial = async () => {
    const res = await api.community.getChiefActivity(activity_id)
    console.log('fetchDetail:', pickBy(res, doc.community.COMMUNITY_ACTIVITY_ITEM))
    let timer = {}
    if (res.last_second > 0) {
      timer = calcTimer(res.last_second)
    }
    setState((draft) => {
      draft.detail = pickBy(res, doc.community.COMMUNITY_ACTIVITY_ITEM)
      draft.loading = false
      draft.timer = timer
    })
  }

  useShareAppMessage(() => {
    const path = `/subpages/community/group-memberdetail?activity_id=${detail.activityId}`
    log.debug(`share path: ${path}`)
    return {
      title: detail.activityName,
      // imageUrl: imgs.length > 0 ? imgs[0] : [],
      path
    }
  })

  // 点击素材
  const handleClickPic = () => {}

  // 点击分享
  const handleClickShare = () => {}

  // 加入购物车
  const handleAddCart = () => {}

  const onRefresh = () => {
    fetchDetial()
  }

  const countDownEnd = () => {
    fetchDetial()
  }

  let diffConditionMoney = 0
  if (detail) {
    const { conditionMoney, conditionType, totalFee, items } = detail
    const totalNum = items.reduce((pre, next) => pre.buyNum + next.buyNum, 0)
    if (conditionType == 'num') {
      // diffConditionMoney =
    }
  }

  return (
    <SpPage
      className='page-community-group-leaderdetail'
      loading={loading}
      renderFooter={<CompGroupTabbar info={detail} onRefresh={onRefresh} />}
    >
      <View className='page-bg'></View>
      <View className='page-body'>
        <View className='page-header'>
          <View className='user-info'>
            <SpImage
              src={detail?.chiefInfo?.chief_avatar}
              className='user-head'
              width={120}
              height={120}
              mode='aspectFit'
            />
            <Text className='user-name'>
              {detail?.chiefInfo?.chief_name || detail?.chiefInfo?.chief_mobile}
            </Text>
            {/* <View className='leader-info'>
              成员 xx <Text className='i'></Text> 跟团人次 xx
            </View> */}
          </View>
          <View className='user-info-right'>
            {/* <View className='right-item' onClick={handleClickPic.bind(this)}>
              <Text className='icon iconfont icon-gouwuche'></Text>
              <Text className='right-item-txt'>素材</Text>
            </View> */}
            {/* <View className='right-item' onClick={handleClickShare.bind(this)}>
              
              
            </View> */}

            <Button className='right-item' openType='share'>
              <Text className='iconfont icon-fenxiang-01'></Text>
              <Text className='right-item-txt'>分享</Text>
            </Button>
          </View>
          <CompGroupNeighbour info={detail?.ziti} />
          <View className='group-info'>
            <View className='head'>
              <View>
                <Text className='name'>{detail?.activityName}</Text>
                <Text className='type'>顾客自提</Text>
              </View>
              <View className='activity-status'>{detail?.activityStatusMsg}</View>
            </View>
            <View className='goods-group-info'>
              <View className='list'>
                <View className='time'>
                  {detail?.save_time && <View className='date'>{detail?.save_time} 发布</View>}
                  {detail?.save_time && timer.ss && <View className='i' />}
                  {timer?.ss && (
                    <>
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
                    </>
                  )}
                </View>
              </View>
              {detail?.order_num && (
                <View className='list'>
                  <View className='time'>
                    {/* <Text className=''>9人查看</Text> */}
                    {/* <Text className='i'></Text> */}
                    <Text className=''>{detail?.order_num}人跟团</Text>
                  </View>
                </View>
              )}
            </View>

            <View className='warning'>
              <Text className='icon iconfont icon-gouwuche'></Text>
              请先加好友或进群，确认邻居身份后再下单
            </View>

            {detail?.showCondition && (
              <View className='condition'>
                <Text>成团金额</Text>
                <AtProgress percent={20} isHidePercent />
                <Text></Text>
              </View>
            )}

            {isArray(detail?.activityPics) && (
              <View
                className='leader-concat'
                onClick={() => {
                  Taro.previewImage({
                    urls: detail?.activityPics
                  })
                }}
              >
                {detail?.activityPics.map((item) => (
                  <SpImage
                    src={item}
                    mode='aspectFit'
                    className='group-head'
                    width={200}
                    height={200}
                  />
                ))}
              </View>
            )}
          </View>
          <View className='group-foot'>
            <CompWgts info={detail?.activityIntro} />
          </View>
        </View>

        <View className='goodslist'>
          {detail?.items?.map((item) => (
            <CompGoodsItem info={item} showProgress />
          ))}
          {/* <CompGoodsItemBuy isShare isMarket isLeft isTag isSpecs></CompGoodsItemBuy>
          <CompGoodsItemBuy isShare isMarket isLeft></CompGoodsItemBuy> */}
          {/* <AtButton className='add-cart' type='primary' circle onClick={handleAddCart.bind(this)}>
            加入购物车
          </AtButton> */}
        </View>
        {detail?.orders.length > 0 && (
          <View className='joinlog'>
            <View className='title'>跟团记录</View>
            <CompGroupLogList list={detail?.orders} isLeader />
          </View>
        )}
      </View>
    </SpPage>
  )
}

GroupLeaderDetail.options = {
  addGlobalClass: true
}

export default GroupLeaderDetail
