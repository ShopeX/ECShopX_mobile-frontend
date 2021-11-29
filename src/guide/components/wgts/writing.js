import React, { Component } from 'react';
import { View } from '@tarojs/components'
import { linkPage } from './helper'

import './writing.scss'

export default class WgtWriting extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      curIdx: 0
    }
  }

  handleClickItem = linkPage

  handleSwiperChange = (e) => {
    const { current } = e.detail

    this.setState({
      curIdx: current
    })
  }

  render() {
    const { info } = this.props
    const { curIdx } = this.state

    if (!info) {
      return null
    }

    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content
    let contentArr = []
    if (curContent) {
      contentArr = curContent.split('\n')
    }

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>{base.title}</View>
            <View className='wgt__subtitle'>{base.subtitle}</View>
          </View>
        )}
        <View
          className={`slider-wra wgt-writing ${config.padded ? 'padded' : ''}`}
          style={`${config.align ? `text-align:${config.align}` : ''}`}
        >
          {contentArr.map((item, index) => {
            return (
              <View className='writing-view' key={`${index}1`}>
                {item}
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
