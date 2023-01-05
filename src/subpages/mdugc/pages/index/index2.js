import React, { useEffect, useState, useCallback } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { pickBy } from '@/utils'
import { View, Image, ScrollView } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpToast, Loading, SpNote, SearchBar } from '@/components'
import api from '@/api'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import { TagsBarcheck, Scrollitem } from '../../components'

import './index2.scss'

const initialState = {
  list: [],
  oddList: [],
  evenList: [],
  curTagId: [], //标签
  istag: 1, //时间、热度
  val: '', //搜索框
  tagsList: [],
  refresherTriggered: false,
  page:{
    page_no: 1, page_size: 10
  }
}

function MdugcIndex() {
  const [state, setState] = useImmer(initialState)
  const { initState, openRecommend, openLocation, openStore, appName } = useSelector(
    (state) => state.sys
  )

  const [policyModal, setPolicyModal] = useState(false)
  const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { openScanQrcode } = useSelector((state) => state.sys)
  const { setNavigationBarTitle } = useNavigation()

  const dispatch = useDispatch()

  useEffect(() => {
    gettopicslist()
    fetch(state.page)
    // nextPage()
  }, [])

  // 搜索
  const shonChange = (val) => {
    // console.log("输入框值改变",val)
  }
  const shonClear = () => {
    console.log('清除')
    // resetPage()
    setState((draft) => {
      ;(draft.list = []), (draft.oddList = []), (draft.evenList = []), (draft.val = '')
    })
  }
  const shonConfirm = (val) => {
    console.log('完成触发', val)
    // resetPage()
    setState((draft) => {
      ;(draft.list = []), (draft.oddList = []), (draft.evenList = []), (draft.val = val)
    })
  }

  const handleTagChange = (id) => {
    console.log('这是选中标签', id)
    let { curTagId } = state
    // this.resetPage()
    setState((draft) => {
      ;(draft.list = []), (draft.oddList = []), (draft.evenList = [])
    })
    let idx = curTagId.findIndex((item) => {
      return item == id
    })
    if (idx >= 0) {
      curTagId.splice(idx, 1)
    } else {
      curTagId.push(id)
    }
    setState(
      (draft) => {
        draft.curTagId = curTagId
      },
      () => {
        // this.nextPage()
        console.log(123)
      }
    )
  }

  const gettopicslist = async () => {
    let data = {
      page: 1,
      pageSize: 8
    }
    let { list } = await api.mdugc.topiclist(data)
    let nList = pickBy(list, {
      topic_id: 'topic_id',
      topic_name: 'topic_name'
    })
    setState((draft) => {
      draft.tagsList = nList
    })
  }

  const onistag = (istag) => {
    // this.resetPage()
    console.log(istag)
    setState((draft) => {
      ;(draft.list = []), (draft.oddList = []), (draft.evenList = [])
    })

    setState(
      (draft) => {
        draft.istag = istag
      },
      () => {
        // nextPage()
      }
    )
  }

  // 列表
  const fetch = async (params) => {
    Taro.showLoading({
      title: '正在加载...'
    })
    let { curTagId, istag, val } = state
    const { page_no: page = 1, page_size: pageSize = 10 } = params
    params = {
      page,
      pageSize,
      topics: [...curTagId],
      sort: istag == 1 ? 'likes desc' : 'created desc',
      content: val
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
        user_id: 'userInfo.user_id',
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
        ;(draft.list = [...this.state.list, ...nList]),
          (draft.oddList = [...this.state.oddList, ...odd]),
          (draft.evenList = [...this.state.evenList, ...even]),
          (draft.refresherTriggered = false)
      },
      () => {
        Taro.hideLoading()
      }
    )

    return { total }
  }

  const { val, tagsList, curTagId, istag, oddList, evenList } = state
  return (
    <View className='ugcindex'>
      <View className='ugcindex_search'>
        <SearchBar
          showDailog={false}
          keyword={val}
          placeholder='搜索'
          onFocus={() => false}
          onCancel={() => {}}
          onChange={shonChange.bind(this)}
          onClear={shonClear.bind(this)}
          onConfirm={shonConfirm.bind(this)}
        />
      </View>
      <View className='ugcindex_tagsbar'>
        {tagsList.length && (
          <TagsBarcheck current={curTagId} list={tagsList} onChange={handleTagChange.bind(this)} />
        )}
      </View>
      <View className='ugcindex_list'>
        <View className='ugcindex_list__tag'>
          <View
            onClick={onistag.bind(this, 1)}
            className={
              istag == 1
                ? 'ugcindex_list__tag_i icon-shijian ugcindex_list__tag_iact'
                : 'ugcindex_list__tag_i icon-shijian'
            }
          >
            最热
          </View>
          <View
            onClick={onistag.bind(this, 2)}
            className={
              istag == 2
                ? 'ugcindex_list__tag_i icon-shoucang ugcindex_list__tag_iact'
                : 'ugcindex_list__tag_i icon-shoucang'
            }
          >
            最新
          </View>
        </View>
        <ScrollView
          scrollY
          className='ugcindex_list__scroll'
          // scrollTop={scrollTop}
          scrollWithAnimation
          // onScroll={this.handleScroll}
          // onScrollToLower={this.nextPage}
          // refresherEnabled={true}
          // refresherTriggered={refresherTriggered}
          // onRefresherRefresh={this.onRefresherRefresh}
          lowerThreshold={100}
        >
          <View className='ugcindex_list__scroll_scrolls'>
            <View className='ugcindex_list__scroll_scrolls_left'>
              {oddList.map((item) => {
                return (
                  <View className='ugcindex_list__scroll_scrolls_item' key={item.item_id}>
                    <Scrollitem item={item} setlikes={this.updatelist} />
                  </View>
                )
              })}
            </View>
            <View className='ugcindex_list__scroll_scrolls_right'>
              {evenList.map((item) => {
                return (
                  <View className='ugcindex_list__scroll_scrolls_item' key={item.item_id}>
                    <Scrollitem item={item} setlikes={this.updatelist} />
                  </View>
                )
              })}
            </View>
          </View>
          {/* {
                page.isLoading && <Loading key={page.isLoading}>正在加载...</Loading>
              } */}

          {/* {
                !page.isLoading && !page.hasNext && list.length==page.total
                && (<View className='ugcindex_list__scroll_end'>—— ——人家是有底线的—— ——</View>)
              } */}
          {/* {
                !page.isLoading && !page.hasNext && !list.length
                && (<SpNote img='trades_empty.png'>列表页为空!</SpNote>)
              } */}
        </ScrollView>
      </View>

      <SpToast />
    </View>
  )
}

export default MdugcIndex
