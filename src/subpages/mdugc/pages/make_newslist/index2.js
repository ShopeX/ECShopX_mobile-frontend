/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useCallback } from 'react'
import Taro, { getCurrentInstance, useRouter, usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'

import api from '@/api'
import { useImmer } from 'use-immer'
import { SpImage } from '@/components'

//import '../../font/iconfont.scss'
import './index2.scss'

const initialState = {
  list: [],
  list2: [
    {
      time: '2023-03-02 16:05',
      title: '我是通知标题',
      content:
        '我是通知内容我是通知内容我是通知内容我是通知内容我是通知内容我是通知内容我是通知内容我是通知内容！！！！我是通知内容。我是通知内容！！！',
      storeInfo: {
        headimgurl:
          'https://bbc-espier-images.amorepacific.com.cn/image/2/2023/02/27/8cb6a339f27aeaeb02669173e9a68fdeHe4tKEonZIuygGC8ZSSCWXdGJXJKeywv',
        nickname: 'ecshopex-长沙北辰店'
      }
    },
    {
      time: '2023-03-02 16:05',
      title: '我是通知标题',
      content:
        '我是通知内容我是通知内容我是通知内容我是通知内容我是通知内容我是通知内容我是通知内容我是通知内容！！！！我是通知内容。我是通知内容！！！',
      storeInfo: {
        headimgurl:
          'https://bbc-espier-images.amorepacific.com.cn/image/2/2023/02/27/8cb6a339f27aeaeb02669173e9a68fdeHe4tKEonZIuygGC8ZSSCWXdGJXJKeywv',
        nickname: 'ecshopex-长沙北辰店'
      }
    }
  ]
}

function make_newslist(props) {
  const [state, setState] = useImmer(initialState)

  const isicon = (type) => {
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
  const topage = (item) => {
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

  useEffect(() => {
    initMessage()
  }, [])
  // 刷新当前未读消息数
  const initMessage = async () => {
    let { message_info } = await api.mdugc.messagedashboard()
    if (message_info) {
      setState((draft) => {
        draft.list = message_info
      })
    }
    console.log('这是消息', message_info)
  }
  // 下拉刷新
  usePullDownRefresh(async () => {
    console.log('下拉')
    // Taro.startPullDownRefresh()
    let { message_info } = await api.mdugc.messagedashboard()
    if (message_info) {
      await setState((draft) => {
        draft.list = message_info
      })
      Taro.stopPullDownRefresh()
    }
  })

  const { list2 } = state
  // console.log('list', list)
  return (
    <View className='newslist'>
      {list2.map((item, index) => {
        // return item.recent_message.list.length > 0 ? (
        //   <View className='newslist_i' onClick={topage.bind(this, item)}>
        //     <View className='newslist_i_icon'>
        //       <View className={`newslist_i_icon_icons ${item.type} ${isicon(item.type)}`}></View>
        //       {item.unread_nums ? (
        //         <View className='newslist_i_icon_num'>{item.unread_nums}</View>
        //       ) : null}
        //     </View>
        //     <View className='newslist_i_cen'>
        //       <View className='newslist_i_cen_title'>
        //         {item.type == 'system' ? '系统通知' : item.recent_message.list[0].from_nickname}
        //       </View>
        //       <View className='newslist_i_cen_text'>
        //         {item.recent_message.list.length > 0
        //           ? (item.type == 'system' ? '' : item.recent_message.list[0].created_moment) +
        //             '' +
        //             item.recent_message.list[0].title
        //           : null}
        //       </View>
        //     </View>

        //     <View className='newslist_i_time'>
        //       {item.recent_message.list.length > 0
        //         ? item.recent_message.list[0].created_text
        //         : null}
        //     </View>
        //   </View>
        // ) : null
        return (
          <View className='list-item' key={index}>
            <View className='time'>{item.time}</View>
            <View className='content'>
              <View className='content-title'>{item.title}</View>
              <View className='content-content'>{item.content}</View>
              <View className='content-info'>
                <SpImage
                  src={item.storeInfo.headimgurl || 'user_icon.png'}
                  className='content-info-img'
                />
                <View className='content-info-nickname'>{item.storeInfo.nickname}</View>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default make_newslist
