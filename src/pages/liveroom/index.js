import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import { calcTimer, classNames } from '@/utils'
import api from '@/api'
import { withPager } from '@/hocs'
import { TabBar, Loading, SpNote } from '@/components'

import './index.scss'

@withPager
export default class LiveRoomList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      liveList: []
    }
  }

  componentDidMount() {
    this.nextPage()
  }

  async fetch(params) {
    const { page_no: page, page_size } = params
    const query = {
      page,
      page_size
    }
    const { list, total_count: total } = await api.liveroom.getLiveRoomList(query)
    this.setState({
      liveList: [...this.state.liveList, ...list]
    })
    return {
      total
    }
  }

  timeStamp = (time) => {
    let currentTimp = new Date().getTime() / 1000
    let second = calcTimer(time - currentTimp)
    return second
  }

  onPullDownRefresh = () => {
    // Taro.showLoading({
    //   title: '加载中',
    //   icon: 'none',
    // })
    this.resetPage(() => {
      this.setState({ liveList: [] })
      this.nextPage()
      // Taro.hideLoading()
    })
  }

  onLocation = (item) => {
    Taro.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomid}`
    })
  }

  render() {
    const { liveList, scrollTop, page } = this.state
    return (
      <View>
        <ScrollView
          className='liveroom-page'
          scrollY
          scroll-anchoring
          scrollWithAnimation
          scrollTop={scrollTop}
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
          onScrollToUpper={this.onPullDownRefresh.bind(this)}
        >
          {liveList.map((item) => {
            let liveing = item.live_status == 101 // 直播中
            let notStarted = item.live_status == 102 // 未开始（预告）
            let playback = item.live_status == 103 && item.close_replay == 0 // 回放
            let other =
              (item.live_status == 103 && item.close_replay == 1) ||
              item.live_status == 104 ||
              item.live_status == 105 ||
              item.live_status == 106 ||
              item.live_status == 107
            return (
              <View className='liveroom-page-box' key={item.roomid}>
                <View className='liveroom-page-left'>
                  <Image className='left-img' mode='widthFix' src={item.share_img} />
                  <View className='left-mengceng'></View>
                  <View className='left-state'>
                    <View
                      className={classNames(
                        'lives',
                        (notStarted && 'notice') || ((other || playback) && 'return')
                      )}
                    >
                      {liveing && (
                        <Image
                          className='icons'
                          mode='aspectFit'
                          src={`${process.env.APP_IMAGE_CDN}/live_w.png`}
                        />
                      )}
                      {notStarted && (
                        <Image
                          className='icons'
                          mode='aspectFit'
                          src={`${process.env.APP_IMAGE_CDN}/notice_w.png`}
                        />
                      )}
                      {playback && (
                        <Image
                          className='icons'
                          mode='aspectFit'
                          src={`${process.env.APP_IMAGE_CDN}/return_b.png`}
                        />
                      )}
                      {other && (
                        <Image
                          className='icons'
                          mode='aspectFit'
                          src={`${process.env.APP_IMAGE_CDN}/over_b.png`}
                        />
                      )}
                    </View>
                    <View className='content'>
                      {(liveing && '正在直播中') ||
                        (notStarted && '预告') ||
                        (playback && '回放') ||
                        (other && '已结束')}
                    </View>
                  </View>
                </View>
                <View className='liveroom-page-right'>
                  <View className='right-title'>{item.name}</View>
                  {/* 直播倒计时 */}
                  {notStarted && (
                    <View className='right-count'>
                      <View className='fs'>直播倒计时：</View>
                      <AtCountdown
                        isShowDay={this.timeStamp(item.start_time).dd != 0}
                        isShowHour={this.timeStamp(item.start_time).hh != 0}
                        format={{ day: '天', hours: '时', minutes: '分', seconds: '秒' }}
                        day={this.timeStamp(item.start_time).dd}
                        hours={this.timeStamp(item.start_time).hh}
                        minutes={this.timeStamp(item.start_time).mm}
                        seconds={this.timeStamp(item.start_time).ss}
                      />
                    </View>
                  )}
                  {playback && (
                    <View className='right-count'>
                      <View className='fs'>直播时长：</View>
                      <View className='fs'>{item.live_time_text}</View>
                    </View>
                  )}
                  {/* 右侧按钮 */}
                  {liveing && (
                    <View onClick={this.onLocation.bind(this, item)} className='right-btn lives'>
                      <Image
                        className='icons'
                        mode='aspectFit'
                        src={`${process.env.APP_IMAGE_CDN}/live_w.png`}
                      />
                      进入直播
                    </View>
                  )}
                  {notStarted && (
                    <View
                      onClick={this.onLocation.bind(this, item)}
                      className='right-btn return notice-border'
                    >
                      <Image
                        className='icons'
                        mode='aspectFit'
                        src={`${process.env.APP_IMAGE_CDN}/notice_b.png`}
                      />
                      查看预告
                    </View>
                  )}
                  {playback && (
                    <View
                      onClick={this.onLocation.bind(this, item)}
                      className='right-btn return return-border'
                    >
                      <Image
                        className='icons'
                        mode='aspectFit'
                        src={`${process.env.APP_IMAGE_CDN}/return_b.png`}
                      />
                      查看回放
                    </View>
                  )}
                </View>
              </View>
            )
          })}
          {page.isLoading ? <Loading>正在加载...</Loading> : null}
          {!page.isLoading && !page.hasNext && !liveList.length && <SpNote>暂无数据~</SpNote>}
        </ScrollView>
        <TabBar />
      </View>
    )
  }
}
