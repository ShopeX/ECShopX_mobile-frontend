import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpToast, Loading, BackToTop, NavBar } from '@/components'
import req from '@/api/req'
import { withBackToTop } from '@/hocs'
import S from "@/spx";
import { buriedPoint,platformTemplateName } from '@/utils'
import { getDistributorId } from "@/utils/helper";
import HomeWgts from '../home/comps/home-wgts'
import qs from 'qs';
import './custom-page.scss'

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
    const pathparams=qs.stringify({
      template_name:platformTemplateName,
      version:'v1.0.1',
      page_name:`custom_${id}`,
      name:'search'
    })
    const url = `/alipay/pageparams/setting?${pathparams}`
    const fixSetting = await req.get(url)

    this.setState({
      positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
    }, () => {
      this.fetchInfo()
    })
    // 埋点处理
    buriedPoint.call(this, {
      event_type: "activeCustomPage"
    });
  }

  async fetchInfo () {
    const { id } = this.$router.params
    const dtid = getDistributorId();
    const url = `/alipay/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=custom_${id}&distributor_id=${dtid}`
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
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `?uid=${userId}&id=${id}` : `?id=${id}`
    console.log(query)    
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

    if (!wgts) {
      return <Loading />
    }

    return (
      <View className='page-index-custom'>
        <NavBar 
          title='微商城'
        />
        <ScrollView
          className={`wgts-wrap ${positionStatus ? 'wgts-wrap__fixed' : ''}`}
          scrollTop={scrollTop}
          scrollY
        >
          <View className='wgts-wrap__cont'>
            <HomeWgts
              wgts={wgts}
            />
          </View>
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

        <SpToast />
      </View>
    )
  }
}
