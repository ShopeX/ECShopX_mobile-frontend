import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './writing.scss'

export default class WgtHeading extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)

    this.state = {
      curIdx: 0
    }
  }

  handleSwiperChange = (e) => {
    const { current } = e.detail

    this.setState({
      curIdx: current
    })
  }

  render () {
    const { info } = this.props
    const { curIdx } = this.state

    if (!info) {
      return null
    }

    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content
    let stringStyle = ''
    if (config) {
      if (config.align) {
        stringStyle = `text-align: ${config.align};`
      }
      if (config.italic === true) {
        stringStyle = stringStyle.concat('font-style: italic;')
      }
      if (config.bold === true) {
        stringStyle = stringStyle.concat('font-weight: 700;')
      }
      if (config.size) {
        stringStyle = stringStyle.concat(`font-size: ${Taro.pxTransform(config.size * 2)};`)
      }
    }

    return (
      <View className={`wgt  ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>{base.title}</View>
            <View className='wgt__subtitle'>{base.subtitle}</View>
          </View>
        )}
        <View className={`slider-wra ${config.padded ? 'padded' : ''}`} style={stringStyle}>
          <View className='writing-view'>{curContent}</View>
        </View>
      </View>
    )
  }
}
