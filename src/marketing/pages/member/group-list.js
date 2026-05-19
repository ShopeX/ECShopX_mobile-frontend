/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { Loading, SpNote, SpPrice, SpNavBar } from '@/components'
import { $t, ti } from '@/i18n'
import _mapKeys from 'lodash/mapKeys'
import api from '@/api'
import { withPager } from '@/hocs'
import { calcTimer, hasNavbar } from '@/utils'
import './group-list.scss'

@withPager
class MyGroupList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      list: []
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.nextPage()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('9503e8f0.75a1d2') })
  }

  async fetch(params) {
    params = _mapKeys(
      {
        ...params,
        group_goods_type: 'normal',
        team_status: '0'
      },
      function (val, key) {
        if (key === 'page_no') return 'page'
        if (key === 'page_size') return 'pageSize'

        return key
      }
    )

    const { list, total_count: total } = await api.group.myGroupList(params)
    list.forEach((t) => {
      if (t.remaining_time > 0) {
        t.remaining_time_obj = calcTimer(t.remaining_time)
      }
    })

    this.setState({
      list: [...this.state.list, ...list]
    })

    return { total }
  }

  handleClickItem = (item) => {
    const { team_id } = item

    Taro.navigateTo({
      url: `/marketing/pages/item/group-detail?team_id=${team_id}`
    })
  }

  render() {
    const { list, page } = this.state

    return (
      <View className={`page-my-group-list ${hasNavbar && 'group-list-top'}`}>
        <SpNavBar title={$t('9503e8f0.75a1d2')} leftIconType='chevron-left' fixed='true' />
        {list.map((item, idx) => {
          const { remaining_time_obj } = item
          return (
            <View
              className='group-item'
              key={item.groups_activity_id}
              onClick={this.handleClickItem.bind(this, item)}
            >
              <View className='group-item__hd'>
                <Image className='group-item__img' mode='aspectFill' src={item.pics[0]} />
              </View>
              <View className='group-item__bd'>
                <View className='group-item__cont'>
                  {item.team_status == 2 && <View className='iconfont icon-over-group'></View>}
                  {item.team_status == 3 && <View className='iconfont icon-ungroup'></View>}
                  <Text className='group-item__title'>{item.itemName}</Text>
                  <View className='group-item__desc'>
                    <View className='group-item__tuan'>
                      <Text className='group-item__tuan-num'>{item.person_num}</Text>
                      <Text className='group-item__tuan-txt'>{$t('0b8348a9.58d9ce')}</Text>
                    </View>
                    <SpPrice primary className='group-item__price' value={item.price} unit='cent' />
                  </View>
                </View>
                <View className='group-item__footer'>
                  <View className='group-item__avatar'>
                    {item.member_list.map((avatar, index) => {
                      return (
                        <Image
                          key={`${index}1`}
                          mode='aspectFill'
                          className='user-avatar'
                          src={avatar?.member_info?.headimgurl}
                        />
                      )
                    })}
                  </View>
                  {item.team_status == 1 && (
                    <View className='group-item__tips'>
                      {ti('f98d4253.53a0a7', [item.person_num - item.join_person_num])}
                    </View>
                  )}
                </View>
              </View>
            </View>
          )
        })}
        {page.isLoading && <Loading>{$t('56af9ff8.bd0271')}</Loading>}
        {!page.isLoading && !page.hasNext && !list.length && (
          <SpNote img='trades_empty.png'>{$t('9503e8f0.dc70a5')}</SpNote>
        )}
      </View>
    )
  }
}

export default withTranslation()(MyGroupList)
