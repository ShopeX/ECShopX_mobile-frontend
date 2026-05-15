/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Form, Text, Image } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { $t, i18n } from '@/i18n'
import './index.scss'

export default class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this._onLanguageChanged = () => this.forceUpdate()
    i18n.on('languageChanged', this._onLanguageChanged)
  }

  componentWillUnmount() {
    if (this._onLanguageChanged) {
      i18n.off('languageChanged', this._onLanguageChanged)
    }
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
            placeholder={_placeholder || $t('377a1681.cd11be')}
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
