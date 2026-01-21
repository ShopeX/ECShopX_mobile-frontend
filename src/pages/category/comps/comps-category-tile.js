/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import { pickBy, VERSION_PLATFORM } from '@/utils'
import doc from '@/doc'
import { platformTemplateName } from '@/utils/platform'
import { SpPage, SpTabbar } from '@/components'
import CompSeries from './comp-series'

import './comps-category-tile.scss'

const initialState = {
  currentList: [], //当前系列
  activeIndex: 0,
  tabList: [], // 横向tab
  contentList: [],
  hasSeries: false, //是否有多级
  footerHeight: 0
}

const CompsCategoryTile = (props) => {
  const [state, setState] = useImmer(initialState)
  const pageRef = useRef(null)
  const { currentList, activeIndex, tabList, contentList, hasSeries } = state
  console.log('==state==', tabList)
  // 获取数据
  useEffect(() => {
    getConfig()
  }, [])

  useEffect(() => {
    pageRef.current?.pageLock()
  }, [])

  const getConfig = async () => {
    const query = { template_name: platformTemplateName, version: 'v1.0.1', page_name: 'category' }
    const { list } = await api.category.getCategory(query)
    let seriesList = list[0] ? list[0].params.data : []

    if (!seriesList.length) {
      const res = await api.category.get(VERSION_PLATFORM ? { is_main_category: 1 } : {})
      console.log('res', res)
      const currentList = pickBy(res, {
        name: 'category_name',
        img: 'image_url',
        id: 'id',
        category_id: 'category_id',
        main_category_id: 'main_category_id',
        children: ({ children }) =>
          pickBy(children, {
            name: 'category_name',
            img: 'image_url',
            id: 'id',
            category_id: 'category_id',
            main_category_id: 'main_category_id',
            children: ({ children }) =>
              pickBy(children, {
                name: 'category_name',
                img: 'image_url',
                category_id: 'category_id',
                main_category_id: 'main_category_id'
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
    })
  }

  return (
    <SpPage
      className='page-category-index-new'
      ref={pageRef}
      showpoweredBy={false}
      renderFooter={<SpTabbar height={state.footerHeight} />}
      onReady={({ footerHeight, height }) => {
        setState((draft) => {
          draft.footerHeight = footerHeight
        })
      }}
    >
      <View style={{ height: `calc(100vh - ${state.footerHeight})` }}>
        {tabList.length > 1 && (
          <AtTabs current={activeIndex} tabList={tabList} onClick={fnSwitchSeries}>
            {tabList.map((item, index) => (
              <AtTabsPane current={activeIndex} index={index} key={item.status}>
                <CompSeries info={contentList[index]} />
              </AtTabsPane>
            ))}
          </AtTabs>
        )}
        {!(hasSeries && tabList.length > 1) && (
          <View className='category-comps-not'>
            <CompSeries info={currentList} />
          </View>
        )}
      </View>
    </SpPage>
  )
}

export default CompsCategoryTile
