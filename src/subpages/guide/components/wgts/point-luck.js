/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import api from '@/api'
import { maskMobile, formatTime } from '@/utils'
import { ti, i18n } from '@/i18n'

export default class PointLuck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      announce: null
    }
  }

  componentDidMount() {
    this._onLanguageChanged = () => this.forceUpdate()
    i18n.on('languageChanged', this._onLanguageChanged)
    // this.fetch()
  }

  componentWillUnmount() {
    if (this._onLanguageChanged) {
      i18n.off('languageChanged', this._onLanguageChanged)
    }
  }

  async fetch() {
    const { list } = await api.member.pointDrawLuckAll()
    const announce = list
      .map((t) =>
        ti('b1affc36.b998ae', [
          formatTime(t.created * 1000),
          t.username,
          maskMobile(t.mobile),
          t.item_name
        ])
      )
      .join('　　')
    this.setState({
      announce
    })
  }

  render() {
    const { announce } = this.state
    if (!announce) {
      return null
    }

    return (
      <View className='wgt'>
        <View className='wgt-body with-padding'>
          <AtNoticebar marquee>
            <Text>{announce}</Text>
          </AtNoticebar>
        </View>
      </View>
    )
  }
}
