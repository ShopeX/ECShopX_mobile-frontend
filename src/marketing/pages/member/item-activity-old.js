// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Loading, SpNote, SpNavBar } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { pickBy } from '@/utils'

import './item-activity.scss'

@withPager
export default class ItemActivity extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      list: []
    }
  }

  componentDidMount() {
    this.nextPage()
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize
    }
    const { list, total_count: total } = await api.user.registrationRecordList(params)
    console.log(list, total, 22)

    const nList = pickBy(list, {
      activity_id: 'activity_id',
      record_id: 'record_id',
      activity_name: 'activity_name',
      status: 'status',
      start_date: 'start_date',
      end_date: 'end_date'
    })

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return { total }
  }

  handleClickDetail = (id) => {
    Taro.navigateTo({
      url: `/marketing/pages/member/activity-detail?record_id=${id}`
    })
  }

  render() {
    const { list, page } = this.state

    return (
      <View className='reservation-list'>
        <SpNavBar title='活动预约' leftIconType='chevron-left' fixed='true' />
        <ScrollView scrollY className='reservation-list__scroll' onScrollToLower={this.nextPage}>
          <View className='reservation-list__list'>
            {list.map((item) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <View className='reservation-list__item'>
                  <View className='reservation-list__item_title'>
                    <Text></Text>
                    <Text>
                      {item.status === 'rejected'
                        ? '本次活动太火爆了，很遗憾名额已满，请您持续关注！'
                        : ''}
                      {item.status === 'pending' ? '待审核' : ''}
                      {item.status === 'passed' ? '通过' : ''}
                    </Text>
                  </View>
                  <View className='reservation-list__item_content'>
                    <View className='content_data'>
                      <Text>活动名称</Text>
                      <Text>{item.activity_name}</Text>
                    </View>
                    <View className='content_data'>
                      <Text>活动时间</Text>
                      <Text>
                        {item.start_date} ~ {item.end_date}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className='reservation-list__item_btn'
                    onClick={this.handleClickDetail.bind(this, item.record_id)}
                  >
                    查看详情
                  </Text>
                </View>
              )
            })}
            {page.isLoading && <Loading>正在加载...</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote isUrl img={`${process.env.APP_IMAGE_CDN}/empty_activity.png`}>
                您还未报名任何活动哦，快去报名吧!
              </SpNote>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}
