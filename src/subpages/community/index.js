import React, { useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { SpPage, SpImage, SpScrollView, SpSearchBar } from '@/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { pickBy } from '@/utils'
import doc from '@/doc'
import api from '@/api'

import './index.scss'

import CompTabbar from './comps/comp-tabbar'
import CompGroupItem from './comps/comp-groupitem'

const CHIEFMENUS = [
  {
    key: 'order',
    name: '订单管理',
    icon: 'm_menu_order.png',
    link: '/subpages/community/order-manage'
  },
  {
    key: 'active',
    name: '我的活动',
    icon: 'm_menu_activity.png',
    link: '/subpages/community/activity'
  },
  {
    key: 'start',
    name: '一键开团',
    icon: 'm_menu_group.png',
    link: '/subpages/community/group'
  },
  {
    key: 'yongjin',
    name: '团长佣金',
    icon: 'm_menu_yongjin.png',
    link: '/subpages/community/commission'
  }
  // {
  //   key: 'goods',
  //   name: '商品核销',
  //   icon: 'm_menu_qrcode.png',
  //   link: ''
  // }
]

const MENUS = [
  {
    key: 'order',
    name: '我的订单',
    icon: 'm_menu_order.png',
    link: '/subpages/community/order'
  }
]

const tabList = [
  { title: '全部', type: 'all' },
  { title: '未开始', type: 'waiting' },
  { title: '进行中', type: 'running' },
  { title: '已结束', type: 'end' }
]

const initialState = {
  curTabIdx: 0,
  tabType: 'all',
  searchValue: undefined,
  activityList: []
}

const Index = () => {
  const [state, setState] = useImmer(initialState)
  const { chiefInfo, checkIsChief } = useSelector((state) => state.user)
  const { curTabIdx, searchValue, activityList, tabType } = state
  const [isShowSearch, setIsShowSearch] = useState(false)
  const activityRef = useRef()

  console.log(checkIsChief, chiefInfo, '---state.user----')

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize,
      tab_status: tabType,
      activity_name: searchValue
    }
    const { list, total_count: total } = await api.community.getMemberActivityList(params)
    const n_list = pickBy(list, doc.community.COMMUNITY_ACTIVITY_LIST)
    setState((draft) => {
      draft.activityList = [...activityList, ...n_list]
    })

    return { total }
  }

  const handleClickTab = async (curTabIdx) => {
    console.log(curTabIdx)
    await setState((draft) => {
      draft.curTabIdx = curTabIdx
      draft.tabType =
        (curTabIdx == 0 && 'all') ||
        (curTabIdx == 1 && 'waiting') ||
        (curTabIdx == 2 && 'running') ||
        (curTabIdx == 3 && 'end')
      draft.activityList = []
    })
    activityRef.current.reset()
  }

  const handleOnFocus = () => {
    setIsShowSearch(true)
  }

  const onSearchChange = (val) => {
    setState((draft) => {
      draft.searchValue = val
    })
  }

  const handleOnClear = async () => {
    await setState((draft) => {
      draft.searchValue = undefined
      draft.activityList = []
    })
    setIsShowSearch(false)
    activityRef.current.reset()
  }

  const handleSearchCancel = () => {
    setState((draft) => {
      draft.searchValue = undefined
      draft.orderList = []
    })
    setIsShowSearch(false)
    orderRef.current.reset()
  }

  const handleConfirm = async (val) => {
    await setState((draft) => {
      draft.activityList = []
      draft.searchValue = val
    })
    setIsShowSearch(false)
    activityRef.current.reset()
  }

  const handleClickActivity = ({ activityId }) => {
    Taro.navigateTo({
      url: `/subpages/community/group-leaderdetail?activity_id=${activityId}`
    })
  }

  const onMenusClick = (item) => {
    if (item.key == 'goods') {
      Taro.scanCode()
        .then(async (res) => {
          let parmas = {
            code: res.result
          }
          try {
            const result = await api.community.scanOrderCode(parmas)
            S.toast(result.msg)
          } catch (e) {
            Taro.showToast({
              icon: 'none',
              title: e.message
            })
          }
        })
        .catch((err) => {})
    } else {
      Taro.navigateTo({ url: item.link })
    }
  }

  return (
    <SpPage className='page-community-index'>
      <SpScrollView className='page-community-activity-scroll' ref={activityRef} fetch={fetch}>
        <View className='page-header'>
          <View className='user-info'>
            <SpImage src={chiefInfo?.chief_avatar} width={110} height={110} />
            <Text className='user-name'>{chiefInfo?.chief_name}</Text>
          </View>
        </View>

        <View className='card-block'>
          <View className='card-block-hd'>团长功能</View>
          <View className='card-block-bd menu-list'>
            {CHIEFMENUS.map((item, index) => (
              <View
                className='menu-item'
                onClick={() => onMenusClick(item)}
                key={`menu-item__${index}`}
              >
                <SpImage className='menu-image' src={item.icon} width={100} height={100} />
                <Text className='menu-name'>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='card-block'>
          <View className='card-block-hd'>团员功能</View>
          <View className='card-block-bd menu-list'>
            {MENUS.map((item, index) => (
              <View
                className='menu-item'
                onClick={() => onMenusClick(item)}
                key={`menu-item__${index}`}
              >
                <SpImage className='menu-image' src={item.icon} width={100} height={100} />
                <Text className='menu-name'>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='card-block'>
          <View className='search-wrap'>
            <SpSearchBar
              showDailog={false}
              keyword={searchValue}
              placeholder='根据活动名查询'
              onFocus={handleOnFocus}
              onChange={onSearchChange}
              onClear={handleOnClear}
              onCancel={handleSearchCancel}
              onConfirm={handleConfirm}
            />
          </View>
          <View className='group-state-list'>
            <AtTabs current={curTabIdx} tabList={tabList} onClick={handleClickTab}>
              {tabList.map((panes, pIdx) => (
                <AtTabsPane current={curTabIdx} key={panes.type} index={pIdx} />
              ))}
            </AtTabs>
          </View>
        </View>

        <View className='group-list'>
          {activityList.map((item, idx) => (
            <View className='card-block' key={idx}>
              <CompGroupItem info={item} onClick={handleClickActivity} />
            </View>
          ))}
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default Index
