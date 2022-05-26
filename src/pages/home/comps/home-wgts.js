import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpSearch, SpScrollView } from '@/components'
// // import { Tracker } from '@/service'
import {
  WgtSearchHome,
  WgtFilm,
  WgtMarquees,
  WgtSlider,
  WgtImgHotZone,
  WgtNavigation,
  WgtCoupon,
  WgtGoodsScroll,
  WgtGoodsGrid,
  WgtGoodsGridTab,
  WgtShowcase,
  WgtStore,
  WgtHeadline,
  WgtImgGif,
  WgtHotTopic,
  WgtFloorImg,
  WgtNearbyShop
} from '../wgts'

export default class HomeWgts extends Component {
  constructor (props) {
    console.log('HomeWgts-constructor-this.props1', props)
    super(props)
    console.log('HomeWgts-constructor-props2', props)
  }
  // static defaultProps = {
  //   wgts: []
  // }

  state = {
    screenWidth: 375,
    localWgts: []
  }

  componentDidMount () {
    console.log('HomeWgts-constructor-this.props3', this.props)
    Taro.getSystemInfo().then((res) => {
      this.setState({
        screenWidth: res.screenWidth
      })
      // if (process.env.TARO_ENV == 'weapp') {
      //   this.startTrack()
      // }
    })
  }

  static options = {
    addGlobalClass: true
  }

  startTrack () {
    this.endTrack()

    const { wgts } = this.props

    if (!wgts) return
    // const toExpose = wgts.map((t, idx) => String(idx))

    const observer = Taro.createIntersectionObserver({ observeAll: true })
    this.observe = observer
  }

  endTrack () {
    if (this.observer) {
      this.observer.disconnect()
      this.observe = null
    }
  }

  handleLoadMore = (idx, goodType, currentTabIndex, currentLength) => {
    const { loadMore = () => {} } = this.props
    loadMore(idx, goodType, currentTabIndex, currentLength)
  }

  fetch = ({ pageIndex, pageSize }) => {
    // console.log('fetch home wgts...', pageIndex, pageSize)
    const { localWgts } = this.state
    const { wgts } = this.props
    this.setState({
      localWgts: [
        ...localWgts,
        wgts[pageIndex - 1]
      ]
    })
    return {
      total: this.props.wgts.length
    }
  }

  render () {
    const { wgts } = this.props
    const { screenWidth, localWgts } = this.state

    // console.log('home-wgts23', localWgts)

    // if (localWgts.length <= 0) return null

    return (
      <SpScrollView className='home-wgts' fetch={this.fetch} pageSize={1}>
        {localWgts.map((item, idx) => (
          <View
            className='wgt-wrap'
            key={`${item.name}${idx}`}
            data-idx={idx}
            data-name={item.name}
          >
            {/* {item.name === "search" && <WgtSearchHome info={item} />} */}
            {item.name === 'search' && <SpSearch info={item} />} {/** 搜索 */}
            {item.name === 'film' && <WgtFilm info={item} />} {/** 视频 */}
            {item.name === 'marquees' && <WgtMarquees info={item} />} {/** 文字轮播 */}
            {item.name === 'slider' && (
              <WgtSlider isHomeSearch info={item} width={screenWidth} />
            )}{' '}
            {/** 轮播 */}
            {item.name === 'navigation' && <WgtNavigation info={item} />} {/** 图片导航 */}
            {item.name === 'coupon' && <WgtCoupon info={item} />} {/** 优惠券 */}
            {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />} {/** 热区图 */}
            {/** 商品滚动 */}
            {item.name === 'goodsScroll' && (
              <WgtGoodsScroll
                info={item}
                index={idx}
                type='good-scroll'
                onLoadMore={this.handleLoadMore}
              />
            )}
            {/** 商品栅格 */}
            {item.name === 'goodsGrid' && (
              <WgtGoodsGrid
                info={item}
                index={idx}
                type='good-grid'
                onLoadMore={this.handleLoadMore}
              />
            )}
            {/** 商品Tab */}
            {item.name === 'goodsGridTab' && (
              <WgtGoodsGridTab
                info={item}
                index={idx}
                type='good-grid-tab'
                onLoadMore={this.handleLoadMore}
              />
            )}
            {item.name === 'showcase' && <WgtShowcase info={item} />} {/** 橱窗 */}
            {item.name === 'headline' && <WgtHeadline info={item} />} {/** 文字标题 */}
            {item.name === 'img-gif' && <WgtImgGif info={item} />} {/** 视频图 */}
            {item.name === 'hotTopic' && <WgtHotTopic info={item} />} {/** 热点话题 */}
            {item.name === 'floorImg' && <WgtFloorImg info={item} />} {/** 楼层图片 */}
            {item.name === 'store' && <WgtStore info={item} />} {/** 推荐商铺 */}
            {item.name === 'nearbyShop' && <WgtNearbyShop info={item} />} {/** 附近商家 */}
          </View>
        ))}
      </SpScrollView>
    )
  }
}
