import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Picker } from '@tarojs/components'
import { SpSearchInput, SpAddress, SpScrollView, SpRecommendItem } from '@/components'
import { useImmer } from 'use-immer'
import { withPager, withBackToTop } from '@/hocs'
import { connect } from 'react-redux'
import { AtDrawer } from 'taro-ui'
import {
  BackToTop,
  Loading,
  RecommendItem,
  SearchBar,
  SpNote,
  FilterBar,
  SpTabbar,
  SpPage
} from '@/components'
import api from '@/api'
import { classNames, pickBy } from '@/utils'
import doc from '@/doc'
import S from '@/spx'

import './list.scss'

const initialState = {
  leftList: [],
  rightList: []
}

function RecommendList() {
  const [state, setState] = useImmer(initialState)
  const { leftList, rightList } = state

  const fetch = async ({ pageIndex, pageSize }) => {
    const queryParams = {
      article_type: 'bring',
      page: pageIndex,
      pageSize,
      // category_id: selectColumn.id
    }
    const {
      list,
      total_count: total,
      province_list
    } = S.getAuthToken()
        ? await api.article.authList(queryParams)
        : await api.article.list(queryParams)

    const n_list = pickBy(list, doc.article.ARTICLE_ITEM)
    const resLeftList = n_list.filter((item, index) => {
      if (index % 2 == 0) {
        return item
      }
    })
    const resRightList = n_list.filter((item, index) => {
      if (index % 2 == 1) {
        return item
      }
    })

    setState(draft => {
      draft.leftList[pageIndex - 1] = resLeftList
      draft.rightList[pageIndex - 1] = resRightList
    })

    return {
      total
    }
  }

  const handleClickItem = ({ itemId }) => {
    Taro.navigateTo({
      url: `/pages/recommend/detail?id=${itemId}`
    })
  }

  return (
    <SpPage className="page-recommend-list" renderFooter={<SpTabbar />}>
      <View className="search-container">
        <SpSearchInput
          placeholder='搜索'
          onConfirm={(val) => {
            setState((draft) => {
              draft.keywords = val
            })
          }}
        />
      </View>
      <ScrollView className="list-scroll-container" scrollY>
        <SpScrollView fetch={fetch} >
          <View className='article-list'>
            <View className='left-container'>
              {leftList.map(gitem => {
                return gitem.map((item, index) => (
                  <View className='article-item-wrap' key={`article-item-l__${index}`}>
                    <SpRecommendItem info={item} onClick={handleClickItem.bind(this, item)} />
                  </View>
                ))
              })}
            </View>
            <View className='right-container'>
              {rightList.map((gitem, index) => {
                return gitem.map((item, index) => (
                  <View className='article-item-wrap' key={`article-item-r__${index}`}>
                    <SpRecommendItem info={item} onClick={handleClickItem.bind(this, item)} />
                  </View>
                ))
              })}
            </View>
          </View>
        </SpScrollView>
      </ScrollView>
    </SpPage>
  )
}

export default RecommendList
