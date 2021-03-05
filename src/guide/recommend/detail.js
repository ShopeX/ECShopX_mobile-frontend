import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { NavBar } from '@/components'
import { connect } from '@tarojs/redux'
import { formatTime } from '@/utils'
import S from '@/spx'
import { Tracker } from "@/service";
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../components/wgts'
import './detail.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

@withPager
export default class recommendDetail extends Component {
  constructor(props) {
    props = props || {}
    props.pageSize = 50
    super(props)

    this.state = {
      ...this.state,
      info: null,
      collectArticleStatus: false,
      item_id_List: [],
      screenWidth: 0
    }
  }

  config = {
    navigationBarTitleText: '种草详情'
  }

  componentDidShow() {
    console.log(this.props,'propspropspropspropspropsprops');
    this.fetchContent()
  }

  componentDidMount() {
    Taro.getSystemInfo()
      .then(res => {
        this.setState({
          screenWidth: res.screenWidth
        })
      })
  }

  onShareAppMessage() {
    const { info } = this.state
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `&uid=${userId}` : ''

    Tracker.dispatch("GOODS_SHARE_TO_CHANNEL_CLICK", {
      ...info,
      shareType: "分享给好友"
    });
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
    const { id } = this.$router.params
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

    info.updated_str = formatTime(info.updated * 1000, 'yyyy-MM-dd')

    this.setState({
      info
    })
  }

  async fetchContent() {
    const { id } = this.$router.params

    // 关注数加1
    const resFocus = await api.article.focus(id)

    this.confirmCollectArticle()

    if (resFocus) {
      this.detailInfo(id)
    }
  }

  handleClickBar = async (type) => {
    const { id } = this.$router.params
  }

  handleClickGoods = () => {
    const { id } = this.$router.params
    this.detailInfo(id)
  }

  render() {
    const { colors } = this.props
    const { info, screenWidth, collectArticleStatus } = this.state
    console.log(screenWidth,'screenWidth');

    if (!info) {
      return null
    }

    return (
      <View className='guide-recommend-detail'>
        <NavBar
          title='种草详情'
          leftIconType='chevron-left'
          fixed='true'
        />
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
        <View
          className='recommend-detail__content'
          scrollY
        >
          <View className='wgts-wrap__cont'>
            {
              info.content.map((item, idx) => {
                return (
                  <View className='wgt-wrap' key={`${item.name}${idx}`}>
                    {item.name === 'film' && <WgtFilm info={item} />}
                    {item.name === 'slider' && <WgtSlider info={item} width={screenWidth} />}
                    {item.name === 'writing' && <WgtWriting info={item} />}
                    {item.name === 'heading' && <WgtHeading info={item} />}
                    {item.name === 'goods' && <WgtGoods onClick={this.handleClickGoods.bind('goods')} info={item} />}
                  </View>
                )
              })
            }
          </View>
        </View>

        <View className='recommend-detail__bar'>
          <Button openType='share' style={"background: " + colors.data[0].primary}>
            分享给顾客
          </Button>
        </View>
      </View>
    )
  }
}
