/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { classNames } from '@/utils'
import api from '@/api'
import { $t, i18n } from '@/i18n'
import './index.scss'

export default class BaStoreList extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    currentIndex: 0
  }
  constructor(props) {
    super(props)
    this.state = {
      keyWord: '',
      storeList: [],
      setIdx: 0
    }
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
  //点击门店item
  handleClick = (index) => {
    this.setState({
      setIdx: index
    })
  }

  //搜索框
  hanldeInput = (e) => {
    this.setState({
      keyWord: e.detail.value
    })
  }

  //重制搜索框
  handleReset = () => {
    this.setState({
      keyWord: ''
    })
  }

  //提交当前选择
  hanldeStore = () => {
    const { setIdx } = this.state
    this.props.onStoreConfirm(setIdx)
  }

  render() {
    const { shopList } = this.props
    const { keyWord, setIdx } = this.state
    if (!shopList) return
    const filterShopList = shopList.filter((item) => {
      return !keyWord || item.store_name.indexOf(keyWord) > -1
    })
    console.log('filterShopList:', filterShopList)
    return (
      <View className='mask'>
        <View className='ba-store-list'>
          <View className='store-head'>
            <View className='store-head__strname'>{$t('986be21d.d944ed')}</View>
            <Text className='iconfont icon-close' onClick={() => this.props.onClose(false)}></Text>
          </View>

          <Input
            className='store-search'
            value={keyWord}
            type='text'
            placeholder={$t('986be21d.1f68ea')}
            onInput={this.hanldeInput}
          />
          <View className='store-main'>
            {filterShopList.map((item, index) => (
              <View
                className={classNames('store-item', {
                  active: index == setIdx
                })}
                key={`store-item-${index}`}
                onClick={this.handleClick.bind(this, index)}
              >
                <View className='store-name'>{item.store_name}</View>
                <View className='store-address'>{item.address}</View>
              </View>
            ))}
          </View>
          <View className='store-ft'>
            <View className='btn reset_btn' onClick={this.handleReset}>
              {$t('986be21d.4b9c32')}
            </View>
            <View className='btn confirm_btn' onClick={this.hanldeStore}>
              {$t('b232790d.38cf16')}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
