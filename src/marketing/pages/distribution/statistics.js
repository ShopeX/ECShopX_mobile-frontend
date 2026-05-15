/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { SpPage } from '@/components'
import { $t, ti } from '@/i18n'
import api from '@/api'
import { pickBy } from '@/utils'
import './statistics.scss'

class DistributionStatistics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {}
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('f9a10522.b11898') })
  }

  async fetch() {
    const res = await api.distribution.statistics()
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
      taskBrokerageItemTotalFee: 'taskBrokerageItemTotalFee'
    })

    this.setState({
      info
    })
  }

  render() {
    const { info } = this.state
    const dayPart = info.limit_time > 0 ? `${info.limit_time}天` : ''

    return (
      <SpPage className='page-distribution-statistics'>
        <View className='min-h-full'>
          <View className='header content-padded-b'>
            <View className='header-top'>
              <View className='view-flex view-flex-justify'>
                <View>
                  {ti('f9a10522.a0106c', [info.payedRebate ? info.payedRebate / 100 : '0'])}
                </View>
                <Navigator
                  url='/marketing/pages/distribution/withdrawals-record'
                  className='record-btn'
                >
                  {$t('f9a10522.103053')} <text className='icons icons-gengduo'></text>
                </Navigator>
              </View>
              <View className='view-flex  view-flex-vertical view-flex-middle view-flex-center'>
                <Navigator className='cash-btn' url='/marketing/pages/distribution/withdraw'>
                  {$t('f9a10522.37fec4')}
                </Navigator>
              </View>
            </View>
            <View className='header-bottom view-flex'>
              <View className='view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center with-border'>
                <View className='assets-label'>{$t('eeff7b0d.482963')}</View>
                <View>¥ {info.rebateTotal ? info.rebateTotal / 100 : '0'}</View>
              </View>
              <View className='view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center'>
                <View className='assets-label'>{$t('f9a10522.fed4c1')}</View>
                <View>¥ {info.cashWithdrawalRebate ? info.cashWithdrawalRebate / 100 : '0'}</View>
              </View>
            </View>
          </View>
          <View>
            <View className='content-padded'>
              <View className='tips'>{ti('eeff7b0d.8c824c', [dayPart])}</View>
            </View>
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
                      {info.orderNoCloseRebate ? info.orderNoCloseRebate / 100 : '0'}
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
            <View className='section section-card analysis'>
              <View className='content-padded-b'>
                <View>
                  <View className='data-label'>{$t('bb18b49a.80d90d')}</View>
                  <View className='data-amount'>
                    {info.orderTeamRebate ? info.orderTeamRebate / 100 : '0'}
                  </View>
                </View>
                <View className='view-flex'>
                  <View className='view-flex-item'>
                    <View className='data-label'>{$t('f9a10522.fc8ee8')}</View>
                    <View className='data-count'>
                      {info.orderTeamNoCloseRebate ? info.orderTeamNoCloseRebate / 100 : '0'}
                    </View>
                  </View>
                  <View className='view-flex-item'>
                    <View className='data-label'>{$t('f9a10522.4113e7')}</View>
                    <View className='data-count'>
                      {info.orderTeamCloseRebate ? info.orderTeamCloseRebate / 100 : '0'}
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View className='section section-card analysis'>
              <View className='content-padded-b'>
                <View>
                  <View className='data-label'>{$t('eeff7b0d.efd4e9')}</View>
                  <View className='data-amount'>
                    {info.taskBrokerageItemTotalFee ? info.taskBrokerageItemTotalFee / 100 : '0'}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionStatistics)
