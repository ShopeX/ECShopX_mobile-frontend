import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, TabBar, Loading } from '@/components'
import req from '@/api/req'
import S from "@/spx";
import { WgtSearchHome, WgtSlider, WgtNavigation, WgtCoupon, WgtGoodsScroll, WgtGoodsGrid, WgtShowcase, WgtPointLuck } from './wgts'

import './index.scss'

@connect(store => ({
  store
}))
export default class HomeIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      wgts: null,
      authStatus: false
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=index'
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
    const { wgts, authStatus } = this.state

    if (!wgts || !this.props.store) {
      return <Loading />
    }

    return (
      <View className='page-index'>
        <WgtSearchHome />
        <ScrollView
          className='wgts-wrap wgts-wrap__fixed'
          scrollY
        >
          <View className='wgts-wrap__cont'>
            {
              wgts.map((item, idx) => {
                return (
                  <View className='wgt-wrap' key={idx}>
                    {item.name === 'slider' && <WgtSlider info={item} />}
                    {item.name === 'navigation' && <WgtNavigation info={item} />}
                    {item.name === 'coupon' && <WgtCoupon info={item} />}
                    {item.name === 'goodsScroll' && <WgtGoodsScroll info={item} />}
                    {item.name === 'goodsGrid' && <WgtGoodsGrid info={item} />}
                    {item.name === 'showcase' && <WgtShowcase info={item} />}
                    {idx === 1 && (
                      <WgtPointLuck />
                    )}
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
        <SpToast />
        <TabBar />
      </View>
    )
  }
}
