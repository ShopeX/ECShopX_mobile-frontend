import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { AtTabBar } from 'taro-ui'

export default class NavBar extends Component {
  static defaultProps = {
    current: 0
  }

  constructor(props) {
    super(props)
  }

  handleTab = (current) => {
    const tabList = [
      '/groupBy/pages/home/index',
      '/groupBy/pages/cart/index',
      '/pages/member/index'
    ]
    const jumpType = current === 2 ? 'navigateTo' : 'redirectTo'
    Taro[jumpType]({
      url: tabList[current]
    })
  }

  render() {
    const { current } = this.props
    return (
      <AtTabBar
        fixed
        current={current}
        selectedColor='#ffd000'
        onClick={this.handleTab}
        backgroundColor='#fafafa'
        tabList={[
          { title: '首页', iconType: 'home', iconPrefixClass: 'icon' },
          { title: '购物车', iconType: 'cart', iconPrefixClass: 'icon', text: '' },
          { title: '会员中心', iconType: 'member', iconPrefixClass: 'icon' }
        ]}
      />
    )
  }
}
