import React, { memo, Component } from 'react'
import { View } from '@tarojs/components'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import { pickBy } from '@/utils'
import { setPageTitle, platformTemplateName } from '@/utils/platform'
import { SpTabbar } from '@/components'
import Series from './comps/series'

import './index.scss'

const initialState = {
  currentList: [], //当前系列
  activeIndex: 0,
  tabList: [], // 横向tab
  contentList: [],
  hasSeries: false //是否有多级
}

const Category = (props) => {
  const [state, setState] = useImmer(initialState)
  const { currentList, activeIndex, tabList, contentList, hasSeries } = state
  // 获取数据
  useEffect(() => {
    getConfig()
    setPageTitle('商品分类')
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
    setState((v) => {
      ;(v.tabList = tabList),
        (v.contentList = contentList),
        (v.hasSeries = true),
        (v.currentList = currentList)
    })
  }

  const fnSwitchSeries = (index) => {
    setState((v) => {
      ;(v.activeIndex = index), (v.currentList = v.contentList[index])
    })
  }

  return (
    <View className='page-category-index'>
      {tabList.length > 1 ? (
        <AtTabs current={state.activeIndex} tabList={state.tabList} onClick={fnSwitchSeries}>
          {tabList.map((item, index) => (
            <AtTabsPane current={state.activeIndex} index={index} key={item.status}></AtTabsPane>
          ))}
        </AtTabs>
      ) : (
        ''
      )}
      <View
        className={`${hasSeries && tabList.length > 1 ? 'category-comps' : 'category-comps-not'}`}
      >
        <Series info={currentList} />
      </View>
      <SpTabbar />
    </View>
  )
}

export default memo(Category)
