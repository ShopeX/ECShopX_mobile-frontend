import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { FloatMenus, FloatMenuItem, SpNavBar } from '@/components'
import { connect } from 'react-redux'
import { formatTime, buriedPoint } from '@/utils'
import S from '@/spx'
// import { Tracker } from '@/service'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../../../pages/home/wgts'
import './detail.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
@withPager
export default class recommendDetail extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    props = props || {}
    props.pageSize = 50
    super(props)

    this.state = {
      ...this.state,
      info: null,
      praiseCheckStatus: false,
      collectArticleStatus: false,
      item_id_List: [],
      screenWidth: 0
    }
  }

  componentDidShow() {
    this.fetchContent()
    // this.praiseCheck()
  }

  componentDidMount() {
    Taro.getSystemInfo().then((res) => {
      this.setState({
        screenWidth: res.screenWidth
      })
    })
    // 埋点处理
    buriedPoint.call(this, {
      event_type: 'activeSeedingDetail'
    })
  }

  onShareAppMessage(res) {
    const { info } = this.state
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `&uid=${userId}` : ''

    return {
      title: info.title,
      path: `/subpage/pages/recommend/detail?id=${info.article_id}${query}`,
      imageUrl: info.share_image_url || info.image_url
    }
  }

  onShareTimeline() {
    const { info } = this.state
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `&uid=${userId}` : ''
    return {
      title: info.title,
      query: `id=${info.article_id}${query}`,
      imageUrl: info.share_image_url || info.image_url
    }
  }

  // 确认本人文章是否已收藏
  confirmCollectArticle = async () => {
    const { id } = this.$instance.router.params
    if (S.getAuthToken()) {
      const res = await api.article.collectArticleInfo({ article_id: id })
      if (res.length === 0) {
        this.setState({
          collectArticleStatus: false
        })
      } else {
        this.setState({
          collectArticleStatus: true
        })
      }
    }
  }

  // 拉取详情
  detailInfo = async (id) => {
    const info = S.getAuthToken() ? await api.article.detailAuth(id) : await api.article.detail(id)

    info.updated_str = formatTime(info.updated * 1000, 'YYYY-MM-DD')

    this.setState({
      info
    })
  }

  async fetchContent() {
    const { id } = this.$instance.router.params

    // 关注数加1
    const resFocus = await api.article.focus(id)

    this.confirmCollectArticle()

    if (resFocus) {
      this.detailInfo(id)
      /*, ()=>{
      //         Taro.showLoading()
      //         let item_id_List = []
      //         if(info.content){
      //           info.content.map(item => {
      //             if(item.name === 'goods') {
      //               item.data.map(id_item => {
      //                 item_id_List.push(id_item.item_id)
      //               })
      //             }
      //           })
      //           this.setState({
      //             item_id_List
      //           },()=>{
      //             this.resetPage()
      //             setTimeout(()=>{
      //               this.nextPage()
      //             }, 200)
      //           })
      //
      //         }
      //       }*/
    }
  }

  /*praiseCheck = async () => {
    if(!S.getAuthToken()){
      return false
    }
    const { id } = getCurrentInstance().params
    const { status } = await api.article.praiseCheck(id)
    this.setState({
      praiseCheckStatus: status
    })
  }*/

  handleClickBar = async (type) => {
    const { id } = this.$instance.router.params
    if (type === 'like') {
      const { count } = await api.article.praise(id)
      this.detailInfo(id)
      /*if(this.state.praiseCheckStatus === true){
        return false
      }*/
      /*const { count } = await api.article.praise(id)
      this.praiseCheck()
      this.fetchContent()*/
    }

    if (type === 'mark') {
      const resCollectArticle = await api.article.collectArticle(id)
      if (resCollectArticle.fav_id && this.state.collectArticleStatus === false) {
        this.setState({
          collectArticleStatus: true
        })
        Taro.showToast({
          title: '已加入心愿单',
          icon: 'none'
        })
      } else {
        const query = {
          article_id: id
        }
        await api.article.delCollectArticle(query)
        this.setState({
          collectArticleStatus: false
        })
        Taro.showToast({
          title: '已移出心愿单',
          icon: 'none'
        })
      }
    }
  }

  handleShare() {}

  handleClickGoods = () => {
    const { id } = this.$instance.router.params
    this.detailInfo(id)
  }

  handleToGiftMiniProgram = () => {
    Taro.navigateToMiniProgram({
      appId: APP_GIFT_APPID, // 要跳转的小程序的appid
      path: '/pages/index/index', // 跳转的目标页面
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  }

  render() {
    const { colors } = this.props
    const { info, praiseCheckStatus, screenWidth, collectArticleStatus, showBackToTop } = this.state

    if (!info) {
      return null
    }

    return (
      <View className='page-recommend-detail'>
        <SpNavBar title='微商城' leftIconType='chevron-left' fixed='true' />
        <View className='recommend-detail__title'>{info.title}</View>
        <View className='recommend-detail-info'>
          <View className='recommend-detail-info__time'>
            <Text className={`icon-time ${info.is_like ? '' : ''}`}> </Text>
            {info.updated_str}
          </View>
          <View className='recommend-detail-info__time'>
            <Text className={`icon-eye ${info.is_like ? '' : ''}`}> </Text>
            {info.articleFocusNum.count ? info.articleFocusNum.count : 0}关注
          </View>
        </View>
        <View className='recommend-detail__content' scrollY>
          <View className='wgts-wrap__cont'>
            {info.content.map((item, idx) => {
              return (
                <View className='wgt-wrap' key={`${item.name}${idx}`}>
                  {item.name === 'film' && <WgtFilm info={item} />}
                  {item.name === 'slider' && <WgtSlider info={item} width={screenWidth} />}
                  {item.name === 'writing' && <WgtWriting info={item} />}
                  {item.name === 'heading' && <WgtHeading info={item} />}
                  {item.name === 'goods' && (
                    <WgtGoods onClick={this.handleClickGoods.bind('goods')} info={item} />
                  )}
                </View>
              )
            })}
          </View>
        </View>

        {/* <FloatMenuItem
          iconPrefixClass='in-icon'
          icon='float-gift'
          onClick={this.handleToGiftMiniProgram.bind(this)}
        /> */}
        <FloatMenus>
          <FloatMenuItem
            iconPrefixClass='icon'
            icon='share'
            openType='share'
            onClick={this.handleShare}
          />
          <FloatMenuItem
            iconPrefixClass='icon'
            icon='arrow-up'
            hide={!showBackToTop}
            onClick={this.scrollBackToTop}
          />
        </FloatMenus>
        <View className='recommend-detail__bar'>
          <View
            className='recommend-detail__bar-item'
            style={info.isPraise ? `color: ${colors.data[0].primary}` : 'color: inherit'}
            onClick={this.handleClickBar.bind(this, 'like')}
          >
            <Text className='iconfont icon-like'> </Text>
            <Text>
              {info.isPraise ? '已赞' : '点赞'} ·{' '}
              {info.articlePraiseNum.count ? info.articlePraiseNum.count : 0}
            </Text>
          </View>
          <View
            className='recommend-detail__bar-item'
            style={collectArticleStatus ? `color: ${colors.data[0].primary}` : 'color: inherit'}
            onClick={this.handleClickBar.bind(this, 'mark')}
          >
            <Text className='icon-star-on'> </Text>
            <Text>{collectArticleStatus ? '已加入' : '加入心愿'}</Text>
          </View>
          <Button
            openType='share'
            className='recommend-detail__bar-item'
            onClick={this.handleClickBar.bind(this, 'share')}
          >
            <Text className='icon-article-share'> </Text>
            <Text>分享</Text>
          </Button>
        </View>
      </View>
    )
  }
}
