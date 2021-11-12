import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Button } from '@tarojs/components'
import { SpToast, Loading, BackToTop, SpNavBar } from '@/components'
import { connect } from '@tarojs/redux'
import req from '@/api/req'
import { withPager, withBackToTop } from '@/hocs'
import S from '@/spx'
import { buriedPoint } from '@/utils'
import { platformTemplateName, transformPlatformUrl } from '@/utils/platform'
import { getDtidIdUrl } from '@/utils/helper'
import { BaHomeWgts } from '../components'
import './custom-page.scss'
import qs from 'qs'

@connect(({ colors }) => ({
  colors: colors.current
}))
@withPager
@withBackToTop
export default class HomeIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      wgts: null,
      shareInfo: null,
      authStatus: false,
      positionStatus: false
    }
  }

  async componentDidMount () {
    const { id } = this.$router.params

    const pathparams = qs.stringify({
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: `custom_${id}`,
      name: search
    })
    const url = transformPlatformUrl(`/alipay/pageparams/setting?${pathparams}`)
    const fixSetting = await req.get(url)

    this.setState(
      {
        positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
      },
      () => {
        this.fetchInfo()
      }
    )
    Taro.hideShareMenu({
      //禁用胶囊分享
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // 埋点处理
    buriedPoint.call(this, {
      event_type: 'activeCustomPage'
    })
  }

  async fetchInfo () {
    const { id } = this.$router.params
    const pathparams = qs.stringify({
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: `custom_${id}`
    })
    const url = transformPlatformUrl(`/alipay/pageparams/setting?${pathparams}`)
    const info = await req.get(url)

    if (!S.getAuthToken()) {
      this.setState({
        authStatus: true
      })
    }
    this.setState({
      shareInfo: info.share,
      wgts: info.config
    })
  }

  async onShareAppMessage () {
    const { shareInfo } = this.state
    const { id } = this.$router.params
    const { salesperson_id, distributor_id, work_userid, shop_code } = S.get('GUIDE_INFO', true)
    const gu = `${work_userid}_${shop_code}`
    // const gu_user_id = Taro.getStorageSync("work_userid");
    // const { userId } = Taro.getStorageSync("userinfo");
    const query = salesperson_id
      ? getDtidIdUrl(`?smid=${salesperson_id}&id=${id}&gu=${gu}`, distributor_id)
      : `?id=${id}&gu=${gu}`

    return {
      title: shareInfo.page_share_title,
      imageUrl: shareInfo.page_share_imageUrl,
      path: `/pages/custom/custom-page${query}`
    }
  }

  onShareTimeline () {
    const { shareInfo } = this.state
    const { id } = this.$router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `uid=${userId}&id=${id}` : `id=${id}`
    return {
      title: shareInfo.page_share_title,
      imageUrl: shareInfo.page_share_imageUrl,
      query: query
    }
  }

  render () {
    const { wgts, authStatus, scrollTop, showBackToTop, positionStatus } = this.state
    const { colors } = this.props
    if (!wgts) {
      return <Loading />
    }

    return (
      <View className='page-index-custom'>
        <SpNavBar title='微商城' />
        <ScrollView
          className={`wgts-wrap ${positionStatus ? 'wgts-wrap__fixed' : ''}`}
          scrollTop={scrollTop}
          scrollY
        >
          <View className='wgts-wrap__cont'>
            <BaHomeWgts wgts={wgts} />
          </View>

          <View className='recommend-detail__bar'>
            <Button openType='share' style={'background: ' + colors.data[0].primary}>
              分享给顾客
            </Button>
          </View>
        </ScrollView>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} />

        <SpToast />
      </View>
    )
  }
}
