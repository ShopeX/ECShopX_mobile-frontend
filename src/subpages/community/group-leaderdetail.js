/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useShareAppMessage, useDidShow, getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { SpPage, SpImage, SpButton, SpUpload, SpCell } from '@/components'
import { AtCountdown, AtButton, AtProgress } from 'taro-ui'
import { calcTimer, pickBy, log, isArray, buildSharePath } from '@/utils'
import doc from '@/subpages/doc'
import api from '@/api'
import * as communityApi from '@/api/community'
import { useTranslation, $t, ti } from '@/i18n'

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
  timer: {},
  shareImageUrl: ''
}
function GroupLeaderDetail(props) {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const { activity_id } = $instance?.router?.params

  const [state, setState] = useImmer(initialState)
  const { detail, loading, timer, shareImageUrl } = state
  const { userInfo = {} } = useSelector((state) => state.user)

  useDidShow(() => {
    fetchDetial()
  }, [])

  const fetchDetial = async () => {
    const res = await communityApi.getChiefActivity(activity_id)
    console.log('fetchDetail:', pickBy(res, doc.community.COMMUNITY_ACTIVITY_ITEM))
    let timer = {}
    if (res.last_second > 0) {
      timer = calcTimer(res.last_second)
    }
    setState((draft) => {
      draft.detail = pickBy(res, doc.community.COMMUNITY_ACTIVITY_ITEM)
      draft.loading = false
      ;(draft.timer = timer), (draft.shareImageUrl = res.share_image_url)
    })
  }

  useShareAppMessage(() => {
    const path = buildSharePath('poster_community_memberdetail', { activity_id: detail.activityId })
    log.debug(`share path: ${path}`)
    return {
      imageUrl: shareImageUrl,
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

  const countDownFormat = useMemo(
    () => ({
      day: $t('934ffec2.249aba'),
      hours: ':',
      minutes: ':',
      seconds: ''
    }),
    [i18n.language]
  )

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
              <Text className='right-item-txt'>{$t('934ffec2.c31f48')}</Text>
            </Button>
          </View>
          <CompGroupNeighbour info={detail?.ziti} />
          <View className='group-info'>
            <View className='head'>
              <View>
                <Text className='name'>{detail?.activityName}</Text>
                <Text className='type'>{$t('934ffec2.b30d27')}</Text>
              </View>
              <View className='activity-status'>{detail?.activityStatusMsg}</View>
            </View>
            <View className='goods-group-info'>
              <View className='list'>
                <View className='time'>
                  {detail?.save_time && (
                    <View className='date'>{ti('934ffec2.3c7da9', [detail.save_time])}</View>
                  )}
                  {detail?.save_time && timer.ss && <View className='i' />}
                  {timer?.ss && (
                    <>
                      <View className='countdown'>
                        <AtCountdown
                          format={countDownFormat}
                          isShowDay={timer.dd > 0}
                          day={timer.dd}
                          hours={timer.hh}
                          minutes={timer.mm}
                          seconds={timer.ss}
                          onTimeUp={countDownEnd}
                        />
                      </View>
                      {$t('934ffec2.23a300')}
                    </>
                  )}
                </View>
              </View>
              {detail?.order_num && (
                <View className='list'>
                  <View className='time'>
                    {/* <Text className=''>9人查看</Text> */}
                    {/* <Text className='i'></Text> */}
                    <Text className=''>{ti('934ffec2.165340', [detail?.order_num])}</Text>
                  </View>
                </View>
              )}
            </View>

            <View className='warning'>
              <Text className='icon iconfont icon-gouwuche'></Text>
              {$t('934ffec2.598baf')}
            </View>

            {detail?.showCondition && (
              <View className='condition-wrap'>
                <View className='condition'>
                  <View className='condition-label'>
                    <Text>{$t('934ffec2.bc4708')}</Text>
                    <Text>
                      {detail.diffCondition <= 0
                        ? $t('934ffec2.9cbc7c')
                        : ti('934ffec2.cf413c', [detail.diffCondition])}
                    </Text>
                  </View>
                  <AtProgress percent={detail.progressValue} isHidePercent />
                </View>
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
            <View className='title'>{$t('934ffec2.c13dcb')}</View>
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
