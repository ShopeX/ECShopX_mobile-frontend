/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import { calcTimer } from '@/utils'
import { $t, ti } from '@/i18n'
import './grouping-item.scss'

export default class GroupingItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: {},
    onClick: () => {}
  }

  constructor(props) {
    super(props)

    this.state = {
      remaining_time: null
    }
  }

  componentDidMount() {
    const { info } = this.props
    const remaining_time = calcTimer(info.over_time)
    console.log(remaining_time)
    this.setState({
      remaining_time
    })
  }

  render() {
    const { info, total, onClick } = this.props
    const { remaining_time } = this.state

    if (!remaining_time) return null

    return (
      <View className='grouping-item view-flex view-flex-middle' onClick={onClick}>
        <Image className='group-sponsor-avatar' src={info.member_info.headimgurl} />
        <View className='view-flex-item'>
          <View className='name'>
            {ti('f98d4253.38dff1', [info.member_info.nickname || $t('f98d4253.1a75c1')])}
          </View>
          <View>{ti('f98d4253.53a0a7', [total - info.join_person_num])}</View>
          <View className='text-muted'>
            {$t('f98d4253.43b510')}
            <AtCountdown
              isShowDay
              format={{ day: $t('f98d4253.249aba'), hours: ':', minutes: ':', seconds: '' }}
              day={remaining_time.dd}
              hours={remaining_time.hh}
              minutes={remaining_time.mm}
              seconds={remaining_time.ss}
            />
          </View>
        </View>
        <View className='group-join'>{$t('f98d4253.2fd665')}</View>
      </View>
    )
  }
}
