
import React, { Component,useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text , Image , ScrollView } from '@tarojs/components'
import S from '@/spx'
import { useImmer } from 'use-immer'
import {SearchBar} from '../../components'
import { SpNote , BackToTop, Loading } from "@/components";
import { pickBy } from "@/utils";
import { withPager, withBackToTop } from '@/hocs'
import doc from '@/doc'

import api from "@/api";

//import '../../font/iconfont.scss'
import './index2.scss'


const initialState = {
  list: [],
  val:'',//搜索框
}

function MakeCollection(props){
  const [state, setState] = useImmer(initialState)
  const router = useRouter()

  useEffect(()=>{
    initHandle()
  })

  const initHandle =  async () => {
    let {num}=router.params
    let data={
      type:"favoritePost"
    }
    if(num){
      let {type}=await api.mdugc.messagesetTohasRead(data)

    }
    // this.nextPage()
  }

  // 列表
  const fetch =  async(params) => {
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      type:"favoritePost"
    }
    const { list, total_count: total } = await api.mdugc.messagelist(params)
    console.log("list, total",list, total)

    const nList = pickBy(list, doc.mdugc.MAKE_COLLECTION_LIST)
    setState(draft => {
      draft.list = [...state.list, ...nList]
    })

    return { total }
  }
  topages=(url)=>{
    console.log("url",url)
    Taro.navigateTo({ url })
  }

  const { list , page , showBackToTop , scrollTop } = state
    return (
      <View className="collection">

        <View className='collection_list'>

          <ScrollView
            scrollY
            className='collection_list__scroll'
            // scrollTop={scrollTop}
            scrollWithAnimation
            // onScroll={this.handleScroll}
            // onScrollToLower={this.nextPage}
          >
              <View className="collection_list__scroll_scrolls">
                    {
                        list?.map(item => {
                            return (
                              <View className="collection_list__scroll_scrolls_item" onClick={topages.bind(this,`/mdugc/pages/make_details/index?item_id=${item.post_id}`)}>
                                  <View className='collection_list__scroll_scrolls_item_l'>
                                    <Image className='collection_list__scroll_scrolls_item_l_img' mode='aspectFill' src={item.from_userInfo.avatar} />
                                  </View>
                                  <View className='collection_list__scroll_scrolls_item_cen'>
                                    <View className='collection_list__scroll_scrolls_item_cen_title'>
                                      {item.from_nickname}
                                    </View>
                                    <View className='collection_list__scroll_scrolls_item_cen_text'>
                                      <View className='collection_list__scroll_scrolls_item_cen_text_word'>
                                        {item.title}
                                      </View>
                                      <View className='collection_list__scroll_scrolls_item_cen_text_time'>{item.time}</View>
                                    </View>
                                  </View>
                                  <View className='collection_list__scroll_scrolls_item_r'>
                                    <Image className='collection_list__scroll_scrolls_item_r_img' mode='aspectFill' src={item.postInfo.cover} />
                                  </View>
                              </View>
                                )
                        })
                    }
              </View>
              {/* {
                page.isLoading && <Loading>正在加载...</Loading>
              }
              {
                !page.isLoading && !page.hasNext && !list.length
                && (<SpNote img='trades_empty.png'>列表页为空!</SpNote>)
              } */}
          </ScrollView>
        </View>

        {/* <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
          bottom={150}
        /> */}
      </View>
    )

}

export default MakeCollection




@withPager
@withBackToTop

export default class make_collection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      val:'',//搜索框
    }
  }

  async componentDidMount () {
    let {num}=this.$router.params
    let data={
      type:"favoritePost"
    }
    if(num){
      let {type}=await api.mdugc.messagesetTohasRead(data)

    }
    this.nextPage()
  }
  config = {
    navigationBarTitleText: '收到的收藏',
  }
  // 列表
  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      type:"favoritePost"
    }
    const { list, total_count: total } = await api.mdugc.messagelist(params)
    console.log("list, total",list, total)

    const nList = pickBy(list, {
      postInfo:"postInfo",
      item_id:"article_id",
      title:"title",
      from_userInfo:'from_userInfo',
      content:'content',
      time:'created_moment',
      from_nickname:'from_nickname',
      post_id:'post_id'
    })
    this.setState({
      list: [...this.state.list, ...nList]
    })

    return { total }
  }
  topages=(url)=>{
    console.log("url",url)
    Taro.navigateTo({ url })
  }


  render () {
    const { list , page , showBackToTop , scrollTop } = this.state
    return (
      <View className="collection">

        <View className='collection_list'>

          <ScrollView
            scrollY
            className='collection_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
              <View className="collection_list__scroll_scrolls">
                    {
                        list.map(item => {
                            return (
                              <View className="collection_list__scroll_scrolls_item" onClick={this.topages.bind(this,`/mdugc/pages/make_details/index?item_id=${item.post_id}`)}>
                                  <View className='collection_list__scroll_scrolls_item_l'>
                                    <Image className='collection_list__scroll_scrolls_item_l_img' mode='aspectFill' src={item.from_userInfo.avatar} />
                                  </View>
                                  <View className='collection_list__scroll_scrolls_item_cen'>
                                    <View className='collection_list__scroll_scrolls_item_cen_title'>
                                      {item.from_nickname}
                                    </View>
                                    <View className='collection_list__scroll_scrolls_item_cen_text'>
                                      <View className='collection_list__scroll_scrolls_item_cen_text_word'>
                                        {item.title}
                                      </View>
                                      <View className='collection_list__scroll_scrolls_item_cen_text_time'>{item.time}</View>
                                    </View>
                                  </View>
                                  <View className='collection_list__scroll_scrolls_item_r'>
                                    <Image className='collection_list__scroll_scrolls_item_r_img' mode='aspectFill' src={item.postInfo.cover} />
                                  </View>
                              </View>
                                )
                        })
                    }
              </View>
              {
                page.isLoading && <Loading>正在加载...</Loading>
              }
              {
                !page.isLoading && !page.hasNext && !list.length
                && (<SpNote img='trades_empty.png'>列表页为空!</SpNote>)
              }
          </ScrollView>
        </View>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
          bottom={150}
        />
      </View>
    )
  }
}
