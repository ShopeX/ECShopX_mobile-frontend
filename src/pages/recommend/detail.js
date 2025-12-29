/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import qs from 'qs'
import Taro, { useDidShow, useShareAppMessage, getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage } from '@/components'
import api from '@/api'
import doc from '@/doc'
import S from '@/spx'
import { pickBy, log, isWeixin, showToast } from '@/utils'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../home/wgts'
import './detail.scss'

const initialState = {
  itemId: '',
  title: '',
  articleFocusNum: 0,
  content: [],
  updated: '',
  isPraise: false,
  articlePraiseNum: 0,
  collectArticleStatus: false
}
function GuideRecommendDetail(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { img, shareImageUrl, itemId, title, content, articleFocusNum, updated } = state
  const { userInfo } = useSelector((state) => state.guide)
  const router = useRouter()

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
    const { subtask_id } = router.params
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
    const { id } = router.params
    // 关注数加1
    const res = await api.article.detail(id)
    if (S.getAuthToken()) {
      const resCollectArticle = await api.article.collectArticleInfo({ article_id: id })
      if (resCollectArticle.length > 0) {
        setState((draft) => {
          draft.collectArticleStatus = true
        })
      }
    }
    const { itemId, title, articleFocusNum, content, updated, isPraise, articlePraiseNum } = pickBy(
      res,
      doc.article.ARTICLE_ITEM
    )

    setState((draft) => {
      draft.itemId = itemId
      draft.title = title
      draft.articleFocusNum = articleFocusNum
      draft.content = content
      draft.updated = updated
      draft.isPraise = isPraise
      draft.articlePraiseNum = articlePraiseNum
    })
  }

  const handleLikeClick = async () => {
    const { count, status } = await api.article.praise(router.params.id)
    setState((draft) => {
      draft.isPraise = status
      draft.articlePraiseNum = count
    })
  }

  const handleMarkClick = async () => {
    const resCollectArticle = await api.article.collectArticle(router.params.id)
    if (resCollectArticle.fav_id && !state.collectArticleStatus) {
      setState((draft) => {
        draft.collectArticleStatus = true
      })
      showToast('已加入心愿单')
    } else {
      await api.article.delCollectArticle({
        article_id: router.params.id
      })
      setState((draft) => {
        draft.collectArticleStatus = false
      })
      showToast('已移出心愿单')
    }
  }

  const handleClickGoods = async () => {}

  return (
    <SpPage
      className='pages-recommend-detail'
      renderFooter={
        <View className='recommend-detail__bar flex'>
          <View className='recommend-detail__bar-item' onClick={handleLikeClick}>
            <Text className={`iconfont icon-like ${state.isPraise ? 'active' : ''}`} />
            <Text className='bar-item-text'>
              {`${state.isPraise ? '已赞' : '点赞'} ${state.articlePraiseNum}`}
            </Text>
          </View>
          <View className='recommend-detail__bar-item' onClick={handleMarkClick}>
            <Text
              className={`iconfont icon-star_on ${state.collectArticleStatus ? 'active' : ''}`}
            />
            <Text className='bar-item-text'>
              {state.collectArticleStatus ? '已加入' : '加入心愿'}
            </Text>
          </View>
          {isWeixin && (
            <Button openType='share' className='recommend-detail__bar-item'>
              <Text className='iconfont icon-share1'> </Text>
              <Text className='bar-item-text'>分享</Text>
            </Button>
          )}
        </View>
      }
    >
      <ScrollView className='scrollview-container' scrollY>
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
                {item.name === 'goods' && <WgtGoods onClick={handleClickGoods} info={item} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SpPage>
  )
}

GuideRecommendDetail.options = {
  addGlobalClass: true
}

export default GuideRecommendDetail
