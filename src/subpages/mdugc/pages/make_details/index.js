
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text ,Input , ScrollView , Button } from '@tarojs/components'
import {Swiperugc,Popups} from '../../components'
import { FloatMenus , FloatMenuItem , BackToTop, Loading  } from "@/components";
import S from '@/spx'
import { connect } from 'react-redux'
import { withPager, withBackToTop,withPointitem } from '@/hocs'

import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import api from "@/api";

//import '../../font/iconfont.scss'
import './index.scss'
import { async } from 'regenerator-runtime';


@connect(
  ({ member }) => ({
    memberData: member.member
  })
)
@withPager
@withBackToTop
@withPointitem
export default class mdugcdetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      isoneself:false,
      file_details:{},
      theory:[],
      isOpened:false,
      inputtext:'',
      isfocus:false,
      input_bottom:0,
      isPopups:false,
      poptitle:'',
      comment_act:{
        parent:'',
        reply:''
      },
      commentlist:{},
      old_isheart:-1,
      commoditynum:0,
      totalnum:0
    }
  }
  async onShareAppMessage (res) {
    let that=this
    let {item_id}=this.$router.params
    let {file_details}=this.state
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }else if(res.from==='menu'){
      // 来自右上角转发
    }
    let data={
      post_id:item_id
    }
    const isAuth = S.getAuthToken()
    if(isAuth){
      let share=await api.mdugc.postshare(data)
      if(share.post_id==item_id){
        console.log("share",share.share_nums)
        file_details.share_nums=share.share_nums
        that.setState({
          file_details
        })
      }
    }

    return {
      title: file_details.title,
      path: `/mdugc/pages/make_details/index?item_id=${item_id}`,
      imageUrl:file_details.cover,
    }
  }
  componentDidShow(){
    let {item_id}=this.$router.params
    this.getpostdetail(item_id)
  }
  componentDidMount () {
    // 判断是否是笔记作者
    // let {item_id}=this.$router.params
    // this.getpostdetail(item_id)
  }
  // 获取详情
  getpostdetail=async(post_id)=>{
    Taro.showLoading({
      title: '加载中',
      mask:true
    })
    const { memberData } = this.props;
    console.log(11111,memberData)
    let {isoneself,old_isheart}=this.state
    let id=Number(post_id)
    let data={
      post_id:id
    }
    let res=await api.mdugc.postdetail(data)
    // console.log("这是笔记详情",res,res.post_info,memberData,memberData.memberInfo.user_id,res.post_info.user_id)
    isoneself=(memberData.memberInfo && (memberData.memberInfo.user_id==res.post_info.user_id))
    if(res.post_info){
      if(old_isheart==-1){
        old_isheart=res.post_info.like_status
      }
      if(res.post_info.status!=1){
        wx.hideShareMenu()
      }
      this.setState({
        file_details:res.post_info,
        isoneself,
        old_isheart
      },()=>{
        Taro.hideLoading()
        this.nextPage()
      })
    }
  }

  config = {
    navigationBarTitleText: '笔记详情',
  }
  // 浮动按钮跳转
  topages=(url)=>{
    console.log("url",url)
    Taro.navigateTo({ url })
  }
  async fetch (params) {
    let {item_id}=this.$router.params
    const { memberData } = this.props;
    const { page_no: page, page_size: pageSize } = params
    params = {
      page_no:page,
      page_size:pageSize,
      post_id:item_id,
    }
    if(memberData.memberInfo){
      params.user_id=memberData.memberInfo.user_id
    }
    const { list, total_count: total } = await api.mdugc.commentlist(params)
    console.log("list, total",list, total)

    this.setState({
      theory: [...this.state.theory, ...list]
    })

    return { total }
  }
  // 获取二级评论列表
  getcommentlist=async(item)=>{
    let {item_id}=this.$router.params
    let {commentlist}=this.state
    let comment_id=item.comment_id
    const { memberData } = this.props;
    let data={}
    if(commentlist[comment_id]){
      data={
        page_no:commentlist[comment_id].page_no,
        page_size:commentlist[comment_id].page_size,
        post_id:commentlist[comment_id].post_id,
        parent_comment_id:commentlist[comment_id].parent_comment_id
      }
    }else{
      data={
        page_no:1,
        page_size:10,
        post_id:item_id,
        parent_comment_id:item.comment_id
      }
    }
    if(memberData.memberInfo){
      data.user_id=memberData.memberInfo.user_id
    }

    const { list, total_count: total } = await api.mdugc.commentlist(data)

    data.page_no+=1
    if(commentlist[comment_id]){
      data.list=[ ...commentlist[comment_id].list,...list ]
    }else{
      data.list=[...list]
    }
    data.total=total
    commentlist[comment_id]=data
    this.setState({
      commentlist
    })

  }
  // 商品点击
  handleClickItem = (item) => {
    let url;
    if(item.item_type==="pointsmall"){//积分商城
      url=`/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}&type=pointitem`
    }else{
      url=`/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
    }
    Taro.navigateTo({
      url
    })
  }
  // 点击评论
  onopen=(parent='',reply='')=>{
    console.log("这是点击评论详情")
    let {comment_act}=this.state
    comment_act.parent=parent
    comment_act.reply=reply
    this.setState({
      isOpened:true,
      comment_act
    })
  }
  // 关闭弹窗
  closesheet=()=>{
    let {isOpened,comment_act}=this.state
    if(isOpened){
      this.setState({
        isOpened:false
      })
    }
  }
  // 回复评论
  reply=(type)=>{
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
    let that=this
    let {comment_act}=this.state
    if(type=='one'){
      console.log("一级评论")
      comment_act.parent=''
      comment_act.reply=''
      this.setState({
        inputtext:"请输入",
        isfocus:true,
        comment_act
      })
    }else{
      console.log("二级评论_回复")
      this.closesheet()
      let name=''

      if(comment_act.reply){
        // 回复二级评论
        name=comment_act.reply.nickname
      }else if(comment_act.parent){
        // 回复一级评论
        name=comment_act.parent.nickname
      }
      this.setState({
        inputtext:`回复 @${name}：`,
        isfocus:true
      })
    }
  }
  // 删除评论
  deletecomment=()=>{
    this.setState({
      isPopups:true,
      poptitle:'确认要删除该评论吗？'
    })
    this.closesheet()
  }
  // 输入完成
  setinput=async(e)=>{
    console.log("这是文本",e,e.detail.value)
    let {theory,comment_act,commentlist,page,totalnum}=this.state
    let {item_id}=this.$router.params
    const { memberData } = this.props;
    let data={
      user_id :memberData.memberInfo.user_id,
      post_id :item_id,
      content:e.detail.value
    }
    console.log("这是选中信息",comment_act)

    if(comment_act.reply){
      // 回复二级评论
      console.log("回复二级评论")
      data.reply_comment_id=comment_act.reply.comment_id
      data.parent_comment_id=comment_act.parent.comment_id
    }else if(comment_act.parent){
      // 回复一级评论
      console.log("回复一级评论")
      data.parent_comment_id=comment_act.parent.comment_id
    }else{
      console.log("生成一级评论")
    }
    let res=await api.mdugc.commentcreate(data)
    console.log("这是发布评论",res)
    Taro.showToast({
      icon:'none',
      title:res.message
    })
    if(res && res.status==1 ){
      let itemi={
        nickname:memberData.memberInfo.nickname,
        headimgurl:memberData.memberInfo.avatar,
        user_id:res.user_id,
        likes:0,
        comment_id:res.comment_id,
        content:res.content,
        reply_user_id:res.reply_user_id,
        created:'刚刚',
        company_id:res.company_id
      }
      if(comment_act.reply){
        // 回复二级评论
        itemi.reply_nickname=comment_act.reply.nickname
        if(commentlist[comment_act.parent.comment_id]){
          commentlist[comment_act.parent.comment_id].list.unshift(itemi)
        }else{
          theory.forEach((theoryi)=>{
            if(theoryi.comment_id==comment_act.parent.comment_id){
              if(theoryi.child){
                theoryi.child.unshift(itemi)
              }else{
                theoryi.child=[]
                theoryi.child.unshift(itemi)
              }
            }
          })
        }
      }else if(comment_act.parent){
        // 回复一级评论
        itemi.reply_nickname=comment_act.parent.nickname
        if(commentlist[comment_act.parent.comment_id]){
          commentlist[comment_act.parent.comment_id].list.unshift(itemi)
        }else{
          theory.forEach((theoryi)=>{
            if(theoryi.comment_id==comment_act.parent.comment_id){
              if(theoryi.child){
                theoryi.child.unshift(itemi)
              }else{
                theoryi.child=[]
                theoryi.child.unshift(itemi)
              }
            }
          })
        }
      }else{
        if(totalnum){
          totalnum=(totalnum-0+1)
        }else{
          totalnum=(page.total-0+1)
        }
        theory.unshift(itemi)
      }
    }
    this.setState({
      theory,
      commentlist,
      totalnum
    })

  }
  // 失去焦点
  onBlurinput=()=>{
    this.setState({
      inputtext:"",
      isfocus:false
    })
  }
  // 键盘高度变化
  setinputtop=(e)=>{
    console.log("键盘高度变化",e,e.detail.height)
    let het=e.detail.height-0
    this.setState({
      input_bottom:het
    })
  }
  // 跳转话题列表
  wordlist=(item)=>{
    let items=JSON.stringify(item)
    Taro.navigateTo({
      url:`/mdugc/pages/list/index?item=${items}`
    })
  }
  // 遮罩层
  onLast=async(ispup)=>{
    let {poptitle,theory,comment_act,commentlist,totalnum,page}=this.state
    const { memberData } = this.props;
    let that=this
    if( (ispup==2) && poptitle){
      if(poptitle.indexOf("评论")>0){
        console.log("确认删除评论")
        let data={
          user_id:memberData.memberInfo.user_id,
          comment_id:''
        }
        if(comment_act.reply){
          // 删除二级评论
          data.comment_id=comment_act.reply.comment_id
        }else if(comment_act.parent){
          // 删除一级评论
          data.comment_id=comment_act.parent.comment_id
          if(totalnum){
            totalnum=(totalnum-1)
          }else{
            totalnum=(page.total-1)
          }
        }
        let res=await api.mdugc.commentdelete(data)
        if(res.comment_id){
          try {
            theory.forEach((theoryi,idx)=>{
              if(theoryi.comment_id==data.comment_id){
                theory.splice(idx,1)
                console.log("hahaha1",theory)
                throw new Error('阻止')
              }
              if(theoryi.child){
                theoryi.child.forEach((childi,cidx)=>{
                  if(childi.comment_id==data.comment_id){
                    theoryi.child.splice(cidx,1)
                    console.log("hahaha2",theory)
                    throw new Error('阻止')
                  }
                })
              }
            })
          } catch (error) {
            console.log('error_阻止成功', error);
          }
          console.log("删除测试",theory)
          if(commentlist[comment_act.parent.comment_id]){
            commentlist[comment_act.parent.comment_id].list.forEach((listi,i)=>{
              if(listi.comment_id==data.comment_id){
                commentlist[comment_act.parent.comment_id].list.splice(i,1)
              }
            })
          }
          that.setState({
            theory,
            commentlist,
            totalnum
          })
        }
      }else{
        console.log("确认删除作品")
        let {item_id}=that.$router.params
        let data={
          post_id:[item_id]
        }
        let res=await api.mdugc.postdelete(data)
        if(res.message){
          Taro.showToast({
            icon:'none',
            title: res.message,
            duration: 1000,
          })
          let pages = Taro.getCurrentPages(); // 获取当前的页面栈
          if(pages.length>1){
            let prevPage = pages[pages.length-2]; // 获取上一页面
            console.log("这是详情页",pages)

            prevPage.setData({ //设置上一个页面的值
              delete: item_id
            });
            setTimeout(()=>{
              Taro.navigateBack({
                delta: 1
              })
            },500)
          }else{
            Taro.redirectTo({
              url:'/mdugc/pages/index/index'
            })
          }
        }
      }
    }
    this.setState({
      isPopups:false
    })
  }
  // 删除笔记
  deletenotes=()=>{
    this.setState({
      isPopups:true,
      poptitle:'确认要删除这条笔记吗？'
    })
  }
  // 点赞评论
  commentlike=async(comment_id)=>{
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
    let {item_id}=this.$router.params
    let {theory,comment_act,commentlist}=this.state
    const { memberData } = this.props;
    let that=this
    let data={
      user_id:memberData.memberInfo.user_id,
      post_id:item_id,
      comment_id
    }
    let res=await api.mdugc.commentlike(data)
    console.log("点赞返回",res)

    if(res.action){
      try {
        theory.forEach((theoryi,idx)=>{
          if(theoryi.comment_id==data.comment_id){
            theoryi.like_status=res.action=='like'?1:0
            // console.log("theoryi.like_statustheoryi.like_status",theoryi.like_status)
            theoryi.likes=res.likes
            throw new Error('阻止')
          }
          if(theoryi.child){
            theoryi.child.forEach((childi,cidx)=>{
              if(childi.comment_id==data.comment_id){
                childi.like_status=res.action=='like'?1:0
                childi.likes=res.likes
                throw new Error('阻止')
              }
            })
          }
        })
      } catch (error) {
        console.log('error_阻止成功', error);
      }
      console.log("点赞",theory)

      // commentlist.forEach((lists)=>{
      for (let key in commentlist) {

        commentlist[key].list.forEach((listi)=>{
          if(listi.comment_id==data.comment_id){
            listi.like_status=res.action=='like'?1:0
            listi.likes=res.likes
          }
        })
      }

      that.setState({
        theory,
        commentlist
      })
    }
  }
  // 点赞笔记
  postlike=async()=>{
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
    let {item_id}=this.$router.params
    const { memberData } = this.props;
    let {file_details}=this.state
    let data={
      user_id:memberData.memberInfo.user_id,
      post_id:item_id
    }
    let message=''
    let res=await api.mdugc.postlike(data)
    if(res.action){
      if(res.action=='unlike'){
        file_details.like_status=0
        message='取消点赞'
      }else if(res.action='like'){
        file_details.like_status=1
        message='点赞成功'
      }
      Taro.showToast({
        icon:'none',
        title: message,
        duration: 1000,
      })
      file_details.likes=res.likes
      this.setState({
        file_details
      })
    }
  }
  // 收藏笔记
  postfavorite=async()=>{
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
    let {item_id}=this.$router.params
    let {file_details}=this.state
    let data={
      post_id:item_id
    }
    let message=''
    let res=await api.mdugc.postfavorite(data)
    if(res.action){
      if(res.action=='unfavorite'){
        message='取消收藏'
        file_details.favorite_status=0
      }else if(res.action='favorite'){
        message='收藏成功'
        file_details.favorite_status=1
      }
      Taro.showToast({
        icon:'none',
        title: message,
        duration: 1000,
      })
      file_details.favorite_nums=res.likes
      this.setState({
        file_details
      })
    }
  }
  // 关注|取消关注
  followercreate=async()=>{
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
    const { memberData } = this.props;
    let {file_details}=this.state
    let data={
      user_id:file_details.user_id,
      follower_user_id:memberData.memberInfo.user_id
    }
    let res=await api.mdugc.followercreate(data)
    if(res.action=='unfollow'){
      // 取消关注
      file_details.follow_status=0
      Taro.showToast({
        icon:'none',
        title: '取消关注'
      })
    }else if(res.action=='follow'){
      // 关注
      file_details.follow_status=1
      Taro.showToast({
        icon:'none',
        title: '关注成功'
      })
    }
    this.setState({
      file_details
    })
  }
  // 收起评论
  stowcommentlist=(comment_id )=>{
    let {commentlist}=this.state
    delete commentlist[comment_id]
    this.setState({
      commentlist
    })
  }
  // 时间戳转化
  formatDate=(now)=>{
    if(!now){
      return ''
    }
    now=(now*1000)
    const date = new Date(now)
    const new_data=new Date()
    let new_y=new_data.getFullYear() //当前年份
    let y = date.getFullYear() // 年份
    let m = date.getMonth() + 1 // 月份，注意：js里的月要加1
    let d = date.getDate() // 日
    // let h = date.getHours() // 小时
    // let min = date.getMinutes() // 分钟
    // let s = date.getSeconds() // 秒
    // 返回值，根据自己需求调整，现在已经拿到了年月日时分秒了
    let time=m + '月' + d + '日'
    if(new_y>y){
      time=(y + '年' + time)
    }
    return time
  }
  // 销毁组件触发
  componentWillUnmount(){
    let {item_id}=this.$router.params
    let {old_isheart,file_details}=this.state
    let pages = Taro.getCurrentPages(); // 获取当前的页面栈
    if(pages.length>1){
      let prevPage = pages[pages.length-2]; // 获取上一页面
      if(!prevPage.__data__.delete && old_isheart!=file_details.like_status && old_isheart!=-1){
        let heart={
          item_id,
          isheart:file_details.like_status,
          likes:file_details.likes
        }
        prevPage.setData({ //设置上一个页面的值
          heart
        });
      }
    }
  }
  // 商品组件滚动
  oncommoditynum=()=>{
    this.setState({
      commoditynum: 1
    }, () => {
      if (process.env.TARO_ENV === 'weapp') {
        // workaround for weapp
        this.setState({
          commoditynum: null
        })
      }
    })
  }
  // onscrollcommodity=(e)=>{
  //   console.log("这是滚动距离",e)
  // }


  render () {
    const { isoneself , file_details , theory , page ,  scrollTop , showBackToTop , isOpened , inputtext , isfocus , input_bottom , isPopups , poptitle , comment_act , commentlist , commoditynum , totalnum } = this.state
    const { memberData } = this.props;
    let {goods,topics}=file_details
    // console.log("这是下拉",page)
    return (
      <View className="ugcdetailsr">
        <ScrollView
            scrollY
            className='ugcdetailsr_scroll'
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
            <View className='ugcdetailsr_scroll_view'>
              <View className='ugcdetailsr_swiper'>
                <Swiperugc
                  file_detailss={file_details}
                ></Swiperugc>
              </View>
              <View className="ugcdetailsr_text">
                <View className='ugcdetailsr_text_top'>
                  <View className='ugcdetailsr_text_top_l' onClick={this.topages.bind(this,`/mdugc/pages/member/index?user_id=${file_details.user_id}`)}>
                    <image mode="aspectFit" src={file_details?.userInfo?.headimgurl} />
                    <View>{file_details?.userInfo?.nickname }</View>
                  </View>
                  {
                    !isoneself?(
                      <View onClick={this.followercreate.bind(this)} className={`ugcdetailsr_text_top_r ${file_details.follow_status?'follow':''}`}>
                        {file_details.follow_status?'已关注':'关注'}
                      </View>
                    ):null
                  }

                </View>
                <View className='ugcdetailsr_text_word'>
                  <View className='ugcdetailsr_text_word_title'>
                    {file_details.title}
                  </View>
                  <View className='ugcdetailsr_text_word_text'>
                    <Text>
                      {file_details.content}
                    </Text>
                  </View>
                </View>
                <View className='ugcdetailsr_text_subject'>
                  {
                    topics?.map((item)=>{
                      return(
                        <View onClick={this.wordlist.bind(this,item)} className='ugcdetailsr_text_subject_i'>
                          {item.topic_name}
                        </View>
                      )
                    })
                  }
                </View>
                <View className='ugcdetailsr_text_time'>
                  {this.formatDate(file_details.created)}
                </View>
              </View>
              {
                goods?.length>0?(
                  <View className='ugcdetailsr_commodity'>
                    <View className="ugcdetailsr_commodity_title">
                      推荐商品
                    </View>
                    <View className='ugcdetailsr_commodity_center'>
                      {
                        goods?.length>2?(
                          <View
                          className='ugcdetailsr_commodity_center_left'
                          onClick={this.oncommoditynum.bind(this)}
                          >
                            <View className='ugcdetailsr_commodity_center_left_icon'>
                              <Text className='icon-jiantouxiangzuo'></Text>
                            </View>
                          </View>
                        ):(
                          <View
                          className='ugcdetailsr_commodity_center_left'
                          >
                            <View className='ugcdetailsr_commodity_center_left_icon'>
                            </View>
                          </View>
                        )
                      }
                      <ScrollView
                        className='ugcdetailsr_commodity_center_scroll'
                        scrollX
                        scrollWithAnimation={true}
                        scrollLeft={commoditynum}
                        // onScroll={this.onscrollcommodity.bind(this)}
                        scrollHeight={0}
                      >
                        {
                          goods.map((item)=>{
                            return(
                              <View className='ugcdetailsr_commodity_center_scroll_i' onClick={this.handleClickItem.bind(this,item)}>
                                <Image mode="heightFix" src={item.pics[0]} />
                              </View>
                            )
                          })
                        }
                      </ScrollView>
                    </View>

                  </View>
                ):null
              }
              <View className='ugcdetailsr_theory'>
                <View className='ugcdetailsr_theory_length'>
                  共{totalnum?totalnum:page.total}条评论
                </View>
                {
                  theory?.length>0?(
                    <View className='ugcdetailsr_theory_text'>
                      {
                        theory.map((item,idx)=>{
                          return(
                            <View className='ugcdetailsr_theory_list'>
                              <View className='ugcdetailsr_theory_list_top'>
                                <View className='ugcdetailsr_theory_i'>
                                  <View className='ugcdetailsr_theory_i_l'>
                                    <Image className='ugcdetailsr_theory_i_l_avatar' src={item.headimgurl} />
                                  </View>
                                  <View className='ugcdetailsr_theory_i_r'>
                                    <View className='ugcdetailsr_theory_i_r_t'>
                                      <View className='ugcdetailsr_theory_i_r_t_text'>
                                        <View className='ugcdetailsr_theory_i_r_t_text_name'>
                                          {item.nickname}
                                        </View>
                                        <View className='ugcdetailsr_theory_i_r_t_text_word' onClick={this.onopen.bind(this,item,'')}>
                                          <View className='ugcdetailsr_theory_i_r_t_text_word_title'>
                                            {item.content}
                                          </View>
                                          <View className='ugcdetailsr_theory_i_r_t_text_word_time'>
                                            {item.created}
                                          </View>
                                        </View>
                                      </View>
                                      <View className='ugcdetailsr_theory_i_r_t_fabulous'>
                                        <View onClick={this.commentlike.bind(this,item.comment_id)} className={ `${item.like_status?'icon-aixin-shixin':'icon-aixin'}`}></View>
                                        <Text>{item.likes}</Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                              <View className='ugcdetailsr_theory_list_bottom'>
                                {
                                  commentlist[item.comment_id]?(

                                    commentlist[item.comment_id].list.map((childi)=>{
                                        return(
                                        <View className='ugcdetailsr_theory_i'>
                                          <View className='ugcdetailsr_theory_i_l'>
                                            <Image className='ugcdetailsr_theory_i_l_avatar' src={childi.headimgurl} />
                                          </View>
                                          <View className='ugcdetailsr_theory_i_r'>
                                            <View className='ugcdetailsr_theory_i_r_t'>
                                              <View className='ugcdetailsr_theory_i_r_t_text'>
                                                <View className='ugcdetailsr_theory_i_r_t_text_name'>
                                                  {childi.nickname}
                                                </View>
                                                <View className='ugcdetailsr_theory_i_r_t_text_word' onClick={this.onopen.bind(this,item,childi)}>
                                                  <View className='ugcdetailsr_theory_i_r_t_text_word_title'>
                                                    {
                                                      childi.reply_nickname?'回复   '+childi.reply_nickname+'：':null
                                                    }
                                                    {childi.content}
                                                  </View>
                                                  <View className='ugcdetailsr_theory_i_r_t_text_word_time'>
                                                    {childi.created}
                                                  </View>
                                                </View>
                                              </View>
                                              <View className='ugcdetailsr_theory_i_r_t_fabulous'>
                                                <View onClick={this.commentlike.bind(this,childi.comment_id)} className={ `${childi.like_status?'icon-aixin-shixin':'icon-aixin'}`}></View>
                                                <Text>{childi.likes}</Text>
                                              </View>
                                            </View>
                                          </View>
                                        </View>
                                        )
                                      })

                                  ):(

                                      item.child.map((childi)=>{
                                        return(
                                        <View className='ugcdetailsr_theory_i'>
                                          <View className='ugcdetailsr_theory_i_l'>
                                            <Image className='ugcdetailsr_theory_i_l_avatar' src={childi.headimgurl} />
                                          </View>
                                          <View className='ugcdetailsr_theory_i_r'>
                                            <View className='ugcdetailsr_theory_i_r_t'>
                                              <View className='ugcdetailsr_theory_i_r_t_text'>
                                                <View className='ugcdetailsr_theory_i_r_t_text_name'>
                                                  {childi.nickname}
                                                </View>
                                                <View className='ugcdetailsr_theory_i_r_t_text_word' onClick={this.onopen.bind(this,item,childi)}>
                                                  <View className='ugcdetailsr_theory_i_r_t_text_word_title'>
                                                    {
                                                      childi.reply_nickname?'回复   '+childi.reply_nickname+'：':null
                                                    }
                                                    {childi.content}
                                                  </View>
                                                  <View className='ugcdetailsr_theory_i_r_t_text_word_time'>
                                                    {childi.created}
                                                  </View>
                                                </View>
                                              </View>
                                              <View className='ugcdetailsr_theory_i_r_t_fabulous'>
                                                <View onClick={this.commentlike.bind(this,childi.comment_id)} className={ `${childi.like_status?'icon-aixin-shixin':'icon-aixin'}`}></View>
                                                <Text>{childi.likes}</Text>
                                              </View>
                                            </View>
                                          </View>
                                        </View>
                                        )
                                      })
                                  )
                                }


                              </View>
                              {
                                ( (commentlist[item.comment_id] && (commentlist[item.comment_id].total==commentlist[item.comment_id].list?.length) ) || (item.child && item.child.length<2 || (!item.child)) )?null:(
                                  <View className='ugcdetailsr_theory_open' onClick={this.getcommentlist.bind(this,item)}>
                                    展开10条评论
                                  </View>
                                )
                              }
                              {
                                (commentlist[item.comment_id] &&  (commentlist[item.comment_id].total==commentlist[item.comment_id].list?.length) && commentlist[item.comment_id].total>2 )?(
                                  <View className='ugcdetailsr_theory_open' onClick={this.stowcommentlist.bind(this,item.comment_id)}>
                                    收起评论
                                  </View>
                                ):null
                              }

                            </View>
                          )
                        })
                      }
                    </View>
                  ):null
                }
                {
                  !page.isLoading && !page.hasNext && !theory?.length
                  && (
                    <View className='ugcdetailsr_theory_empty'>
                      <View className='icon-sixin ugcdetailsr_theory_empty_icons'></View>
                      <View className='ugcdetailsr_theory_empty_text'>还没有评论哦，<Text onClick={ this.reply.bind(this,"one") }>点击评论</Text></View>
                    </View>
                  )
                }

              </View>
              {
                isoneself?(
                  <View className="ugcdetailsr_float">
                    <FloatMenus>
                      <FloatMenuItem
                        iconPrefixClass="icon"
                        icon="bianji"
                        onClick={this.topages.bind(this,`/mdugc/pages/make/index?post_id=${file_details.post_id}`)}
                      />
                      <FloatMenuItem
                        iconPrefixClass="icon"
                        icon="shangchu"
                        onClick={this.deletenotes.bind(this)}

                      />
                    </FloatMenus>
                  </View>
                ):null
              }
            </View>
            {
                page.isLoading && <Loading>正在加载...</Loading>
            }
          </ScrollView>
          {
            isfocus?(
              <View
               className='ugcdetailsr_input'
               style={{paddingBottom:`${input_bottom-0+10}px`}}
               >
                <Input
                  className='ugcdetailsr_input_text'
                  type='text'
                  placeholder={inputtext}
                  focus={isfocus}
                  onConfirm={this.setinput.bind(this)}
                  adjustPosition={false}
                  onKeyboardHeightChange={this.setinputtop.bind(this)}
                  onBlur={this.onBlurinput}
                />
              </View>
            ):null
          }
          <View className='ugcdetailsr_footer'>
            <View className='ugcdetailsr_footer_icon'>
              <View onClick={this.postlike.bind(this)} className={file_details.like_status?'icon-aixin-shixin':'icon-aixin'}></View>
              <Text>{file_details.likes}</Text>
            </View>
            <View className='ugcdetailsr_footer_icon'>
              <View onClick={this.postfavorite.bind(this)} className={file_details.favorite_status?'icon-shoucang-shixin':'icon-shoucang'}></View>
              <Text>{file_details.favorite_nums}</Text>
            </View>
            {
              file_details.status==1?(
              <Button
                openType='share'
                className='ugcdetailsr_footer_icon ugcdetailsr_footer_btn'>
                <View className='icon-fengxiang share'></View>
                <Text>{file_details.share_nums?file_details.share_nums:0}</Text>
              </Button>
              ):null
            }

            <View className='ugcdetailsr_footer_input' onClick={ this.reply.bind(this,"one") }>
            留言评论
            </View>
          </View>
          <BackToTop
            show={showBackToTop}
            onClick={this.scrollBackToTop}
            bottom={150}
          />

          <AtActionSheet isOpened={isOpened} cancelText='关闭' title='' onClose={this.closesheet} onCancel={this.closesheet}>
            <AtActionSheetItem onClick={ this.reply }>
              回复
            </AtActionSheetItem>
            {
              ( memberData.memberInfo &&( comment_act.reply.user_id==memberData.memberInfo.user_id || ((comment_act.parent.user_id==memberData.memberInfo.user_id) && !comment_act.reply.user_id ) ) )?(
              <AtActionSheetItem onClick={this.deletecomment}>
                删除评论
              </AtActionSheetItem>
              ):null
            }
          </AtActionSheet>
          {
            isPopups?(
              <Popups
                title={poptitle}
                Last={this.onLast.bind(this)}
              ></Popups>
            ):null
          }
      </View>
    )
  }
}
