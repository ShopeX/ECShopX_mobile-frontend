import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { BaNavBar } from '../components'
import { connect } from 'react-redux'
import { formatTime, log, buriedPoint } from '@/utils'
import S from '@/spx'
// import { Tracker } from '@/service'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../components/wgts'
import { getDtidIdUrl } from '@/utils/helper'
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
      item_id_List: [],
      screenWidth: 0
    }
  }

  async componentDidMount() {
    await S.autoLogin(this)
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

  componentDidShow() {
    Taro.hideShareMenu({
      //禁用胶囊分享
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.fetchContent()
  }

  onShareAppMessage() {
    const { info } = this.state
    const { salesperson_id, work_userid, distributor_id, shop_code } = S.get('GUIDE_INFO', true)
    const gu = `${work_userid}_${shop_code}`
    // const gu_user_id = Taro.getStorageSync("work_userid");
    // Tracker.dispatch("GOODS_SHARE_TO_CHANNEL_CLICK", {
    //   ...info,
    //   shareType: "分享给好友"
    // } );
    const sharePath = getDtidIdUrl(
      `/subpage/pages/recommend/detail?id=${info.article_id}&smid=${salesperson_id}&gu=${gu}`,
      distributor_id
    )
    log.debug(`【guide/recommend/detail】onShareAppMessage path: ${sharePath}`)
    return {
      title: info.title,
      path: sharePath,
      imageUrl: info.share_image_url || info.image_url
    }
  }

  // 拉取详情
  detailInfo = async (id) => {
    const info = await api.article.detail(id)
    info.updated_str = formatTime(info.updated * 1000, 'YYYY-MM-DD')
    this.setState({
      info
    })
  }

  async fetchContent() {
    const { id } = this.$instance.router.params

    // 关注数加1
    const resFocus = await api.article.focus(id)

    if (resFocus) {
      this.detailInfo(id)
    }
  }

  handleClickGoods = () => {
    const { id } = this.$instance.router.params
    this.detailInfo(id)
  }

  render() {
    const { colors } = this.props
    const { info, screenWidth } = this.state
    const navbar_height = S.get('navbar_height', true)

    if (!info) {
      return null
    }

    return (
      <View className='guide-recommend-detail' style={`padding-top:${navbar_height}PX`}>
        <BaNavBar title='种草详情' fixed />
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

        <View className='recommend-detail__bar'>
          <Button openType='share' style={'background: ' + colors.data[0].primary}>
            分享给顾客
          </Button>
        </View>
      </View>
    )
  }
}
