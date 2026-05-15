/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { Loading, SpNote, SpNavBar } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { pickBy } from '@/utils'
import './item-activity.scss'

@withPager
class ItemActivityOld extends Component {
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
    Taro.setNavigationBarTitle({ title: $t('f275bcec.dba0ff') })
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    params = {
      page,
      pageSize
    }
    const { list, total_count: total } = await api.user.registrationRecordList(params)

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
        <SpNavBar title={$t('f275bcec.dba0ff')} leftIconType='chevron-left' fixed='true' />
        <ScrollView scrollY className='reservation-list__scroll' onScrollToLower={this.nextPage}>
          <View className='reservation-list__list'>
            {list.map((item) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <View className='reservation-list__item'>
                  <View className='reservation-list__item_title'>
                    <Text></Text>
                    <Text>
                      {item.status === 'rejected' ? $t('f275bcec.d43954') : ''}
                      {item.status === 'pending' ? $t('1d9cdff5.5cb424') : ''}
                      {item.status === 'passed' ? $t('f275bcec.23c1f3') : ''}
                    </Text>
                  </View>
                  <View className='reservation-list__item_content'>
                    <View className='content_data'>
                      <Text>{$t('e32a7439.39834b')}</Text>
                      <Text>{item.activity_name}</Text>
                    </View>
                    <View className='content_data'>
                      <Text>{$t('f275bcec.c799f5')}</Text>
                      <Text>
                        {item.start_date} ~ {item.end_date}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className='reservation-list__item_btn'
                    onClick={this.handleClickDetail.bind(this, item.record_id)}
                  >
                    {$t('f275bcec.5b48db')}
                  </Text>
                </View>
              )
            })}
            {page.isLoading && <Loading>{$t('f1d3181c.bd0271')}</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote isUrl img={`${process.env.APP_IMAGE_CDN}/empty_activity.png`}>
                {$t('f275bcec.71c9c6')}
              </SpNote>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default withTranslation()(ItemActivityOld)
