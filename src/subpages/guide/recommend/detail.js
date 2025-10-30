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
import { useImmer } from 'use-immer'
import qs from 'qs'
import Taro, { useDidShow, useShareAppMessage, getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy, log } from '@/utils'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../components/wgts'
import './detail.scss'

const initialState = {
  itemId: '',
  title: '',
  articleFocusNum: 0,
  content: [],
  updated: ''
}
function GuideRecommendDetail(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { img, shareImageUrl, itemId, title, content, articleFocusNum, updated } = state
  const { userInfo } = useSelector((state) => state.guide)

  useEffect(() => {
    fetch()
  }, [])

  useDidShow(() => {
    Taro.hideShareMenu({
      //禁用胶囊分享
      menus: ['shareAppMessage', 'shareTimeline']
    })
  })

  useShareAppMessage(async () => {
    const { salesperson_id, work_userid, distributor_id, shop_code } = userInfo
    const { subtask_id } = $instance.router.params
    const query = {
      id: itemId,
      dtid: distributor_id,
      smid: salesperson_id,
      gu: `${work_userid}_${shop_code}`,
      subtask_id
    }
    const sharePath = `/subpage/pages/recommend/detail?${qs.stringify(query)}`
    log.debug(`【guide/recommend/detail】onShareAppMessage path: ${sharePath}`)
    return {
      title: title,
      path: sharePath,
      imageUrl: shareImageUrl || img
    }
  })

  const fetch = async () => {
    const { id } = $instance.router.params
    // 关注数加1
    const resFocus = await api.article.focus(id)
    const res = await api.article.detail(id)
    const { itemId, title, articleFocusNum, content, updated } = pickBy(
      res,
      doc.article.ARTICLE_ITEM
    )

    setState((draft) => {
      draft.itemId = itemId
      draft.title = title
      draft.articleFocusNum = articleFocusNum
      draft.content = content
      draft.updated = updated
    })
  }

  const handleClickGoods = async () => {}

  return (
    <SpPage
      className='guide-recommend-detail'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle className='btn-share' type='primary' openType='share'>
            分享给顾客
          </AtButton>
        </View>
      }
    >
      <View className='article-hd'>
        <View className='article-title'>{title}</View>
        <View className='article-info'>
          <Text className='update-time'>{updated}</Text>
          <Text className='focus-num'>{`${articleFocusNum}关注`}</Text>
        </View>
      </View>
      <View className='article-bd'>
        <View className='wgts-wrap__cont'>
          {content.map((item, idx) => (
            <View className='wgt-wrap' key={`${item.name}${idx}`}>
              {item.name === 'film' && <WgtFilm info={item} />}
              {item.name === 'slider' && <WgtSlider info={item} />}
              {item.name === 'writing' && <WgtWriting info={item} />}
              {item.name === 'heading' && <WgtHeading info={item} />}
              {item.name === 'goods' && (
                <WgtGoods onClick={handleClickGoods.bind(this, 'goods')} info={item} />
              )}
            </View>
          ))}
        </View>
      </View>
    </SpPage>
  )
}

GuideRecommendDetail.options = {
  addGlobalClass: true
}

export default GuideRecommendDetail
