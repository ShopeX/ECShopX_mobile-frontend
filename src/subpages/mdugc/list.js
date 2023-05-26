import React, { useEffect, useRef } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import {
  SpNote,
  BackToTop,
  FloatMenus,
  SpPage,
  SpFloatMenuItem,
  SpScrollView,
  FloatMenuItem
} from '@/components'
import { pickBy } from '@/utils'
import S from '@/spx'
import api from '@/api'
import Scrollitem from './comps/comp-noteitem'
import './list.scss'

const initialState = {
  list: [],
  oddList: [],
  evenList: [],
  curTagId: '',
  topic_name: '',
  istag: 1,
  refresherTriggered: false
}

function mdugclist(props) {
  const [state, setState] = useImmer(initialState)
  const router = useRouter()
  const listRef = useRef()

  useEffect(() => {
    console.log('router', router)
    let { item } = router.params
    item = JSON.parse(item)

    let { topic_id, topic_name } = item
    setState((draft) => {
      draft.curTagId = topic_id
      draft.topic_name = topic_name
    })
  }, [])

  useDidShow(() => {
    let pages = Taro.getCurrentPages()
    let currentPage = pages[pages.length - 1] // 获取当前页面
    if (currentPage.__data__.delete) {
      // 获取值
      console.log('这是笔记详情传递的删除数据', currentPage.__data__.delete)
      let post_id = currentPage.__data__.delete
      updatelist(post_id, 'delete')
      setTimeout(() => {
        currentPage.setData({
          //清空上一页面传递值
          delete: ''
        })
      }, 1000)
    } else if (currentPage.__data__.heart) {
      console.log('这是笔记详情传递的点赞数据', currentPage.__data__.heart)
      let heart = currentPage.__data__.heart
      updatelist(heart.item_id, heart.isheart, heart.likes)
      setTimeout(() => {
        currentPage.setData({
          //清空上一页面传递值
          heart: ''
        })
      }, 1000)
    }
  })
  // 热度
  const onistag = (istag) => {
    // this.resetPage()
    setState((draft) => {
      ;(draft.list = []), (draft.oddList = []), (draft.evenList = [])
    })

    setState(
      (draft) => {
        draft.istag = istag
      },
      () => {
        // this.nextPage()
      }
    )
  }
  // 列表
  const fetch = async (params) => {
    Taro.showLoading({
      title: '正在加载...'
    })
    const { curTagId } = state
    const { page_no: page, istag, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      sort: istag == 1 ? 'likes desc' : 'created desc',
      topics: [curTagId]
    }
    const { list, total_count: total } = await api.mdugc.postlist(params)
    console.log('list, total', list, total)
    let nList = []
    if (list) {
      nList = pickBy(list, {
        image_url: 'cover',
        head_portrait: 'userInfo.headimgurl',
        item_id: 'post_id',
        title: 'title',
        author: 'userInfo.nickname',
        likes: 'likes',
        isheart: 'like_status',
        badges: 'badges'
      })
    }

    console.log('这是nlist', nList)

    let odd = [],
      even = []
    nList.map((item, idx) => {
      if (idx % 2 == 0) {
        odd.push(item)
      } else {
        even.push(item)
      }
    })
    setState(
      (draft) => {
        ;(draft.list = [...state.list, ...nList]),
          (draft.oddList = [...state.oddList, ...odd]),
          (draft.evenList = [...state.evenList, ...even]),
          (draft.refresherTriggered = false)
      },
      () => {
        Taro.hideLoading()
      }
    )

    return { total }
  }
  const handleClickItem = (item) => {
    console.log('item', item)
  }
  // 浮动按钮跳转
  const topages = (url) => {
    console.log('url', url)
    Taro.navigateTo({ url })
  }
  // 更新列表
  const updatelist = (post_id, type, likes) => {
    let { list, oddList, evenList } = state
    let idx = list.findIndex((item) => item.item_id == post_id)
    let idx_odd = oddList.findIndex((item) => item.item_id == post_id)
    let idx_even = evenList.findIndex((item) => item.item_id == post_id)
    console.log('这是下标', idx, idx_odd, idx_even)
    if (idx >= 0) {
      if (type == 'delete') {
        list.splice(idx, 1)
        if (idx_odd >= 0) {
          oddList.splice(idx_odd, 1)
        } else {
          evenList.splice(idx_even, 1)
        }
      } else {
        list = setlist(list, idx, type, likes)
        // if(idx_odd>=0){
        //   oddList=that.setlist(oddList,idx_odd,type)
        // }else{
        //   evenList=that.setlist(evenList,idx_even,type)
        // }
        console.log('这是改后数据', list, oddList, evenList)
      }
      setState((draft) => {
        ;(draft.list = list), (draft.oddList = oddList), (draft.evenList = evenList)
      })
    }
  }
  const setlist = (lists, idxs, types, likes) => {
    let listi = lists,
      idx = idxs,
      type = types
    listi[idx].isheart = type
    listi[idx].likes = likes
    return listi
  }
  // 自定义下拉刷新
  const onRefresherRefresh = () => {
    const { refresherTriggered } = state
    // 正处于刷新状态
    if (refresherTriggered) return
    setState((draft) => {
      draft.refresherTriggered = true // 手动调整刷新状态
    })

    setState(
      (draft) => {
        ;(draft.list = []), (draft.oddList = []), (draft.evenList = [])
      },
      () => {
        // this.nextPage()
      }
    )
  }

  const {
    list,
    istag,
    topic_name,
    page,
    oddList,
    evenList,
    showBackToTop,
    scrollTop,
    refresherTriggered
  } = state
  return (
    <View className='ugclist'>
      <View className='ugclist_top'>
        <View className='ugclist_title'>#{topic_name}</View>
        <View className='ugclist__tag'>
          <View
            onClick={onistag.bind(this, 1)}
            className={
              istag == 1
                ? 'ugclist__tag_i icon-shijian ugclist__tag_iact'
                : 'ugclist__tag_i icon-shijian'
            }
          >
            最热
          </View>
          <View
            onClick={onistag.bind(this, 2)}
            className={
              istag == 2
                ? 'ugclist__tag_i icon-shoucang ugclist__tag_iact'
                : 'ugclist__tag_i icon-shoucang'
            }
          >
            最新
          </View>
        </View>
      </View>
      <SpPage
        scrollToTopBtn
        renderFloat={
          <View className='float-icon'>
            <SpFloatMenuItem
              style={{ fontSize: '38px' }}
              onClick={topages.bind(this, '/subpages/mdugc/pages/member/index2')}
            >
              <Text className='iconfont icon-huiyuanzhongxin'></Text>
            </SpFloatMenuItem>
            <SpFloatMenuItem onClick={topages.bind(this, '/subpages/mdugc/pages/make/index2')}>
              <Text className='iconfont icon-tianjia1'></Text>
            </SpFloatMenuItem>
          </View>
        }
      >
        <View className='ugcindex_list'>
          <SpScrollView className='ugcindex_list__scroll' auto={false}  ref={listRef} fetch={fetch}>
            <View className='ugcindex_list__scroll_scrolls'>
              <View className='ugcindex_list__scroll_scrolls_left'>
                {oddList?.map((item) => {
                  return (
                    <View className='ugcindex_list__scroll_scrolls_item' key={item.item_id}>
                      <Scrollitem item={item} setlikes={updatelist} />
                    </View>
                  )
                })}
              </View>
              <View className='ugcindex_list__scroll_scrolls_right'>
                {evenList?.map((item) => {
                  return (
                    <View className='ugcindex_list__scroll_scrolls_item' key={item.item_id}>
                      <Scrollitem item={item} setlikes={updatelist} />
                    </View>
                  )
                })}
              </View>
            </View>
          </SpScrollView>
        </View>
      </SpPage>
    </View>
  )
}

export default mdugclist
