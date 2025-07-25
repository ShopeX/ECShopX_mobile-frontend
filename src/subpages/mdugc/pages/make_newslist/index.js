import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'

import api from '@/api'

//import '../../font/iconfont.scss'
import './index.scss'

export default class make_newslist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }
  isicon = (type) => {
    let icon = ''
    if (type == 'system') {
      icon = 'icon-logo'
    } else if (type == 'reply') {
      icon = 'icon-sixin'
    } else if (type == 'like') {
      icon = 'icon-aixin'
    } else if (type == 'favoritePost') {
      icon = 'icon-redu'
    } else if (type == 'followerUser') {
      icon = 'icon-gerenzhongxin'
    }
    return icon
  }
  topage = (item) => {
    let { type, unread_nums } = item
    let url = ''
    if (type == 'system') {
      url = 'make_system'
    } else if (type == 'reply') {
      url = 'make_comment'
    } else if (type == 'like') {
      url = 'make_fabulous'
    } else if (type == 'favoritePost') {
      url = 'make_collection'
    } else if (type == 'followerUser') {
      url = 'make_follow'
    }
    if (!Number(unread_nums)) {
      unread_nums = ''
    }
    Taro.navigateTo({
      url: `/mdugc/pages/${url}/index?num=${unread_nums}`
    })
  }
  // 刷新当前未读消息数
  async componentDidShow() {
    let { message_info } = await api.mdugc.messagedashboard()
    if (message_info) {
      this.setState({
        list: message_info
      })
    }
    console.log('这是消息', message_info)
  }
  config = {
    navigationBarTitleText: '消息通知',
    enablePullDownRefresh: true,
    'backgroundTextStyle': 'dark'
  }
  // 下拉刷新
  async onPullDownRefresh() {
    console.log('下拉')
    Taro.startPullDownRefresh()
    let { message_info } = await api.mdugc.messagedashboard()
    if (message_info) {
      this.setState(
        {
          list: message_info
        },
        () => {
          Taro.stopPullDownRefresh()
        }
      )
    }
  }

  render() {
    const { list } = this.state
    return (
      <View className='newslist'>
        {list.map((item) => {
          return item.recent_message.list.length > 0 ? (
            <View className='newslist_i' onClick={this.topage.bind(this, item)}>
              <View className='newslist_i_icon'>
                <View
                  className={`newslist_i_icon_icons ${item.type} ${this.isicon(item.type)}`}
                ></View>
                {item.unread_nums ? (
                  <View className='newslist_i_icon_num'>{item.unread_nums}</View>
                ) : null}
              </View>
              <View className='newslist_i_cen'>
                <View className='newslist_i_cen_title'>
                  {item.type == 'system' ? '系统通知' : item.recent_message.list[0].from_nickname}
                </View>
                <View className='newslist_i_cen_text'>
                  {item.recent_message.list.length > 0
                    ? (item.type == 'system' ? '' : item.recent_message.list[0].created_moment) +
                      '' +
                      item.recent_message.list[0].title
                    : null}
                </View>
              </View>

              <View className='newslist_i_time'>
                {item.recent_message.list.length > 0
                  ? item.recent_message.list[0].created_text
                  : null}
              </View>
            </View>
          ) : null
        })}
      </View>
    )
  }
}
