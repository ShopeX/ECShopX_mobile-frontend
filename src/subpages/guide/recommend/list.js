import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpSearchBar, SpScrollView, SpRecommendItem } from '@/components'
import {
  BaHomeWgts,
  BaStoreList,
  BaStore,
  BaGoodsBuyPanel,
  BaTabBar,
  BaNavBar,
  BaCoupon
} from '@/subpages/guide/components'
import { pickBy, styleNames } from '@/utils'
import api from '@/api'
import doc from '@/doc'
import './list.scss'

const initialState = {
  leftList: [],
  rightList: [],
  keywords: '',
  fixTop: 0
}
function GuideRecommendList(props) {
  const [state, setState] = useImmer(initialState)
  const { leftList, rightList, keywords, fixTop } = state
  const scrollRef = useRef()
  useEffect(() => {}, [])

  useDidShow(() => {
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('#search-wrap')
        .boundingClientRect((res) => {
          console.log('boundingClientRect:', res) //
          if (res) {
            setState((draft) => {
              draft.fixTop = res.bottom
              console.log('fixTop:', res.bottom) //
            })
          }
        })
        .exec()
    }, 200)
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    const { list, total_count: total } = await api.article.list({
      article_type: 'bring',
      title: keywords,
      page: pageIndex,
      pageSize
    })

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

    setState((draft) => {
      draft.leftList = [...leftList, ...resLeftList]
      draft.rightList = [...rightList, ...resRightList]
    })

    return { total }
  }

  const handleOnChange = (val) => {
    setState((draft) => {
      draft.keywords = val
    })
  }

  const handleOnClear = async () => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.keywords = ''
    })
    scrollRef.current.reset()
  }

  const handleSearchOff = async () => {
    await setState((draft) => {
      draft.keywords = ''
    })
  }

  const handleConfirm = async (val) => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.keywords = val
    })
    scrollRef.current.reset()
  }

  const handleClickItem = ({ itemId }) => {
    Taro.navigateTo({
      url: `/subpages/guide/recommend/detail?id=${itemId}`
    })
  }

  return (
    <SpPage className='page-guide-recommendlist' renderFooter={<BaTabBar />}>
      <BaNavBar home title='种草' />
      <View id='search-wrap' className='search-wrap'>
        <SpSearchBar
          keyword={keywords}
          placeholder='搜索'
          onChange={handleOnChange}
          onClear={handleOnClear}
          onCancel={handleSearchOff}
          onConfirm={handleConfirm}
        />
      </View>
      <SpScrollView
        className='item-list-scroll'
        style={styleNames({
          top: `${fixTop}px`
        })}
        ref={scrollRef}
        fetch={fetch}
      >
        <View className='article-list'>
          <View className='left-container'>
            {leftList.map((item, index) => (
              <View className='article-item-wrap' key={`article-item-l__${index}`}>
                <SpRecommendItem info={item} onClick={handleClickItem.bind(this, item)} />
              </View>
            ))}
          </View>
          <View className='right-container'>
            {rightList.map((item, index) => (
              <View className='article-item-wrap' key={`article-item-r__${index}`}>
                <SpRecommendItem info={item} onClick={handleClickItem.bind(this, item)} />
              </View>
            ))}
          </View>
        </View>
      </SpScrollView>
    </SpPage>
  )
}

GuideRecommendList.options = {
  addGlobalClass: true
}

export default GuideRecommendList
