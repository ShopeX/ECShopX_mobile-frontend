import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import configStore from '@/store'

import './index.scss'

const {store} = configStore()
export default class PointTag extends Component {
  static defaultProps = {
    url: ''
  }

  render () {
    const { className } = this.props
    const classes = classNames('point-tag', className)

    return <View className={classes}>{store.getState().sys.pointName}</View>
  }
}
