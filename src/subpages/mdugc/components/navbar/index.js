import { isFunction, getSystemInfo } from '@/utils/ugcnavbar'

import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

let globalSystemInfo = getSystemInfo()

export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      configStyle: this.setStyle(globalSystemInfo)
    }
  }
  static options = {
    addGlobalClass: true
  }
  componentDidShow() {
    if (globalSystemInfo.ios) {
      globalSystemInfo = getSystemInfo()
      this.setState({
        configStyle: this.setStyle(globalSystemInfo)
      })
    }
  }
  handleBackClick() {
    if (isFunction(this.props.onBack)) {
      this.props.onBack()
    } else {
      const pages = Taro.getCurrentPages()
      if (pages.length >= 2) {
        Taro.navigateBack({
          delta: this.props.delta
        })
      }
    }
  }
  handleGoHomeClick() {
    if (isFunction(this.props.onHome)) {
      this.props.onHome()
    }
  }
  handleSearchClick() {
    if (isFunction(this.props.onSearch)) {
      this.props.onSearch()
    }
  }
  static defaultProps = {
    extClass: '',
    background: 'rgba(255,255,255,1)', //导航栏背景
    color: '#000000',
    title: '',
    searchText: '点我搜索',
    searchBar: false,
    back: false,
    home: false,
    iconTheme: 'black',
    delta: 1
  }

  state = {}

  setStyle(systemInfo) {
    const { statusBarHeight, navBarHeight, capsulePosition, navBarExtendHeight, ios, windowWidth } =
      systemInfo
    const { back, home, title, color } = this.props
    let rightDistance = windowWidth - capsulePosition.right //胶囊按钮右侧到屏幕右侧的边距
    let leftWidth = windowWidth - capsulePosition.left //胶囊按钮左侧到屏幕右侧的边距

    let navigationbarinnerStyle = [
      `color:${color}`,
      //`background:${background}`,
      `height:${navBarHeight + navBarExtendHeight}px`,
      `padding-top:${statusBarHeight}px`,
      `padding-right:${leftWidth}px`,
      `padding-bottom:${navBarExtendHeight}px`
    ].join(';')
    let navBarLeft = []
    if ((back && !home) || (!back && home)) {
      navBarLeft = [
        `width:${capsulePosition.width}px`,
        `height:${capsulePosition.height}px`,
        `margin-left:0px`,
        `margin-right:${rightDistance}px`
      ].join(';')
    } else if ((back && home) || title) {
      navBarLeft = [
        `width:${capsulePosition.width}px`,
        `height:${capsulePosition.height}px`,
        `margin-left:${rightDistance}px`
      ].join(';')
    } else {
      navBarLeft = [`width:auto`, `margin-left:0px`].join(';')
    }
    return {
      navigationbarinnerStyle,
      navBarLeft,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      rightDistance
    }
  }

  render() {
    const {
      navigationbarinnerStyle,
      navBarLeft,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      rightDistance
    } = this.state.configStyle
    const {
      title,
      background,
      backgroundColorTop,
      back,
      home,
      searchBar,
      searchText,
      iconTheme,
      extClass
    } = this.props
    let nav_bar__center = null
    if (title) {
      nav_bar__center = <text>{title}</text>
    } else if (searchBar) {
      nav_bar__center = (
        <View
          className='lzh-nav-bar-search'
          style={`height:${capsulePosition.height}px;`}
          onClick={this.handleSearchClick.bind(this)}
        >
          <View className='lzh-nav-bar-search__icon' />
          <View className='lzh-nav-bar-search__input'>{searchText}</View>
        </View>
      )
    } else {
      /* eslint-disable */
      nav_bar__center = this.props.renderCenter
      /* eslint-enable */
    }
    console.log('navBarLeft', navBarLeft)
    return (
      <View
        className={`lzh-nav-bar ${ios ? 'ios' : 'android'} ${extClass}`}
        style={`background: ${backgroundColorTop ? backgroundColorTop : background};height:${
          navBarHeight + navBarExtendHeight
        }px;`}
      >
        <View
          className={`lzh-nav-bar__placeholder ${ios ? 'ios' : 'android'}`}
          style={`padding-top: ${navBarHeight + navBarExtendHeight}px;`}
        />
        <View
          className={`lzh-nav-bar__inner ${ios ? 'ios' : 'android'}`}
          style={`background:${background};${navigationbarinnerStyle};`}
        >
          <View className='lzh-nav-bar__left' style={navBarLeft}>
            {back && !home && (
              <View
                onClick={this.handleBackClick.bind(this)}
                className={`lzh-nav-bar__button lzh-nav-bar__btn_goback ${iconTheme}`}
              />
            )}
            {!back && home && (
              <View
                onClick={this.handleGoHomeClick.bind(this)}
                className={`lzh-nav-bar__button lzh-nav-bar__btn_gohome ${iconTheme}`}
              />
            )}
            {back && home && (
              <View className={`lzh-nav-bar__buttons ${ios ? 'ios' : 'android'}`}>
                <View
                  onClick={this.handleBackClick.bind(this)}
                  className={`lzh-nav-bar__button lzh-nav-bar__btn_goback ${iconTheme}`}
                />
                <View
                  onClick={this.handleGoHomeClick.bind(this)}
                  className={`lzh-nav-bar__button lzh-nav-bar__btn_gohome ${iconTheme}}`}
                />
              </View>
            )}
            {!back && !home && this.props.renderLeft}
          </View>
          <View className='lzh-nav-bar__center' style={`padding-left: ${rightDistance}px`}>
            {nav_bar__center}
          </View>
          <View className='lzh-nav-bar__right' style={`margin-right: ${rightDistance}px`}>
            {this.props.renderRight}
          </View>
        </View>
      </View>
    )
  }
}
