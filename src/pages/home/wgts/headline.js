import React, { Component } from 'react';
import { View } from '@tarojs/components'
import './headline.scss'

export default class WgtHeadline extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { info } = this.props
    if (!info) {
      return null
    }
    return (
      <View className='head-line-index'>
        <View className='title' style={'text-align:' + info.base.float}>
          {info.base.title}
        </View>
      </View>
    )
  }
}
