/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View, Text, Navigator } from '@tarojs/components'
import api from '@/api'
import { withTranslation } from 'react-i18next'
import { SpNavBar, SpSearchInput } from '@/components'
import { $t, ti } from '@/i18n'
import { pickBy } from '@/utils'
import './statistics.scss'

class DistributionStatistics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {},
      searchConditionList: [{ label: '', value: '' }],
      parameter: {
        distributor_id: '',
        keywords: ''
      }
    }
  }

  componentDidShow() {
    this.fetch()
    this.distributor()
  }

  async fetch() {
    const res = await api.distribution.statistics({ ...this.state.parameter, isSalesmanPage: 1 })
    const info = pickBy(res, {
      payedRebate: 'payedRebate',
      rebateTotal: 'rebateTotal',
      cashWithdrawalRebate: 'cashWithdrawalRebate',
      limit_time: 'limit_time',
      orderRebate: 'orderRebate',
      orderTeamRebate: 'orderTeamRebate',
      orderCloseRebate: 'orderCloseRebate',
      orderNoCloseRebate: 'orderNoCloseRebate',
      orderTeamCloseRebate: 'orderTeamCloseRebate',
      orderTeamNoCloseRebate: 'orderTeamNoCloseRebate',
      taskBrokerageItemTotalFee: 'taskBrokerageItemTotalFee',
      noCloseRebate: 'noCloseRebate'
    })

    this.setState({
      info
    })
  }

  distributor = async () => {
    const { list } = await api.salesman.getSalespersonSalemanShopList({
      page: 1,
      page_size: 1000
    })
    list.forEach((element) => {
      element.value = element.distributor_id
      element.label = element.name
    })
    list.unshift({
      value: '',
      label: ''
    })
    this.setState({
      searchConditionList: list
    })
  }

  handleConfirm = (val) => {
    this.setState(
      {
        parameter: {
          keywords: val.keywords,
          distributor_id: val.key
        }
      },
      () => {
        this.fetch()
      }
    )
  }
  onHandleSearch(item) {
    this.setState(
      {
        parameter: {
          ...this.state.parameter,
          distributor_id: item.distributor_id
        }
      },
      () => {
        this.fetch()
      }
    )
  }

  render() {
    const { info, searchConditionList } = this.state

    return (
      <View className='page-distribution-statistics'>
        <SpNavBar title={$t('f9a10522.b11898')} leftIconType='chevron-left' fixed='true' />
        <SpSearchInput
          placeholder={$t('f9a10522.ec47d2')}
          // isShowArea
          isShowSearchCondition
          searchConditionList={searchConditionList.map((row) =>
            row.value === '' ? { ...row, label: row.label || $t('f9a10522.77678b') } : row
          )}
          onConfirm={this.handleConfirm.bind(this)}
          onHandleSearch={this.onHandleSearch.bind(this)}
        />
        <View className='header content-padded-b'>
          <View className='header-top'>
            <View className='view-flex view-flex-justify'>
              <View>
                {ti('f9a10522.a0106c', [info.payedRebate ? info.payedRebate / 100 : '0'])}
              </View>
              <Navigator
                url='/subpages/salesman/distribution/withdrawals-record'
                className='record-btn'
              >
                {$t('f9a10522.103053')} <text className='icons icons-gengduo'></text>
              </Navigator>
            </View>
            <View className='view-flex  view-flex-vertical view-flex-middle view-flex-center'>
              <Navigator className='cash-btn' url='/subpages/salesman/distribution/withdraw'>
                {$t('f9a10522.37fec4')}
              </Navigator>
            </View>
          </View>
          <View className='header-bottom view-flex'>
            <View className='view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center with-border'>
              <View className='assets-label'>{$t('f9a10522.615a19')}</View>
              <View>¥ {info.rebateTotal ? info.rebateTotal / 100 : '0'}</View>
            </View>
            <View className='view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center'>
              <View className='assets-label'>{$t('f9a10522.fed4c1')}</View>
              <View>¥ {info.cashWithdrawalRebate ? info.cashWithdrawalRebate / 100 : '0'}</View>
            </View>
          </View>
        </View>
        <View>
          {/* <View className='content-padded'>
            <View className='tips'>
              提成和津贴订单需要确认收货
              {info.limit_time > 0 && <Text>{info.limit_time}天</Text>}
              后方可提取推广费
            </View>
          </View> */}
          <View className='section section-card analysis'>
            <View className='content-padded-b'>
              <View>
                <View className='data-label'>{$t('f9a10522.de03c4')}</View>
                <View className='data-amount'>
                  {info.orderRebate ? info.orderRebate / 100 : '0'}
                </View>
              </View>
              <View className='view-flex'>
                <View className='view-flex-item'>
                  <View className='data-label'>{$t('f9a10522.fc8ee8')}</View>
                  <View className='data-count'>
                    {info.noCloseRebate ? info.noCloseRebate / 100 : '0'}
                  </View>
                </View>
                <View className='view-flex-item'>
                  <View className='data-label'>{$t('f9a10522.4113e7')}</View>
                  <View className='data-count'>
                    {info.orderCloseRebate ? info.orderCloseRebate / 100 : '0'}
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* <View className='section section-card analysis'>
            <View className='content-padded-b'>
              <View>
                <View className='data-label'>津贴</View>
                <View className='data-amount'>
                  {info.orderTeamRebate ? info.orderTeamRebate / 100 : '0'}
                </View>
              </View>
              <View className='view-flex'>
                <View className='view-flex-item'>
                  <View className='data-label'>未确认</View>
                  <View className='data-count'>
                    {info.orderTeamNoCloseRebate ? info.orderTeamNoCloseRebate / 100 : '0'}
                  </View>
                </View>
                <View className='view-flex-item'>
                  <View className='data-label'>已确认</View>
                  <View className='data-count'>
                    {info.orderTeamCloseRebate ? info.orderTeamCloseRebate / 100 : '0'}
                  </View>
                </View>
              </View>
            </View>
          </View> */}
          {/* <View className='section section-card analysis'>
            <View className='content-padded-b'>
              <View>
                <View className='data-label'>小店提成</View>
                <View className='data-amount'>
                  {info.taskBrokerageItemTotalFee ? info.taskBrokerageItemTotalFee / 100 : '0'}
                </View>
              </View>
            </View>
          </View> */}
        </View>
      </View>
    )
  }
}

export default withTranslation()(DistributionStatistics)
