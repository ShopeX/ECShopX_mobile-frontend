/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading, SpNote, SpNavBar, SpSearchInput, SpTabs, SpPage } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { classNames, pickBy } from '@/utils'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import './subordinate.scss'

const SUBORDINATE_TAB_TITLE_KEYS = ['90aaacd7.20566a', '90aaacd7.9a3819']
const SUBORDINATE_SEARCH_LABEL_KEYS = {
  userName: '90aaacd7.5b0f22',
  shopName: '90aaacd7.0d4934',
  mobile: '90aaacd7.8098e2'
}

@withPager
class DistributionSubordinate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      curTabIdx: 0,
      tabList: [
        { num: 0, type: 'buy' },
        { num: 0, type: 'not_buy' }
      ],
      searchConditionList: [{ value: 'userName' }, { value: 'shopName' }, { value: 'mobile' }],
      parameter: {}
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
    Taro.setNavigationBarTitle({ title: $t('90aaacd7.720be2') })
  }

  async fetch(params) {
    const { curTabIdx, tabList, parameter } = this.state
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize: 15,
      buy_type: tabList[curTabIdx].type
    }
    query[parameter.key] = parameter.keywords

    const res = await api.distribution.subordinate(query)

    const { list, total_count } = res[query.buy_type]

    const total = total_count

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
      total
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

  handleConfirm(val) {
    console.log('handleConfirm', val)
    this.setState(
      {
        parameter: val,
        list: [],
        scrollTop: 0
      },
      () => {
        this.resetPage()
        this.nextPage()
      }
    )
  }

  render() {
    const { list, page, curTabIdx, tabList, scrollTop, searchConditionList } = this.state
    const tablistForUi = tabList.map((item, idx) => ({
      ...item,
      title: $t(SUBORDINATE_TAB_TITLE_KEYS[idx])
    }))
    const searchListForUi = searchConditionList.map((row) => ({
      ...row,
      label: $t(SUBORDINATE_SEARCH_LABEL_KEYS[row.value])
    }))

    return (
      <SpPage scrollToTopBtn>
        <View className='page-distribution-subordinate'>
          <SpNavBar title={$t('90aaacd7.fed338')} leftIconType='chevron-left' fixed='true' />
          <SpSearchInput
            placeholder={$t('f9a10522.ec47d2')}
            // isShowArea
            isShowSearchCondition
            searchConditionList={searchListForUi}
            onConfirm={this.handleConfirm.bind(this)}
          />
          <SpTabs
            current={curTabIdx}
            tablist={tablistForUi}
            onChange={(e) => {
              console.log(e, 'llonChange')
              this.handleClickTab(e)
            }}
          />
          {/* <AtTabs
          className='client-list__tabs'
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
        >
          {tabList.map((panes, pIdx) => (
            <AtTabsPane current={curTabIdx} key={panes.type} index={pIdx}></AtTabsPane>
          ))}
        </AtTabs> */}
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
                          item.headimgurl
                            ? item.headimgurl
                            : `${process.env.APP_IMAGE_CDN}/logo.png`
                        }
                      />
                      <View className='list-item-txt'>
                        <View className='name'>
                          {item.username || $t('90aaacd7.708229')}
                          {/* {item.is_open_promoter_grade && (
                          <Text className='level-name'>({item.promoter_grade_name})</Text>
                        )} */}
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
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionSubordinate)
