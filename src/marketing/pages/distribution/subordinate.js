/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { withTranslation } from 'react-i18next'
import { Loading, SpNote, SpPage } from '@/components'
import { $t } from '@/i18n'
import api from '@/api'
import { withPager } from '@/hocs'
import { classNames, pickBy } from '@/utils'
import './subordinate.scss'

const SUBORDINATE_TAB_TITLE_KEYS = ['43d09756.6ad54f', '43d09756.29a2da']

@withPager
class DistributionSubordinate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      curTabIdx: 0,
      tabList: [
        { title: '', num: 0, type: 'buy' },
        { title: '', num: 0, type: 'not_buy' }
      ]
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
    Taro.setNavigationBarTitle({ title: $t('90aaacd7.fed338') })
  }

  async fetch(params) {
    const { curTabIdx, tabList } = this.state
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize: 15,
      buy_type: tabList[curTabIdx].type
    }

    const res = await api.distribution.subordinate(query)
    const { list, total_count } = res[query.buy_type]

    const nList = pickBy(list, {
      relationship_depth: 'relationship_depth',
      headimgurl: 'headimgurl',
      username: ({ username, nickname }) => nickname || username,
      is_open_promoter_grade: 'is_open_promoter_grade',
      promoter_grade_name: 'promoter_grade_name',
      mobile: 'mobile',
      bind_date: 'bind_date'
    })

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return {
      total: total_count
    }
  }

  handleClickTab = (idx) => {
    if (this.state.page.isLoading) return

    if (idx !== this.state.curTabIdx) {
      this.resetPage()
      this.setState({
        list: [],
        scrollTop: 0
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

  render() {
    const { list, page, curTabIdx, tabList, scrollTop } = this.state
    const tabListForUi = tabList.map((item, index) => ({
      ...item,
      title: $t(SUBORDINATE_TAB_TITLE_KEYS[index])
    }))

    return (
      <SpPage className='page-distribution-subordinate'>
        <AtTabs
          className='client-list__tabs'
          current={curTabIdx}
          tabList={tabListForUi}
          onClick={this.handleClickTab}
        >
          {tabListForUi.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={panes.type} index={pIdx}></AtTabsPane>
          ))}
        </AtTabs>
        <ScrollView
          className='subordinate-list__scroll'
          scrollY
          lower-threshold={100}
          scrollTop={scrollTop}
          onScrollToLower={this.nextPage}
        >
          {list.length > 0 && (
            <View className='section list'>
              {list.map((item) => {
                return (
                  <View
                    key={item.user_id}
                    className={classNames(
                      'list-item',
                      item.relationship_depth == 1 && 'child',
                      item.relationship_depth == 2 && 'Gchild',
                      item.relationship_depth == 3 && 'GGchild'
                    )}
                  >
                    <Image
                      className='avatar'
                      src={
                        item.headimgurl ? item.headimgurl : `${process.env.APP_IMAGE_CDN}/logo.png`
                      }
                    />
                    <View className='list-item-txt'>
                      <View className='name'>
                        {item.username || $t('90aaacd7.708229')}
                        {item.is_open_promoter_grade && (
                          <Text className='level-name'>({item.promoter_grade_name})</Text>
                        )}
                      </View>
                      <View className='mobile'>{item.mobile && <Text>{item.mobile}</Text>}</View>
                    </View>
                    <View className='bind-date'>
                      <View>{$t('90aaacd7.d12952')}</View>
                      <View>{item.bind_date}</View>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
          {page.isLoading ? <Loading>{$t('c73c4371.bd0271')}</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>{$t('c73c4371.ba1de9')}</SpNote>
          )}
        </ScrollView>
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionSubordinate)
