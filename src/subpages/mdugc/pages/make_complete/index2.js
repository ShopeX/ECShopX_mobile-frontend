
import React, { Component,useEffect } from 'react'
import Taro , { useRouter } from '@tarojs/taro'
import { View, Text , Image , ScrollView } from '@tarojs/components'
import S from '@/spx'
import { useImmer } from 'use-immer'
import {SearchBar} from '../../components'
import { SpNote , BackToTop , GoodsItem, Loading } from "@/components";
import { pickBy } from "@/utils";
import { withPager, withBackToTop } from '@/hocs'
import entry from "@/utils/entry";
import doc from '@/doc'

import api from "@/api";


//import '../../font/iconfont.scss'
import './index.scss'

const initialState = {
      list: [],
      val:'',//搜索框
      query: {
        keywords: ''
      },
      oddList:[],
      evenList:[]
}

function MakeComplete(){

  const [state, setState] = useImmer(initialState)
  const router = useRouter()

  useEffect(()=>{
    initData()
  })

  const initData = async() => {
    const isOpenStore = await entry.getStoreStatus()
    const { store_id } = Taro.getStorageSync('curStore')

    this.setState(draft=>{
      draft.isOpenStore = isOpenStore,
      draft.query = {
        keywords: '',
        item_type: 'normal',
        is_point: 'false',
        distributor_id:isOpenStore ? store_id : '',
        approve_status: 'onsale,only_show',
        category:'',
        main_category:''
      }
    },()=>{
      // this.nextPage()
    })
  }

  // 列表
  const fetch = async(params) => {
    const { isOpenStore } = state

    const { page_no: page, page_size: pageSize } = params
    const { distributor_id,store_id } = Taro.getStorageSync('curStore')

    const query = {
      ...state.query,
      page,
      pageSize,
    }
    if (process.env.APP_PLATFORM === 'standard'){
      query.distributor_id = isOpenStore ? store_id : distributor_id
    }

    // const { list, total_count: total } = await api.mdugc.yuyueActivityList(params)
    const { list, total_count: total} = await api.item.search(query)
    console.log("list, total",list, total)

    const nList = pickBy(list, doc.mdugc.MAKE_COMPLETE_LIST)

    let odd = [], even = []
    nList.map((item, idx) => {
      if (idx % 2 == 0) {
        odd.push(item)
      } else {
        even.push(item)
      }
    })
    setState(draft=>{
      draft.list = [...this.state.list, ...nList],
      draft.oddList = [...this.state.oddList, ...odd],
      draft.evenList = [...this.state.evenList, ...even],
      draft.query = query
    })

    return { total }
  }
  const handleClickItem = (item) => {
    console.log("item",item)
  }
  const topages=(item)=>{
    let pages = Taro.getCurrentPages(); // 获取当前的页面栈
    let prevPage = pages[pages.length-2]; // 获取上一页面
    prevPage.setData({ //设置上一个页面的值
      complete: item
    });
    Taro.navigateBack({
      delta: 1
    });
  }

  const { list , page , query , showBackToTop , scrollTop , oddList, evenList } = state
    return (
      <View className="ugcindex">
        <View className='ugcindex_search'>
          <SearchBar
            onChange={shonChange}
            onClear={shonClear}
            onConfirm={shonConfirm}
            _placeholder="请输入"
            keyword={query.keywords}
          ></SearchBar>
        </View>

        <View className='ugcindex_list'>

          <ScrollView
            scrollY
            className='ugcindex_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
              <View className="ugcindex_list__scroll_scrolls">
                    <View className='ugcindex_list__scroll_scrolls_item'>
                      {
                        oddList?.map((item)=>{
                          return(
                            <GoodsItem
                              key={item.item_id}
                              info={item}
                              onClick={() => this.topages(item)}
                            />
                          )
                        })
                      }

                    </View>
                    <View className='ugcindex_list__scroll_scrolls_item'>
                      {
                        evenList?.map((item)=>{
                          return(
                            <GoodsItem
                              key={item.item_id}
                              info={item}
                              onClick={() => this.topages(item)}
                            />
                          )
                        })
                      }
                    </View>
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
export default MakeComplete


@withPager
@withBackToTop

export default class make_complete extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      val:'',//搜索框
      query: {
        keywords: ''
      },
      oddList:[],
      evenList:[]
    }
  }
  async componentDidMount(){
    const isOpenStore = await entry.getStoreStatus()
    const { store_id } = Taro.getStorageSync('curStore')
    this.setState({
      isOpenStore
    })
    this.setState({
      query: {
        keywords: '',
        item_type: 'normal',
        is_point: 'false',
        distributor_id:isOpenStore ? store_id : '',
        approve_status: 'onsale,only_show',
        category:'',
        main_category:''
      }
    },()=>{
      this.nextPage()
    })
  }
  config = {
    navigationBarTitleText: '添加商品',
  }
  componentDidShow () {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
  }
  // 搜索
  shonChange=(val)=>{
    console.log("输入框值改变",val)
  }
  shonClear=()=>{
    console.log("清除")
    let{query}=this.state
    this.resetPage()
    query.keywords=''
    this.setState({
      query,
      list: [],
      oddList:[],
      evenList:[]
    }, () => {
      this.nextPage()
    })
  }
  shonConfirm=(val)=>{
    console.log("完成触发",val)
    let{query}=this.state
    this.resetPage()
    query.keywords=val
    this.setState({
      query,
      list: [],
      oddList:[],
      evenList:[]
    }, () => {
      this.nextPage()
    })
  }

  // 列表
  async fetch (params) {
    const { isOpenStore } = this.state

    const { page_no: page, page_size: pageSize } = params
    const { distributor_id,store_id } = Taro.getStorageSync('curStore')

    const query = {
      ...this.state.query,
      page,
      pageSize,
    }
    if (process.env.APP_PLATFORM === 'standard'){
      query.distributor_id = isOpenStore ? store_id : distributor_id
    }

    // const { list, total_count: total } = await api.mdugc.yuyueActivityList(params)
    const { list, total_count: total} = await api.item.search(query)
    console.log("list, total",list, total)

    const nList = pickBy(list, {
      img: ({ pics }) => pics ? typeof pics !== 'string' ? pics[0] : JSON.parse(pics)[0] : '',
      item_id: 'item_id',
      title: ({ itemName, item_name }) => itemName ? itemName : item_name,
      desc: 'brief',
      distributor_id: 'distributor_id',
      distributor_info: 'distributor_info',
      promotion_activity_tag: 'promotion_activity',
      origincountry_name: 'origincountry_name',
      origincountry_img_url: 'origincountry_img_url',
      type: 'type',
      price: ({ price }) => (price/100).toFixed(2),
      member_price: ({ member_price }) => (member_price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2)
    })

    let odd = [], even = []
    nList.map((item, idx) => {
      if (idx % 2 == 0) {
        odd.push(item)
      } else {
        even.push(item)
      }
    })
    this.setState({
      list: [...this.state.list, ...nList],
      oddList: [...this.state.oddList, ...odd],
      evenList: [...this.state.evenList, ...even],
      query
    })

    return { total }
  }
  handleClickItem = (item) => {
    console.log("item",item)
  }
  topages=(item)=>{
    let pages = Taro.getCurrentPages(); // 获取当前的页面栈
    let prevPage = pages[pages.length-2]; // 获取上一页面
    prevPage.setData({ //设置上一个页面的值
      complete: item
    });
    Taro.navigateBack({
      delta: 1
    });

  }



  render () {
    const { list , page , query , showBackToTop , scrollTop , oddList, evenList } = this.state
    return (
      <View className="ugcindex">
        <View className='ugcindex_search'>
          <SearchBar
            onChange={this.shonChange.bind(this)}
            onClear={this.shonClear.bind(this)}
            onConfirm={this.shonConfirm.bind(this)}
            _placeholder="请输入"
            keyword={query.keywords}
          ></SearchBar>
        </View>

        <View className='ugcindex_list'>

          <ScrollView
            scrollY
            className='ugcindex_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
              <View className="ugcindex_list__scroll_scrolls">
                    <View className='ugcindex_list__scroll_scrolls_item'>
                      {
                        oddList.map((item)=>{
                          return(
                            <GoodsItem
                              key={item.item_id}
                              info={item}
                              onClick={() => this.topages(item)}
                            />
                          )
                        })
                      }

                    </View>
                    <View className='ugcindex_list__scroll_scrolls_item'>
                      {
                        evenList.map((item)=>{
                          return(
                            <GoodsItem
                              key={item.item_id}
                              info={item}
                              onClick={() => this.topages(item)}
                            />
                          )
                        })
                      }
                    </View>
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
