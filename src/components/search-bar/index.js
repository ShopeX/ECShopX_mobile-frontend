/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Form, Text, Image } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { isWeb, isWeixin, isAlipay, classNames } from '@/utils'
import { toggleTouchMove } from '@/utils/dom'
import { $t } from '@/i18n'
import { DEFAULT_NAVIGATE_HEIGHT } from '@/consts'

import './index.scss'

export default class SearchBar extends Component {
  static defaultProps = {
    isOpened: false,
    keyword: '',
    showDailog: true,
    localStorageKey: 'searchHistory',
    navigateHeight: DEFAULT_NAVIGATE_HEIGHT,
    immersive: false
  }

  constructor(props) {
    super(props)

    this.state = {
      searchValue: '',
      showSearchDailog: false,
      historyList: [],
      isShowAction: false
    }
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'h5') {
      toggleTouchMove(this.refs.container)
    }
  }

  handleFocusSearchHistory = (isOpened) => {
    this.props.onFocus?.()
    this.setState({
      showSearchDailog: isOpened,
      isShowAction: true
    })
    Taro.getStorage({ key: this.props.localStorageKey })
      .then((res) => {
        let stringArr = res.data.split(',').filter((item) => {
          const isHave = item.trim()
          return isHave
        })
        this.setState({ historyList: stringArr })
      })
      .catch(() => {})
  }

  handleChangeSearch = (value, event) => {
    //h5中value为空 需从event里面拿值
    // value = value.replace(/\s+/g,'')
    this.props.onChange?.(isWeb ? event?.detail?.value : value)
  }

  handleClear = () => {
    this.props.onClear()
  }

  handleConfirm = (e) => {
    const keywords = e.detail.value.trim()
    if (keywords) {
      const value = Taro.getStorageSync(this.props.localStorageKey)
      let defaultValue = []
      if (value) {
        const array = value.split(',')
        if (!array.includes(keywords)) {
          array.unshift(keywords)
        }
        defaultValue = array
      } else {
        defaultValue.push(keywords)
      }
      Taro.setStorage({ key: this.props.localStorageKey, data: defaultValue.toString() })
      this.props.onConfirm(e.detail.value)
    }
    this.setState({
      showSearchDailog: false,
      isShowAction: false
    })
  }

  handleClickCancel = (isOpened) => {
    this.props.onCancel?.()
    this.setState({
      showSearchDailog: isOpened,
      isShowAction: false
    })
    this.handleClear()
  }

  handleClickDelete = () => {
    Taro.removeStorage({ key: this.props.localStorageKey }).then(() => {
      this.setState({ historyList: [] })
    })
  }

  handleClickTag = (item) => {
    this.props.onConfirm(item)
    this.setState({
      showSearchDailog: false,
      isShowAction: false
    })
  }

  handleClickHotItem = () => {}

  handleBlurSearch = () => {
    this.props.onBlur?.()
  }

  /** 与 SpPage body 的 padding-top 同值：custom 导航时算法与 SpPage 内一致；可传 navBarInsetPx 覆盖（如 H5 仅靠 pageConfig 自定义顶栏时） */
  resolveNavBarInsetPx() {
    const { immersive, navigateHeight, navBarInsetPx } = this.props
    if (immersive) return 0
    if (navBarInsetPx != null && navBarInsetPx !== '') return Number(navBarInsetPx) || 0

    const nh = navigateHeight ?? DEFAULT_NAVIGATE_HEIGHT
    if (getCurrentInstance()?.page?.config?.navigationStyle !== 'custom') return 0

    if (isWeixin || isAlipay) {
      try {
        const mb = Taro.getMenuButtonBoundingClientRect()
        return Math.floor(mb.bottom + (nh - mb.height) / 2)
      } catch (e) {
        return 0
      }
    }
    if (isWeb) return nh
    return 0
  }

  render() {
    const { isFixed, keyword, showDailog, placeholder } = this.props
    const { showSearchDailog, historyList, isShowAction, searchValue } = this.state
    const navInsetPx = showSearchDailog ? this.resolveNavBarInsetPx() : 0
    // 与 SpPage body 一致用 padding-top 留白；高度显式给出，避免仅 bottom:0 时未撑满
    const focusOverlayStyle = showSearchDailog
      ? {
          paddingTop: `${navInsetPx}px`,
          boxSizing: 'border-box',
          ...(showDailog ? { height: '100vh' } : {})
        }
      : undefined

    return (
      <View
        className={classNames(
          'search-input',
          isFixed ? 'search-input-fixed' : null,
          showSearchDailog ? 'search-input__focus' : null,
          !showDailog && 'without-dialog'
        )}
        style={focusOverlayStyle}
      >
        {/* {微信浏览器form enter自动刷新页面} */}
        <View className='search-input__form'>
          <AtSearchBar
            className='search-input__bar'
            value={keyword}
            placeholder={!placeholder ? $t('377a1681.cd11be') : placeholder}
            actionName={$t('61e2d21a.625fb2')}
            showActionButton={isShowAction}
            onFocus={this.handleFocusSearchHistory.bind(this, true)}
            onBlur={this.handleBlurSearch.bind(this)}
            onClear={this.handleClear}
            onChange={this.handleChangeSearch.bind(this)}
            onConfirm={this.handleConfirm.bind(this)}
            onActionClick={this.handleClickCancel.bind(this, false)}
          />
        </View>
        {/* 历史搜索 */}
        {showDailog && (
          <View
            className={classNames(
              showSearchDailog ? 'search-input__history' : 'search-input__history-none'
            )}
          >
            <View className='search-input__history-title'>
              <Text>{$t('7fa435fc.e8cb95')}</Text>
              <Text className='clear-history' onClick={this.handleClickDelete.bind(this)}>
                {$t('7fa435fc.4bf6fd')}
              </Text>
            </View>
            <View className='search-input__history-list'>
              {historyList.map((item, index) => (
                <View
                  className='search-input__history-list__btn'
                  key={`${index}1`}
                  onClick={this.handleClickTag.bind(this, item)}
                >
                  {item}
                </View>
              ))}
            </View>
            {/*<View className='search-input__history-title hot-title'>
              <Text>热门搜索</Text>
            </View>
            <View className='hot-list'>
              <View className='hot-list__item' onClick={this.handleClickHotItem.bind(this)}>
                <Text>#绿茶籽小绿瓶#</Text>
                <View className='at-icon at-icon-chevron-right'></View>
              </View>
            </View>*/}
          </View>
        )}
      </View>
    )
  }
}
