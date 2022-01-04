import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Form, Text, Image } from '@tarojs/components'
import { AtSearchBar, AtForm } from 'taro-ui'
import { classNames } from '@/utils'
import { toggleTouchMove } from '@/utils/dom'

import './index.scss'

export default class SpSearchBar extends Component {
  static defaultProps = {
    isOpened: false,
    keyword: '',
    showDailog: true,
    placeholder: '搜索',
    onCancel: () => {},
    onChange: () => {},
    onClear: () => {},
    onFocus: () => {},
    onConfirm: () => {}
  }

  constructor (props) {
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

  componentDidMount () {
    if (process.env.TARO_ENV === 'h5') {
      toggleTouchMove(this.refs.container)
    }
  }

  handleFocusSearchHistory = (isOpened) => {
    this.props.onFocus()
    this.setState({
      showSearchDailog: isOpened,
      isShowAction: true
    })
    Taro.getStorage({ key: 'searchHistory' })
      .then((res) => {
        let stringArr = res.data.split(',').filter((item) => {
          const isHave = item.trim()
          return isHave
        })
        this.setState({ historyList: stringArr })
      })
      .catch(() => {})
  }

  handleChangeSearch = (value) => {
    // value = value.replace(/\s+/g,'')
    this.props.onChange(value)
  }

  handleClear = () => {
    this.props.onClear()
  }

  handleConfirm = (e) => {
    debugger
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()

    if (e.detail.value && e.detail.value.trim()) {
      Taro.getStorage({ key: 'searchHistory' })
        .then((res) => {
          let stringArr = res.data.split(',')
          let arr = [].concat(stringArr)
          arr.unshift(e.detail.value)
          arr = Array.from(new Set(arr))
          let arrString = arr.join(',')
          Taro.setStorage({ key: 'searchHistory', data: arrString })
        })
        .catch(() => {
          let arr = []
          arr.push(this.state.searchValue)
          let arrString = arr.join(',')
          Taro.setStorage({ key: 'searchHistory', data: arrString })
        })
      this.props.onConfirm(e.detail.value)
      /*Taro.navigateTo({
        url: `/pages/item/list?keywords=${this.state.searchValue}`
      })*/
    }
    this.setState({
      showSearchDailog: false,
      isShowAction: false
    })
  }

  handleClickCancel = (isOpened) => {
    this.props.onCancel()
    this.setState({
      showSearchDailog: isOpened,
      isShowAction: false
    })
  }

  handleClickDelete = () => {
    Taro.removeStorage({ key: 'searchHistory' }).then(() => {
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

  handleClickHotItem = () => {
    console.log('热门搜索', 100)
  }

  render () {
    const { isFixed, keyword, showDailog, placeholder } = this.props
    const { showSearchDailog, historyList, isShowAction, searchValue } = this.state
    return (
      <View
        className={classNames(
          'sp-search-bar',
          isFixed ? 'sp-search-bar-fixed' : null,
          showSearchDailog ? 'sp-search-bar__focus' : null,
          !showDailog && 'without-dialog'
        )}
      >
        <Form className='sp-search-bar__form'>
          {/* <AtForm onSubmit={this.handleConfirm.bind(this)}> */}
          <AtSearchBar
            className='sp-search-bar__bar'
            value={keyword}
            placeholder={placeholder}
            actionName='取消'
            showActionButton={isShowAction}
            onFocus={this.handleFocusSearchHistory.bind(this, true)}
            onClear={this.handleClear}
            onChange={this.handleChangeSearch.bind(this)}
            onConfirm={this.handleConfirm.bind(this)}
            onActionClick={this.handleClickCancel.bind(this, false)}
          />
          {/* </AtForm> */}
        </Form>

        {showDailog && (
          <View
            className={classNames(
              showSearchDailog ? 'sp-search-bar__history' : 'sp-search-bar__history-none'
            )}
          >
            <View className='sp-search-bar__history-title'>
              <Text className='title'>最近搜索</Text>
              <Text
                className='icon-trashCan icon-del'
                onClick={this.handleClickDelete.bind(this)}
              ></Text>
            </View>
            <View className='sp-search-bar__history-list'>
              {historyList.map((item, index) => (
                <View
                  className='sp-search-bar__history-list__btn sp-search-bar-border'
                  key={`${index}1`}
                  onClick={this.handleClickTag.bind(this, item)}
                >
                  {item}
                </View>
              ))}
            </View>
            {/*<View className='sp-search-bar__history-title hot-title'>
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
