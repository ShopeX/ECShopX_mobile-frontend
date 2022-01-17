import React, { memo, Component, useEffect } from 'react'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import { pickBy } from '@/utils'
import { setPageTitle, platformTemplateName } from '@/utils/platform'
import { SpPage, SpTabbar } from '@/components'
import ComSeries from './comps/comp-series'

import './index.scss'

const initialState = {
  currentList: [], //当前系列
  activeIndex: 0,
  tabList: [], // 横向tab
  contentList: [],
  hasSeries: false //是否有多级
}

const CategoryIndex = (props) => {
  const [state, setState] = useImmer(initialState)
  const { currentList, activeIndex, tabList, contentList, hasSeries } = state
  // 获取数据
  useEffect(() => {
    getConfig()
  }, [])

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
    console.log('tabList====', tabList)

    console.log('contentList====', contentList)
    let currentList = contentList[activeIndex] //当前系列内容
    console.log('currentList ====', currentList)
    currentList = pickBy(currentList, {
      name: 'name',
      img: 'img',
      children: 'children',
      hot: 'hot',
      id: 'id'
    })
    setState((draft) => {
      draft.tabList = tabList
      draft.contentList = contentList
      draft.hasSeries = true
      draft.currentList = currentList
    })
  }

  const fnSwitchSeries = (index) => {
    setState((draft) => {
      draft.activeIndex = index
      draft.currentList = draft.contentList[index]
    })
  }

  return (
    <SpPage className='page-category-index'>
      {tabList.length > 1 && (
        <AtTabs current={activeIndex} tabList={tabList} onClick={fnSwitchSeries}>
          {tabList.map((item, index) => (
            <AtTabsPane current={activeIndex} index={index} key={item.status}></AtTabsPane>
          ))}
        </AtTabs>
      )}
      <View
        className={`${hasSeries && tabList.length > 1 ? 'category-comps' : 'category-comps-not'}`}
      >
        <ComSeries info={currentList} />
      </View>
      <SpTabbar />
    </SpPage>
  )
}

export default CategoryIndex
