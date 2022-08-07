import React, { useEffect } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import doc from '@/doc'
import { pickBy, classNames, styleNames } from '@/utils'
import { platformTemplateName } from '@/utils/platform'
import { SpPage, SpImage } from '@/components'
import CompTabbar from './comps/comp-tabbar'

import './category.scss'

const initialState = {
  pIndex: 0, // 一级索引
  sIndex: 0, // 二级索引
  tabList: [], // 横向tab
  contentList: [],
  hasSeries: false //是否有多级
}

const CategoryIndex = (props) => {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { currentList, pIndex, sIndex, tabList, contentList, hasSeries } = state
  // 获取数据
  useEffect(() => {
    getConfig()
  }, [])

  const getConfig = async () => {
    const { dtid } = $instance.router.params
    const query = {
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: 'category',
      distributor_id: dtid
    }
    const { list } = await api.category.getCategory(query)
    const { data, hasSeries } = list[0].params
    const seriesList = pickBy(data, doc.category.CATEGORY_STORE_LIST)
    let tabList = []
    let contentList = []
    if (hasSeries) {
      seriesList.map((item) => {
        tabList.push({ title: item.name, status: item.name })
        contentList.push(item.children)
      })
    } else {
      contentList.push(seriesList)
    }
    console.log(`contentList:`, contentList)
    setState((draft) => {
      draft.tabList = tabList
      draft.contentList = contentList
      // draft.activeContent = pickBy(contentList[pIndex], doc.category.CATEGORY_STORE_CONTENT)
    })
  }

  const fnSwitchSeries = (index) => {
    setState((draft) => {
      draft.pIndex = index
      draft.sIndex = 0
    })
  }

  const handleClickItem = (item) => {
    const { dtid } = $instance.router.params
    const { category_id = '', main_category_id, is_main_category } = item
    let url = ''
    if (category_id) {
      url = `/subpages/store/item-list?cat_id=${category_id}&dis_id=${dtid}&tabbar=0`
    }
    if (main_category_id || is_main_category) {
      url = `/subpages/store/item-list?main_cat_id=${
        main_category_id || category_id
      }&dis_id=${dtid}&tabbar=0`
    }
    if (url) {
      Taro.navigateTo({
        url
      })
    }
  }

  const curContent = contentList?.[pIndex]?.[sIndex]

  console.log('curContent', curContent)
  return (
    <SpPage className='page-store-category' renderFooter={<CompTabbar />}>
      {/* <View id='category-tab'>
        <AtTabs current={pIndex} tabList={tabList} onClick={fnSwitchSeries}>
          {tabList.map((item, index) => (
            <AtTabsPane current={pIndex} index={index} key={item.status}></AtTabsPane>
          ))}
        </AtTabs>
      </View> */}
      <View className='category-container'>
        <ScrollView className='comp-series__nav' scrollY>
          <View className='nav-list'>
            {contentList[pIndex]?.map((item, index) => (
              <View
                className={classNames('nav-item', {
                  'active': sIndex === index
                })}
                key={`nav-item__${index}`}
                onClick={() => {
                  setState((draft) => {
                    draft.sIndex = index
                  })
                }}
              >
                {item.hot && (
                  <View className='imgbox'>
                    <SpImage src='hot.png' width={20} />
                  </View>
                )}
                <Text className='text'>{item.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <ScrollView className='comp-series__content' scrollY>
          <View className='category-content'>
            {curContent?.img && (
              <SpImage src={curContent.img} width={600} height={200} mode='aspectFill' />
            )}
            <View className='category-content-list'>
              {curContent?.children.map((item, index) => (
                <View className='category-content' key={`content-item__${index}`}>
                  <View className='category-two-item'>
                    <Text className='item-name'>{item.name}</Text>
                  </View>
                  <View className='category-three'>
                    {item.children.map((sitem, sindex) => (
                      <View
                        className='category-three-item'
                        key={`category-three-item__${sindex}`}
                        onClick={() => handleClickItem(sitem)}
                      >
                        <SpImage mode='aspectFill' src={sitem.img} width={158} height={158} />
                        <View className='item-name'>{sitem.name}</View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SpPage>
  )
}

export default CategoryIndex
