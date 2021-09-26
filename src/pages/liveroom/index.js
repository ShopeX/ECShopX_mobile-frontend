import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import { AtCountdown } from "taro-ui"
import { debounce, calcTimer, classNames } from '@/utils'
import api from '@/api'
import LoadingMore from '@/boost/component/loadingMore'

import './index.scss'

export default class LiveRoomList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scrollTop: 0,
      isRefresh: false,
      liveRoomList: [],
      isEnd: false,
      isLoading: false,
      isEmpty: false,
      param: {
        page: 1,
        pageSize: 5
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
    const { param, liveRoomList } = this.state
    isRefrsh && Taro.showLoading({title: '正在加载...', mask: true})
    await api.liveroom.getLiveRoomList({ page: param.page, page_size: param.pageSize }).then(res => {
      const { list, total_count } = res
      const isEnd = param.page >= (total_count / param.pageSize)
      this.setState({
        liveRoomList: isRefrsh ? list : [...liveRoomList, ...list],
        isRefresh: false,
        isLoading: false,
        isEnd,
        isEmpty: list.length <= 0
      })
      isRefrsh && Taro.hideLoading()
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
    this.getList(true)
  }

  // 上拉加载
  handleLoadMore = () => {
    const { isLoading, isEnd, param, isEmpty } = this.state
    if (isEnd || isLoading || isEmpty) return
    this.setState({
      param: {
        page: ++param.page,
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
    const { liveRoomList, scrollTop, isRefresh, isEnd, isLoading, isEmpty } = this.state
    return (
      <ScrollView
        className='liveroom-page'
        scrollY
        scroll-anchoring
        refresherEnabled
        scrollWithAnimation
        scrollTop={scrollTop}
        onScroll={this.onScroll}
        refresherTriggered={isRefresh}
        onRefresherRefresh={this.handleRefresh}
        onScrollToLower={this.handleLoadMore}
      >
        {/* <View className='liveroom-page-box'>
          <View className='liveroom-page-left'>
            <Image className='left-img' mode='widthFix' src={liveRoomList[0].cover_img}></Image>
            <View className='left-state'>
              <View className='lives'><Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/live_w.png`} /></View>
              <View className='content'>
                正在直播中
              </View>
            </View>
          </View>
          <View className='liveroom-page-right'>
            <View className='right-title'>科技布沙发现代轻奢直播名称最多显示两行…</View>
            <View className='right-btn lives'><Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/live_w.png`} />进入直播</View>
          </View>
        </View>
        <View className='liveroom-page-box'>
          <View className='liveroom-page-left'>
            <Image className='left-img' mode='widthFix' src={liveRoomList[0].cover_img}></Image>
            <View className='left-state'>
              <View className='lives notice'><Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/notice_w.png`} /></View>
              <View className='content'>
                预告
              </View>
            </View>
          </View>
          <View className='liveroom-page-right'>
            <View className='right-title'>科技布沙发现代轻奢直播名称最多显示两行…</View>
            <View className='right-count'>
              <Text>直播时间：</Text>
              <AtCountdown
                isShowDay={this.timeStamp(1632991411).dd != 0}
                isShowHour={this.timeStamp(1632991411).hh != 0}
                format={{ day: '天', hours: '时', minutes: '分', seconds: '' }}
                day={this.timeStamp(1632991411).dd}
                hours={this.timeStamp(1632991411).hh}
                minutes={this.timeStamp(1632991411).mm}
                seconds={this.timeStamp(1632991411).ss}
              />
            </View>
            <View className='right-btn return notice-border'><Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/notice_b.png`} />查看预告</View>
          </View>
        </View>
        <View className='liveroom-page-box'>
          <View className='liveroom-page-left'>
            <Image className='left-img' mode='widthFix' src={liveRoomList[0].cover_img}></Image>
            <View className='left-state'>
              <View className='lives return'><Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/return_b.png`} /></View>
              <View className='content'>
                回放
              </View>
            </View>
          </View>
          <View className='liveroom-page-right'>
            <View className='right-title'>科技布沙发现代轻奢直播名称最多显示两行…</View>
            <View className='right-count'>
              <View className='fs'>直播时长：</View>
              <View className='fs'>4小时16分05秒</View>
            </View>
            <View className='right-btn return return-border'><Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/return_b.png`} />查看回放</View>
          </View>
        </View>
        <View className='liveroom-page-box'>
          <View className='liveroom-page-left'>
            <Image className='left-img' mode='widthFix' src={liveRoomList[0].cover_img}></Image>
            <View className='left-state'>
              <View className='lives return'><Image className='icons' mode='aspectFit' src={`${APP_IMAGE_CDN}/over_b.png`} /></View>
              <View className='content'>
                已结束
              </View>
            </View>
          </View>
          <View className='liveroom-page-right'>
            <View className='right-title'>科技布沙发现代轻奢直播名称最多显示两行…</View>
          </View>
        </View> */}
        {liveRoomList.map(item => {
          let liveing = item.live_status == 101 // 直播中
          let notStarted = item.live_status == 102 // 未开始（预告）
          let playback = item.live_status == 103 && item.close_replay == 0 // 回放
          let other = (item.live_status == 103 && item.close_replay == 1) || item.live_status == 104 || item.live_status == 105 || item.live_status == 106 || item.live_status == 107
          return (
            <View className='liveroom-page-box' key={item.roomid}>
              <View className='liveroom-page-left'>
                <Image className='left-img' mode='widthFix' src={item.cover_img} />
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
                    <Text>直播时间：</Text>
                    <AtCountdown
                      isShowDay={this.timeStamp(1632991411).dd != 0}
                      isShowHour={this.timeStamp(1632991411).hh != 0}
                      format={{ day: '天', hours: '时', minutes: '分', seconds: '' }}
                      day={this.timeStamp(1632991411).dd}
                      hours={this.timeStamp(1632991411).hh}
                      minutes={this.timeStamp(1632991411).mm}
                      seconds={this.timeStamp(1632991411).ss}
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
      {/* 加载更多 */}
      <LoadingMore isLoading={isLoading} isEnd={isEnd} isEmpty={isEmpty} />
      {/* 防止子内容无法支撑scroll-view下拉刷新 */}
      <View style='width:2rpx;height:2rpx;bottom:-2rpx;position:absolute;' />
    </ScrollView>
  )}
}
