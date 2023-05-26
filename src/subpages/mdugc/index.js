import React, { useEffect, useState, useCallback, useRef } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpLogin,
  SpToast,
  Loading,
  SpNote,
  SpSearchBar,
  SpScrollView,
  SpTabbar,
  FloatMenus,
  FloatMenuItem,
  SpPage,
  SpFloatMenuItem,
  SpTagBar,
  SpDefault,
  CompTabbar
} from '@/components'
import api from '@/api'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import { pickBy, showToast, navigateTo } from '@/utils'
import doc from '@/doc'
import S from '@/spx'
import CompNoteItem from './comps/comp-noteitem'
import TagsBarcheck from './comps/comp-tags-barcheck'

import './index.scss'

const initialState = {
  keyword: '',
  tagsList: [],
  curTagIndex: 0,
  filterList: [
    { tag_id: 1, tag_name: '最热' },
    { tag_id: 2, tag_name: '最新' },
  ],
  curFilterIndex: 0,
  leftList: [],
  rightList: []
}

function UgcIndex() {
  const [state, setState] = useImmer(initialState)
  const { keyword, tagsList, curTagIndex, filterList, curFilterIndex, leftList, rightList } = state
  const listRef = useRef()

  useEffect(() => {
    getTopicslist()
  }, [])

  useEffect(() => {
    if (tagsList.length > 0) {
      listRef.current.reset()
    }
  }, [curTagIndex, keyword, curFilterIndex, tagsList])

  // useEffect(() => {
  //   getUgcList()
  // }, [curTagId, istag])

  // const getUgcList = async () => {
  //   await setState((draft) => {
  //     draft.list = []
  //     draft.oddList = []
  //     draft.evenList = []
  //   })
  //   listRef.current.reset()
  // }

  const getTopicslist = async () => {
    const data = {
      page: 1,
      pageSize: 8
    }
    const { list } = await api.mdugc.topiclist(data)
    setState((draft) => {
      draft.tagsList = pickBy(list, doc.mdugc.MDUGC_TOPICLIST)
    })
  }

  // 列表
  const fetch = async ({ pageIndex, pageSize }) => {
    Taro.showLoading()
    let params = {
      page: pageIndex,
      pageSize,
      sort: curFilterIndex == 0 ? 'likes desc' : 'created desc',
      content: keyword
    }

    if (tagsList.length > 0) {
      params = {
        ...params,
        topics: [...tagsList[curTagIndex].tag_id]
      }
    }

    const { list, total_count: total } = await api.mdugc.postlist(params)

    let nList = pickBy(list, doc.mdugc.UGC_LIST)

    const resLeftList = nList.filter((item, index) => {
      if (index % 2 == 0) {
        return item
      }
    })
    const resRightList = nList.filter((item, index) => {
      if (index % 2 == 1) {
        return item
      }
    })

    setState((draft) => {
      draft.leftList[pageIndex - 1] = resLeftList
      draft.rightList[pageIndex - 1] = resRightList
    })
    Taro.hideLoading()

    return { total: total || 0 }
  }

  const handleOnClear = async () => {
    await setState((draft) => {
      draft.keyword = ''
      draft.leftList = []
      draft.rightList = []
    })
  }

  const handleSearchCancel = () => {
    setState((draft) => {
      draft.keyword = ''
      draft.leftList = []
      draft.rightList = []
    })
  }

  const handleConfirm = async (val) => {
    setState((draft) => {
      draft.keyword = val
      draft.leftList = []
      draft.rightList = []
    })
  }

  const onChangeTag = (index, item) => {
    setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.curTagIndex = index
    })
  }

  const onChangeFilter = (index, item) => {
    setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.curFilterIndex = index
    })
  }

  // 浮动按钮跳转
  const onHandleMenuItem = (url) => {
    // const isAuth = S.getAuthToken()
    // if (!isAuth) {
    //   showToast('请先登录')
    //   return
    // }
    Taro.navigateTo({ url })
  }

  return (
    <SpPage
      className='page-ugc-index'
      scrollToTopBtn
      renderFloat={
        <View className='float-icon'>
          <SpFloatMenuItem
            style={{ fontSize: '38px' }}
            onClick={onHandleMenuItem.bind(this, '/subpages/mdugc/my')}
          >
            <Text className='iconfont icon-huiyuanzhongxin'></Text>
          </SpFloatMenuItem>
          <SpLogin onChange={onHandleMenuItem.bind(this, '/subpages/mdugc/note')}>
            <SpFloatMenuItem>
              <Text className='iconfont icon-tianjia1'></Text>
            </SpFloatMenuItem>
          </SpLogin>

        </View>
      }
      renderFooter={<SpTabbar />}
    >
      <SpSearchBar
        keyword={keyword}
        placeholder='搜索'
        showDailog={false}
        onFocus={() => { }}
        onChange={() => { }}
        onClear={handleOnClear}
        onCancel={handleSearchCancel}
        onConfirm={handleConfirm}
      />

      <View>
        <SpTagBar
          className='ugc-tag'
          list={tagsList}
          value={tagsList[curTagIndex]?.tag_id}
          onChange={onChangeTag}
        />

        <View className='ugc-filter'>
          <SpTagBar
            list={filterList}
            value={filterList[curFilterIndex]?.tag_id}
            onChange={onChangeFilter}
          />
        </View>

        <SpScrollView
          className='list-scroll'
          auto={false}
          ref={listRef}
          fetch={fetch}
        >
          <View className='list-container'>
            <View className='left-container'>
              {leftList.map((list) => {
                return list?.map((item) => {
                  return (
                    <View className='note-item-wrap' key={item.item_id}>
                      <CompNoteItem info={item} />
                    </View>
                  )
                })
              })}
            </View>
            <View className='right-container'>
              {rightList.map((list) => {
                return list?.map((item) => {
                  return (
                    <View className='note-item-wrap' key={item.item_id}>
                      <CompNoteItem info={item} />
                    </View>
                  )
                })
              })}
            </View>
          </View>
        </SpScrollView>
      </View>
    </SpPage>
  )
}

export default UgcIndex
