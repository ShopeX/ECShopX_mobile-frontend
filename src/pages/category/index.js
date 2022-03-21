import React, { useEffect } from 'react'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import { pickBy } from '@/utils'
import doc from '@/doc'
import { platformTemplateName } from '@/utils/platform'
import { SpPage, SpTabbar } from '@/components'
import CompSeries from './comps/comp-series'

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

    if (!seriesList.length) {
      const res = await api.category.get()
      const currentList = pickBy(res, {
        name: 'category_name',
        img: 'image_url',
        id: 'id',
        category_id: 'category_id',
        children: ({ children }) =>
          pickBy(children, {
            name: 'category_name',
            img: 'image_url',
            id: 'id',
            category_id: 'category_id',
            children: ({ children }) =>
              pickBy(children, {
                name: 'category_name',
                img: 'image_url',
                category_id: 'category_id'
              })
          })
      })
      setState((draft) => {
        draft.currentList = currentList
        draft.hasSeries = true
      })
    } else {
      let tabList = []
      let contentList = []
      if (list[0].params.hasSeries) {
        seriesList.map((item) => {
          tabList.push({ title: item.title, status: item.name })
          contentList.push(item.content)
        })
      } else {
        contentList.push(seriesList)
      }
      const curIndexList = contentList[activeIndex]
      const nList = pickBy(curIndexList, doc.category.CATEGORY_LIST)
      setState((draft) => {
        draft.tabList = tabList
        draft.contentList = contentList
        draft.currentList = nList
        draft.hasSeries = true
      })
    }
  }

  const fnSwitchSeries = (index) => {
    setState((draft) => {
      draft.activeIndex = index
      draft.currentList = draft.contentList[index]
    })
  }

  console.log('==currentList==', currentList, tabList)

  return (
    <SpPage className='page-category-index' renderFooter={<SpTabbar />}>
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
        <CompSeries info={currentList} />
      </View>
    </SpPage>
  )
}

export default CategoryIndex
