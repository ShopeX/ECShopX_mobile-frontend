/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpLogin, SpSearchBar, SpScrollView, SpTabbar, SpPage, SpFloatMenuItem } from '@/components'
import { SpTagBar } from '@/subpages/components'
import * as mdugcApi from '@/api/mdugc'
import { useImmer } from 'use-immer'
import { pickBy } from '@/utils'
import * as mdugcDoc from '@/doc/mdugc'
import { useTranslation, $t } from '@/i18n'
import CompNoteItem from './comps/comp-noteitem'
import './index.scss'

function UgcIndex() {
  const { i18n } = useTranslation()
  const filterList = useMemo(
    () => [
      { tag_id: 1, tag_name: $t('d668d0e3.4d2d97') },
      { tag_id: 2, tag_name: $t('d668d0e3.8818d4') }
    ],
    [i18n.language]
  )
  const initialState = {
    keyword: '',
    searchKeyword: '',
    tagsList: [],
    curTagIndex: 0,
    curFilterIndex: 0,
    leftList: [],
    rightList: [],
    footerHeight: 0
  }
  const [state, setState] = useImmer(initialState)
  const { keyword, searchKeyword, tagsList, curTagIndex, curFilterIndex, leftList, rightList } =
    state
  const listRef = useRef()
  const searchKeywordRef = useRef('')
  searchKeywordRef.current = searchKeyword

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('d668d0e3.888af1') })
  }, [i18n.language])

  useEffect(() => {
    getTopicslist()

    // 笔记编辑、删除后刷新页面
    Taro.eventCenter.on('onEventRefreshFromNote', () => {
      console.log('onEventRefreshFromNote:')
      listRef.current.reset()
    })

    return () => {
      Taro.eventCenter.off('onEventRefreshFromNote')
    }
  }, [])

  useEffect(() => {
    if (tagsList.length > 0) {
      listRef.current?.reset()
    }
  }, [curTagIndex, curFilterIndex, tagsList, searchKeyword])

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
    const { list } = await mdugcApi.topiclist(data)
    setState((draft) => {
      draft.tagsList = pickBy(list, mdugcDoc.MDUGC_TOPICLIST)
    })
  }

  // 列表
  const fetch = async ({ pageIndex, pageSize }) => {
    Taro.showLoading()
    try {
      let params = {
        page: pageIndex,
        pageSize,
        sort: curFilterIndex == 0 ? 'likes desc' : 'created desc'
      }
      const keyword = (searchKeywordRef.current || '').trim()
      if (keyword) {
        params.content = keyword
      }

      if (tagsList.length > 0 && tagsList[curTagIndex]) {
        params = {
          ...params,
          topics: [tagsList[curTagIndex].tag_id]
        }
      }

      const res = (await mdugcApi.postlist(params)) || {}
      const list = Array.isArray(res.list) ? res.list : []
      const total = res.total_count

      let nList = pickBy(list, mdugcDoc.UGC_LIST)

      const resLeftList = nList.filter((item, index) => index % 2 == 0)
      const resRightList = nList.filter((item, index) => index % 2 == 1)

      setState((draft) => {
        if (pageIndex === 1) {
          draft.leftList = [resLeftList]
          draft.rightList = [resRightList]
        } else {
          draft.leftList[pageIndex - 1] = resLeftList
          draft.rightList[pageIndex - 1] = resRightList
        }
      })

      return { total: total || 0 }
    } finally {
      Taro.hideLoading()
    }
  }

  const refreshBySearch = (val = '') => {
    const nextKeyword = typeof val === 'string' ? val : ''
    searchKeywordRef.current = nextKeyword
    setState((draft) => {
      draft.keyword = nextKeyword
      draft.searchKeyword = nextKeyword
      draft.leftList = []
      draft.rightList = []
    })
  }

  const handleOnClear = () => {
    refreshBySearch('')
  }

  const handleSearchCancel = () => {
    refreshBySearch('')
  }

  const handleConfirm = (val) => {
    refreshBySearch(val)
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
    // const isAuth = S?.getAuthToken()
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
          <SpLogin onChange={onHandleMenuItem.bind(this, '/subpages/mdugc/my')}>
            <SpFloatMenuItem>
              <Text className='iconfont icon-huiyuanzhongxin'></Text>
            </SpFloatMenuItem>
          </SpLogin>
          <SpLogin onChange={onHandleMenuItem.bind(this, '/subpages/mdugc/note')}>
            <SpFloatMenuItem>
              <Text className='iconfont icon-tianjia1'></Text>
            </SpFloatMenuItem>
          </SpLogin>
        </View>
      }
      onReady={({ footerHeight }) => {
        setState((draft) => {
          draft.footerHeight = footerHeight
        })
      }}
      renderFooter={<SpTabbar height={state.footerHeight} />}
    >
      <SpSearchBar
        keyword={keyword}
        placeholder={$t('d668d0e3.e5f71f')}
        showDailog={false}
        onFocus={() => {}}
        onChange={(e) => {
          setState((draft) => {
            draft.keyword = e
          })
        }}
        onClear={handleOnClear}
        onCancel={handleSearchCancel}
        onConfirm={handleConfirm}
      />

      <>
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

        <SpScrollView className='list-scroll' auto={false} ref={listRef} fetch={fetch}>
          <View className='list-container'>
            <View className='left-container'>
              {leftList.map((list) => {
                return list?.map((item) => {
                  return (
                    <View className='note-item-wrap' key={item.postId}>
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
                    <View className='note-item-wrap' key={item.postId}>
                      <CompNoteItem info={item} />
                    </View>
                  )
                })
              })}
            </View>
          </View>
        </SpScrollView>
      </>
    </SpPage>
  )
}

export default UgcIndex
