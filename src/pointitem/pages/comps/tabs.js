/*
 * @Author: your name
 * @Date: 2021-02-25 14:06:54
 * @LastEditTime: 2021-02-26 18:42:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/pages/pointitem/comps/tabs.js
 */
import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Icon } from '@tarojs/components'
import { connect } from 'react-redux'
import { classNames } from '@/utils'
import { AtForm, AtInput, AtButton } from 'taro-ui'

import './tabs.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class FilterBar extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    sort: {},
    current: 0,
    list: [],
    inputRef: null,
    activeRef: false
  }

  constructor(props) {
    super(props)

    const { current } = props
    this.state = {
      curIdx: current,
      sortOrder: null,
      active: false,
      inputValue: ''
    }
  }

  handleClickItem(idx) {
    const item = this.props.list[idx] || {}

    let sortOrder = null

    if (item.sort) {
      sortOrder = idx === this.state.curIdx ? this.state.sortOrder * -1 : item.sort
    }

    this.setState({
      curIdx: idx,
      sortOrder
    })

    this.props.onChange({
      current: idx,
      sort: sortOrder
    })
  }

  handleFocus = () => {
    this.activeRef = true
    this.setState({
      active: true
    })
  }

  handleBlur = () => {
    this.activeRef = false
    this.setState({
      active: false,
      inputValue: ''
    })
  }

  handleInputChange = (e) => {
    let value
    if (this.activeRef) {
      value = e
    } else {
      value = ''
    }
    this.setState({
      inputValue: value
    })
  }

  handleConfirm = (value) => {
    const { onInputConfirm } = this.props
    if (onInputConfirm) {
      onInputConfirm(value)
    }
  }

  handleOpenFilter = () => {
    const { onOpenFilter } = this.props
    if (onOpenFilter) {
      onOpenFilter()
    }
  }

  getDomTop = (callback) => {
    const query = Taro.createSelectorQuery().in(this)
    console.log('-----query----getDomTop', query.select('#filter'))
    console.log(
      '-----query----getDomTop-boundingClientRect',
      query.select('#filter').boundingClientRect
    )

    query.select('#filter').boundingClientRect((rect) => {
      console.log('-----getDomTop----getDomTop', rect)
      callback(rect)
    })
  }

  render() {
    const { list, className, custom, colors } = this.props
    const { sortOrder, curIdx, active, inputValue } = this.state

    return (
      <View className={classNames('filter-bar', { 'active': active }, className)} id='filter'>
        {/* <Icon className='iconfont search-icon' type='search' size='14' color='#999999'></Icon> */}
        <View className='text'>
          {custom &&
            list.map((item, idx) => {
              const isCurrent = curIdx === idx

              return (
                <View
                  className={classNames(
                    'filter-bar__item',
                    isCurrent && 'filter-bar__item-active',
                    item.key && `filter-bar__item-${item.key}`,
                    item.sort
                      ? `filter-bar__item-sort filter-bar__item-sort-${
                          sortOrder > 0 ? 'asc' : 'desc'
                        }`
                      : null
                  )}
                  style={isCurrent ? 'color: ' + colors.data[0].primary : 'color: #666'}
                  onClick={this.handleClickItem.bind(this, idx)}
                  key={item.title}
                >
                  <Text className='filter-bar__item-text'>{item.title}</Text>
                  {/* <View className='active-bar' style={'background: ' + colors.data[0].primary}></View> */}
                </View>
              )
            })}
        </View>
        <View className='action'>
          <View className='filter' onClick={this.handleOpenFilter}>
            <View className='textFilter'>筛选</View>
            <View className='iconfont icon-filter'></View>
          </View>
          <View className='searchInput'></View>
        </View>
        <View className='searchInput searchInput-P'>
          <AtInput
            value={inputValue}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onConfirm={this.handleConfirm}
            onChange={this.handleInputChange}
          />

          {!active && (
            <Icon className='iconfont search-icon' type='search' size='14' color='#999999'></Icon>
          )}
        </View>
        {this.props.children}
      </View>
    )
  }
}
