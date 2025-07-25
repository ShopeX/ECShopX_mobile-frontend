import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Form, Text, Image } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'

import './index.scss'

export default class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  handleChangeSearch = (value) => {
    this.props.onChange(value)
  }

  handleClear = () => {
    this.props.onClear()
  }

  handleConfirm = (e) => {
    this.props.onConfirm(e.detail.value)
  }

  render() {
    const { keyword, _placeholder, bgc, maxLength } = this.props
    const {} = this.state
    return (
      <View className='search-inputugc'>
        <Form className='search-inputugc__form'>
          <AtSearchBar
            className={bgc ? 'search-inputugc__bar' : 'search-inputugc__bar search-inputugc__bgc'}
            value={keyword}
            placeholder={!_placeholder ? '请输入关键词' : _placeholder}
            onClear={this.handleClear.bind(this)}
            maxLength={maxLength ? maxLength : 140}
            onChange={this.handleChangeSearch.bind(this)}
            onConfirm={this.handleConfirm.bind(this)}
          />
        </Form>
      </View>
    )
  }
}
