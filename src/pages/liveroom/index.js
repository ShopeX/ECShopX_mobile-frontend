/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import { calcTimer, classNames } from '@/utils'
import api from '@/api'
import { withPager } from '@/hocs'
import { SpTabbar, Loading, SpNote, SpPage } from '@/components'
import { $t } from '@/i18n'

import './index.scss'

class LiveRoomList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      liveList: [],
      footerHeight: 0
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
    const { liveList, scrollTop, page, footerHeight } = this.state
    const countFormat = {
      day: $t('5513a80c.249aba'),
      hours: $t('5513a80c.609b5f'),
      minutes: $t('5513a80c.daf783'),
      seconds: $t('5513a80c.0c1fec')
    }
    return (
      <SpPage
        renderFooter={<SpTabbar height={footerHeight} />}
        onReady={({ footerHeight }) => {
          this.setState({ footerHeight: footerHeight })
        }}
      >
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
                        {(liveing && $t('5513a80c.6cdee8')) ||
                          (notStarted && $t('5513a80c.1cbb42')) ||
                          (playback && $t('5513a80c.94f38a')) ||
                          (other && $t('5513a80c.047fab'))}
                      </View>
                    </View>
                  </View>
                  <View className='liveroom-page-right'>
                    <View className='right-title'>{item.name}</View>
                    {/* 直播倒计时 */}
                    {notStarted && (
                      <View className='right-count'>
                        <View className='fs'>{$t('5513a80c.aaffb1')}</View>
                        <AtCountdown
                          isShowDay={this.timeStamp(item.start_time).dd != 0}
                          isShowHour={this.timeStamp(item.start_time).hh != 0}
                          format={countFormat}
                          day={this.timeStamp(item.start_time).dd}
                          hours={this.timeStamp(item.start_time).hh}
                          minutes={this.timeStamp(item.start_time).mm}
                          seconds={this.timeStamp(item.start_time).ss}
                        />
                      </View>
                    )}
                    {playback && (
                      <View className='right-count'>
                        <View className='fs'>{$t('5513a80c.cba3aa')}</View>
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
                        {$t('5513a80c.c55f91')}
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
                        {$t('5513a80c.f13a51')}
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
                        {$t('5513a80c.e8fcc4')}
                      </View>
                    )}
                  </View>
                </View>
              )
            })}
            {page.isLoading ? <Loading>{$t('5513a80c.bd0271')}</Loading> : null}
            {!page.isLoading && !page.hasNext && !liveList.length && (
              <SpNote>{$t('5513a80c.ba1de9')}</SpNote>
            )}
          </ScrollView>
          {/* <TabBar /> */}
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(withPager(LiveRoomList))
