import Taro, { Component } from '@tarojs/taro'
import {View, Form, Text} from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { classNames } from '@/utils'

import './index.scss'

export default class SearchBar extends Component {
  static defaultProps = {
    isOpened: false
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

  handleFocusSearchHistory = (isOpened) => {
    this.setState({
      showSearchDailog: isOpened,
      isShowAction: true
    })
    Taro.getStorage({ key: 'searchHistory' })
      .then(res => {
        let stringArr = res.data.split(',')
        this.setState({ historyList: stringArr })
      })
      .catch(() => {})
  }

  handleChangeSearch = (value) => {
    this.setState({
      searchValue: value,
    })
  }

  handleConfirm = () => {
    if (this.state.searchValue) {
      Taro.getStorage({ key: 'searchHistory' })
        .then(res => {
          let stringArr = res.data.split(',')
          let arr = [].concat(stringArr);
          arr.unshift(this.state.searchValue)
          arr = Array.from(new Set(arr))
          let arrString = arr.join(',')
          Taro.setStorage({ key: 'searchHistory', data: arrString })
          this.setState({ searchValue: '' })
        })
        .catch(() => {
          let arr = []
          arr.push(this.state.searchValue)
          let arrString = arr.join(',')
          Taro.setStorage({ key: 'searchHistory', data: arrString })
        })
      Taro.navigateTo({
        url: `/pages/item/list?keywords=${this.state.searchValue}`
      })
    }
  }

  handleClickLogin = () => {
    Taro.redirectTo({
      url: '/pages/auth/login'
    })
  }

  handleClickCancel = (isOpened) => {
    this.setState({
      showSearchDailog: isOpened,
      searchValue: '',
      isShowAction: false
    })
  }

  handleClickDelete = () => {
    Taro.removeStorage({ key: 'searchHistory' })
      .then(() => {
        this.setState({ historyList: [] })
      })
  }

  handleClickTag = () => {
    console.log("tag")
  }

  render () {
    const { isFixed, className, isAuth } = this.props
    const { showSearchDailog, historyList, isShowAction, searchValue } = this.state
    return (
      <View className={classNames('search-input', className === 'category-top' ? className : '', showSearchDailog ? 'search-input__focus' : null, isFixed ? 'search-input-fixed' : null)}>
        <Form className={classNames('search-input__form', className === 'home-index-search' ? `${className} login-width` : '')} onSubmit={this.handleConfirm.bind(this)}>
          <AtSearchBar
            className={classNames('search-input__bar', className === 'home-index-search' ? className : '')}
            value={searchValue}
            actionName='取消'
            showActionButton={isShowAction}
            onFocus={this.handleFocusSearchHistory.bind(this, true)}
            onChange={this.handleChangeSearch.bind(this)}
            onConfirm={this.handleConfirm.bind(this)}
            onActionClick={this.handleClickCancel.bind(this, false)}
          />
          {
            className === 'home-index-search' && isAuth ? <View className='home-login' onClick={this.handleClickLogin}>登录</View> : null
          }
        </Form>
        <View className={classNames(showSearchDailog ? 'search-input__history' : 'search-input__history-none')}>
          <View className='search-input__history-title'>
            <Text>最近搜索</Text>
            <Text className='sp-icon sp-icon-shanchu icon-del' onClick={this.handleClickDelete.bind(this)}></Text>
          </View>
          <View className='search-input__history-list'>
            {
              historyList.map((item, index) => <View className='search-input__history-list__btn' key={index} onClick={this.handleClickTag}>{item}</View> )
            }
          </View>
        </View>
      </View>
    )
  }
}
