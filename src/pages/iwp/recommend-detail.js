import Taro, { Component } from '@tarojs/taro'
import {View, Text, Button, ScrollView} from '@tarojs/components'
import api from '@/api'
import { SpHtmlContent } from '@/components'
import { formatTime } from '@/utils'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods } from '../home/wgts'
import S from '@/spx'

import '../recommend/detail.scss'

export default class recommendDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: null,
      praiseCheckStatus: false,
      collectArticleStatus: false
    }
  }

  componentDidShow () {
    this.fetch()
    // this.praiseCheck()
  }

  componentDidMount () {
  }

  async fetch () {

    const { id } = this.$router.params
    const resFocus = await api.article.focus(id)
    const res = await api.article.delCollectArticleInfo({article_id: id})
    if(res.length === 0) {
      this.setState({
        collectArticleStatus: false
      })
    } else {
      this.setState({
        collectArticleStatus: true
      })
    }
    if(resFocus) {
      const info = S.getAuthToken() ? await api.article.authDetail(id): await api.article.detail(id)



      info.updated_str = formatTime(info.updated * 1000, 'YYYY-MM-DD')
      this.setState({
        info
      })
    }

  }

  praiseCheck = async () => {
    const { id } = this.$router.params
    const { status } = await api.article.praiseCheck(id)
    this.setState({
      praiseCheckStatus: status
    })
  }

  handleClickBar = async () => {
    /*const { id } = this.$router.params
    if (type === 'like') {
      if(this.state.praiseCheckStatus === true){
        return false
      }
      const resPraise = await api.article.praise(id)
      console.log(resPraise, 48)
    }

    if (type === 'mark') {
      const resCollectArticle = await api.article.collectArticle(id)
      if(resCollectArticle.fav_id && (this.state.collectArticleStatus === false)){
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
      console.log(resCollectArticle, 62)
    }*/
  }

  render () {
    const { info, praiseCheckStatus, collectArticleStatus } = this.state

    if (!info) {
      return null
    }

    console.log(info.content, 44)

    return (
      <View className='page-recommend-detail'>
        <View className='recommend-detail__title'>{info.title}</View>
        <View className='recommend-detail-info'>
          <View className='recommend-detail-info__time'>
            <Text className={`in-icon in-icon-shijian ${info.is_like ? '' : ''}`}> </Text>
            {info.updated_str}
          </View>
          <View className='recommend-detail-info__time'>
            <Text className={`in-icon in-icon-xingzhuang ${info.is_like ? '' : ''}`}> </Text>
            {info.articleFocusNum.count ? info.articleFocusNum.count : 0}关注
          </View>
        </View>
        <View
          className='recommend-detail__content'
          scrollY
        >
          <View className='wgts-wrap__cont'>
            {
              info.content.map((item, idx) => {
                return (
                  <View className='wgt-wrap' key={idx}>
                    {item.name === 'film' && <WgtFilm info={item} />}
                    {item.name === 'slider' && <WgtSlider info={item} />}
                    {item.name === 'writing' && <WgtWriting info={item} />}
                    {item.name === 'goods' && <WgtGoods info={item} />}
                  </View>
                )
              })
            }
          </View>
        </View>
        <View className='recommend-detail__bar'>
          <View className={`recommend-detail__bar-item ${praiseCheckStatus ? 'check-true': ''}`} onClick={this.handleClickBar.bind(this, 'like')}>
            <Text className={`in-icon in-icon-like ${info.is_like ? '' : ''}`}> </Text>
            <Text>{praiseCheckStatus ? '已赞' : '点赞'} · {info.articlePraiseNum.count ? info.articlePraiseNum.count : 0}</Text>
          </View>
          <View className={`recommend-detail__bar-item ${collectArticleStatus ? 'check-true': ''}`} onClick={this.handleClickBar.bind(this, 'mark')}>
            <Text className={`in-icon in-icon-jiarushoucang ${info.is_like ? '' : ''}`}> </Text>
            <Text>{collectArticleStatus ? '已加入' : '加入心愿'}</Text>
          </View>
          <Button  openType='share' className='recommend-detail__bar-item' onClick={this.handleClickBar.bind(this, 'share')}>
            <Text className={`in-icon in-icon-fenxiang ${info.is_like ? '' : ''}`}> </Text>
            <Text>分享</Text>
          </Button>
        </View>
      </View>
    )
  }
}
