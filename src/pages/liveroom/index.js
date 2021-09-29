import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { AtCountdown } from "taro-ui"
import { debounce, calcTimer, classNames } from '@/utils'
import api from '@/api'
import { TabBar } from '@/components'

import './index.scss'

export default class LiveRoomList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scrollTop: 0,
      isRefresh: false,
      liveList: [],
      isLoading: false,
      isEnding: false,
      param: {
        page: 1,
        pageSize: 10
      }
    }
  }

  componentDidMount () {
    this.getList()
  }

  timeStamp = (time) => {
    // time = 1632640084
    let currentTimp = new Date().getTime() / 1000
    let second = calcTimer((time - currentTimp))
    return second
  }

  getList = async (isRefrsh = false) => {
    const { param, liveList } = this.state
    await api.liveroom.getLiveRoomList({ page: param.page, page_size: param.pageSize }).then(res => {
      const { list, total_count } = res
      let listlength = liveList.concat(list).length || list.length
      this.setState({
        liveList: isRefrsh ? liveList.concat(list) : list,
        isRefresh: false,
        isLoading: false,
        isEnding: listlength == total_count
      })
    })
  }

  // 滚动事件
  onScroll = debounce((e) => {
    const { scrollTop } = e.detail
    this.setState({
      scrollTop
    })
  }, 1000)

  // 下拉刷新
  handleRefresh = () => {
    const { param } = this.state
    param.page = 1
    this.setState({
      isRefresh: true,
      param
    })
    this.getList()
  }

  // 滚动到底部
  onScrollToLower = () => {
    const { isLoading, param, isEnding } = this.state
    if (isLoading || isEnding) return
    this.setState({
      param: {
        page: ++param.page,
        pageSize: param.pageSize
      },
      isLoading: true
    })
    this.getList(true)
  }

  // 上拉加载
  onScrollToUpper = () => {
    const { isLoading, param, isEnding } = this.state
    if (isLoading || isEnding) return
    this.setState({
      param: {
        page: 1,
        pageSize: param.pageSize
      },
      isLoading: true
    })
    this.getList()
  }

  onLocation = (item) => {
    // if ((item.live_status === 103 && item.close_replay === 0) || item.live_status === 101) {
    Taro.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomid}`
    })
    // } else {
    //   return
    // }
  }

  render () {
    const { liveList, scrollTop, isRefresh, isLoading, isEnding } = this.state
    return (
      <View>
        <ScrollView
          className='liveroom-page'
          scrollY
          scrollAnchoring
          refresherEnabled
          scrollWithAnimation
          lowerThreshold='100px'
          upperThreshold='100px'
          scrollTop={scrollTop}
          onScroll={this.onScroll}
          refresherTriggered={isRefresh}
          onRefresherRefresh={this.handleRefresh}
          onScrollToUpper={this.onScrollToUpper}
          onScrollToLower={this.onScrollToLower}
          style={{ height: '100vh' }}
        >
          {liveList.map(item => {
            let liveing = item.live_status == 101 // 直播中
            let notStarted = item.live_status == 102 // 未开始（预告）
            let playback = item.live_status == 103 && item.close_replay == 0 // 回放
            let other = (item.live_status == 103 && item.close_replay == 1) || item.live_status == 104 || item.live_status == 105 || item.live_status == 106 || item.live_status == 107
            return (
              <View className='liveroom-page-box' key={item.roomid}>
                <View className='liveroom-page-left'>
                  <Image className='left-img' mode='widthFix' src={item.share_img} />
                  <View className='left-mengceng'></View>
                  <View className='left-state'>
                    <View className={classNames('lives', notStarted && 'notice' || (other || playback) && 'return')}>
                      {
                        liveing &&
                        <Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/live_w.png`} />
                      }
                      {
                        notStarted &&
                        <Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/notice_w.png`} />
                      }
                      {
                        playback &&
                        <Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/return_b.png`} />
                      }
                      {
                        other &&
                        <Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/over_b.png`} />
                      }
                    </View>
                    <View className='content'>
                      {
                        liveing && '正在直播中' ||
                        notStarted && '预告' ||
                        playback && '回放' ||
                        other && '已结束'
                      }
                    </View>
                  </View>
                </View>
                <View className='liveroom-page-right'>
                  <View className='right-title'>{item.name}</View>
                  {/* 直播时间 */}
                  {
                    notStarted &&
                    <View className='right-count'>
                      <View className='fs'>直播时间：</View>
                      <AtCountdown
                        isShowDay={this.timeStamp(item.start_time).dd != 0}
                        isShowHour={this.timeStamp(item.start_time).hh != 0}
                        format={{ day: '天', hours: '时', minutes: '分', seconds: '' }}
                        day={this.timeStamp(item.start_time).dd}
                        hours={this.timeStamp(item.start_time).hh}
                        minutes={this.timeStamp(item.start_time).mm}
                        seconds={this.timeStamp(item.start_time).ss}
                      />
                    </View>
                  }
                  {
                    playback &&
                    <View className='right-count'>
                      <View className='fs'>直播时长：</View>
                      <View className='fs'>{item.live_time_text}</View>
                    </View>
                  }
                  {/* 右侧按钮 */}
                  {
                    liveing &&
                    <View onClick={this.onLocation.bind(this, item)} className='right-btn lives'>
                      <Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/live_w.png`} />
                      进入直播
                    </View>
                  }
                  {
                    notStarted &&
                    <View onClick={this.onLocation.bind(this, item)} className='right-btn return notice-border'>
                      <Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/notice_b.png`} />
                      查看预告
                    </View>
                  }
                  {
                    playback &&
                    <View onClick={this.onLocation.bind(this, item)} className='right-btn return return-border'>
                      <Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/return_b.png`} />
                      查看回放
                    </View>
                  }
                </View>
              </View>
            )
          })
        }
        <View style='text-align: center;margin: 10px;'>
          { isLoading && <View>加载中...</View> }
          { isEnding && <View>-- 我也是有底线的 --</View> }
        </View>
      </ScrollView>
      <TabBar />
    </View>
  )}
}
