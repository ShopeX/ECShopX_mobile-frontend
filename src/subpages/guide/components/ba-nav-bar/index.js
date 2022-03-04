import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import S from '@/subpages/guide/lib/Spx.js'
import './index.scss'

export default class BaNavBar extends Component {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    onClick: () => {}
  }
  constructor(props) {
    super(props)
    this.state = {
      navbarHeight: 0,
      right: 0,
      leftWidth: 50,
      titleWidth: 100,
      statusBarHeight: 44,
      MenuButtonH: 0,
      jumpType: 'home'
    }
  }
  async componentDidMount() {
    let MenuButton = await Taro.getMenuButtonBoundingClientRect()
    let systemInfo = await Taro.getSystemInfoSync()
    let currentPage = await Taro.getCurrentPages().length
    let MenuButtonH = MenuButton.height
    //    let MenuButtonT= MenuButton.top
    let MenuButtonW = MenuButton.width
    let right = systemInfo.screenWidth - MenuButton.right
    let statusBarHeight = systemInfo.statusBarHeight
    let navbarHeight = statusBarHeight + MenuButtonH + 9
    const { leftWidth } = this.state
    let titleWidth = systemInfo.windowWidth - (MenuButtonW + right * 2) - leftWidth

    this.setState({
      navbarHeight,
      right,
      titleWidth,
      statusBarHeight,
      MenuButtonH,
      jumpType: currentPage === 1 ? 'home' : 'others'
    })
    S.set('navbar_height', navbarHeight, true)
  }
  //回退
  navBack() {
    Taro.navigateBack({
      delta: 1
    })
  }
  //回首页
  navHome() {
    Taro.redirectTo({
      url: '/guide/index'
    })
  }

  render() {
    const { navbarHeight, right, leftWidth, titleWidth, statusBarHeight, MenuButtonH, jumpType } =
      this.state
    const { title, fixed } = this.props
    if (!navbarHeight) return

    return (
      <View
        className={classNames('ba-nav-bar', fixed ? 'ba-nav-bar__fixed' : '')}
        style={styleNames({
          height: `${navbarHeight}PX`,
          'padding-left': `${right}px`,
          'padding-top': `${statusBarHeight}PX`
        })}
      >
        <View className='nav-left' style={styleNames({ width: `${leftWidth}PX` })}>
          <View
            className={classNames(
              'icon-sty,icon',
              jumpType === 'home' ? 'icon-home' : 'icon-arrowDown'
            )}
            onClick={jumpType === 'home' ? this.navHome : this.navBack}
          ></View>
        </View>

        <View
          className='ba-nav-bar__title'
          style={styleNames({
            width: `${titleWidth}PX`,
            height: `${MenuButtonH}PX`,
            'line-height': `${MenuButtonH}PX`
          })}
        >
          {title}
        </View>
      </View>
    )
  }
}
