import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, Loading, SpNote, BackToTop } from '@/components'
import req from '@/api/req'
import api from '@/api'
import { pickBy } from '@/utils'
import { withBackToTop } from '@/hocs'
import S from "@/spx";
import { HomeWgts } from '../home/comps/home-wgts'

import './custom-page.scss'

@withBackToTop
export default class HomeIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      wgts: null,
      authStatus: false,
      positionStatus: false
    }
  }

  async componentDidMount () {
    const { id } = this.$router.params
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=custom_${id}&name=search`
    const fixSetting = await req.get(url)

    this.setState({
      positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
    }, () => {
      this.fetchInfo()
    })
  }

  async fetchInfo () {
    const { id } = this.$router.params
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=custom_${id}`
    const info = await req.get(url)

    if (!S.getAuthToken()) {
      this.setState({
        authStatus: true
      })
    }
    this.setState({
      wgts: info.config
    })
  }

  render () {
    const { wgts, authStatus, scrollTop, showBackToTop, positionStatus } = this.state

    if (!wgts) {
      return <Loading />
    }

    return (
      <View className='page-index'>
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
