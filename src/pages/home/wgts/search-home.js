import Taro, { Component } from '@tarojs/taro'
import {View, Form, Text, Image} from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { classNames } from '@/utils'
import { toggleTouchMove } from '@/utils/dom'

import './search-home.scss'

export default class WgtSearchHome extends Component {
  static defaultProps = {
    isOpened: false
  }

  constructor (props) {
    super(props)

    this.state = {
      searchValue: '',
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
    this.setState({
      showSearchDailog: isOpened,
      isShowAction: true,
      searchValue: ' '
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

  handleClickCancel = (isOpened) => {
    this.setState({
      showSearchDailog: isOpened,
      searchValue: '',
      isShowAction: false
    })
  }

  render () {
    const { isShowAction, searchValue } = this.state
    return (
      <View
        className='home-search-input'
      >
        <Form className='home-search__form'>
          <AtSearchBar
            className='home-search__bar'
            value={searchValue}
            placeholder='护肤/彩妆/面膜/指甲油'
            actionName='取消'
            showActionButton={isShowAction}
            onFocus={this.handleFocusSearchHistory.bind(this, true)}
            onChange={this.handleChangeSearch.bind(this)}
            onConfirm={this.handleConfirm.bind(this)}
            onActionClick={this.handleClickCancel.bind(this, false)}
          />
        </Form>
      </View>
    )
  }
}
