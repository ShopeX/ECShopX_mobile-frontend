import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Button } from '@tarojs/components'
import { SpPage, SpImage, SpPrice, SpFloatLayout, SpInputNumber } from '@/components'
import { AtButton, AtCountdown } from 'taro-ui'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import api from '@/api'
import { isArray, navigateTo, calcTimer, pickBy, showToast } from '@/utils'

import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '@/pages/home/wgts'

import CompGoodsItemBuy from './comps/comp-goodsitembuy'
import CompGroupLogList from './comps/comp-grouploglist'
import CompGroupNeighbour from './comps/comp-groupneighbour'
import CompWgts from './comps/comp-wgts'

import './group-memberdetail.scss'

const initialState = {
  info: null,
  timer: {},
  loading: true,
  chiefInfo: null,
  items: [],
  isOpened: false,
  activeIndex: null
}

function GroupLeaderDetail(props) {
  const $instance = getCurrentInstance()
  const { activity_id } = $instance.router.params
  const [state, setState] = useImmer(initialState)

  const { info, timer, loading, chiefInfo, items, isOpened, activeIndex } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const info = await api.community.getActiveDetail(activity_id)

    let timer = null
    if (info.last_second > 0) {
      timer = calcTimer(info.last_second)
    }
    console.log(`group-memberdetail:`, pickBy(info, doc.community.COMMUNITY_ACTIVITY_ITEM))
    const res = pickBy(info, doc.community.COMMUNITY_ACTIVITY_ITEM)
    const { chiefInfo, items } = res
    setState((draft) => {
      draft.info = res
      draft.chiefInfo = chiefInfo
      draft.items = items
      draft.timer = timer
      draft.loading = false
    })
  }

  // 点击素材
  const handleClickPic = () => {}

  const handleClickBuy = () => {
    let tempItems = []
    items.forEach((item) => {
      // 多规格
      if (!item.nospec) {
        item.specItems.forEach((spec) => {
          if (spec.num > 0) {
            tempItems.push({
              item_id: spec.itemId,
              num: spec.num
            })
          }
        })
      } else if (item.num > 0) {
        tempItems.push({
          item_id: item.itemId,
          num: item.num
        })
      }
    })
    if (tempItems.length == 0) {
      return showToast('请选择购买商品')
    }
    const goodsItems = JSON.stringify(tempItems)
    Taro.navigateTo({
      url: `/subpages/community/espier-checkout?activity_id=${activity_id}&items=${goodsItems}`
    })
  }

  const countDownEnd = () => {
    fetch()
  }

  const onNumChange = (idx, goodsNum) => {
    const _items = JSON.parse(JSON.stringify(items))
    _items[idx].num = goodsNum
    setState((draft) => {
      draft.items = _items
    })
  }

  const onSkuNumChange = (idx, num) => {
    const _items = JSON.parse(JSON.stringify(items))
    _items[activeIndex].specItems[idx].num = num
    setState((draft) => {
      draft.items = _items
    })
  }

  const onChangeSku = (index) => {
    setState((draft) => {
      draft.activeIndex = index
      draft.isOpened = true
    })
  }

  return (
    <SpPage
      className='page-group-memberdetail'
      loading={loading}
      renderFooter={
        <View className='goodsbuytoolbar'>
          <View
            className='toolbar-item'
            onClick={navigateTo.bind(
              this,
              `/subpages/community/order?activity_id=${info?.activityId}`
            )}
          >
            <Text className='icon iconfont icon-dingdan' />
            <Text className='toolbar-item-txt'>订单</Text>
          </View>
          {/* <View
            className='toolbar-item'
            onClick={navigateTo.bind(this, '/pages/cart/espier-index?tabbar=0')}
          >
            <Text className='icon iconfont icon-gouwuche'></Text>
            <Text className='toolbar-item-txt'>购物车</Text>
          </View> */}
          <View className='btn-buy-wrap'>
            <AtButton
              disabled={!info?.showBuy}
              circle
              type='primary'
              onClick={handleClickBuy.bind(this)}
            >
              <View className='btn-buy'>
                {/* <SpPrice value={0} /> */}
                <Text>跟团购买</Text>
              </View>
            </AtButton>
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
            <SpImage src={chiefInfo?.chief_avatar} className='user-head' width={120} height={120} />
            <Text className='user-name'>
              {chiefInfo?.chief_name || info?.chiefInfo?.chief_mobile}
            </Text>
          </View>
          <View className='user-info-right'>
            {/* <View className='right-item' onClick={handleClickPic.bind(this)}>
              <Text className='icon iconfont icon-weixin'></Text>
              <Text className='right-item-txt'>朋友圈</Text>
            </View> */}
            <Button className='right-item' openType='share'>
              <Text className='iconfont icon-fenxiang-01'></Text>
              <Text className='right-item-txt'>分享</Text>
            </Button>
          </View>
        </View>
        {chiefInfo?.chief_desc && (
          <View className='leader'>
            <View className='title'>团长介绍</View>
            <View className='des'>
              {chiefInfo.chief_desc}
              <Text className='icon iconfont icon-arrowRight'></Text>
            </View>
          </View>
        )}

        <View className='warning'>
          <Text className='icon iconfont icon-gouwuche'></Text>
          请先加好友或进群，确认邻居身份后再下单
        </View>
        {isArray(info?.activityPics) && (
          <View
            className='leader-concat'
            onClick={() => {
              Taro.previewImage({
                urls: info?.activityPics
              })
            }}
          >
            {info?.activityPics.map((item) => (
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

        <CompGroupNeighbour info={info?.ziti} />

        {/* 本团信息 */}
        <View className='group'>
          <View className='group-hd'>
            <View className='group-name'>
              <Text className='group-title'>{info?.activityName}</Text>
              <Text className='group-type'>自提</Text>
            </View>
            <View className='activity-status'>{info?.activityStatusMsg}</View>
          </View>

          <View className='group-info'>
            <View className='left'>
              <View className='title'>本团</View>
              <View className='title'>商品</View>
            </View>
            <View className='right'>
              <ScrollView className='scroll-goods' scrollX>
                {info?.items?.map((item, idx) => (
                  <View className='goods' key={idx}>
                    <View className='goods-imgbox'>
                      <Image src={item.pic} className='goods-img' lazyLoad />
                    </View>
                    <View className='goods-descp-box'>
                      <View className='goods-descp'>{item.itemName}</View>
                      <View className='goods-descp'>
                        <SpPrice primary value={item.price} size={26} />
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
                {info?.save_time && <View className='date'>{info?.save_time} 发布</View>}
                {info?.save_time && timer.ss && <View className='i' />}
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
            <View className='list'>
              <View className='time'>
                {/* <Text className=''>9人查看</Text> */}
                {/* <Text className='i'></Text> */}
                {info?.order_num && <Text className=''>{info?.order_num}人跟团</Text>}
              </View>
            </View>
          </View>
        </View>

        <View className='goods-desc'>
          <View className='desc-hd'>
            <Text className='desc-title'>宝贝详情</Text>
          </View>
          <CompWgts info={info?.activityIntro} />
        </View>

        <View className='goodslist'>
          {info?.showChiefGoodsList === 1 && (
            <View
              className='btn-viewmore'
              onClick={() => {
                Taro.navigateTo({
                  url: `/subpages/community/list?chief_id=${info.chiefId}&distributor_id=${info.distributorId}`
                })
              }}
            >
              查看平台所有商品
            </View>
          )}
          {items?.map((goods, index) => (
            <CompGoodsItemBuy
              info={goods}
              onChange={onNumChange.bind(this, index)}
              onChangeSku={onChangeSku.bind(this, index)}
            />
          ))}
        </View>

        {/* 跟团记录 */}
        {info?.orders.length > 0 && (
          <View className='joinlog'>
            <View className='title'>跟团记录</View>
            <CompGroupLogList list={info?.orders} />
          </View>
        )}
      </View>

      {/* sku选择 */}
      <SpFloatLayout
        hideClose
        open={isOpened}
        renderFooter={
          <AtButton
            circle
            type='primary'
            onClick={() => {
              setState((draft) => {
                draft.isOpened = false
              })
            }}
          >
            确定
          </AtButton>
        }
      >
        {activeIndex !== null &&
          items[activeIndex]?.specItems.map((item, index) => (
            <View className='spec-item'>
              <View className='spec-item-hd'>
                <SpImage src={item.pic} width={160} height={160} />
              </View>
              <View className='spec-item-bd'>
                <View className='item-name'>{item.itemName}</View>
                <View className='spec-desc'>{item.itemSpecDesc}</View>
                <View className='item-price-num'>
                  <SpPrice size={32} value={item.price} />
                  <SpInputNumber
                    value={item.num}
                    min={0}
                    onChange={onSkuNumChange.bind(this, index)}
                  />
                </View>
              </View>
            </View>
          ))}
      </SpFloatLayout>
    </SpPage>
  )
}

GroupLeaderDetail.options = {
  addGlobalClass: true
}

export default GroupLeaderDetail
