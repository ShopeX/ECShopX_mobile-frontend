import React, { useEffect, useState, useCallback, useRef } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { pickBy, navigateTo } from '@/utils'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpToast,
  Loading,
  SpNote,
  SearchBar,
  SpScrollView,
  SpTabbar,
  FloatMenus,
  FloatMenuItem,
  SpPage,
  SpFloatMenuItem,
  SpDefault,
  CompTabbar
} from '@/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import { TagsBarcheck, Scrollitem } from '../../components'
import doc from '@/doc'
import S from '@/spx'

import './index2.scss'

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
  curTagId: '',
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
  istag: 1
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
  const listRef = useRef()

  const dispatch = useDispatch()

  useEffect(() => {
    gettopicslist()

    initHandle()
    // fetch()
    // nextPage()
  }, [])

  useEffect(() => {
    getUgcList()
  }, [curTagId, istag])

  // componentDidShow () {
  const initHandle = () => {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#eeeeee',
    })
    let pages = Taro.getCurrentPages();
    let currentPage = pages[pages.length - 1]; // 获取当前页面
    if (currentPage.__data__.delete) { // 获取值
      console.log("这是笔记详情传递的删除数据",currentPage.__data__.delete)
      let post_id=currentPage.__data__.delete
      this.updatelist(post_id,"delete")
      setTimeout(() => {
        currentPage.setData({ //清空上一页面传递值
          delete:''
        });
      }, 1000);

    }else if(currentPage.__data__.heart){
      console.log("这是笔记详情传递的点赞数据",currentPage.__data__.heart)
      let heart=currentPage.__data__.heart
      this.updatelist(heart.item_id,heart.isheart,heart.likes)
      setTimeout(() => {
        currentPage.setData({ //清空上一页面传递值
          heart:''
        });
      }, 1000);
    }
  }


  const getUgcList = async () => {
    await setState((draft) => {
      draft.list = []
      draft.oddList = []
      draft.evenList = []
    })
    listRef.current.reset()
  }

   // 更新列表
  const updatelist=(post_id,type,likes)=>{
    let {list,oddList,evenList}=state
    let idx=list.findIndex(item=>item.item_id==post_id)
    let idx_odd=oddList.findIndex(item=>item.item_id==post_id)
    let idx_even=evenList.findIndex(item=>item.item_id==post_id)
    console.log("这是下标",idx,idx_odd,idx_even)
    if(idx>=0){
      if(type=='delete'){
        list.splice(idx,1)
        if(idx_odd>=0){
          oddList.splice(idx_odd,1)
        }else{
          evenList.splice(idx_even,1)
        }
      }else{
        list=setlist(list,idx,type,likes)
        // if(idx_odd>=0){
        //   oddList=that.setlist(oddList,idx_odd,type)
        // }else{
        //   evenList=that.setlist(evenList,idx_even,type)
        // }
        console.log("这是改后数据",list,oddList,evenList)
      }
      setState(draft=>{
        draft.list = list,
        draft.oddList = oddList,
        draft.evenList = evenList
      })
    }
  }

  const setlist=(lists,idxs,types,likes)=>{
    let listi=lists,idx=idxs,type=types;
    listi[idx].isheart=type
    listi[idx].likes=likes
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
      ;(draft.list = []), (draft.oddList = []), (draft.evenList = []), (draft.val = '')
    })
    listRef.current.reset()
  }
  const shonConfirm = (val) => {
    console.log('完成触发', val)
    // resetPage()
    setState((draft) => {
      ;(draft.list = []), (draft.oddList = []), (draft.evenList = []), (draft.val = val)
    })
    listRef.current.reset()
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
    let nList = pickBy(list, doc.mdugc.MDUGC_TOPICLIST)
    setState((draft) => {
      draft.tagsList = nList
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
  const fetch = async ({ pageIndex = 2, pageSize = 10 }) => {
    Taro.showLoading({
      title: '正在加载...'
    })
    let { curTagId, istag, val } = state
    const params = {
      page: pageIndex,
      pageSize,
      topics: [...curTagId],
      sort: istag == 1 ? 'likes desc' : 'created desc',
      content: val
    }
    const { list, total_count: total } = await api.mdugc.postlist(params)
    console.log('list, total', list, total)
    let nList = []
    if (list) {
      nList = pickBy(list, doc.mdugc.MDUGC_NLIST)
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
    Taro.hideLoading()

    return { total }
  }

  // 浮动按钮跳转
  const topages = (url) => {
    const isAuth = S.getAuthToken()
    if (!isAuth) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      return
    }
    console.log('url', url)
    Taro.navigateTo({ url })
  }

  console.log('---------', state.istag)
  const { val, tagsList, curTagId, istag, oddList, evenList, list } = state
  return (
    <View className='ugcindex'>
      <View className='ugcindex_search'>
        <SearchBar
          // showDailog={false}
          keyword={val}
          placeholder='搜索'
          onFocus={() => false}
          onCancel={() => {}}
          onChange={shonChange.bind(this)}
          onClear={shonClear.bind(this)}
          onConfirm={shonConfirm.bind(this)}
        />
      </View>

      {/* {tagsList?.length !== 0 && list?.length !== 0 && ( */}
        <SpPage
          scrollToTopBtn
          renderFloat={
            <View className='float-icon'>
              <SpFloatMenuItem
                style={{ fontSize: '38px' }}
                onClick={topages.bind(this,'/subpages/mdugc/pages/member/index2')}
              >
                <Text className='iconfont icon-huiyuanzhongxin'></Text>
              </SpFloatMenuItem>
              <SpFloatMenuItem
                onClick={topages.bind(this,'/subpages/mdugc/pages/make/index2')}
              >
                <Text className='iconfont icon-tianjia1'></Text>
              </SpFloatMenuItem>
            </View>
          }
          renderFooter={<SpTabbar />}
        >
          <View>
            <View className='ugcindex_tagsbar'>
              {tagsList?.length && (
                <TagsBarcheck
                  current={curTagId}
                  list={tagsList}
                  onChange={handleTagChange.bind(this)}
                />
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
              <SpScrollView
                className='ugcindex_list__scroll'
                auto={false}
                ref={listRef}
                fetch={fetch}
              >
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
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
                <View>1</View>
              </SpScrollView>
            </View>
          </View>
        </SpPage>
      {/*  )} */}

      {/* {tagsList?.length == 0 && list?.length == 0 && (
        <>
          <SpNote img='trades_empty.png' isUrl>
            暂无更新~先去商城看看
          </SpNote>
          <Button
            className='pay-button'
            style={{ backgroundColor: '#009bd4' }}
            onClick={navigateTo.bind(this, '/pages/index', true)}
          >
            去选购
          </Button>
          <SpTabbar />
        </>
       )}  */}

    </View>

    // <View className='ugcindex'>
    //   <View className='ugcindex_search'>
    //     <SearchBar
    //       // showDailog={false}
    //       keyword={val}
    //       placeholder='搜索'
    //       onFocus={() => false}
    //       onCancel={() => {}}
    //       onChange={shonChange.bind(this)}
    //       onClear={shonClear.bind(this)}
    //       onConfirm={shonConfirm.bind(this)}
    //     />
    //   </View>
    //   <View className='ugcindex_tagsbar'>
    //     {tagsList?.length && (
    //       <TagsBarcheck current={curTagId} list={tagsList} onChange={handleTagChange.bind(this)} />
    //     )}
    //   </View>
    //   <View className='ugcindex_list'>
    //     <View className='ugcindex_list__tag'>
    //       <View
    //         onClick={onistag.bind(this, 1)}
    //         className={
    //           istag == 1
    //             ? 'ugcindex_list__tag_i icon-shijian ugcindex_list__tag_iact'
    //             : 'ugcindex_list__tag_i icon-shijian'
    //         }
    //       >
    //         最热
    //       </View>
    //       <View
    //         onClick={onistag.bind(this, 2)}
    //         className={
    //           istag == 2
    //             ? 'ugcindex_list__tag_i icon-shoucang ugcindex_list__tag_iact'
    //             : 'ugcindex_list__tag_i icon-shoucang'
    //         }
    //       >
    //         最新
    //       </View>
    //     </View>

    //     <SpScrollView className='ugcindex_list__scroll' auto={false} ref={listRef} fetch={fetch}>
    //       <View className='ugcindex_list__scroll_scrolls'>
    //         <View className='ugcindex_list__scroll_scrolls_left'>
    //           {oddList?.map((item) => {
    //             return (
    //               <View className='ugcindex_list__scroll_scrolls_item' key={item.item_id}>
    //                 <Scrollitem item={item} setlikes={this.updatelist} />
    //               </View>
    //             )
    //           })}
    //         </View>
    //         <View className='ugcindex_list__scroll_scrolls_right'>
    //           {evenList?.map((item) => {
    //             return (
    //               <View className='ugcindex_list__scroll_scrolls_item' key={item.item_id}>
    //                 <Scrollitem item={item} setlikes={this.updatelist} />
    //               </View>
    //             )
    //           })}
    //         </View>
    //       </View>
    //       {/* {
    //             page.isLoading && <Loading key={page.isLoading}>正在加载...</Loading>
    //           } */}

    //       {/* {
    //             !page.isLoading && !page.hasNext && list.length==page.total
    //             && (<View className='ugcindex_list__scroll_end'>—— ——人家是有底线的—— ——</View>)
    //           } */}
    //       {/* {
    //             !page.isLoading && !page.hasNext && !list.length
    //             && (<SpNote img='trades_empty.png'>列表页为空!</SpNote>)
    //           } */}
    //     </SpScrollView>

    //   </View>
    //   <View className={'ugcindex_floatmenus'}>
    //       <FloatMenus>
    //         <FloatMenuItem
    //           iconPrefixClass='icon'
    //           icon='tianjia1'
    //           onClick={topages.bind(this,'/subpages/mdugc/pages/member/index')}
    //         />
    //         <FloatMenuItem
    //           iconPrefixClass='icon'
    //           icon='tianjia1'
    //           onClick={topages.bind(this,'/subpages/mdugc/pages/make/index')}

    //         />
    //       </FloatMenus>
    //     </View>
    //   <SpTabbar />
    //   <SpToast />
    // </View>
  )
}

export default MdugcIndex
