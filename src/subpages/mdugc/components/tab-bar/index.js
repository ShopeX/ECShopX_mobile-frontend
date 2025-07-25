import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'

export default class TabBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      backgroundColor: '',
      color: '#999999',
      selectedColor: '#000000',
      tabList: [
        {
          title: '首页',
          iconType: 'shouye',
          iconPrefixClass: 'icon',
          url: '/mdugc/pages/index/index'
        },
        {
          title: '分类',
          iconType: 'mquan',
          iconPrefixClass: 'icon',
          url: '/mdugc/pages/list/index'
        },
        { title: '创作', iconType: 'bi', iconPrefixClass: 'icon', url: '/mdugc/pages/make/index' },
        {
          title: '我的',
          iconType: 'gerenzhongxin',
          iconPrefixClass: 'icon',
          url: '/mdugc/pages/member/index'
        }
      ]
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
