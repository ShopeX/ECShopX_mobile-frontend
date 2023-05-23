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
import Scrollitem from './comps/comp-scrollitem'
import TagsBarcheck from './comps/comp-tags-barcheck'

import './index.scss'

const initialState = {
  file_video: {
    url: '',
    // urlimge_id:'',
    cover: '',
    // coverimge_id:'',
    proportion: '',
    video_idx: -1
  },
  file_img: [],
  file_text: {
    title: '',
    attextarea: ''
  },
  file_commodity: [],
  file_word: [],
  occupy: [
    {
      occupyi: 0
    },
    {
      occupyi: 0
    },
    {
      occupyi: 0
    },
    {
      occupyi: 0
    }
  ],
  curTagId: [],
  isPopups: false,
  videoenable: 0,
  elastic: {
    title: '使用您的摄像头，将会上传你摄录的照片及视频',
    closetext: '拒绝',
    showtext: '允许',
    type: 0
  },
  isGrant: false, //是否授权
  isOpened: false, //是否显示上传按钮
  uploadtype: [],
  upload_choice: [
    {
      text: '添加视频',
      type: 'video'
    },
    {
      text: '添加图片',
      type: 'img'
    }
  ],
  upload_img: [
    {
      text: '拍照',
      type: 'camera_i'
    },
    {
      text: '从相册选择',
      type: 'album_i'
    }
  ],
  upload_video: [
    {
      text: '拍摄',
      type: 'camera_v'
    },
    {
      text: '从相册选择',
      type: 'album_v'
    }
  ],
  page: {
    pageIndex: 1,
    pageSize: 10
  },
  istag: 1,
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
  const { val, curTagId, istag, list, tagsList, curTagIndex, filterList, curFilterIndex, leftList, rightList } = state
  const listRef = useRef()

  useEffect(() => {
    getTopicslist()
  }, [])

  useEffect(() => {
    getUgcList()
  }, [curTagId, istag])

  // const initHandle = () => {
  //   Taro.setNavigationBarColor({
  //     frontColor: '#000000',
  //     backgroundColor: '#eeeeee'
  //   })
  //   let pages = Taro.getCurrentPages()
  //   let currentPage = pages[pages.length - 1] // 获取当前页面
  //   if (currentPage.__data__.delete) {
  //     // 获取值
  //     console.log('这是笔记详情传递的删除数据', currentPage.__data__.delete)
  //     let post_id = currentPage.__data__.delete
  //     this.updatelist(post_id, 'delete')
  //     setTimeout(() => {
  //       currentPage.setData({
  //         //清空上一页面传递值
  //         delete: ''
  //       })
  //     }, 1000)
  //   } else if (currentPage.__data__.heart) {
  //     console.log('这是笔记详情传递的点赞数据', currentPage.__data__.heart)
  //     let heart = currentPage.__data__.heart
  //     this.updatelist(heart.item_id, heart.isheart, heart.likes)
  //     setTimeout(() => {
  //       currentPage.setData({
  //         //清空上一页面传递值
  //         heart: ''
  //       })
  //     }, 1000)
  //   }
  // }

  const getUgcList = async () => {
    await setState((draft) => {
      draft.list = []
      draft.oddList = []
      draft.evenList = []
    })
    listRef.current.reset()
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
        ; (draft.list = list), (draft.oddList = oddList), (draft.evenList = evenList)
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

  // 搜索
  const shonChange = (val) => {
    // console.log("输入框值改变",val)
  }
  const shonClear = () => {
    console.log('清除')
    // resetPage()
    setState((draft) => {
      ; (draft.list = []), (draft.oddList = []), (draft.evenList = []), (draft.val = '')
    })
    listRef.current.reset()
  }

  const shonConfirm = (val) => {
    console.log('完成触发', val)
    // resetPage()
    setState((draft) => {
      ; (draft.list = []), (draft.oddList = []), (draft.evenList = []), (draft.val = val)
    })
    listRef.current.reset()
  }

  const handleTagChange = (id) => {
    let ncurTagId = JSON.parse(JSON.stringify(state.curTagId))

    console.log('这是选中标签', id, ncurTagId)
    listRef.current.reset()
    setState((draft) => {
      ; (draft.list = []), (draft.oddList = []), (draft.evenList = [])
    })
    let idx = ncurTagId.findIndex((item) => {
      return item == id
    })
    if (idx >= 0) {
      ncurTagId.splice(idx, 1)
    } else {
      ncurTagId.push(id)
    }
    setState(
      (draft) => {
        draft.curTagId = ncurTagId
      },
      async () => {
        console.log(state.curTagId)
      }
    )
  }

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

  const onistag = async (istag) => {
    listRef.current.reset()
    console.log(123, istag)
    await setState((draft) => {
      draft.istag = istag
      draft.list = []
      draft.oddList = []
      draft.evenList = []
    })
  }

  // 列表
  const fetch = async ({ pageIndex = 1, pageSize = 10 }) => {
    Taro.showLoading()
    let { curTagId, istag, val } = state
    const params = {
      page: pageIndex,
      pageSize,
      topics: [...curTagId],
      sort: istag == 1 ? 'likes desc' : 'created desc',
      content: val
    }
    const { list, total_count: total } = await api.mdugc.postlist(params)

    let nList = pickBy(list, doc.mdugc.MDUGC_NLIST)

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

    return { total }
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
            onClick={onHandleMenuItem.bind(this, '/subpages/mdugc/pages/member/index2')}
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
        keyword={val}
        placeholder='搜索'
        onFocus={() => false}
        onCancel={() => { }}
        onChange={shonChange.bind(this)}
        onClear={shonClear.bind(this)}
        onConfirm={shonConfirm.bind(this)}
      />

      <View>
        <SpTagBar
          className='ugc-tag'
          list={tagsList}
          value={tagsList[curTagIndex]?.tag_id}
        />

        <View className='ugc-filter'>
          <SpTagBar
            list={filterList}
            value={filterList[curFilterIndex]?.tag_id}
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
              {leftList.map((list, idx) => {
                return list?.map((item) => {
                  return (
                    <View className='ugcindex_list__scroll_scrolls_item' key={item.item_id}>
                      <Scrollitem item={item} setlikes={updatelist} />
                    </View>
                  )
                })
              })}
            </View>
            <View className='right-container'>
              {rightList.map((list, idx) => {
                return list?.map((item) => {
                  return (
                    <View className='ugcindex_list__scroll_scrolls_item' key={item.item_id}>
                      <Scrollitem item={item} setlikes={updatelist} />
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
