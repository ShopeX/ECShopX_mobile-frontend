
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text , Image , ScrollView } from '@tarojs/components'
import S from '@/spx'
import {SearchBar,TagsBarcheck,Scrollitem} from '../../components'
import { SpNote , BackToTop , FloatMenus , FloatMenuItem, SpTabbar } from "@/components";
import { pickBy } from "@/utils";
import { connect } from 'react-redux'
import { withPager, withBackToTop } from '@/hocs'

import api from "@/api";


//import '../../font/iconfont.scss'
import './index.scss'
@connect(
  ({ member }) => ({
    memberData: member.member
  }),dispatch => ({
    setMemberInfo: memberInfo =>
      dispatch({ type: "member/init", payload: memberInfo })
  })
)
@withPager
@withBackToTop
export default class mdugcindex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      list: [],
      oddList:[],
      evenList:[],
      curTagId:[],//标签
      istag:1,//时间、热度
      val:'',//搜索框
      tagsList:[],
      refresherTriggered:false
    }
  }

 async  componentDidMount () {
    const res = await S.getMemberInfo()
    this.props.setMemberInfo(res)
    console.log(123,this.props)
    this.gettopicslist()
    this.nextPage()
  }
  config = {
    navigationBarTitleText: '社区',
  }
  componentDidShow () {

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
  // 更新列表
  updatelist=(post_id,type,likes)=>{
    let {list,oddList,evenList}=this.state
    let idx=list.findIndex(item=>item.item_id==post_id)
    let idx_odd=oddList.findIndex(item=>item.item_id==post_id)
    let idx_even=evenList.findIndex(item=>item.item_id==post_id)
    let that=this
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
        list=that.setlist(list,idx,type,likes)
        // if(idx_odd>=0){
        //   oddList=that.setlist(oddList,idx_odd,type)
        // }else{
        //   evenList=that.setlist(evenList,idx_even,type)
        // }
        console.log("这是改后数据",list,oddList,evenList)
      }
      this.setState({
        list,
        oddList,
        evenList
      })
    }
  }
  setlist=(lists,idxs,types,likes)=>{
    let listi=lists,idx=idxs,type=types;
    listi[idx].isheart=type
    listi[idx].likes=likes
    return listi
  }
  gettopicslist=async()=>{
    let data={
      page:1,
      pageSize:8
    }
    let { list } = await api.mdugc.topiclist(data)
    let nList = pickBy(list, {
      topic_id:"topic_id",
      topic_name:"topic_name"
    })
    this.setState({
      tagsList:nList
    })

  }
  // 搜索
  shonChange=(val)=>{
    // console.log("输入框值改变",val)
  }
  shonClear=()=>{
    console.log("清除")
    this.resetPage()
    this.setState({
      list: [],
      oddList: [],
      evenList: []
    })

    this.setState({
      val:''
    }, () => {
      this.nextPage()
    })
  }
  shonConfirm=(val)=>{
    console.log("完成触发",val)
    this.resetPage()
    this.setState({
      list: [],
      oddList: [],
      evenList: []
    })

    this.setState({
      val
    }, () => {
      this.nextPage()
    })
  }
  // 标签
  handleTagChange=(id)=>{
    console.log("这是选中标签",id)
    let {curTagId}=this.state
    this.resetPage()
    this.setState({
      list: [],
      oddList: [],
      evenList: []
    })
    let idx=curTagId.findIndex((item)=>{
      return item==id
    })
    if(idx>=0){
      curTagId.splice(idx,1)
    }else{
      curTagId.push(id)
    }
    this.setState({
      curTagId
    }, () => {
      this.nextPage()
    })
  }
  // 热度
  onistag=(istag)=>{
    this.resetPage()
    this.setState({
      list: [],
      oddList: [],
      evenList: []
    })

    this.setState({
      istag
    }, () => {
      this.nextPage()
    })
  }
  // 列表
  async fetch (params) {
    Taro.showLoading({
      title: '正在加载...',
    })
    let {curTagId , istag , val , refresherTriggered}=this.state
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize,
      topics:[...curTagId],
      sort:(istag==1?'likes desc':'created desc'),
      content:val
    }
    const { list, total_count: total } = await api.mdugc.postlist(params)
    console.log("list, total",list, total)
    let nList=[]
    if(list){
      nList = pickBy(list, {
        image_url:"cover",
        head_portrait:"userInfo.headimgurl",
        item_id:"post_id",
        title:"title",
        author:"userInfo.nickname",
        user_id:"userInfo.user_id",
        likes:"likes",
        isheart:'like_status',
        badges:'badges'
      })
    }


    console.log("这是nlist",nList)

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
      refresherTriggered:false
    },()=>{
      Taro.hideLoading()
    })

    return { total }
  }
  handleClickItem = (item) => {
    console.log("item",item)
  }
  // 浮动按钮跳转
  topages=(url)=>{
    const isAuth = S.getAuthToken()
    if (!isAuth) {
      Taro.showToast({
        icon:'none',
        title: '请先登录'
      })
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url:"/pages/member/index"
      //   })
      // }, 1000)

      return
    }
    console.log("url",url)
    Taro.navigateTo({ url })
  }
  // 自定义下拉刷新
  onRefresherRefresh =  () => {
    const { refresherTriggered } = this.state;
    // 正处于刷新状态
    if(refresherTriggered) return
    this.setState({
      refresherTriggered: true  // 手动调整刷新状态
    })

    this.resetPage()
    this.setState({
      list: [],
      oddList: [],
      evenList: []
    },()=>{
      this.nextPage()
    })
  }




  render () {
    const { val , curTagId , tagsList , list , page , oddList , evenList , istag , showBackToTop , scrollTop , refresherTriggered } = this.state
    return (
      <View className="ugcindex">
        <View className='ugcindex_search'>
          <SearchBar
            onChange={this.shonChange.bind(this)}
            onClear={this.shonClear.bind(this)}
            onConfirm={this.shonConfirm.bind(this)}
            _placeholder="搜索内容"
            bgc={true}
            keyword={val}
          ></SearchBar>
        </View>
        <View className='ugcindex_tagsbar'>
          {
            tagsList.length &&
            <TagsBarcheck
              current={curTagId}
              list={tagsList}
              onChange={this.handleTagChange.bind(this)}
            />
          }
        </View>
        <View className='ugcindex_list'>
          <View className='ugcindex_list__tag'>
            <View onClick={this.onistag.bind(this,2)} className={ istag==2?'ugcindex_list__tag_i icon-shijian ugcindex_list__tag_iact':'ugcindex_list__tag_i icon-shijian'}>时间</View>
            <View onClick={this.onistag.bind(this,1)} className={ istag==1?'ugcindex_list__tag_i icon-shoucang ugcindex_list__tag_iact':'ugcindex_list__tag_i icon-shoucang'}>热度</View>
          </View>
          <ScrollView
            scrollY
            className='ugcindex_list__scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
            refresherEnabled={true}
            refresherTriggered={refresherTriggered}
	          onRefresherRefresh={this.onRefresherRefresh}
            lowerThreshold={100}
          >
              <View className="ugcindex_list__scroll_scrolls">
                <View className='ugcindex_list__scroll_scrolls_left'>
                {
                        oddList.map(item => {
                            return (
                              <View className="ugcindex_list__scroll_scrolls_item" key={item.item_id}>
                                <Scrollitem
                                  item={item}
                                  setlikes={this.updatelist}
                                />
                              </View>
                                )
                        })
                    }
                </View>
                <View className='ugcindex_list__scroll_scrolls_right'>
                    {
                        evenList.map(item => {
                            return (
                              <View className="ugcindex_list__scroll_scrolls_item" key={item.item_id}>
                                <Scrollitem
                                  item={item}
                                  setlikes={this.updatelist}
                                />
                              </View>
                                )
                        })
                    }
                </View>
              </View>
              {/* {
                page.isLoading && <Loading key={page.isLoading}>正在加载...</Loading>
              } */}

              {/* {
                !page.isLoading && !page.hasNext && list.length==page.total
                && (<View className='ugcindex_list__scroll_end'>—— ——人家是有底线的—— ——</View>)
              } */}
              {
                !page.isLoading && !page.hasNext && !list.length
                && (<SpNote img='trades_empty.png'>列表页为空!</SpNote>)
              }
          </ScrollView>
        </View>
        {/* <TabBar
          current={0}
        ></TabBar> */}
        <SpTabbar />
        <View className={showBackToTop?"ugcindex_floatmenus":""}>
          <FloatMenus>
            <FloatMenuItem
              iconPrefixClass="icon"
              icon="gerenzhongxin"
              onClick={this.topages.bind(this,'/subpages/mdugc/pages/member/index')}
            />
            <FloatMenuItem
              iconPrefixClass="icon"
              icon="jiahao"
              onClick={this.topages.bind(this,'/subpages/mdugc/pages/make/index')}

            />
          </FloatMenus>
        </View>
        {
          showBackToTop?(
            <BackToTop
              show={showBackToTop}
              onClick={this.scrollBackToTop}
              bottom={150}
            />
          ):null
        }

      </View>
    )
  }
}
