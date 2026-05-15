/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpImage } from '@/components'
import { SpTagBar } from '@/subpages/components'
import { infotype } from '@/consts'
import api from '@/api'
import * as mdugcApi from '@/api/mdugc'
import dayjs from 'dayjs'
import { useTranslation, $t } from '@/i18n'
import './info-notify.scss'

const FILTER_TEMPLATE = () => [
  { tag_id: 1, tag_type: infotype().SYSTEM, icon: 'icon-logo', num: 0 },
  { tag_id: 2, tag_type: infotype().REPLY, icon: 'icon-sixin', num: 0 },
  { tag_id: 3, tag_type: infotype().LIKE, icon: 'icon-aixin', num: 0 },
  { tag_id: 4, tag_type: infotype().FAVORITEPOST, icon: 'icon-redu', num: 0 },
  {
    tag_id: 5,
    tag_type: infotype().FOLLOWERUSER,
    icon: 'icon-gerenzhongxin',
    num: 0
  }
]

const initialState = {
  curFilterIndex: 0,
  infoList: [],
  type: '',
  filterUnread: {}
}
function UgcFollowFans() {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { curFilterIndex, infoList, type, filterUnread } = state
  const filterList = useMemo(() => {
    const tmpl = FILTER_TEMPLATE()
    const names = [
      $t('6d5afdff.8a8b89'),
      $t('6d5afdff.1edff0'),
      $t('6d5afdff.87f653'),
      $t('6d5afdff.ae336c'),
      $t('6d5afdff.4c0a3a')
    ]
    return tmpl.map((row, i) => ({
      ...row,
      tag_name: names[i],
      num: filterUnread[row.tag_type] ?? 0
    }))
  }, [i18n.language, filterUnread])
  const listRef = useRef('')

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('6d5afdff.d1d4c3') })
  }, [i18n.language])

  useEffect(() => {
    getInfoList()
  }, [])

  useEffect(() => {
    console.log('----', type)
    listRef.current.reset()
    readInfo()
  }, [type])

  usePullDownRefresh(() => {
    setState((draft) => {
      draft.type = ''
    })
    getInfoList()
  })

  const onChangeFilter = useCallback(
    async (index) => {
      setState((draft) => {
        draft.curFilterIndex = index
        draft.type = filterList[index].tag_type
      })
    },
    [filterList, setState]
  )
  const readInfo = async () => {
    if (!type) return
    let data = {
      type
    }
    await mdugcApi.messagesetTohasRead(data)
  }
  const getInfoList = async () => {
    let { message_info } = await mdugcApi.messagedashboard()
    setState((draft) => {
      const nextUnread = {}
      message_info.forEach((ele) => {
        nextUnread[ele.type] = ele.unread_nums
      })
      draft.filterUnread = nextUnread
      const tm = FILTER_TEMPLATE()
      draft.type = tm[draft.curFilterIndex].tag_type
    })
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    if (!type) return 0
    // const { page_no: page, page_size: pageSize } = params
    const params = {
      page: pageIndex,
      pageSize,
      type
    }
    const { list, total_count: total } = await mdugcApi.messagelist(params)

    console.log(list, '----- ')
    Taro.stopPullDownRefresh()
    setState((draft) => {
      draft.infoList = list
    })
    return { total: total || 0 }
  }
  const goToPage = (item) => {
    console.log(item)
    const { type, sub_type, postInfo, from_user_id } = item
    if (type === infotype().SYSTEM && sub_type === 'refusePost') {
      Taro.navigateTo({ url: `/subpages/mdugc/note?post_id=${postInfo.post_id}` })
    } else if (type === infotype().FOLLOWERUSER) {
      Taro.navigateTo({ url: `/subpages/mdugc/my?user_id=${from_user_id}` })
    } else {
      Taro.navigateTo({ url: `/subpages/mdugc/note-detail?post_id=${postInfo.post_id}` })

      // /mdugc/pages/make_details/index?item_id=${item.post_id
    }
    //
  }
  // const isicon = (type) => {
  //   let icon = ''
  //   if (type == 'system') {
  //     icon = 'icon-logo'
  //   } else if (type == 'reply') {
  //     icon = 'icon-sixin'
  //   } else if (type == 'like') {
  //     icon = 'icon-aixin'
  //   } else if (type == 'favoritePost') {
  //     icon = 'icon-redu'
  //   } else if (type == 'followerUser') {
  //     icon = 'icon-gerenzhongxin'
  //   }
  //   return icon
  // }

  return (
    <SpPage className='page-ugc-info-notify'>
      <SpTagBar
        list={filterList}
        value={filterList[curFilterIndex]?.tag_id}
        onChange={onChangeFilter}
      />
      <SpScrollView className='scroll-list' auto ref={listRef} fetch={fetch}>
        <View className='info-list'>
          {
            infoList &&
              infoList.map((item, index) => (
                <View
                  className='info-item'
                  key={`info-item__${index}`}
                  onClick={() => goToPage(item)}
                >
                  <View className='info-item-create_time'>
                    {dayjs(item.created * 1000).format('YYYY-MM-DD HH:MM:ss')}
                  </View>
                  <View className='info-item-container'>
                    <View className='info-item_title'>
                      {item.title}
                      {/* {item.from_nickname} */}
                      {/* {filterList[curFilterIndex]?.tag_name}通知 */}
                    </View>
                    <View className='info-item_content'>{item.content}</View>
                    <View className='info-item_footer'>
                      <SpImage circle src={item.from_userInfo.avatar} width={32} height={32} />
                      <Text className='info-item_footer_name'>{item.from_userInfo.nickname}</Text>
                    </View>
                  </View>
                </View>
              ))

            // <View className='newslist_i'>
            //   <View className='newslist_i_cen'>
            //     <View className='newslist_i_cen_title'>
            //       {infoList.type == 'system'
            //         ? '系统通知'
            //         : infoList.recent_message.list[0]?.from_nickname}
            //     </View>
            //     <View className='newslist_i_cen_text'>
            //       {infoList.recent_message.list.length > 0
            //         ? (infoList.type == 'system'
            //             ? ''
            //             : infoList.recent_message.list[0]?.created_moment) +
            //           '' +
            //           infoList.recent_message.list[0]?.title
            //         : null}
            //     </View>
            //   </View>

            //   <View className='newslist_i_time'>
            //     {infoList.recent_message.list.length > 0
            //       ? infoList.recent_message.list[0]?.created_text
            //       : null}
            //   </View>
            // </View>
          }
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default UgcFollowFans
