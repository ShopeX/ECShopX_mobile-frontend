/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import { $t, i18n } from '@/i18n'

export default class TabBar extends Component {
  buildTabList() {
    return [
      {
        title: $t('e4bfc1bd.db1c89'),
        iconType: 'shouye',
        iconPrefixClass: 'icon',
        url: '/mdugc/pages/index/index'
      },
      {
        title: $t('e4bfc1bd.d0771a'),
        iconType: 'mquan',
        iconPrefixClass: 'icon',
        url: '/mdugc/pages/list/index'
      },
      {
        title: $t('e4bfc1bd.93d695'),
        iconType: 'bi',
        iconPrefixClass: 'icon',
        url: '/mdugc/pages/make/index'
      },
      {
        title: $t('e4bfc1bd.07b181'),
        iconType: 'gerenzhongxin',
        iconPrefixClass: 'icon',
        url: '/mdugc/pages/member/index'
      }
    ]
  }

  constructor(props) {
    super(props)
    this.state = {
      backgroundColor: '',
      color: '#999999',
      selectedColor: '#000000',
      tabList: this.buildTabList()
    }
  }

  componentDidMount() {
    this._onLanguageChanged = () => this.setState({ tabList: this.buildTabList() })
    i18n.on('languageChanged', this._onLanguageChanged)
  }

  componentWillUnmount() {
    if (this._onLanguageChanged) {
      i18n.off('languageChanged', this._onLanguageChanged)
    }
  }

  handleClick = (current) => {
    const curTab = this.state.tabList[current]
    const { url } = curTab
    Taro.redirectTo({ url })
  }

  render() {
    const { color, backgroundColor, selectedColor, tabList } = this.state
    const { current } = this.props
    return (
      <View>
        <AtTabBar
          fixed
          color={color}
          backgroundColor={backgroundColor}
          selectedColor={selectedColor}
          tabList={tabList}
          onClick={this.handleClick}
          current={current}
        />
      </View>
    )
  }
}
