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
import { pickBy, log, isWeixin, showToast, buildSharePath } from '@/utils'
import { withPageWrapper } from '@/hocs'
import { useTranslation, $t, ti } from '@/i18n'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoodsCard, WgtHeading } from '../home/wgts'
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
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { img, shareImageUrl, itemId, title, content, articleFocusNum, updated } = state
  const { userInfo } = useSelector((state) => state.guide)
  const router = useRouter()

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('a8e160ea.8d29da') })
  }, [i18n.language])

  useDidShow(() => {
    Taro.hideShareMenu({
      //禁用胶囊分享
      menus: ['shareAppMessage', 'shareTimeline']
    })
  })

  useShareAppMessage(async () => {
    const { subtask_id } = router?.params
    const query = {
      id: itemId,
      subtask_id
    }

    // 如果有userInfo，添加相关参数
    if (userInfo) {
      const { salesperson_id, work_userid, distributor_id, shop_code } = userInfo
      query.dtid = distributor_id
      query.smid = salesperson_id
      query.gu = `${work_userid}_${shop_code}`
    }

    const sharePath = buildSharePath('poster_recommend_detail', query)
    log.debug(`【/pages/recommend/detail】onShareAppMessage path: ${sharePath}`)
    return {
      title: title,
      path: sharePath,
      imageUrl: shareImageUrl || img
    }
  })

  const fetch = async () => {
    const { id } = router?.params
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
    const { count, status } = await api.article.praise(router?.params.id)
    setState((draft) => {
      draft.isPraise = status
      draft.articlePraiseNum = count
    })
  }

  const handleMarkClick = async () => {
    const resCollectArticle = await api.article.collectArticle(router?.params.id)
    if (resCollectArticle.fav_id && !state.collectArticleStatus) {
      setState((draft) => {
        draft.collectArticleStatus = true
      })
      showToast($t('a8e160ea.bee805'))
    } else {
      await api.article.delCollectArticle({
        article_id: router?.params.id
      })
      setState((draft) => {
        draft.collectArticleStatus = false
      })
      showToast($t('a8e160ea.2cddac'))
    }
  }

  return (
    <SpPage
      className='pages-recommend-detail'
      renderFooter={
        <View className='recommend-detail__bar flex'>
          <View className='recommend-detail__bar-item' onClick={handleLikeClick}>
            <Text className={`iconfont icon-like ${state.isPraise ? 'active' : ''}`} />
            <Text className='bar-item-text'>
              {`${state.isPraise ? $t('a8e160ea.d10f66') : $t('a8e160ea.75f0fa')} ${
                state.articlePraiseNum
              }`}
            </Text>
          </View>
          <View className='recommend-detail__bar-item' onClick={handleMarkClick}>
            <Text
              className={`iconfont icon-star_on ${state.collectArticleStatus ? 'active' : ''}`}
            />
            <Text className='bar-item-text'>
              {state.collectArticleStatus ? $t('a8e160ea.711785') : $t('a8e160ea.56d0b8')}
            </Text>
          </View>
          {isWeixin && (
            <Button openType='share' className='recommend-detail__bar-item'>
              <Text className='iconfont icon-share1'> </Text>
              <Text className='bar-item-text'>{$t('a8e160ea.c31f48')}</Text>
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
          </View>
        </View>
        <View className='article-bd'>
          <View className='wgts-wrap__cont'>
            {Array.isArray(content) &&
              content.map((item, idx) => (
                <View className='wgt-wrap' key={`${item.name}${idx}`}>
                  {item.name === 'film' && <WgtFilm info={item} />}
                  {item.name === 'slider' && <WgtSlider info={item} />}
                  {item.name === 'writing' && <WgtWriting info={item} />}
                  {item.name === 'heading' && <WgtHeading info={item} />}
                  {item.name === 'goodsCard' && <WgtGoodsCard info={item} />}
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

export default withPageWrapper(GuideRecommendDetail)
