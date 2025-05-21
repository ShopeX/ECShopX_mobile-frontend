import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
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
      <View className={classNames(`wgt wgt-writing`, {
        'wgt__padded': base.padded
      })}>
        {base.title && (
          <View className='wgt-head'>
            <View className='wgt-hd'>
              <Text className='wgt-title'>{base.title}</Text>
              <Text className='wgt-subtitle'>{base.subtitle}</Text>
            </View>
          </View>
        )}
        <View
          className={`wgt__body`}
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
