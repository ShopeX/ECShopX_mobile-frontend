/*
 * @Author: your name
 * @Date: 2021-02-25 13:14:46
 * @LastEditTime: 2021-02-26 13:35:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/pages/pointitem/comps/header.js
 */
import React, { Component } from 'react';
import { View, Image } from '@tarojs/components'
import { classNames } from '@/utils'

import './filter-block.scss'

export default class FilterBlock extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  getName = () => {
    const { info, type } = this.props

    if (type === 'brand') {
      return info.attribute_name
    } else if (type === 'category') {
      return info.label
    } else {
      return info && Array.isArray(info) && info.length ? `${info[0]} ~ ${info[1]}` : ''
    }
  }

  getId = () => {
    const { info, type } = this.props
    if (type === 'brand') {
      return info.attribute_id
    } else if (type === 'category') {
      return info.category_id
    } else {
      return `${info[0]} ~ ${info[1]}`
    }
  }

  handleClickItem = () => {
    const { type, active } = this.props
    const id = this.getId()
    if (this.props.onClickItem) {
      this.props.onClickItem({ id, type, active })
    }
  }

  render() {
    const name = this.getName()

    const { type } = this.props

    return (
      <View
        className={classNames('filter-block', { 'active': this.props.active })}
        onClick={this.handleClickItem}
      >
        <View className={classNames({ 'ellipsis2': type === 'brand' })}>{name}</View>
      </View>
    )
  }
}
