/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { SpNavBar } from '@/components'
import { $t } from '@/i18n'
import api from '@/api'
import './setting.scss'

class DistributionSetting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: {},
      shop_name: '',
      isEdit: false
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const res = await api.distribution.info()
    const { parent_info = null, bind_date, mobile, shop_name = '' } = res

    this.setState({
      info: {
        parent_info,
        bind_date,
        mobile
      },
      shop_name
    })
  }

  handleChange = (val) => {
    this.setState({
      shop_name: val
    })
  }

  handleClick = () => {
    const { isEdit, shop_name } = this.state
    this.setState({
      isEdit: !isEdit
    })
    if (isEdit) {
      api.distribution.update({ shop_name })
    }
  }

  render() {
    const { info, shop_name, isEdit } = this.state

    return (
      <View className='page-distribution-setting'>
        <SpNavBar title={$t('a1930d35.216133')} leftIconType='chevron-left' />
        <View className='content-padded'>{$t('a1930d35.216133')}</View>
        <View className='section'>
          <View className='list'>
            <View className='list-item'>
              <View className='label'>{$t('a1930d35.dd0925')}</View>
              <View className='list-item-txt text-right'>
                {info.parent_info ? (
                  <Text>
                    {info.parent_info.nickname || info.parent_info.username}(
                    {info.parent_info.mobile})
                  </Text>
                ) : (
                  <Text>--</Text>
                )}
              </View>
            </View>
            <View className='list-item'>
              <View className='label'>{$t('a1930d35.87d5eb')}</View>
              <View className='list-item-txt text-right'>{info.bind_date}</View>
            </View>
            <View className='list-item'>
              <View className='label'>{$t('a1930d35.8098e2')}</View>
              <View className='list-item-txt text-right'>
                {info.mobile ? <Text>{info.mobile}</Text> : <Text>--</Text>}
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default withTranslation()(DistributionSetting)
