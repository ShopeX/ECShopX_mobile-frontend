import React, { Component, useState, useEffect } from 'react';
import { View, Text, ScrollView } from "@tarojs/components";
import { connect } from 'react-redux'
import { useImmer } from 'use-immer'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer, AtTabs } from 'taro-ui'
import {
  BackToTop,
  Loading,
  TagsBar,
  SpFilterBar,
  SearchBar,
  GoodsItem,
  SpTagBar,
  SpGoodsItem,
  SpSearchBar,
  SpNote,
  SpNavBar, 
  SpLoadMore,
  TabBar,
  SpPage,
  SpScrollView
} from '@/components'
import api from '@/api'
import { pickBy, classNames, isWeixin, isWeb } from '@/utils'

import './list.scss'

const initialState = {
  leftList: [],
  rightList: [],
  filterList: [
    { title: '综合' },
    { title: '销量' },
    { title: '价格', icon: 'icon-shengxu-01' },
    { title: '价格', icon: 'icon-jiangxu-01' }
  ],
  curFilterIdx: 0,
};

function ItemList() {
  const [state, setState] = useImmer(initialState)

  const [list, setList] = useState({
    leftList: [],
    rightList: []
  })
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [query, setQuery] = useState(null)

  const { leftList, rightList } = list

  const fetch = async ({ pageIndex, pageSize }) => {
    console.log('fetch.........')
    const params = {
      page: pageIndex,
      pageSize
    }
    const {
      list,
      total_count,
      item_params_list = [],
      select_tags_list = []
    } = await api.item.search(params)
    const resLeftList = list.filter((item, index) => {
      if (index % 2 == 0) {
        return item
      }
    })
    const resRightList = list.filter((item, index) => {
      if (index % 2 == 1) {
        return item
      }
    })
    setList({
      leftList: [...leftList, ...resLeftList],
      rightList: [...rightList, ...resRightList]
    })
    
    return { total: total_count };
  }

  const handleOnFocus = () => {
    setIsShowSearch(true)
  }

  const handleOnChange = (val) => {
    setQuery({ ...query, keywords: val })
  }

  const handleOnClear = () => {
    setQuery({ ...query, keywords: '' })
    setIsShowSearch(false)
    resetPage()
    setList({ leftList: [], rightList: [] })
    nextPage()
  }

  const handleSearchOff = () => {
    setIsShowSearch(false)
  }

  const handleConfirm = (val) => {
    Tracker.dispatch("SEARCH_RESULT", {
      keywords: val
    })
    setIsShowSearch(false)
    setQuery({ ...query, keywords: val })
    resetPage()
    setList({ leftList: [], rightList: [] })
    nextPage()
  }

  return (
    <SpPage className={classNames("page-goods-list")}>
      <View className="search-wrap">
        <SpSearchBar
          keyword={query ? query.keywords : ""}
          placeholder="搜索商品"
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          onClear={handleOnClear}
          onCancel={handleSearchOff}
          onConfirm={handleConfirm}
        />
      </View>
      <SpTagBar className="tag-list">
        <View
          className="filter-btn"
          onClick={() => {
            setDrawer(true);
          }}
        >
          筛选<Text className="iconfont icon-filter"></Text>
        </View>
      </SpTagBar>
      <SpFilterBar
        custom
        current={curFilterIdx}
        list={filterList}
        onChange={handleFilterChange}
      />
      <SpScrollView fetch={fetch}>
        <View className="goods-list">
          <View className="left-container">
            {leftList.map((item) => (
              <View className="goods-list-wrap" key={item.item_id}>
                <SpGoodsItem info={item} />
              </View>
            ))}
          </View>
          <View className="right-container">
            {rightList.map((item) => (
              <View className="goods-list-wrap" key={item.item_id}>
                <SpGoodsItem info={item} />
              </View>
            ))}
          </View>
        </View>
      </SpScrollView>
      {/* <ScrollView
        className={classNames('scroll-view')}
        scrollY
        scrollWithAnimation
        onScrollToLower={nextPage}
      >
        <SpFilterBar
          className="goods-tabs"
          custom
          current={curFilterIdx}
          list={filterList}
          onChange={this.handleFilterChange}
        />

        <View className='goods-list'>
          <View className='left-container'>
            {leftList.map((item) => (
              <View className='goods-list-wrap' key={item.item_id}>
                <SpGoodsItem info={item} />
              </View>
            ))}
          </View>
          <View className='right-container'>
            {rightList.map((item) => (
              <View className='goods-list-wrap' key={item.item_id}>
                <SpGoodsItem info={item} />
              </View>
            ))}
          </View>
        </View>

        <SpLoadMore loading={loading} hasNext={hasNext} total={total} />
      </ScrollView> */}
    </SpPage>
  );
}

export default ItemList
