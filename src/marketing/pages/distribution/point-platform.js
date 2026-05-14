/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View } from '@tarojs/components'
import api from '@/api'
import { SpNavBar } from '@/components'
import { withTranslation } from 'react-i18next'
import { $t, ti } from '@/i18n'
import './point-platform.scss'

class PointPlatform extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {}
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const res = await api.distribution.getPointInfo()
    this.setState({
      info: res
    })
  }

  render() {
    const { info } = this.state
    return (
      <View className='page-distribution-statistics'>
        <SpNavBar title={$t('bb18b49a.b11898')} leftIconType='chevron-left' />
        <View className='min-h-full'>
          <View className='header content-padded-b'>
            <View className='header-top'>
              <View className='view-flex view-flex-justify'>
                <View>{ti('bb18b49a.ddb167', [info.grand_point_total])}</View>
              </View>
            </View>
            <View className='header-bottom view-flex'>
              <View className='view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center  with-border'>
                <View className='assets-label'>{$t('bb18b49a.f08934')}</View>
                <View>{ti('bb18b49a.511b20', [info.point_total])}</View>
              </View>
              <View className='view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center' />
            </View>
          </View>
          <View>
            <View className='content-padded'>
              <View className='tips'>{$t('bb18b49a.f340c7')}</View>
            </View>
            <View className='section section-card analysis'>
              <View className='content-padded-b'>
                <View>
                  <View className='data-label'>{$t('bb18b49a.de03c4')}</View>
                  <View className='data-amount'>{info.order_total}</View>
                </View>
                <View className='view-flex'>
                  <View className='view-flex-item'>
                    <View className='data-label'>{$t('bb18b49a.fc8ee8')}</View>
                    <View className='data-count'>{info.order_no_close_rebate}</View>
                  </View>
                  <View className='view-flex-item'>
                    <View className='data-label'>{$t('bb18b49a.4113e7')}</View>
                    <View className='data-count'>{info.order_close_rebate}</View>
                  </View>
                </View>
              </View>
            </View>
            <View className='section section-card analysis'>
              <View className='content-padded-b'>
                <View>
                  <View className='data-label'>{$t('bb18b49a.80d90d')}</View>
                  <View className='data-amount'>{info.order_team_total}</View>
                </View>
                <View className='view-flex'>
                  <View className='view-flex-item'>
                    <View className='data-label'>{$t('bb18b49a.fc8ee8')}</View>
                    <View className='data-count'>{info.order_team_no_close_rebate}</View>
                  </View>
                  <View className='view-flex-item'>
                    <View className='data-label'>{$t('bb18b49a.4113e7')}</View>
                    <View className='data-count'>{info.order_team_close_rebate}</View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default withTranslation()(PointPlatform)
