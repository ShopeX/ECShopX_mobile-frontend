import Taro, { Component } from '@tarojs/taro'
import {View, Form, Text, Image} from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { classNames } from '@/utils'
import { toggleTouchMove } from '@/utils/dom'

import './list-search.scss'

export default class ListSearch extends Component {
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
  }

  handleBlur = (e) => {
    let text = e.detail.value
    text = text.replace(/\s+/g,'');
    this.setState({
      searchValue: text
    })
  }

  handleConfirm = () => {
    setTimeout(() => {
      if (this.state.searchValue) {
        this.props.onConfirm(this.state.searchValue)
      }
    }, 300)
  }

  handleClear = () => {
    this.props.onConfirm('')
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
            placeholder='请输入关键字'
            actionName='取消'
            showActionButton={isShowAction}
            onFocus={this.handleFocusSearchHistory.bind(this, true)}
            onClear={this.handleClear.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            onChange={this.handleChangeSearch.bind(this)}
            onConfirm={this.handleConfirm.bind(this)}
            onActionClick={this.handleClickCancel.bind(this, false)}
          />
        </Form>
      </View>
    )
  }
}
