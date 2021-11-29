import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
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
  WgtFloorImg
} from '../wgts'

export default class HomeWgts extends Component {
  constructor(props) {
    console.log('HomeWgts-constructor-this.props1',props)
    super(props)
    console.log('HomeWgts-constructor-props2',props)
  }
  // static defaultProps = {
  //   wgts: []
  // }

  state = {
    screenWidth: 375
  }

  componentDidMount() {
    console.log('HomeWgts-constructor-this.props3',this.props)
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

  startTrack() {
    this.endTrack()

    const { wgts } = this.props

    if (!wgts) return
    // const toExpose = wgts.map((t, idx) => String(idx))

    const observer = Taro.createIntersectionObserver({ observeAll: true })

    this.observe = observer
  }

  endTrack() {
    if (this.observer) {
      this.observer.disconnect()
      this.observe = null
    }
  }

  handleLoadMore = (idx, goodType, currentTabIndex, currentLength) => {
    const { loadMore = () => {} } = this.props
    loadMore(idx, goodType, currentTabIndex, currentLength)
  }

  render() {
    const { wgts } = this.props
    const { screenWidth } = this.state

    console.log('home-wgts23', wgts)

    if (!wgts || wgts.length <= 0) return (<View>就很</View>)
    return (
      <View className='home-wgts'>
        {
         wgts.map((item, idx) => (          
          <View
            className='wgt-wrap'
            key={`${item.name}${idx}`}
            data-idx={idx}
            data-name={item.name}
          >
            {idx} {item.name}
            {item.name === "search" && <WgtSearchHome info={item} />}
            {item.name === 'film' && <WgtFilm info={item} />}
            {item.name === 'marquees' && <WgtMarquees info={item} />}
            {item.name === 'slider' && <WgtSlider isHomeSearch info={item} width={screenWidth} />}
            {item.name === 'navigation' && <WgtNavigation info={item} />}
            {item.name === 'coupon' && <WgtCoupon info={item} />}
            {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />}
            {item.name === 'goodsScroll' && (
              <WgtGoodsScroll
                info={item}
                index={idx}
                type='good-scroll'
                onLoadMore={this.handleLoadMore}
              />
            )}
            {item.name === 'goodsGrid' && (
              <WgtGoodsGrid
                info={item}
                index={idx}
                type='good-grid'
                onLoadMore={this.handleLoadMore}
              />
            )}
            {item.name === 'goodsGridTab' && (
              <WgtGoodsGridTab
                info={item}
                index={idx}
                type='good-grid-tab'
                onLoadMore={this.handleLoadMore}
              />
            )}
            {item.name === 'showcase' && <WgtShowcase info={item} />}
            {item.name === 'headline' && <WgtHeadline info={item} />}
            {item.name === 'img-gif' && <WgtImgGif info={item} />}
            {item.name === 'hotTopic' && <WgtHotTopic info={item} />}
            {item.name === 'floorImg' && <WgtFloorImg info={item} />}
            {/* {process.env.APP_PLATFORM !== 'standard' && item.name === 'store' && (
              <WgtStore info={item} />
            )} */}
          </View>
          ))
        }
      </View>
    )
  }
}
