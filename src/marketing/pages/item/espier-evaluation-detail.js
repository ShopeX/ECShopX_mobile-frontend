import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Loading, GoodsEvaluation, GoodsComment, SpToast, SpNavBar } from '@/components'
import api from '@/api'
import { connect } from 'react-redux'
import { withPager } from '@/hocs'
import S from '@/spx'

import './espier-evaluation.scss'

@connect(
  ({ evaluation }) => ({
    evaluation
  }),
  (dispatch) => ({
    onAddEvaluation: ({ info }) => dispatch({ type: 'evaluation/add', payload: { info } })
  })
)
@withPager
export default class EvaluationDetail extends Component {
  $instance = getCurrentInstance()
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      showCommentPanel: false,
      userInfo: {},
      info: null,
      replyRateList: null
    }
  }

  componentDidMount () {
    const userInfo = Taro.getStorageSync('userinfo')
    this.getEvaluationDetail()

    this.setState({
      userInfo
    })
  }

  getEvaluationDetail = async () => {
    let company_id = this.$instance.router.params.company_id
    let rate_id = this.$instance.router.params.rate_id
    let params = {
      company_id
    }
    let rate_ids = []
    let info = await api.item.getEvaluationDetail(rate_id, params)

    info.picList = info.rate_pic ? info.rate_pic.split(',') : []
    info.reply = {}
    info.reply.total_count = info.reply_count
    this.getreplyRateList(info)
    rate_ids.push(rate_id)
    this.setState({
      info
    })
    /*this.getRatePraiseStatus(rate_ids).then((res)=>{
      let praise_status=res[rate_id]&&res[rate_id].praise_status
      info.praise_status=praise_status

      this.setState({
        info
      })
    })*/
  }
  //获取评论点赞状态
  /* async getRatePraiseStatus(rateids){
    let params={
      rate_ids:JSON.stringify(rateids)
    }

    let res=await api.item.getRatePraiseStatus(params)
    return res.list
  }*/
  // 获取评论列表
  getreplyRateList = async (info) => {
    let company_id = this.$instance.router.params.company_id
    let rate_id = this.$instance.router.params.rate_id
    let item_id = this.$instance.router.params.item_id
    let params = {
      item_id,
      company_id,
      rate_id,
      page: 1,
      pageSize: 100
    }
    let reply = await api.item.getreplyRateList(params)

    //  const {info}=this.state
    info.reply.list = reply.list
    this.setState({
      info
    })
  }
  handlePraiseRate = async (item) => {
    Taro.showLoading({
      mask: true
    })
    await api.item.praiseRate(item.rate_id)
    Taro.hideLoading()
    const { info } = this.state
    if (info.praise_status) {
      if (info.praise_num) {
        info.praise_num--
      }
      info.praise_status = false
    } else {
      info.praise_num++
      info.praise_status = true
    }
    this.setState({
      info
    })
  }

  handleReplyRate = async (e) => {
    const { userInfo, info } = this.state

    if (!e) {
      return
    }
    Taro.showLoading({
      mask: true
    })
    await api.item.replyRate({
      rate_id: info.rate_id,
      content: e
    })

    Taro.hideLoading()
    info.reply.list.unshift({
      username: userInfo.username,
      content: e
    })
    info.reply.total_count++
    this.setState({
      info,
      showCommentPanel: false
    })
  }

  // 点击评论
  handleShowPanel = () => {
    if (S.getAuthToken()) {
      this.setState({ showCommentPanel: true })
    } else {
      S.toast('请登录后再评论')
      setTimeout(() => {
        S.login(this)
      }, 2000)
    }
  }

  render () {
    const { info, showCommentPanel } = this.state

    if (!info) {
      return <Loading />
    }

    return (
      <View className='page-goods-evaluation'>
        <SpNavBar title='评论' leftIconType='chevron-left' />
        <View className='goods-evaluation-wrap'>
          <View className='evaluation-list'>
            <GoodsEvaluation
              info={info}
              showComment
              onReplyRate={this.handleShowPanel.bind(this)}
            />
          </View>
        </View>

        <GoodsComment
          isOpened={showCommentPanel}
          onClose={() => this.setState({ showCommentPanel: false })}
          onReplyRate={this.handleReplyRate}
        />
        <SpToast />
      </View>
    )
  }
}
