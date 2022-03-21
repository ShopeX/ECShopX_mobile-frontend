import React, { useEffect } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import { pickBy, styleNames } from '@/utils'
import doc from '@/doc'
import { platformTemplateName } from '@/utils/platform'
import { SpPage, SpTabbar } from '@/components'
import { BaTabBar, BaNavBar } from '@/subpages/guide/components'
import CompSeries from './comps/comp-series'

import './index.scss'

const initialState = {
  currentList: [], //当前系列
  activeIndex: 0,
  tabList: [], // 横向tab
  contentList: [],
  fixTop: 0,
  hasSeries: false //是否有多级
}

const CategoryIndex = (props) => {
  const [state, setState] = useImmer(initialState)
  const { currentList, activeIndex, tabList, contentList, hasSeries, fixTop } = state
  // 获取数据
  useEffect(() => {
    getConfig()
  }, [])

  // useDidShow(() => {
  //   setTimeout(() => {
  //     wx.createSelectorQuery()
  //     .select('#category-wrap')
  //     .boundingClientRect((res) => {
  //       console.log('boundingClientRect:', res) //
  //       if (res) {
  //         setState((draft) => {
  //           draft.fixTop = res.top
  //           console.log('fixTop:', res.top) //
  //         })
  //       }
  //     })
  //     .exec()
  //   }, 200)
  // })

  const getConfig = async () => {
    const query = { template_name: platformTemplateName, version: 'v1.0.1', page_name: 'category' }
    const { list } = await api.category.getCategory(query)
    let seriesList = list[0] ? list[0].params.data : []
    let tabList = []
    let contentList = []
    // 说明有多系列
    if (list[0].params.hasSeries) {
      seriesList.map((item) => {
        tabList.push({ title: item.title, status: item.name })
        contentList.push(item.content)
      })
    } else {
      contentList.push(seriesList)
    }
    let currentList = contentList[activeIndex] //当前系列内容
    currentList = pickBy(currentList, doc.category.CATEGORY_LIST)
    setState((draft) => {
      draft.tabList = tabList
      draft.contentList = contentList
      draft.hasSeries = true
      draft.currentList = currentList
    })

    setTimeout(() => {
      wx.createSelectorQuery()
        .select('#category-wrap')
        .boundingClientRect((res) => {
          console.log('boundingClientRect:', res) //
          if (res) {
            setState((draft) => {
              draft.fixTop = res.top
              console.log('fixTop:', res.top) //
            })
          }
        })
        .exec()
    }, 200)
  }

  const fnSwitchSeries = (index) => {
    setState((draft) => {
      draft.activeIndex = index
      draft.currentList = draft.contentList[index]
    })
  }

  return (
    <SpPage className='page-guide-category-index' renderFloat={<BaTabBar />}>
      <BaNavBar home title='导购商城' />
      {tabList.length > 1 && (
        <AtTabs current={activeIndex} tabList={tabList} onClick={fnSwitchSeries}>
          {tabList.map((item, index) => (
            <AtTabsPane current={activeIndex} index={index} key={item.status}></AtTabsPane>
          ))}
        </AtTabs>
      )}
      <View
        id='category-wrap'
        className={`${hasSeries && tabList.length > 1 ? 'category-comps' : 'category-comps-not'}`}
      >
        <CompSeries info={currentList} fixTop={fixTop} />
      </View>
    </SpPage>
  )
}

export default CategoryIndex
