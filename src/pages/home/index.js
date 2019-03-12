import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SearchBar, TabBar } from '@/components'
import req from '@/api/req'
import { WgtSlider, WgtNavigation, WgtCoupon, WgtGoodsScroll, WgtGoodsGrid, WgtShowcase } from './wgts'

import './index.scss'

@connect(store => ({
  store
}))
export default class HomeIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      wgts: null
    }
  }

  componentWillMount () {
    this.fetch()
  }

  async fetch () {
    const url = 'http://pjj.aixue7.com/index.php/api/h5app/wxapp/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=index'
    const info = await req.get(url)

    this.setState({
      wgts: info.config
    })
  }

  render () {
    const { wgts } = this.state
    if (!wgts || !this.props.store) {
      return null
    }

    return (
      <View className='page-index'>
        <SearchBar
          isFixed
        />
        <View className='wgts-wrap wgts-wrap__fixed'>
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
                </View>
              )
            })
          }
        </View>
        <TabBar></TabBar>
      </View>
    )
  }
}
