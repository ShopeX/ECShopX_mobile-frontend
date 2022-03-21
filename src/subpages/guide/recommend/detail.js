import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useShareAppMessage, getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy, log } from '@/utils'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../components/wgts'
import './detail.scss'
import { drawText } from '@/components/sp-poster/helper'

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
    const gu = `${work_userid}_${shop_code}`
    const sharePath = `/subpage/pages/recommend/detail?id=${itemId}&smid=${salesperson_id}&gu=${gu}&dtid=${distributor_id}`
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
