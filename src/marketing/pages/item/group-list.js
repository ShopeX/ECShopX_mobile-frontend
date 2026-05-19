/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtCountdown } from 'taro-ui'
import { withTranslation } from 'react-i18next'
import { Loading, SpNote, SpPrice, SpNavBar } from '@/components'
import { $t } from '@/i18n'
import _mapKeys from 'lodash/mapKeys'
import api from '@/api'
import { withPager } from '@/hocs'
import { calcTimer, isNavbar, classNames, getDistributorId } from '@/utils'
import './group-list.scss'

@withPager
class GroupList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        { title: '', status: 0 },
        { title: '', status: 1 }
      ],
      list: [],
      shareInfo: {}
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.nextPage()
    api.wx.shareSetting({ shareindex: 'group' }).then((res) => {
      this.setState({
        shareInfo: res
      })
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('0b8348a9.f47464') })
  }

  async fetch(params) {
    const { curTabIdx } = this.state
    const dtid = getDistributorId()
    params = _mapKeys(
      {
        ...params,
        group_goods_type: 'normal',
        view: curTabIdx === 0 ? '2' : '1',
        team_status: '0',
        distributor_id: dtid
      },
      function (val, key) {
        if (key === 'page_no') return 'page'
        if (key === 'page_size') return 'pageSize'

        return key
      }
    )

    const { list, total_count: total } = await api.group.groupList(params)
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

  handleClickTab = (idx) => {
    if (this.state.page.isLoading) return

    if (idx !== this.state.curTabIdx) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState(
      {
        curTabIdx: idx
      },
      () => {
        this.nextPage()
      }
    )
  }

  handleClickItem = (item) => {
    const { goods_id, distributor_id } = item
    // const dtid = distributor_id ? distributor_id : getDistributorId()
    Taro.navigateTo({
      url: `/subpages/item/espier-detail?id=${goods_id}&dtid=${distributor_id}`
    })
  }

  onShareAppMessage() {
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `?uid=${userId}` : ''
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      path: `/marketing/pages/item/group-list${query}`
    }
  }

  onShareTimeline() {
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `uid=${userId}` : ''
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      query: query
    }
  }

  render() {
    const { tabList, curTabIdx, list, page } = this.state
    const tabListForUi = tabList.map((tab, index) => ({
      ...tab,
      title: index === 0 ? $t('da5ae518.fb852f') : $t('da5ae518.dd4e55')
    }))

    return (
      <View
        className={classNames('page-group-list', {
          'has-navbar': isNavbar()
        })}
      >
        <SpNavBar title={$t('0b8348a9.f47464')} leftIconType='chevron-left' fixed='true' />
        <AtTabs
          className='group-list__tabs'
          current={curTabIdx}
          tabList={tabListForUi}
          onClick={this.handleClickTab}
        >
          {/* {tabList.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
          ))} */}
        </AtTabs>

        <ScrollView scrollY className='groups-list__scroll' onScrollToLower={this.nextPage}>
          {list.map((item, idx) => {
            const { remaining_time_obj } = item
            return (
              <View
                className='group-item'
                key={item.groups_activity_id}
                onClick={this.handleClickItem.bind(this, item)}
              >
                <View className='group-item__hd'>
                  <Image className='group-item__img' mode='aspectFill' src={item.pics} />
                </View>
                <View className='group-item__bd'>
                  <View className='group-item__cont'>
                    <Text className='group-item__title'>
                      {item.team_status == 2 && (
                        <Text className='group-item__title-status'>{$t('0b8348a9.ae490e')}</Text>
                      )}
                      {item.team_status == 3 && (
                        <Text className='group-item__title-status'>{$t('0b8348a9.6621b9')}</Text>
                      )}
                      {item.goods_name}
                    </Text>
                    <View className='group-item__desc'>
                      <View className='group-item__tuan'>
                        <Text className='group-item__tuan-num'>{item.person_num}</Text>
                        <Text className='group-item__tuan-txt'>{$t('0b8348a9.58d9ce')}</Text>
                      </View>
                      <SpPrice
                        primary
                        className='group-item__price'
                        value={item.act_price}
                        unit='cent'
                      />
                    </View>
                  </View>
                  <View className='group-item__action'>
                    {remaining_time_obj && (
                      <View className='timer'>
                        <View className='at-icon at-icon-clock'></View>
                        <AtCountdown
                          isShowDay
                          format={{
                            day: $t('12b6c337.249aba'),
                            hours: ':',
                            minutes: ':',
                            seconds: ''
                          }}
                          day={remaining_time_obj.dd}
                          hours={remaining_time_obj.hh}
                          minutes={remaining_time_obj.mm}
                          seconds={remaining_time_obj.ss}
                        />
                      </View>
                    )}
                    {curTabIdx === 0 ? (
                      <View className='btn-go'>{$t('0b8348a9.d79460')}</View>
                    ) : (
                      <View className='btn-go disabled'>{$t('da5ae518.dd4e55')}</View>
                    )}
                  </View>
                </View>
              </View>
            )
          })}
          {page.isLoading && <Loading>{$t('56af9ff8.bd0271')}</Loading>}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>{$t('56af9ff8.ba1de9')}</SpNote>
          )}
        </ScrollView>
      </View>
    )
  }
}

export default withTranslation()(GroupList)
