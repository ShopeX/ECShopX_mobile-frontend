import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './imghot-zone.scss'

export default class WgtTagNavigation extends Component {
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

  componentDidMount() {}

  handleClickItem(item, index) {
    const { onClick } = this.props
    onClick(index)
  }

  render() {
    const { info } = this.props

    if (!info) {
      return null
    }

    const { config, base, data, tagnavIndex } = info

    return (
      <View className={`wgt  ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgts__header'>
            <View className='wgts__title'>{base.title}</View>
            <View className='wgts__subtitle'>{base.subtitle}</View>
          </View>
        )}
        <View className={`slider-wrap img-hotzone  ${config.padded ? 'padded' : ''}`}>
          <Image src={config.imgUrl} mode='widthFix' />
          {data.map((item, index) => {
            return (
              <View
                key={index}
                className='img-hotzone_zone'
                style={`width: ${item.widthPer * 100}%; height: ${item.heightPer * 100}%; top: ${
                  item.topPer * 100
                }%; left: ${item.leftPer * 100}%`}
                onClick={this.handleClickItem.bind(this, item, index)}
              ></View>
            )
          })}
        </View>
      </View>
    )
  }
}
