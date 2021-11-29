import React, { Component } from 'react';
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { linkPage } from './helper'
import './hot-topic.scss'

export default class WgtHotTopic extends Component {
  static options = {}

  static defaultProps = {
    info: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      current: '',
      list: []
    }
  }

  componentDidMount() {
    const { info } = this.props
    this.setState({
      list: info.data
    })
  }

  handleClick(value, Page, id) {
    this.setState({
      current: value
    })
    linkPage(Page, id)
  }

  render() {
    const { current, list } = this.state
    const { info } = this.props

    return (
      <View className={`hot-topic ${info.base.padded ? 'wgt__padded' : null}`}>
        <View className='title'> {info.base.title}</View>
        <View className='list'>
          {list.map((item, idx) => {
            return (
              <View
                key={item.id}
                className={classNames('gambit', idx === current ? 'checked' : '')}
                onClick={this.handleClick.bind(this, idx, item.linkPage, item)}
              >
                {item.topic}
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
